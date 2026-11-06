import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import mongoose, { Schema, Document } from 'mongoose';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Message Interface
export interface IContactMessage extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  selectedFaqs?: string[];
  createdAt: Date;
}

// Contact Message Schema
const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    selectedFaqs: { type: [String], default: [] },
  },
  { timestamps: true }
);

const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessage>('ContactMessage', ContactMessageSchema);

// GET: Fetch messages for Admin Panel
export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectMongo();
    const docs = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const messages = docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      message: doc.message,
      selectedFaqs: doc.selectedFaqs || [],
      createdAt: doc.createdAt,
    }));

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('[admin messages GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST: Save message from Contact Form / FAQ selection
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { name, email, subject, message, selectedFaqs, website } = body;

  // Anti-Spam Honeypot check
  if (website) {
    return NextResponse.json({ success: true, message: 'Sent' });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: 'Name, email, and message are required' },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    const created = await ContactMessage.create({
      name,
      email,
      subject: subject || '',
      message,
      selectedFaqs: Array.isArray(selectedFaqs) ? selectedFaqs : [],
    });

    return NextResponse.json({
      success: true,
      message: 'Message saved successfully',
      id: created._id.toString(),
    });
  } catch (error) {
    console.error('[admin messages POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save message' },
      { status: 500 }
    );
  }
}