'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setSearched(true);

    // লোকাল স্টোরেজ বা সেভ করা অর্ডার লিস্ট থেকে খোঁজা
    const savedOrders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]');
    const found = savedOrders.find(
      (ord: any) => ord.id.toLowerCase() === orderIdInput.trim().toLowerCase()
    );

    if (found) {
      setOrderResult(found);
    } else {
      // যদি লোকাল স্টোরেজে না থাকে তবে ডেমো বা নট ফাউন্ড হিসেবে দেখাবে
      setOrderResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A24B] mb-2">
            Order Tracking
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2E0A1C]">
            Track Your <span className="italic text-[#B0124F]">Order</span>
          </h1>
          <p className="text-sm text-[#7A5566] mt-2">
            আপনার অর্ডার আইডি (Order ID) দিয়ে অর্ডারের বর্তমান অবস্থা জেনে নিন।
          </p>
        </div>

        {/* Search Box Card */}
        <div className="bg-white/95 rounded-3xl shadow-xl border border-[#F3C6D3] p-6 sm:p-8 backdrop-blur mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="অর্ডার আইডি লিখুন (যেমন: ORD-123456)"
              className="flex-1 px-4 py-3 rounded-2xl border border-[#F3C6D3] bg-[#FFFAFB] text-sm text-[#2E0A1C] placeholder:text-[#B590A0] focus:border-[#B0124F] focus:outline-none focus:ring-2 focus:ring-[#B0124F]/25"
            />
            <button
              type="submit"
              className="rounded-2xl bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#B0124F]/30 hover:opacity-90 transition"
            >
              Search Order
            </button>
          </form>
        </div>

        {/* Search Result Section */}
        {searched && (
          <div className="bg-white/95 rounded-3xl shadow-xl border border-[#F3C6D3] p-6 sm:p-8 backdrop-blur">
            {orderResult ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F3C6D3] pb-4 gap-2">
                  <div>
                    <p className="text-xs text-[#7A5566]">Order ID</p>
                    <h2 className="font-serif text-xl font-bold text-[#B0124F]">{orderResult.id}</h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-[#7A5566]">Order Date</p>
                    <p className="text-sm font-semibold text-[#2E0A1C]">{orderResult.date || 'Today'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-[#FFF4F6] p-4 rounded-2xl border border-[#F3C6D3]/60">
                  <div>
                    <p className="text-[#7A5566] text-xs">Customer Name</p>
                    <p className="font-semibold text-[#2E0A1C]">{orderResult.customerName}</p>
                  </div>
                  <div>
                    <p className="text-[#7A5566] text-xs">Phone Number</p>
                    <p className="font-semibold text-[#2E0A1C]">{orderResult.phone}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[#7A5566] text-xs">Delivery Address</p>
                    <p className="font-semibold text-[#2E0A1C]">{orderResult.address}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#4A0F2E]">Items Ordered</p>
                  <p className="text-sm font-medium text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {orderResult.items}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#F3C6D3] pt-4">
                  <div>
                    <p className="text-xs text-[#7A5566]">Payment Method: <span className="font-semibold text-[#2E0A1C]">{orderResult.paymentMethod}</span></p>
                    <p className="text-sm font-bold text-[#4A0F2E] mt-1">Total: ৳{orderResult.totalAmountBDT?.toLocaleString('en-BD')}</p>
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      Status: {orderResult.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="text-4xl">🔍</div>
                <h3 className="font-serif text-lg font-bold text-[#2E0A1C]">কোনো অর্ডার পাওয়া যায়নি</h3>
                <p className="text-sm text-[#7A5566] max-w-md mx-auto">
                  আপনার দেওয়া আইডি (<span className="font-semibold text-[#B0124F]">{orderIdInput}</span>) দিয়ে এই ডিভাইসে কোনো অর্ডার রেকর্ড পাওয়া যায়নি। দয়া করে সঠিক অর্ডার আইডি দিয়ে আবার চেষ্টা করুন।
                </p>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/marketplace" className="text-sm font-semibold text-[#B0124F] hover:underline">
            ← শপিং এ ফিরে যান
          </Link>
        </div>

      </div>
    </div>
  );
}