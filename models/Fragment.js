import mongoose from "mongoose";

const fragmentSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    title: { type: String },
    files: { type: Array, default: [] },
    sandboxUrl: { type: String },
  },
  { timestamps: true }
);

if (!mongoose.models) {
  mongoose.models = {};
}

export const Fragment =
  mongoose.models.Fragment || mongoose.model("Fragment", fragmentSchema);
