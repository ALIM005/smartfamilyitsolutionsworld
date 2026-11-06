import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { connectMongo } from '@/lib/mongo';
import ITSoftware from '@/models/ITSoftware';
import mongoose from 'mongoose';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Advanced Validation Schema for IT Software Patch
const ITSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  version: z.string().max(50).optional(),
  description: z.string().min(10).optional(),
  price: z.number().nonnegative().optional(),
  image: z.string().url().optional(),
  features: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Resource ID Format' },
      { status: 400 }
    );
  }

  try {
    const rawBody = await req.json();
    const validationResult = ITSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid Patch Payload', details: validationResult.error.format() },
        { status: 422 }
      );
    }

    await connectMongo();

    const updatedSoftware = await ITSoftware.findByIdAndUpdate(
      id,
      { $set: validationResult.data },
      { new: true, runValidators: true }
    );

    if (!updatedSoftware) {
      return NextResponse.json(
        { success: false, error: 'Target IT Software Entity Not Found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, software: updatedSoftware },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[Admin IT Software PATCH Error - ${id}]:`, error);
    return NextResponse.json(
      { success: false, error: 'Atomic update operation failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid Resource ID Format' },
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    const deletionResult = await ITSoftware.findByIdAndDelete(id);

    if (!deletionResult) {
      return NextResponse.json(
        { success: false, error: 'Target IT Software Entity Already Absent' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'IT Software record cleanly expunged' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[Admin IT Software DELETE Error - ${id}]:`, error);
    return NextResponse.json(
      { success: false, error: 'Destructive deletion operation failed' },
      { status: 500 }
    );
  }
}