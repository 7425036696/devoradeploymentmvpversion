import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Message } from "@/models/Message";
import { Project } from "@/models/Project";
import { getAuth } from "@clerk/nextjs/server";
import { Fragment } from "@/models/Fragment";
export async function POST(request) {
  const { userId } = getAuth(request)
  try {
    const body = await request.json();
    const { projectId } = body;

    console.log("Project ID:", projectId);

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "Missing projectId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return new Response(
        JSON.stringify({ error: "Invalid projectId format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectToDatabase();

    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    // Find project
    const project = await Project.findOne({
      _id: projectObjectId,
      userId: userId, // or just userId if variable name matches
    })
      .select("name messages")
      .lean();
    if (!project) {
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Project found:", project.name);
    console.log("Message IDs in project:", project.messages);

    // If no messages
    if (!project.messages) {
      return new Response(
        JSON.stringify({ messages: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 1: Fetch messages with populated fragments (NO .lean() here)
    const populatedMessages = await Message.find({
      _id: { $in: project.messages }
    })
      .sort({ createdAt: 1 })
      .populate("fragments") // This works because we haven't used .lean()
      .exec();

    // Step 2: Convert to plain objects AFTER population
    const messagesPlain = populatedMessages.map(msg => msg.toObject());

    // Step 3: Reorder messages to match project.messages order
    const orderedMessages = project.messages
      .map(id => {
        const idStr = id.toString();
        return messagesPlain.find(msg => msg._id.toString() === idStr);
      })
      .filter(Boolean); // Remove any missing messages (safety)

    console.log(`Returning ${orderedMessages.length} messages with fragments in project order`);

    return new Response(
      JSON.stringify({ messages: orderedMessages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch messages",
        details: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
