import { Message } from "../models/Message.js";
import { Project } from "../models/Project.js";
import { connectToDatabase } from "../lib/mongodb.js";
const db = await connectToDatabase()
export async function createMessage({ content, role, type }) {
  const message = new Message({ content, role, type });
  await message.save();
  return message;
}
export async function getMessages(){
    const messages = await Message.find().sort({ createdAt: 1 });
    return messages;
}


export async function fetchProjectByName(projectName) {
  const project = await Project.findOne({ name: projectName });

  if (!project) {
    throw new Error(`Project with name "${projectName}" not found`);
  }

  return project;
}