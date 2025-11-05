import { connectToDatabase } from "@/lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";

import { Project } from "@/models/Project";
import { NextResponse } from "next/server";
export async function GET(req) {
  const { userId } = getAuth(req);
  try {
    await connectToDatabase();

    const projects = await Project.find({ userId: userId }).sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
