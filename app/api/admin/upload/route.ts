// app/api/admin/upload/route.ts — Secure token for image/video upload (Vercel Blob, directly from the browser)
// Setup: `npm i @vercel/blob` + Vercel → Storage → Create a Blob store (BLOB_READ_WRITE_TOKEN is added automatically)
import { NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob/client';
import type { HandleUploadBody } from '@vercel/blob/client';
import { requireAdmin } from '@/lib/admin-auth';


export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
const MAX_BYTES = 200 * 1024 * 1024; // Maximum 200MB (in the admin UI, images are 10MB, videos are 200MB)


export async function POST(req: Request) {
  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }


  try {
    const result = await handleUpload({
      body,
      request: req,
      // Only a logged-in admin gets the upload token
      onBeforeGenerateToken: async () => {
        if (requireAdmin(req)) throw new Error('Unauthorized');
        return { allowedContentTypes: ALLOWED_TYPES, maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      onUploadCompleted: async () => {
        /* Nothing to save: the URL is saved when the post is saved */
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ success: false, error: message }, { status: message === 'Unauthorized' ? 401 : 400 });
  }
}