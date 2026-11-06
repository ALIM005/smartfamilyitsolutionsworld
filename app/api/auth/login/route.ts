import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongo';
import User from '@/models/User'; // আপনার ইউজার মডেল অনুযায়ী পরিবর্তন করে নিতে পারেন
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// লগইন ভ্যালিডেশন স্কিমা
const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = LoginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid login data', details: validationResult.error.format() },
        { status: 422 }
      );
    }

    const { email, password } = validationResult.data;

    await connectMongo();

    // ইউজার খুঁজে বের করা
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // পাসওয়ার্ড যাচাই করা
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // সফল লগইন রেসপন্স (এখানে সেশন বা টোকেন জেনারেট করা যেতে পারে)
    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[Login API Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}