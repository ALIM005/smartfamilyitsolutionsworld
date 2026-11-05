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


// Hides the database link's user-password in logs
function maskSecrets(value: unknown) {
  return String(value)
    .replace(/(mongodb(?:\+srv)?:\/\/)[^@\s]*@/gi, '$1***:***@')
    .slice(0, 300);
}


// Recognizes the error type and gives the user a safe message
function classifyError(err: any) {
  const name = String(err?.name ?? '');
  const msg = String(err?.message ?? '');
  const sysCode = String(err?.code ?? '');


  if (msg.includes('JWT_SECRET') || msg.includes('MONGODB_URI is not set')) {
    return { code: 'CONFIG', status: 500, message: 'There is a problem with the server configuration.' };
  }
  if (sysCode === '18' || /bad auth|Authentication failed/i.test(msg)) {
    return { code: 'DB_AUTH', status: 503, message: 'There was a problem with the database connection.' };
  }
  if (
    /ServerSelectionError|MongoNetworkError|MongoParseError/.test(name) ||
    /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|querySrv/.test(`${sysCode} ${msg}`)
  ) {
    return { code: 'DB_UNAVAILABLE', status: 503, message: 'The database is not available right now, please try again later.' };
  }
  return { code: 'UNKNOWN', status: 500, message: 'There was a problem with the server.' };
}


function resolveTenant(req: NextRequest, requested: unknown): string | null {
  if (typeof requested === 'string' && requested) {
    return isValidTenant(requested) ? requested : null;
  }
  const host = req.headers.get('host') || '';
  return getProductByHost(host)?.slug ?? 'portal';
}


// Takes the same amount of time to match the password even if the user does not exist
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hashPassword('dummy-password-for-timing'));


// Current session
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
    return json({ message: 'Provide a valid email.' }, 400);
  }
  if (password.length < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return json({ message: 'The password must be at least 8 characters and at most 72 bytes.' }, 400);
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
          return json({ message: 'An account already exists with this email.' }, 409);
        }
        throw e;
      }
    } else {
      user = await User.findOne({ tenantId, email });
      const ok = await checkPassword(password, user ? user.password : await getDummyHash());
      if (!user || !ok) {
        return json({ message: 'Incorrect email or password.' }, 401);
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
    // The actual cause will be visible in the Vercel log; only the safe code will go to the browser
    console.error(`[auth] ${info.code} |`, err?.name, err?.code ?? '', maskSecrets(err?.message));
    return json({ message: info.message, code: info.code }, info.status);
  }
}