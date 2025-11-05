import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    userId: { type: String, required: true },

  },
  { timestamps: true }
);

projectSchema.set("toObject", { virtuals: true });
projectSchema.set("toJSON", { virtuals: true });

// ✅ Fix: ensure mongoose.models exists before accessing
const Project =
  (mongoose.models && mongoose.models.Project) ||
  mongoose.model("Project", projectSchema);

export { Project };
