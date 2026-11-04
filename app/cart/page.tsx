'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/* ---------- Currency Type & Rate Configuration ---------- */
type Currency = 'BDT' | 'USD';
const BDT_PER_USD: number = Number(process.env.NEXT_PUBLIC_BDT_PER_USD) || 120;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface CartItem {
  id: string;
  name: string;
  priceBDT: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

export default function CartPage() {
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Smart Wireless Headset',
      priceBDT: 60,
      quantity: 1,
      image: '/headset.jpg',
      color: 'Black',
      size: 'Standard',
    },
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('preferred_currency');
      if (saved === 'BDT' || saved === 'USD') {
        setCurrency(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    try {
      localStorage.setItem('preferred_currency', newCurrency);
    } catch {
      // ignore
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotalBDT = cartItems.reduce((sum, item) => sum + item.priceBDT * item.quantity, 0);

  const formatPrice = (amountBDT: number) => {
    const bdtAmount = Math.round(amountBDT);
    const usdAmount = amountBDT / BDT_PER_USD;

    const bdtFormatted = `৳${bdtAmount.toLocaleString('en-BD')}`;
    const usdFormatted = usdFormatter.format(usdAmount);

    if (currency === 'USD') {
      return (
        <span className="flex items-center gap-1.5 font-bold">
          <span className="text-[#B0124F]">{usdFormatted}</span>
          <span className="text-xs text-[#7A5566] font-normal">({bdtFormatted})</span>
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="text-[#B0124F]">{bdtFormatted}</span>
        <span className="text-xs text-[#7A5566] font-normal">({usdFormatted})</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen w-screen bg-linear-to-b from-[#FFF4F6] via-[#FFF9FA] to-[#FDE6EC] py-8 px-4 sm:px-10 text-[#2E0A1C] overflow-x-hidden -ml-4 sm:-ml-8 lg:-ml-12" style={{ width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
      {/* Edge-to-edge full width container */}
      <div className="w-full max-w-[1700px] mx-auto space-y-8 px-4 sm:px-8">
        
        {/* Header & Currency Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F3C6D3] pb-5 w-full">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-[#4A0F2E]">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-[#7A5566] mt-1 font-medium">
              Smart Family Point Marketplace — Fast &amp; Secure Checkout
            </p>
          </div>

          {/* Currency Dropdown Selector */}
          <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-full border border-[#F3C6D3] shadow-sm hover:shadow transition">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A0F2E]">
              Currency:
            </span>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
              className="bg-transparent text-sm font-black text-[#B0124F] outline-none cursor-pointer"
            >
              <option value="BDT">৳ BDT (Taka)</option>
              <option value="USD">$ USD (Dollar)</option>
            </select>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white/90 backdrop-blur-md rounded-3xl border border-[#F3C6D3] shadow-sm space-y-4 w-full">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FDE6EC] flex items-center justify-center text-[#B0124F]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-[#7A5566] text-base font-medium">Your shopping cart is currently empty.</p>
            <Link
              href="/marketplace"
              className="inline-block px-8 py-3 bg-linear-to-r from-[#B0124F] to-[#D81B7A] text-white rounded-full font-bold text-sm shadow-md hover:brightness-110 active:scale-95 transition"
            >
              Browse Products &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4 w-full">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row items-center justify-between gap-6 bg-linear-to-r from-white via-[#FFF9FA] to-[#FFF4F6] p-6 rounded-3xl border-2 border-[#F3C6D3] shadow-md transition hover:shadow-lg hover:border-[#B0124F]/40 w-full"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    {/* Smart Product Image Container with Fallback */}
                    <div className="h-28 w-28 shrink-0 rounded-2xl bg-linear-to-br from-[#FDE6EC] to-[#F3C6D3] flex items-center justify-center overflow-hidden border border-[#E8A5B8] relative shadow-inner">
                      {item.image && !imgError[item.id] ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={() => setImgError((prev) => ({ ...prev, [item.id]: true }))}
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#B0124F] opacity-70 p-2 text-center">
                          <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10px] font-semibold uppercase tracking-wider">Item Image</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2E0A1C] group-hover:text-[#B0124F] transition">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#7A5566] font-medium mt-1">
                        {item.color && `Color: ${item.color}`}{' '}
                        {item.size && `| Size: ${item.size}`}
                      </p>
                      <div className="mt-2 text-base">{formatPrice(item.priceBDT)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-[#F3C6D3]">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-[#F3C6D3] rounded-full bg-white p-1.5 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full bg-[#FFF4F6] text-[#4A0F2E] font-black text-sm flex items-center justify-center shadow-xs hover:bg-[#FDE6EC] active:scale-95 transition"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-bold text-[#2E0A1C]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-[#FFF4F6] text-[#4A0F2E] font-black text-sm flex items-center justify-center shadow-xs hover:bg-[#FDE6EC] active:scale-95 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider hover:underline transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Payment Section */}
            <div className="lg:col-span-4 space-y-6 w-full">
              
              {/* Order Summary Box */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F3C6D3] shadow-sm space-y-4 w-full">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#4A0F2E] border-b border-[#F3C6D3] pb-3">
                  Order Summary
                </h2>
                
                <div className="flex justify-between items-center text-sm sm:text-base text-[#7A5566]">
                  <span className="font-medium">Subtotal</span>
                  <div>{formatPrice(subtotalBDT)}</div>
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base text-[#7A5566]">
                  <span className="font-medium">Shipping Fee</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
                    Free
                  </span>
                </div>

                <div className="border-t border-[#F3C6D3] pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg sm:text-xl text-[#4A0F2E]">Total</span>
                  <div className="text-lg sm:text-xl">{formatPrice(subtotalBDT)}</div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center py-4 bg-linear-to-r from-[#B0124F] to-[#D81B7A] text-white rounded-full font-bold shadow-md hover:brightness-110 active:scale-98 transition text-sm sm:text-base tracking-wide"
                >
                  Proceed to Checkout &rarr;
                </Link>
              </div>

              {/* VIP Custom Multi-Currency Debit Card Style */}
              <div className="relative overflow-hidden bg-linear-to-r from-[#1E3A8A] via-[#2563EB] to-[#F59E0B] p-6 rounded-3xl text-white shadow-2xl border border-amber-300/50 space-y-4 w-full">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between relative z-10 border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                    <span className="text-xs font-black uppercase tracking-tight text-white drop-shadow">
                      SMART FAMILY POINT
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-600/90 text-white border border-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                    100% SECURE
                  </span>
                </div>

                <div className="relative z-10">
                  <p className="text-[11px] text-white/90 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    Instant processing via bKash, Nagad, VISA, Mastercard
                  </p>
                </div>
                
                <div className="flex items-center justify-between gap-1 pt-1 relative z-10">
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-sm flex items-center justify-center shrink-0">
                    <span className="text-[#E2136E] text-[11px] font-black tracking-tight">bKash</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-sm flex items-center justify-center shrink-0">
                    <span className="text-[#F6921E] text-[11px] font-black tracking-tight">Nagad</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-sm flex items-center justify-center shrink-0">
                    <span className="text-[#1A1F71] text-[11px] font-black italic tracking-tighter">VISA</span>
                  </div>
                  <div className="px-2.5 py-1 bg-white rounded-md shadow-sm flex items-center justify-center shrink-0">
                    <span className="text-slate-900 text-[11px] font-black tracking-tight">Mastercard</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}