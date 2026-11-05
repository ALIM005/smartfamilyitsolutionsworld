'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');

  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // লোকাল স্টোরেজ বা রিসেন্ট অর্ডার লিস্ট থেকে ডাটা ফেচ করার চেষ্টা
    const savedOrders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]');
    if (orderIdParam) {
      const found = savedOrders.find((ord: any) => ord.id === orderIdParam);
      if (found) {
        setOrderDetails(found);
      }
    } else if (savedOrders.length > 0) {
      // যদি প্যারামিটার না থাকে তবে সর্বশেষ অর্ডারটি দেখাবে
      setOrderDetails(savedOrders[0]);
    }
  }, [orderIdParam]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] p-6">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D81B7A]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#C9A24B]/20 blur-3xl" />

      <div className="relative w-full max-w-lg rounded-3xl border border-[#F3C6D3] bg-white/95 p-8 text-center shadow-2xl shadow-[#B0124F]/15 backdrop-blur md:p-10">
        
        {/* Success Checkmark Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#B0124F] to-[#D81B7A] text-3xl font-extrabold text-white shadow-lg shadow-[#B0124F]/40 ring-4 ring-[#E3B964]/60">
          ✓
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A24B]">
          Payment &amp; Order Confirmed
        </p>
        <h1 className="mb-2 font-serif text-3xl font-bold text-[#2E0A1C]">
          Thank You! <span className="italic text-[#B0124F]">Order Successful</span>
        </h1>
        <p className="mb-6 text-sm text-[#7A5566]">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। খুব শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
        </p>

        {/* Order Info Box */}
        <div className="mb-6 space-y-2.5 rounded-2xl border border-[#F3C6D3] bg-[#FFF4F6] p-5 text-left text-sm text-[#2E0A1C]">
          <div className="flex justify-between border-b border-[#F3C6D3]/60 pb-2">
            <span className="font-medium text-[#7A5566]">Order ID:</span>
            <span className="font-bold text-[#B0124F]">
              {orderDetails?.id || orderIdParam || 'SF-1024'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-[#7A5566]">Customer Name:</span>
            <span className="font-semibold">{orderDetails?.customerName || 'গ্রাহক'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-[#7A5566]">Phone Number:</span>
            <span className="font-semibold">{orderDetails?.phone || 'N/A'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-[#7A5566]">Payment Method:</span>
            <span className="font-semibold text-[#B0124F]">{orderDetails?.paymentMethod || 'SSLCommerz / Online'}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-[#7A5566]">Order Status:</span>
            <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {orderDetails?.status || 'Confirmed'}
            </span>
          </div>

          <div className="mt-2 flex justify-between border-t border-[#E3B964]/50 pt-3">
            <span className="font-bold text-[#4A0F2E]">Total Amount:</span>
            <span className="font-bold text-[#B0124F]">
              ৳{orderDetails?.totalAmountBDT ? orderDetails.totalAmountBDT.toLocaleString('en-BD') : '7,300'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/track-order"
            className="block w-full rounded-full bg-gradient-to-r from-[#E3B964] to-[#C9A24B] py-3.5 text-sm font-bold text-[#2E0A1C] shadow-md shadow-black/10 hover:brightness-105 transition"
          >
            📍 Track Your Order
          </Link>

          <Link
            href="/marketplace"
            className="block w-full rounded-full bg-gradient-to-r from-[#B0124F] to-[#D81B7A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B0124F]/30 hover:opacity-90 transition"
          >
            Continue Shopping →
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}