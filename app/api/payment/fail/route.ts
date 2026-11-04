import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: Request) {
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const contentType = request.headers.get('content-type') || '';
    let tran_id: string | null = null;
    let errorReason: string = 'Payment Failed';

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      tran_id = formData.get('tran_id') as string;
      errorReason = (formData.get('error') as string) || 'Payment Failed';
    } else {
      const body = await request.json().catch(() => ({}));
      tran_id = body.tran_id;
      errorReason = body.error || 'Payment Failed';
    }

    if (!tran_id) {
      const { searchParams } = new URL(request.url);
      tran_id = searchParams.get('tran_id');
      errorReason = searchParams.get('error') || 'Payment Failed';
    }

    if (tran_id) {
      try {
        await dbConnect();
        await Order.findOneAndUpdate(
          { id: tran_id },
          { 
            status: 'Failed', 
            paymentDetails: `SSLCommerz Failed - Reason: ${errorReason}` 
          }
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
    }

    return NextResponse.redirect(`${frontendUrl}/checkout?error=payment_failed&tranId=${tran_id || 'N/A'}`, {
      status: 303,
    });
  } catch (error) {
    console.error('Payment Fail POST Error:', error);
    return NextResponse.redirect(`${frontendUrl}/checkout?error=server_error`, {
      status: 303,
    });
  }
}

export async function GET(request: Request) {
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const { searchParams } = new URL(request.url);
    const tran_id = searchParams.get('tran_id');
    const errorReason = searchParams.get('error') || 'Payment Failed';

    if (tran_id) {
      try {
        await dbConnect();
        await Order.findOneAndUpdate(
          { id: tran_id },
          { 
            status: 'Failed', 
            paymentDetails: `SSLCommerz Failed - Reason: ${errorReason}` 
          }
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
    }

    return NextResponse.redirect(`${frontendUrl}/checkout?error=payment_failed&tranId=${tran_id || 'N/A'}`, {
      status: 303,
    });
  } catch (error) {
    console.error('Payment Fail GET Error:', error);
    return NextResponse.redirect(`${frontendUrl}/checkout?error=server_error`, {
      status: 303,
    });
  }
}