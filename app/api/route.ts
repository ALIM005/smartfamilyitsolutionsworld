import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';


export const dynamic = 'force-dynamic';


// GET /api        → Whether only the server is running
// GET /api?db=1   → Also verifies the database connection
export async function GET(req: NextRequest) {
  const checkDb = req.nextUrl.searchParams.get('db') === '1';


  if (!checkDb) {
    return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
  }


  try {
    await connectDB();
    await mongoose.connection.db?.admin().ping();
    return NextResponse.json({ status: 'ok', db: 'ok', time: new Date().toISOString() });
  } catch (err) {
    console.error('[health]', err);
    // Internal errors are not shown externally
    return NextResponse.json({ status: 'error', db: 'down' }, { status: 503 });
  }
}


// Other methods are disabled
export async function POST() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}