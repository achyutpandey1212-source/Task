import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] MongoDB connected successfully to ${mongoose.connection.name || 'db'}`);
    return connection;
  } catch (error) {
    console.error('[Database] MongoDB connection failed:', error);
    throw error;
  }
}

export function isDatabaseConnected(): boolean {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState === 1;
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('[Database] MongoDB disconnected');
}
