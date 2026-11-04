import { NextRequest, NextResponse } from 'next/server';

// অর্ডারের ডেটার জন্য টাইপ ইন্টারফেস
interface CourierRequestBody {
  recipientName: string;
  address: string;
  phone: string;
  weight: number;
}

export async function POST(req: NextRequest) {
  try {
    // ১. রিকোয়েস্ট বডি পার্স করা
    const body: CourierRequestBody = await req.json();
    const { recipientName, address, phone, weight } = body;

    // ২. বেসিক ইনপুট ভ্যালিডেশন
    if (!recipientName || !address || !phone || !weight) {
      return NextResponse.json(
        { success: false, error: 'সব প্রয়োজনীয় তথ্য (নাম, ঠিকানা, ফোন, ওজন) প্রদান করা বাধ্যতামূলক।' },
        { status: 400 }
      );
    }

    // ৩. এনভায়রনমেন্ট ভেরিয়েবল চেক করা
    const apiUrl = process.env.SUNDARBAN_API_URL;
    const apiKey = process.env.SUNDARBAN_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error('Sundarban API configuration is missing in environment variables.');
      return NextResponse.json(
        { success: false, error: 'সার্ভার কনফিগারেশন ত্রুটি। অনুগ্রহ করে পরবর্তীতে চেষ্টা করুন।' },
        { status: 500 }
      );
    }

    // ৪. সুন্দরবন কুরিয়ার এপিআই কল করা (টাইমআউট সহ সিকিউর ফেচ)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // ১৫ সেকেন্ড টাইমআউট

    try {
      const response = await fetch(`${apiUrl}/create-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          recipientName,
          address,
          phone,
          weight,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      // ৫. সুন্দরবন এপিআই ফেইল করলে হ্যান্ডেল করা
      if (!response.ok) {
        return NextResponse.json(
          { 
            success: false, 
            error: data.message || 'কুরিয়ার বুকিং ব্যর্থ হয়েছে।' 
          }, 
          { status: response.status }
        );
      }

      // ৬. সফল রেসপন্স রিটার্ন করা
      return NextResponse.json({
        success: true,
        message: 'কুরিয়ার বুকিং সফলভাবে সম্পন্ন হয়েছে।',
        data,
      }, { status: 200 });

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'কুরিয়ার সার্ভিসের সাথে সংযোগ করতে সময় বেশি লেগেছে (Timeout)।' },
          { status: 504 }
        );
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error('Sundarban API Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'অভ্যন্তরীণ সার্ভার ত্রুটি (Internal Server Error) ঘটেছে।' },
      { status: 500 }
    );
  }
}