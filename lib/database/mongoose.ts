import mongoose, { Connection, ConnectOptions } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Modern TypeScript global declaration
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: MongooseConnection | undefined;
}

// Use a const assertion pattern to avoid global if possible
const cached: MongooseConnection = (
  global.mongooseConnection ?? {
    conn: null,
    promise: null
  }
);

// Update global reference if not already set
if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

export const connectToDatabase = async (): Promise<Connection> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  const options: ConnectOptions = {
    dbName: 'pixera',
    bufferCommands: false
  };

  cached.promise = 
    cached.promise || 
    mongoose.connect(MONGODB_URL, options)
      .then((mongoose) => mongoose.connection);

  cached.conn = await cached.promise;
  
  return cached.conn;
}


