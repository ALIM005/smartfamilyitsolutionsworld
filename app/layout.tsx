import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { COMPANY } from '@/lib/products';

const siteUrl = process.env.SITE_URL || `https://${COMPANY.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${COMPANY.name} | IT Solutions`,
    template: `%s | ${COMPANY.shortName}`,
  },
  description: COMPANY.description,
  openGraph: {
    title: COMPANY.name,
    description: COMPANY.description,
    siteName: COMPANY.name,
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black text-blue-600">{COMPANY.shortName}</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                IT Solutions
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
              <Link href="/products" className="hover:text-blue-600">Products</Link>
              <Link href="/contact" className="hover:text-blue-600">Contact</Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4">{children}</main>

        <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
          <div className="space-x-4 mb-2">
            <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>
          © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
