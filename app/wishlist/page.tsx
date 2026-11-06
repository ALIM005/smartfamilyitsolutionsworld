'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
  description: string;
}

const goldGradient =
  'bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_30%,#e8a817_65%,#b97a05_100%)]';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<ProductItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // LocalStorage থেকে উইশলিস্ট আইটেম লোড করা
    const saved = localStorage.getItem('smart_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('smart_wishlist', JSON.stringify(updated));
  };

  const clearAll = () => {
    setWishlist([]);
    localStorage.removeItem('smart_wishlist');
  };

  return (
    <div className="min-h-[80vh] bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-[1400px]">
        {/* VIP Banner Header */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#e0a820] bg-[linear-gradient(90deg,#04143f_0%,#0a3a9e_50%,#04143f_100%)] p-6 sm:p-8 shadow-[0_0_30px_rgba(255,200,60,0.25)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                My <span className="bg-[linear-gradient(180deg,#fff7a8,#ffd22e_55%,#e09a00)] bg-clip-text text-transparent">Wishlist</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200">
                আপনার পছন্দের প্রোডাক্ট ও সফটওয়্যার সলিউশনগুলো এখানে সংরক্ষিত রয়েছে।
              </p>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={clearAll}
                className="self-start md:self-auto rounded-full border border-red-500/50 bg-red-950/60 px-5 py-2 text-xs font-bold text-red-300 transition hover:bg-red-800 hover:text-white"
              >
                Clear All Items
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {!isLoaded ? (
          <div className="mt-12 text-center text-slate-400">Loading your saved items...</div>
        ) : wishlist.length === 0 ? (
          /* Empty State */
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-[#e0a820]/30 bg-[#071846]/60 p-12 text-center backdrop-blur-md shadow-2xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f3c443] bg-[linear-gradient(135deg,#031038_0%,#0a2f86_100%)] shadow-[0_0_20px_rgba(255,210,90,0.4)]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10 fill-[#ffd22e]">
                <path d="M12 21s-8-5.3-8-11.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8 2.8C20 15.7 12 21 12 21z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-white">আপনার উইশলিস্টটি খালি রয়েছে</h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              আমাদের সফটওয়্যার এবং ফিচার কালেকশন ব্রাউজ করুন এবং আপনার পছন্দের আইটেমগুলো সেভ করে রাখুন।
            </p>
            <Link
              href="/products"
              className={`${goldGradient} mt-6 rounded-full border border-[#fff3b8] px-8 py-3 text-sm font-black text-[#0a1f5c] shadow-[0_0_16px_rgba(255,200,60,0.6)] transition hover:scale-105 hover:brightness-110`}
            >
              প্রোডাক্টস দেখুন
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e0a820]/40 bg-[linear-gradient(180deg,#061a52_0%,#030d2e_100%)] p-6 shadow-xl transition hover:border-[#e0a820]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-900/60 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-700/50">
                      {item.category}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-400 text-sm font-bold p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white group-hover:text-[#ffd22e] transition">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                  <span className="text-lg font-black text-[#ffd22e]">{item.price}</span>
                  <Link
                    href={`/products/${item.id}`}
                    className={`${goldGradient} rounded-full border border-[#fff3b8] px-4 py-1.5 text-xs font-extrabold text-[#0a1f5c] shadow-md hover:brightness-110`}
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}