'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CompareItem {
  id: string;
  name: string;
  category: string;
  price: string;
  features: string[];
  support: string;
  deployment: string;
}

const goldGradient =
  'bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_30%,#e8a817_65%,#b97a05_100%)]';

export default function ComparePage() {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // LocalStorage থেকে তুলনা করার প্রোডাক্ট ডাটা নেওয়া
    const saved = localStorage.getItem('smart_compare');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse compare list', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem('smart_compare', JSON.stringify(updated));
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem('smart_compare');
  };

  return (
    <div className="min-h-[80vh] bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-[1400px]">
        {/* VIP Banner Header */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#e0a820] bg-[linear-gradient(90deg,#04143f_0%,#0a3a9e_50%,#04143f_100%)] p-6 sm:p-8 shadow-[0_0_30px_rgba(255,200,60,0.25)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Product <span className="bg-[linear-gradient(180deg,#fff7a8,#ffd22e_55%,#e09a00)] bg-clip-text text-transparent">Comparison</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-200">
                বিভিন্ন সফটওয়্যার ও সলিউশনের ফিচার পাশাপাশি রেখে সঠিকভাবে তুলনা করুন।
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="self-start md:self-auto rounded-full border border-red-500/50 bg-red-950/60 px-5 py-2 text-xs font-bold text-red-300 transition hover:bg-red-800 hover:text-white"
              >
                Clear Comparison
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        {!isLoaded ? (
          <div className="mt-12 text-center text-slate-400">Loading comparison table...</div>
        ) : items.length === 0 ? (
          /* Empty State */
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-[#e0a820]/30 bg-[#071846]/60 p-12 text-center backdrop-blur-md shadow-2xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#f3c443] bg-[linear-gradient(135deg,#031038_0%,#0a2f86_100%)] shadow-[0_0_20px_rgba(255,210,90,0.4)]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-10 w-10 fill-none stroke-[#ffd22e]"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v18M5 21h14M5 7h14" />
                <path d="m5 7-3 7a3.5 3.5 0 0 0 6 0L5 7zM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-white">তুলনা করার জন্য কোনো প্রোডাক্ট নির্বাচন করা হয়নি</h2>
            <p className="mt-2 max-w-md text-sm text-slate-300">
              ফিচার ও সুবিধাগুলো তুলনা করতে অন্তত ২টি প্রোডাক্ট আপনার কম্পেয়ার লিস্টে যোগ করুন।
            </p>
            <Link
              href="/products"
              className={`${goldGradient} mt-6 rounded-full border border-[#fff3b8] px-8 py-3 text-sm font-black text-[#0a1f5c] shadow-[0_0_16px_rgba(255,200,60,0.6)] transition hover:scale-105 hover:brightness-110`}
            >
              প্রোডাক্ট সিলেক্ট করুন
            </Link>
          </div>
        ) : (
          /* Comparison Table */
          <div className="mt-8 overflow-x-auto rounded-3xl border border-[#e0a820]/40 bg-[#061a52]/80 shadow-2xl backdrop-blur-md">
            <table className="w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-[#e0a820]/30 bg-[#04143f]">
                  <th className="p-4 sm:p-6 text-base font-bold text-white min-w-[200px]">Features</th>
                  {items.map((item) => (
                    <th key={item.id} className="p-4 sm:p-6 min-w-[250px] align-top">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-extrabold text-[#ffd22e]">{item.name}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-500/40 px-2 py-0.5 rounded"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 text-xl font-black text-white">{item.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-amber-300 bg-slate-900/40">Category</td>
                  {items.map((item) => (
                    <td key={item.id} className="p-4 sm:p-6">{item.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-amber-300 bg-slate-900/40">Deployment</td>
                  {items.map((item) => (
                    <td key={item.id} className="p-4 sm:p-6">{item.deployment || 'Cloud / On-Premise'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-amber-300 bg-slate-900/40">Technical Support</td>
                  {items.map((item) => (
                    <td key={item.id} className="p-4 sm:p-6">{item.support || '24/7 VIP Support'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-bold text-amber-300 bg-slate-900/40 align-top">Key Features</td>
                  {items.map((item) => (
                    <td key={item.id} className="p-4 sm:p-6 align-top">
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                        {item.features?.map((f, i) => (
                          <li key={i}>{f}</li>
                        )) || <li>Standard ERP & Cloud Features</li>}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}