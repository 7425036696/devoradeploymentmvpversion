import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["error", "result"], required: true },
    fragments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fragment" }],
    userId: { type: String, required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // 🆔 Plain project ID (custom or just to store project._id as string)
    projectId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 🧠 Ensure mongoose.models exists first
if (!mongoose.models) {
  mongoose.models = {};
}

export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
