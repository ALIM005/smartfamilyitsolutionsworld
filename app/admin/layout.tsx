// app/admin/layout.tsx
// অ্যাডমিন পেজ সার্চ ইঞ্জিনে আসবে না
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Store Admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
