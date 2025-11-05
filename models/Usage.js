import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true, // Each key should be unique
  },
  points: {
    type: Number,
    default: 0, // Points used or available
  },
  expire: {
    type: Date,
    default: () => Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from creation
    expires: 0, // TTL index, document auto-deletes when expire date is reached
  },
});

export const Usage = mongoose.models.Usage || mongoose.model("Usage", usageSchema);
