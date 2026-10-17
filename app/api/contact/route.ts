import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import ContactMessage from '@/models/ContactMessage';
import { sendEmail, escapeHtml } from '@/lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  // honeypot: বট এই ফিল্ড পূরণ করে, মানুষ দেখতেই পায় না
  if (body?.website) return NextResponse.json({ ok: true });

  const name = clean(body?.name, 100);
  const email = clean(body?.email, 254).toLowerCase();
  const subject = clean(body?.subject, 150);
  const message = clean(body?.message, 3000);

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ message: 'সব তথ্য সঠিকভাবে দিন (বার্তা কমপক্ষে ১০ অক্ষর)।' }, { status: 400 });
  }

  try {
    await connectDB();
    await ContactMessage.create({ name, email, subject, message });

    const to = process.env.CONTACT_TO_EMAIL;
    if (to) {
      await sendEmail({
        to,
        replyTo: email,
        subject: `[Contact] ${subject || 'নতুন বার্তা'} — ${name}`,
        html: `<p><b>নাম:</b> ${escapeHtml(name)}</p>
               <p><b>ইমেইল:</b> ${escapeHtml(email)}</p>
               <p><b>বার্তা:</b></p>
               <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ message: 'সার্ভারে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
