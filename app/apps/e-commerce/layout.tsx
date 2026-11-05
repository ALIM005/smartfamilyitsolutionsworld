// app/apps/e-commerce/layout.tsx
// Since the page itself is 'use client', the SEO metadata is here
import type { Metadata } from 'next';
import type { ReactNode } from 'react';


export const metadata: Metadata = {
  title: 'Online Shop | Smart Family IT Solutions World',
  description: 'View products, add them to your cart, and order with bKash, Nagad, Rocket, or Cash on Delivery.',
};


export default function EcommerceLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}