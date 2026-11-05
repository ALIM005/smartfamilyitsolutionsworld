// lib/admin-auth.ts
// Security for the admin panel. It is separate from your existing user login (lib/auth.ts);
// for the store owner, it uses one password (ADMIN_PASSWORD) and a signed HttpOnly cookie.
import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  createToken,
  readCookie,
  safeEqual,
  verifyToken,
} from './session-token';


function sessionSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}


export function adminConfigured(): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw && pw.length >= 10 && sessionSecret());
}


export function passwordMatches(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 10) return false;
  return safeEqual(input, pw);
}


export function isAdminRequest(req: Request): boolean {
  const secret = sessionSecret();
  if (!secret) return false;
  return verifyToken(readCookie(req.headers.get('cookie'), ADMIN_COOKIE), secret);
}


// If Origin exists, it must be from the same host (an additional layer against CSRF)
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}


// At the start of every admin API: null means authorized; otherwise, a response that can be returned directly
export function requireAdmin(req: Request): NextResponse | null {
  if (!adminConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Admin setup is not complete (provide ADMIN_PASSWORD and ADMIN_SESSION_SECRET)' },
      { status: 503 }
    );
  }
  if (!sameOrigin(req)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}


export function attachSession(res: NextResponse): NextResponse {
  const secret = sessionSecret();
  if (!secret) return res;
  res.cookies.set(ADMIN_COOKIE, createToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}


export function clearSession(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  return res;
}