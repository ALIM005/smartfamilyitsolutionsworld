// app/api/admin/blog/route.ts
// GET  → সব ব্লগ পোস্ট (ড্রাফট সহ)
// POST → নতুন ব্লগ পোস্ট
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import BlogPost from '@/models/BlogPost';
import type { BlogDoc, LeanBlogDoc } from '@/models/BlogPost';
import { toPost } from '@/lib/blog-server';
import { parseBlogInput } from '@/lib/blog-validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    await connectMongo();
    const docs = await BlogPost.find({}).sort({ publishedAt: -1, createdAt: -1 }).limit(500).lean<LeanBlogDoc[]>();
    return NextResponse.json({ success: true, posts: docs.map(toPost) });
  } catch (error) {
    console.error('[admin blog GET]', error);
    return NextResponse.json({ success: false, error: 'ব্লগ লোড করা যায়নি' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'অবৈধ ডেটা' }, { status: 400 });
  }

  const parsed = parseBlogInput(body, 'create');
  if (!parsed.ok) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
  const data = { ...parsed.data };

  try {
    await connectMongo();

    // slug অনন্য রাখা
    const base = String(data.slug);
    let slug = base;
    for (let i = 0; i < 5 && (await BlogPost.exists({ slug })); i++) {
      slug = `${base}-${randomBytes(2).toString('hex')}`;
    }
    data.slug = slug;

    const created = await BlogPost.create(data as unknown as Partial<BlogDoc>);
    const post = toPost(created.toObject() as unknown as LeanBlogDoc);
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    return NextResponse.json({ success: true, post });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ success: false, error: 'এই slug আগে থেকেই আছে' }, { status: 409 });
    }
    console.error('[admin blog POST]', error);
    return NextResponse.json({ success: false, error: 'পোস্ট সেভ করা যায়নি' }, { status: 500 });
  }
}