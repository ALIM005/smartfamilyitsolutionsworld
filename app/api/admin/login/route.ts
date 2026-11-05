// app/api/admin/login/route.ts
// GET    → Whether logged in
// POST   → Log in with password (with rate-limit)
// DELETE → Log out
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
      { success: false, error: 'Set ADMIN_PASSWORD (10+ characters) and ADMIN_SESSION_SECRET (32+ characters) in Vercel' },
      { status: 503 }
    );
  }
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });


  const rl = rateLimit(`admin-login:${clientIp(req)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    const res = NextResponse.json(
      { success: false, error: 'Too many incorrect attempts, try again after 10 minutes' },
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
    /* considered as an empty password */
  }


  if (!passwordMatches(password)) {
    return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
  }
  return attachSession(NextResponse.json({ success: true }));
}


export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  return clearSession(NextResponse.json({ success: true }));
}