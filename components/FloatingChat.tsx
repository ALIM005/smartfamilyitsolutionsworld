// components/FloatingChat.tsx
'use client';


import React from 'react';
import Link from 'next/link';


export default function FloatingChat() {
  const whatsappNumber = '8801934111005'; // Your WhatsApp number
  const messengerPage = 'smartfamilyitsolutionsworld'; // Your Facebook page username


  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello,%20I%20want%20to%20know%20more%20about%20your%20services.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-110 hover:bg-green-600 focus:outline-none"
      >
        <span className="text-2xl">💬</span>
      </a>


      {/* Messenger Floating Button */}
      <a
        href={`https://m.me/${messengerPage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on Messenger"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-110 hover:bg-blue-700 focus:outline-none"
      >
        <span className="text-xl font-bold">M</span>
      </a>


      {/* Contact Page Floating Button */}
      <Link
        href="/contact"
        aria-label="Go to Contact Page"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-xl transition hover:scale-110 hover:bg-amber-600 focus:outline-none"
      >
        <span className="text-xl">✉️</span>
      </Link>
    </div>
  );
}