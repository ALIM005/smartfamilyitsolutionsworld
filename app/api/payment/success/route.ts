import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: Request) {
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const contentType = request.headers.get('content-type') || '';
    let tran_id: string | null = null;
    let val_id: string | null = null;
    let amount: string | null = null;

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      tran_id = formData.get('tran_id') as string;
      val_id = formData.get('val_id') as string;
      amount = formData.get('amount') as string;
    } else {
      const body = await request.json().catch(() => ({}));
      tran_id = body.tran_id;
      val_id = body.val_id;
      amount = body.amount;
    }

    if (!tran_id) {
      const { searchParams } = new URL(request.url);
      tran_id = searchParams.get('tran_id');
      val_id = searchParams.get('val_id');
      amount = searchParams.get('amount');
    }

    if (tran_id) {
      try {
        await dbConnect();
        await Order.findOneAndUpdate(
          { id: tran_id },
          { 
            status: 'Paid', 
            paymentDetails: `SSLCommerz Success - ValID: ${val_id || 'N/A'}, Amount: ${amount || 'N/A'}` 
          }
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
    }

    return NextResponse.redirect(`${frontendUrl}/order-success?orderId=${tran_id || 'N/A'}&valId=${val_id || 'N/A'}`, {
      status: 303,
    });
  } catch (error: any) {
    console.error('Payment Success POST Error:', error);
    return NextResponse.redirect(`${frontendUrl}/checkout?error=payment_processing_failed`, {
      status: 303,
    });
  }
}

export async function GET(request: Request) {
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const { searchParams } = new URL(request.url);
    const tran_id = searchParams.get('tran_id');
    const val_id = searchParams.get('val_id');
    const amount = searchParams.get('amount');

    if (tran_id) {
      try {
        await dbConnect();
        await Order.findOneAndUpdate(
          { id: tran_id },
          { 
            status: 'Paid', 
            paymentDetails: `SSLCommerz Success - ValID: ${val_id || 'N/A'}, Amount: ${amount || 'N/A'}` 
          }
        );
      } catch (dbError) {
        console.error('Database update error:', dbError);
      }
    }

    return NextResponse.redirect(`${frontendUrl}/order-success?orderId=${tran_id || 'N/A'}&valId=${val_id || 'N/A'}`, {
      status: 303,
    });
  } catch (error: any) {
    console.error('Payment Success GET Error:', error);
    return NextResponse.redirect(`${frontendUrl}/checkout?error=payment_processing_failed`, {
      status: 303,
    });
  }
}