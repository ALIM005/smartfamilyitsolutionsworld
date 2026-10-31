import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const orderData = await req.json();

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    console.log("Saving order to DB:", { orderId, ...orderData });

    const smsMessage = `Your order ${orderId} has been submitted successfully!`;
    console.log(`Sending SMS to ${orderData.phone}: ${smsMessage}`);

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order placed successfully and SMS sent.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}