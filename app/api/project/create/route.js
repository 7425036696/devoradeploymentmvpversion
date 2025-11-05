import { NextResponse } from "next/server";
import { Project } from "@/models/Project";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuth } from "@clerk/nextjs/server";
import { Message } from "@/models/Message";
import { consumeCredits } from "@/lib/usage";

export async function POST(req) {
    const { userId } = getAuth(req); // ✅ correct way for API routes
    const { value: content } = await req.json();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await connectToDatabase();

        const name = `Project-${Math.floor(1000 + Math.random() * 9000)}`;
        console.log(userId, "from srever use rid")
        const project = await Project.create({
            name,
            userId, // now this will be set properly
        });
        const userMessage = await Message.create({
            project: project,
            projectId: project._id.toString(),
            userId: project.userId,
            role: "user",
            type: "result",
            content: content,
        });
        project.messages.push(userMessage._id);
        await project.save(); // <-- this line is missing

        await consumeCredits()
        return NextResponse.json(
            { projectId: project._id.toString(), project: project },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
