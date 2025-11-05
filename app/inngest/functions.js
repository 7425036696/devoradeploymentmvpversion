import { Agent, createAgent, createNetwork, createState, createTool } from "@inngest/agent-kit";
import { inngest } from "./client";
import { gemini } from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { z } from "zod";
import { PROMPT, FRAGMENT_TITLE_PROMPT, RESPONSE_PROMPT } from "../prompt";
import { Message } from "@/models/Message";
import { Fragment } from "@/models/Fragment";
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
export const codingAgent = inngest.createFunction(
  { id: "coding-agent", retries: 1 },
  { event: "coding-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("devora-nextjs-template",{
        timeoutMs: 60000
      });
      return sandbox.sandboxId;
    });
    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages = []
      const messages = await Message.find({ projectId: event.data.projectId }).sort({ createdAt: 1 });
      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role,
          content: message.content,
        });
      }
      return formattedMessages
    })
    const state = createState({
      summary: "",
      files: {}
    },
      {
        messages: previousMessages
      }
    )
    const codeAgent = createAgent({
      name: "Code Agent",
      description: "You are an expert Coding Agent.",
      system: PROMPT,
      model: gemini({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Run terminal commands inside a sandboxed environment.",
          parameters: z.object({
            command: z.string().describe("The command to execute inside the sandbox terminal."),
          }),
          handler: async ({ command }, { step }) => {
            return step.run("run-command", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);

                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout || buffers.stdout;
              } catch (error) {
                console.error("Terminal error:", error);
                return buffers.stdout || `Error: ${error.message}`;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files inside the sandbox.",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string().describe("The path of the file to create or update."),
                content: z.string().describe("The content of the file to create or update."),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step.run("create-or-update-files", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (e) {
                console.error("File write error:", e);
                throw new Error(`Error writing files: ${e.message}`);
              }
            });

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }

            return "Files created/updated successfully";
          },
        }),

        createTool({
          name: "read-files",
          description: "Read the content of files.",
          parameters: z.object({
            files: z.array(z.string().describe("The path of the file to read.")),
          }),
          handler: async ({ files }, { step }) => {
            const fileContents = await step.run("read-files", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                console.error("File read error:", error);
                throw new Error(`Error reading files: ${error.message}`);
              }
            });
            return fileContents;
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {

          const lastAssistantTextMessageText = lastAssistantTextMessageContent(result);
          if (lastAssistantTextMessageText && network) {
            if (lastAssistantTextMessageText && lastAssistantTextMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantTextMessageText;
            }
          }
          return result;
        },

      },

    });

    const network = createNetwork({
      name: "Coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        // Return null to stop the network
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });


    const result = await network.run(event.data.value, { state: state });
    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "this is an ai that will generate title for fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({
        model: "gemini-2.5-flash-lite-preview-06-17",
      })
    })
    const responseGeenrator = createAgent({
      name: "fragment-title-generator",
      description: "this is an ai that will generate title for fragment",
      system: RESPONSE_PROMPT,
      model: gemini({
        model: "gemini-2.5-flash-lite-preview-06-17",
      })
    })
    const { output: fragmentTitle } = await fragmentTitleGenerator.run(result.state.data.summary)
    const { output: response } = await responseGeenrator.run(result.state.data.summary)
    const generateFragmentTitle = () => {
      if (fragmentTitle[0].type !== "text") {
        return "Fragment";
      }
      if (Array.isArray(fragmentTitle[0].content)) {
        return fragmentTitle[0].content.map((text) => text).join("")
      }
      else{
        return fragmentTitle[0].content
      }
    }
    const generateResponse = () => {
      if (response[0].type !== "text") {
        return "Fragment";
      }
      if (Array.isArray(response[0].content)) {
        return response[0].content.map((text) => text).join("")
      }
      else{
        return response[0].content
      }
    }
    const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;
    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    const Dbresult = await step.run("save-result-to-db", async () => {
      // 1. Connect to MongoDB
      await connectToDatabase();
      const project = await Project.findById(event.data.projectId)

      // ──────────────────────────────────────
      // 3. USER message
      // ──────────────────────────────────────

      // ──────────────────────────────────────
      // 4. ASSISTANT message
      // ──────────────────────────────────────
      const assistantMessage = await Message.create({
        project: project._id,
        projectId: project._id.toString(),
        userId: project.userId,
        role: "assistant",
        type: isError ? "error" : "result",
        content: isError ? "Something Went Wrong" : generateResponse()
      });
      project.messages.push(assistantMessage._id);
      await project.save();

      // ──────────────────────────────────────
      // 5. Fragment (only for successful assistant)
      // ──────────────────────────────────────
      const fragment = await Fragment.create({
        messageId: assistantMessage._id,
        title: generateFragmentTitle(),
        type: "result",
        sandboxUrl: sandboxUrl || "",
        files: result?.state.data.files || [],
      });

      // link fragment → message
      assistantMessage.fragments.push(fragment._id);
      await assistantMessage.save();

      // ──────────────────────────────────────
      // 6. RETURN **fully populated** project
      // ──────────────────────────────────────
      const populatedProject = await Project.findById(project._id)
        .populate({
          path: "messages",                     // populate every message
          populate: [
            { path: "fragments" },              // → fragments inside each message
            { path: "project" },                // → project inside each message (optional)
          ],
        })
        .lean(); // .lean() gives plain JS objects (faster, no Mongoose docs)

      return {
        projectId: project._id.toString(),
        project: populatedProject,   // ← now every message has .fragments & .project
      };
    });




    return {
      url: sandboxUrl,
      title: "Fragment",
      projectId: Dbresult.projectId || "No project ID available",
      files: result?.state?.data?.files || {},
      summary: result?.state?.data?.summary || "No summary available",
    };
  }
);