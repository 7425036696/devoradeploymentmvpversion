import { connectToDatabase } from "@/lib/mongodb";
import { consumeCredits } from "@/lib/usage";
import { Message } from "@/models/Message";
import { Project } from "@/models/Project";
import { currentUser } from '@clerk/nextjs/server'; // Or appropriate import for your framework

export async function POST(request) {
  const user = await currentUser()
  const userId = user.id
  try {
    const body = await request.json();
    const { value, projectId } = body;

    if (!value) {
      return new Response(
        JSON.stringify({ error: "Missing 'value' in request body" }),
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Generate random project name
    const projectName = `Project-${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    // Create project
    const project = await Project.findById(projectId)
    // Create message and link it to project
    const message = await Message.create({
      projectId: project._id,
      project: project,
      userId: userId,
      type: "result",
      role: "user",
      content: value,
    });
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { messages: message._id } },
      { new: true }
    );
    await consumeCredits()
    return new Response(
      JSON.stringify({
        success: true,
        project,
        message,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500 }
    );
  }
}
