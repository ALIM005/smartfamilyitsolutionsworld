import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import {
  hashPassword,
  checkPassword,
  signToken,
  getSession,
  COOKIE_NAME,
  cookieOptions,
} from '@/lib/auth';
import { getProductByHost, isValidTenant } from '@/lib/products';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function resolveTenant(req: NextRequest, requested: unknown): string | null {
  if (typeof requested === 'string' && requested) {
    return isValidTenant(requested) ? requested : null;
  }
  const host = req.headers.get('host') || '';
  return getProductByHost(host)?.slug ?? 'portal';
}

// বর্তমান সেশন দেখুন
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ email: session.email, tenantId: session.tenantId });
}

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');

  if (action === 'logout') {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, '', { ...cookieOptions(), maxAge: 0 });
    return res;
  }

  if (action !== 'login' && action !== 'register') {
    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');
  const tenantId = resolveTenant(req, body?.tenant);

  if (!tenantId) return NextResponse.json({ message: 'Invalid tenant' }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ message: 'সঠিক ইমেইল দিন।' }, { status: 400 });
  }
  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ message: 'পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের হতে হবে।' }, { status: 400 });
  }

  try {
    await connectDB();
    let user: any;

    if (action === 'register') {
      try {
        user = await User.create({ tenantId, email, password: await hashPassword(password) });
      } catch (e: any) {
        if (e?.code === 11000) {
          return NextResponse.json({ message: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।' }, { status: 409 });
        }
        throw e;
      }
    } else {
      user = await User.findOne({ tenantId, email });
      const ok = user ? await checkPassword(password, user.password) : false;
      if (!user || !ok) {
        return NextResponse.json({ message: 'ইমেইল বা পাসওয়ার্ড ভুল।' }, { status: 401 });
      }
    }

    const token = await signToken({ uid: user._id.toString(), tenantId, email: user.email });
    const res = NextResponse.json({ ok: true }, { status: action === 'register' ? 201 : 200 });
    res.cookies.set(COOKIE_NAME, token, cookieOptions());
    return res;
  } catch (err) {
    console.error('[auth]', err);
    return NextResponse.json({ message: 'সার্ভারে সমস্যা হয়েছে।' }, { status: 500 });
  }
}
