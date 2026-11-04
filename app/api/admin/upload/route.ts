// app/api/admin/upload/route.ts — ছবি/ভিডিও আপলোডের নিরাপদ টোকেন (Vercel Blob, ব্রাউজার থেকে সরাসরি)
// সেটআপ: `npm i @vercel/blob` + Vercel → Storage → Blob স্টোর তৈরি (BLOB_READ_WRITE_TOKEN নিজে যোগ হয়)
import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import type { HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
const MAX_BYTES = 200 * 1024 * 1024; // সর্বোচ্চ ২০০MB (অ্যাডমিন UI-তে ছবি ১০MB, ভিডিও ২০০MB)

export async function POST(req: Request) {
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ success: false, error: 'অবৈধ ডেটা' }, { status: 400 });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      // শুধু লগইন করা অ্যাডমিন আপলোড টোকেন পায়
      onBeforeGenerateToken: async () => {
        if (requireAdmin(req)) throw new Error('Unauthorized');
        return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {
        /* কিছু সেভ করার নেই: পোস্ট সেভ করার সময় URL সেভ হয় */
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'আপলোড হয়নি';
    return NextResponse.json({ success: false, error: message }, { status: message === 'Unauthorized' ? 401 : 400 });
  }
}