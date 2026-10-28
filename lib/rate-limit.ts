// lib/rate-limit.ts
// সহজ ইন-মেমোরি রেট লিমিট। Vercel সার্ভারলেসে প্রতিটি ইনস্ট্যান্সের নিজস্ব মেমোরি, তাই এটা
// "সাধারণ অপব্যবহার ঠেকানো"-র স্তর, কড়া সুরক্ষা নয়। ট্রাফিক বাড়লে Upstash Redis ব্যবহার করুন।

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  if (buckets.size > 5000) {
    buckets.forEach((b, k) => {
      if (b.resetAt <= now) buckets.delete(k);
    });
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}
