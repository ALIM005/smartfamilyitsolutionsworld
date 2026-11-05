import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import SheetData from '@/models/SheetData';
import { getSession } from '@/lib/auth';


const TENANT = 'spreadsheet'; // Only users of this product will be able to use this API
const MAX_ROWS = 200;
const MAX_COLS = 26;
const MAX_CELL = 1000;


function validateSheet(c: unknown): string[][] | null {
  if (!Array.isArray(c) || c.length === 0 || c.length > MAX_ROWS) return null;
  for (const row of c) {
    if (!Array.isArray(row) || row.length > MAX_COLS) return null;
    for (const cell of row) {
      if (typeof cell !== 'string' || cell.length > MAX_CELL) return null;
    }
  }
  return c as string[][];
}


export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (session.tenantId !== TENANT) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });


  try {
    await connectDB();
    const sheet = await SheetData.findOne({ tenantId: TENANT, userId: session.uid });
    return NextResponse.json({ email: session.email, data: sheet?.content ?? [] });
  } catch (err) {
    console.error('[sync:get]', err);
    return NextResponse.json({ message: 'There was a problem with the server.' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (session.tenantId !== TENANT) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });


  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }


  const content = validateSheet(body?.content);
  if (!content) return NextResponse.json({ message: 'The sheet data is not valid.' }, { status: 400 });


  try {
    await connectDB();
    await SheetData.findOneAndUpdate(
      { tenantId: TENANT, userId: session.uid },
      { $set: { content } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[sync:post]', err);
    return NextResponse.json({ message: 'There was a problem with the server.' }, { status: 500 });
  }
}