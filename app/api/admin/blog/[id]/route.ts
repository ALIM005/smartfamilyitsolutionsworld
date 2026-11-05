// app/api/admin/blog/[id]/route.ts
// PATCH  → Edit post (partial update will work)
// DELETE → Delete post
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import BlogPost from '@/models/BlogPost';
import type { BlogDoc, LeanBlogDoc } from '@/models/BlogPost';
import { toPost } from '@/lib/blog-server';
import { parseBlogInput } from '@/lib/blog-validate';


export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


type Ctx = { params: Promise<{ id: string }> };


const bad = (error: string, status: number) => NextResponse.json({ success: false, error }, { status });


export async function PATCH(req: Request, { params }: Ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;


  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return bad('Invalid ID', 400);


  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid data', 400);
  }


  const parsed = parseBlogInput(body, 'update');
  if (!parsed.ok) return bad(parsed.error, 400);
  const data = parsed.data;


  try {
    await connectMongo();


    if (typeof data.slug === 'string' && (await BlogPost.exists({ slug: data.slug, _id: { $ne: id } }))) {
      return bad('This slug already exists, provide another slug', 409);
    }


    const before = await BlogPost.findById(id).select('slug').lean<{ slug: string }>();
    const doc = await BlogPost.findByIdAndUpdate(id, { $set: data as unknown as Partial<BlogDoc> }, { new: true, runValidators: true }).lean<LeanBlogDoc>();
    if (!doc) return bad('Post not found', 404);


    revalidatePath('/blog');
    revalidatePath(`/blog/${doc.slug}`);
    if (before && before.slug !== doc.slug) revalidatePath(`/blog/${before.slug}`);
    return NextResponse.json({ success: true, post: toPost(doc) });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return bad('This slug already exists', 409);
    console.error('[admin blog PATCH]', error);
    return bad('The post could not be saved', 500);
  }
}


export async function DELETE(req: Request, { params }: Ctx) {
  const denied = requireAdmin(req);
  if (denied) return denied;


  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return bad('Invalid ID', 400);


  try {
    await connectMongo();
    const doc = await BlogPost.findByIdAndDelete(id).lean<LeanBlogDoc>();
    if (!doc) return bad('Post not found', 404);
    revalidatePath('/blog');
    revalidatePath(`/blog/${doc.slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin blog DELETE]', error);
    return bad('The post could not be deleted', 500);
  }
}