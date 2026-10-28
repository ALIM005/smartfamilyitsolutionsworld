// lib/mongo.ts
// স্টোরের নিজস্ব MongoDB কানেকশন (হট-রিলোডে ও সার্ভারলেসে কানেকশন ক্যাশ করে)।
// আপনার বিদ্যমান lib/db.ts একই MONGODB_URI ব্যবহার করলে ইচ্ছা হলে সেটাই ব্যবহার করতে পারেন।
import mongoose from 'mongoose';

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _sfMongo?: Cache };
const cache: Cache = g._sfMongo ?? (g._sfMongo = { conn: null, promise: null });

export async function connectMongo(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  }
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
  return cache.conn;
}
