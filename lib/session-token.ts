// lib/session-token.ts
// Admin session token (HMAC-SHA256 signed, with expiry). Uses only Node crypto.
import { createHash, createHmac, timingSafeEqual } from 'crypto';


export const ADMIN_COOKIE = 'sf_admin';
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours


function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}


export function createToken(secret: string, nowMs: number = Date.now()): string {
  const exp = Math.floor(nowMs / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${exp}`;
  return `${payload}.${sign(payload, secret)}`;
}


export function verifyToken(token: string | undefined | null, secret: string, nowMs: number = Date.now()): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') return false;


  const payload = `${parts[0]}.${parts[1]}`;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(parts[2]);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;


  const exp = Number(parts[1]);
  return Number.isFinite(exp) && exp * 1000 > nowMs;
}


// Whether two strings are equal, without leaking timing (hashes them to make equal lengths)
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}


export function readCookie(header: string | null | undefined, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return undefined;
}