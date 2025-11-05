// /app/api/runCodingAgent/route.js

import { inngest } from "@/app/inngest/client";

export async function POST(req) {
  try {
    const { value, projectId } = await req.json();

    // Validate input
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "Project ID is required" }),
        { status: 400 }
      );
    }

    if (!value) {
      return new Response(
        JSON.stringify({ error: "Value is required" }),
        { status: 400 }
      );
    }

    // Send event to Inngest
    const result = await inngest.send({
      name: "coding-agent/run",
      data: { value, projectId },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Event sent to coding agent",
        result,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error sending event to Inngest:", err);
    return new Response(
      JSON.stringify({ error: "Failed to send event", details: err.message }),
      { status: 500 }
    );
  }
}
