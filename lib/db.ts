import dns from 'node:dns';
import mongoose from 'mongoose';


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
        cache.promise = null;
        throw err;
      });
  }


  cache.conn = await cache.promise;
  return cache.conn;
}


// This also remains attached as the default export
export default connectDB;