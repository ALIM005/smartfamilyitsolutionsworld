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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status });

// লগে ডাটাবেস লিংকের ইউজার-পাসওয়ার্ড লুকিয়ে দেয়
function maskSecrets(value: unknown) {
  return String(value)
    .replace(/(mongodb(?:\+srv)?:\/\/)[^@\s]*@/gi, '$1***:***@')
    .slice(0, 300);
}

// ত্রুটির ধরন চিনে ব্যবহারকারীকে নিরাপদ বার্তা দেয়
function classifyError(err: any) {
  const name = String(err?.name ?? '');
  const msg = String(err?.message ?? '');
  const sysCode = String(err?.code ?? '');

  if (msg.includes('JWT_SECRET') || msg.includes('MONGODB_URI is not set')) {
    return { code: 'CONFIG', status: 500, message: 'সার্ভারের কনফিগারেশনে সমস্যা আছে।' };
  }
  if (sysCode === '18' || /bad auth|Authentication failed/i.test(msg)) {
    return { code: 'DB_AUTH', status: 503, message: 'ডাটাবেস সংযোগে সমস্যা হয়েছে।' };
  }
  if (
    /ServerSelectionError|MongoNetworkError|MongoParseError/.test(name) ||
    /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|querySrv/.test(`${sysCode} ${msg}`)
  ) {
    return { code: 'DB_UNAVAILABLE', status: 503, message: 'ডাটাবেস এখন পাওয়া যাচ্ছে না, একটু পরে চেষ্টা করুন।' };
  }
  return { code: 'UNKNOWN', status: 500, message: 'সার্ভারে সমস্যা হয়েছে।' };
}

function resolveTenant(req: NextRequest, requested: unknown): string | null {
  if (typeof requested === 'string' && requested) {
    return isValidTenant(requested) ? requested : null;
  }
  const host = req.headers.get('host') || '';
  return getProductByHost(host)?.slug ?? 'portal';
}

// ইউজার না থাকলেও পাসওয়ার্ড মেলানোর সমান সময় লাগাতে
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword('dummy-password-for-timing'));

// বর্তমান সেশন
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return json({ message: 'Unauthorized' }, 401);
    return json({ email: session.email, tenantId: session.tenantId });
  } catch (err: any) {
    console.error('[auth:get]', err?.name, maskSecrets(err?.message));
    return json({ message: 'Unauthorized' }, 401);
  }
}

export async function POST(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action');

  if (action === 'logout') {
    const res = json({ ok: true });
    res.cookies.set(COOKIE_NAME, '', { ...cookieOptions(), maxAge: 0 });
    return res;
  }

  if (action !== 'login' && action !== 'register') {
    return json({ message: 'Invalid action' }, 400);
  }

  if (!(req.headers.get('content-type') || '').includes('application/json')) {
    return json({ message: 'Invalid request' }, 415);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ message: 'Invalid request' }, 400);
  }

  const email = String(body?.email ?? '').trim().toLowerCase();
  const password = String(body?.password ?? '');
  const tenantId = resolveTenant(req, body?.tenant);

  if (!tenantId) return json({ message: 'Invalid tenant' }, 400);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ message: 'সঠিক ইমেইল দিন।' }, 400);
  }
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return json({ message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর এবং সর্বোচ্চ ৭২ বাইটের হতে হবে।' }, 400);
  }

  try {
    await connectDB();
    let user: any;

    if (action === 'register') {
      try {
        user = await User.create({
          tenantId,
          email,
          password: await hashPassword(password),
        });
      } catch (e: any) {
        if (e?.code === 11000) {
          return json({ message: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।' }, 409);
        }
        throw e;
      }
    } else {
      user = await User.findOne({ tenantId, email });
      const ok = await checkPassword(password, user ? user.password : await getDummyHash());
      if (!user || !ok) {
        return json({ message: 'ইমেইল বা পাসওয়ার্ড ভুল।' }, 401);
      }
    }

    const token = await signToken({
      uid: user._id.toString(),
      tenantId,
      email: user.email,
    });

    const res = json({ ok: true }, action === 'register' ? 201 : 200);
    res.cookies.set(COOKIE_NAME, token, cookieOptions());
    return res;
  } catch (err: any) {
    const info = classifyError(err);
    // Vercel লগে আসল কারণ দেখা যাবে, ব্রাউজারে শুধু নিরাপদ কোড যাবে
    console.error(`[auth] ${info.code} |`, err?.name, err?.code ?? '', maskSecrets(err?.message));
    return json({ message: info.message, code: info.code }, info.status);
  }
}