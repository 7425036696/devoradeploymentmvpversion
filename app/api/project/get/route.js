// app/api/project/get/route.ts   (or .js if you prefer plain JS)
import { connectToDatabase } from "@/lib/mongodb";
import { Project } from "@/models/Project";
import { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request) {
  const { userId } = getAuth(request);
  try {
    // 1. Parse JSON body → { projectId: "…" }
    const { projectId } = await request.json();

    if (!projectId) {
      return Response.json(
        { error: "Missing projectId in request body" },
        { status: 400 }
      );
    }

    // 2. Connect to DB
    await connectToDatabase();

    // 3. Find project + populate messages
    const project = await Project.findOne({
      _id: projectId,
      userId: userId,
    }).populate("messages");

    if (!project) {
      return Response.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 4. Return the project
    return Response.json(project, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return Response.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}