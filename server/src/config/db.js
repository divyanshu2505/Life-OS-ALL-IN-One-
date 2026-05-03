import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from the environment.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    if (process.env.ENABLE_MEMORY_MONGO !== "true") {
      throw error;
    }

    console.warn("Local MongoDB unavailable. Falling back to in-memory MongoDB.");
    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: "companion-circle"
      }
    });

    await mongoose.connect(memoryServer.getUri());
    console.log("In-memory MongoDB connected");
  }
}

export async function closeDatabase() {
  await mongoose.connection.close();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}

export function isUsingMemoryDatabase() {
  return Boolean(memoryServer);
}
