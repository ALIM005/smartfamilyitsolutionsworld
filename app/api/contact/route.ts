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


  // honeypot: bots fill this field, humans cannot even see it
  if (body?.website) return NextResponse.json({ ok: true });


  const name = clean(body?.name, 100);
  const email = clean(body?.email, 254).toLowerCase();
  const subject = clean(body?.subject, 150);
  const message = clean(body?.message, 3000);


  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ message: 'Provide all information correctly (the message must be at least 10 characters).' }, { status: 400 });
  }


  try {
    await connectDB();
    await ContactMessage.create({ name, email, subject, message });


    const to = process.env.CONTACT_TO_EMAIL;
    if (to) {
      await sendEmail({
        to,
        replyTo: email,
        subject: `[Contact] ${subject || 'New message'} — ${name}`,
        html: `<p><b>Name:</b> ${escapeHtml(name)}</p>
               <p><b>Email:</b> ${escapeHtml(email)}</p>
               <p><b>Message:</b></p>
               <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact]', err);
    return NextResponse.json({ message: 'There was a problem with the server.' }, { status: 500 });
  }
}