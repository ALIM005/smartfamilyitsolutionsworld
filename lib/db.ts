import dns from 'node:dns';
import mongoose from 'mongoose';

// কিছু ISP/রাউটার SRV DNS আটকে দেয় (querySrv ECONNREFUSED)।
// শুধু লোকাল ডেভেলপমেন্টে Google ও Cloudflare DNS ব্যবহার হবে,
// প্রোডাকশনে (Vercel) এটি চলে না।
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const g = globalThis as typeof globalThis & { _mongoose?: MongooseCache };
const cache: MongooseCache = g._mongoose || (g._mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .catch((err) => {
        // ব্যর্থ সংযোগ ক্যাশে রাখা যাবে না, পরের রিকোয়েস্টে আবার চেষ্টা হবে
        cache.promise = null;
        throw err;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}