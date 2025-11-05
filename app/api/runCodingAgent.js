// /pages/api/runCodingAgent.js

import { inngest } from "../inngest/client";

export default async function handler(req, res) {
  const { value, projectId } = req.body;

  if (!projectId) return res.status(400).json({ error: "Project ID missing" });

  try {
    await inngest.send({
      name: "coding-agent/run",
      data: { value, projectId },
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send event" });
  }
}
