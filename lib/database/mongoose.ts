import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Explicitly type the global object to avoid the `any` type
declare global {
  let mongoose: MongooseConnection | undefined;
}

const cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<Mongoose> => {
  // If there's already a connection, return it
  if (cached.conn) return cached.conn;

  // If the MongoDB URL is missing, throw an error
  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  // Initialize the promise to connect if it doesn't exist yet
  cached.promise = cached.promise || mongoose.connect(MONGODB_URL, { dbName: "pixera", bufferCommands: false });

  // Wait for the connection to resolve and store it in the cache
  cached.conn = await cached.promise;

  return cached.conn;
};
