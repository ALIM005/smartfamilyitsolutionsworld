import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, totalAmount, customerName, customerEmail, customerPhone, customerAddress } = body;


    // SSLCommerz Credentials (these will need to be set later in the .env.local file as live or sandbox credentials)
    const store_id = process.env.SSLCOMMERZ_STORE_ID || 'your_store_id';
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'your_store_password';
    const isLive = process.env.NODE_ENV === 'production'; // Sandbox will be used in development and the live URL in production


    // SSLCommerz API Endpoint (Sandbox vs Live)
    const gatewayUrl = isLive
      ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.v1.php'
      : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.v1.php';


    const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';


    // SSLCommerz pay load data
    const postData = new URLSearchParams({
      store_id: store_id,
      store_passwd: store_passwd,
      total_amount: totalAmount?.toString() || '100',
      currency: 'BDT',
      tran_id: orderId || `TXN-${Date.now()}`,
      success_url: `${frontendUrl}/api/payment/success?orderId=${orderId}`,
      fail_url: `${frontendUrl}/api/payment/fail?orderId=${orderId}`,
      cancel_url: `${frontendUrl}/api/payment/cancel?orderId=${orderId}`,
      ipn_url: `${frontendUrl}/api/payment/ipn`,
      cus_name: customerName || 'Smart Family Customer',
      cus_email: customerEmail || 'customer@smartfamilyitsolutionsworld.com',
      cus_add1: customerAddress || 'Sylhet, Bangladesh',
      cus_city: 'Sylhet',
      cus_country: 'Bangladesh',
      cus_phone: customerPhone || '01700000000',
      shipping_method: 'Courier',
      product_name: 'Smart Family IT & E-Commerce Products',
      product_category: 'General',
      product_profile: 'general',
    });


    // Sending the request to the SSLCommerz server
    const response = await fetch(gatewayUrl, {
      method: 'POST',
      body: postData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });


    const result = await response.json();


    if (result && result.status === 'SUCCESS' && result.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        gatewayUrl: result.GatewayPageURL,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.failedreason || 'SSLCommerz payment initiation failed.',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment Initiation Error:', error);
    return NextResponse.json(
      { success: false, message: 'A server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}