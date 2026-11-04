// lib/mongo.ts
import mongoose from 'mongoose';

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _sfMongo?: Cache };
const cache: Cache = g._sfMongo ?? (g._sfMongo = { conn: null, promise: null });

export async function connectMongo(): Promise<typeof mongoose> {
  // যদি কানেকশন ইতিমধ্যে তৈরি হয়ে থাকে এবংreadyState ১ (connected) হয়, সরাসরি রিটার্ন করুন
  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { 
      bufferCommands: true, 
      serverSelectionTimeoutMS: 10000 
    }).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    cache.conn = null;
    throw e;
  }
  
  return cache.conn;
}