// app/apps/e-commerce/layout.tsx
// পেজ নিজে 'use client' হওয়ায় SEO মেটাডেটা এখানে থাকে
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'অনলাইন শপ | Smart Family IT Solutions World',
  description: 'প্রোডাক্ট দেখুন, কার্টে যোগ করুন এবং bKash, Nagad, Rocket বা ক্যাশ অন ডেলিভারিতে অর্ডার করুন।',
};

export default function EcommerceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
