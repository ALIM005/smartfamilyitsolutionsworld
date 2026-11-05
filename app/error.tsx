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
    // Print the login or tracking error to the console
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
          Something went wrong!
        </h1>
        <p className="text-sm text-[#7A5566] mb-6 leading-relaxed">
          A temporary technical error has occurred in our system. Please try again or return to the homepage.
        </p>


        <div className="space-y-3">
          <button
            onClick={
              // Attempt to reload or re-attempt the page
              () => reset()
            }
            className="w-full rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B0124F]/30 hover:opacity-90 transition"
          >
            🔄 Try Again
          </button>
          
          <Link
            href="/"
            className="block w-full rounded-full border border-[#F3C6D3] bg-[#FFF4F6] py-3.5 text-sm font-bold text-[#4A0F2E] hover:bg-[#FDE6EC] transition"
          >
            🏠 Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}