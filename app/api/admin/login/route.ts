// app/api/admin/login/route.ts
// GET    → লগইন আছে কি না
// POST   → পাসওয়ার্ড দিয়ে লগইন (রেট-লিমিট সহ)
// DELETE → লগআউট
import { NextResponse } from 'next/server';
import { adminConfigured, attachSession, clearSession, isAdminRequest, passwordMatches, sameOrigin } from '@/lib/admin-auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  return NextResponse.json({
    success: true,
    configured: adminConfigured(),
    authenticated: isAdminRequest(req),
  });
}

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { success: false, error: 'ADMIN_PASSWORD (১০+ অক্ষর) ও ADMIN_SESSION_SECRET (৩২+ অক্ষর) Vercel-এ সেট করুন' },
      { status: 503 }
    );
  }
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });

  const rl = rateLimit(`admin-login:${clientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    const res = NextResponse.json(
      { success: false, error: 'অনেকবার ভুল চেষ্টা হয়েছে, ১০ মিনিট পর আবার চেষ্টা করুন' },
      { status: 429 }
    );
    res.headers.set('Retry-After', String(rl.retryAfterSec));
    return res;
  }

  let password = '';
  try {
    const body: unknown = await req.json();
    if (body && typeof body === 'object' && typeof (body as { password?: unknown }).password === 'string') {
      password = (body as { password: string }).password.slice(0, 200);
    }
  } catch {
    /* খালি পাসওয়ার্ড হিসেবে গণ্য */
  }

  if (!passwordMatches(password)) {
    return NextResponse.json({ success: false, error: 'পাসওয়ার্ড ভুল' }, { status: 401 });
  }
  return attachSession(NextResponse.json({ success: true }));
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  return clearSession(NextResponse.json({ success: true }));
}
