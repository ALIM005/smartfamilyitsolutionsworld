'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // লগ ইন বা ট্র্যাকিং এরর কনসোলে প্রিন্ট করা
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#FFF4F6] via-[#FDE6EC] to-[#FBD3DE] p-6 text-center">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D81B7A]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#C9A24B]/20 blur-3xl" />

      <div className="relative max-w-lg rounded-3xl border border-[#F3C6D3] bg-white/95 p-8 shadow-2xl shadow-[#B0124F]/15 backdrop-blur md:p-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-700 font-bold shadow-inner">
          ⚠️
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2E0A1C] mb-2 font-serif">
          কিছু একটা সমস্যা হয়েছে!
        </h1>
        <p className="text-sm text-[#7A5566] mb-6 leading-relaxed">
          আমাদের সিস্টেমে সাময়িক কারিগরি ত্রুটি দেখা দিয়েছে। দয়া করে আবার চেষ্টা করুন অথবা হোমপেজে ফিরে যান।
        </p>

        <div className="space-y-3">
          <button
            onClick={
              // পেজটি রিলোড বা রি-টেম্পট করার চেষ্টা
              () => reset()
            }
            className="w-full rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B0124F]/30 hover:opacity-90 transition"
          >
            🔄 আবার চেষ্টা করুন (Try Again)
          </button>
          
          <Link
            href="/"
            className="block w-full rounded-full border border-[#F3C6D3] bg-[#FFF4F6] py-3.5 text-sm font-bold text-[#4A0F2E] hover:bg-[#FDE6EC] transition"
          >
            🏠 হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}