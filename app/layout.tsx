import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';
import { COMPANY } from '@/lib/products';
import { CONTACT, SOCIAL, addressLine, mailtoUrl, whatsappUrl } from '@/lib/contact';

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

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 fill-none stroke-blue-400"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const socialIcons: Record<string, ReactNode> = {
  Facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z" />,
  YouTube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3V9z" />
    </>
  ),
};

const footerLinkClass =
  'rounded transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      {/* overflow-x-clip: ফুল-উইডথ ব্যানারের (w-screen) কারণে স্ক্রলবার থাকলে আড়াআড়ি স্ক্রল আসা ঠেকায় (sticky হেডার ঠিক থাকে) */}
      <body className="min-h-screen flex flex-col overflow-x-clip">
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <Link
              href="/"
              aria-label={`${COMPANY.name} — হোম`}
              className="group flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
            >
              <Image
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                priority
                sizes="44px"
                className="h-9 w-9 shrink-0 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11"
              />
              <span className="truncate text-xl sm:text-2xl font-black text-blue-600">{COMPANY.shortName}</span>
              <span className="hidden sm:inline text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                IT Solutions
              </span>
            </Link>
            <nav className="flex shrink-0 items-center gap-3 sm:gap-5 text-sm font-medium text-slate-600">
              <Link href="/products" className="hover:text-blue-600">Products</Link>
              <Link href="/contact" className="hover:text-blue-600">Contact</Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4">{children}</main>

        <footer className="bg-slate-900 text-slate-300">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-12">
            {/* ব্র্যান্ড */}
            <div className="lg:col-span-5">
              <Link href="/" className={`inline-flex items-center gap-3 ${footerLinkClass}`} aria-label={`${COMPANY.name} — হোম`}>
                <Image src="/logo.png" alt="" width={48} height={48} sizes="48px" className="h-12 w-12 object-contain" />
                <span className="text-xl font-black text-white">{COMPANY.shortName}</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">{COMPANY.description}</p>
            </div>

            {/* দ্রুত লিংক */}
            <nav aria-label="Footer" className="lg:col-span-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/" className={footerLinkClass}>Home</Link></li>
                <li><Link href="/products" className={footerLinkClass}>Products</Link></li>
                <li><Link href="/contact" className={footerLinkClass}>Contact</Link></li>
                <li><Link href="/privacy" className={footerLinkClass}>Privacy Policy</Link></li>
                <li><Link href="/login" className={footerLinkClass}>Login</Link></li>
              </ul>
            </nav>

            {/* যোগাযোগ */}
            <div className="sm:col-span-2 lg:col-span-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact Us</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Icon>
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  </Icon>
                  <span className="font-semibold text-white">{CONTACT.name}</span>
                </li>

                <li className="flex items-center gap-3">
                  <Icon>
                    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </Icon>
                  <address className="not-italic">{addressLine}</address>
                </li>

                <li className="flex items-center gap-3">
                  <Icon>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </Icon>
                  <a
                    href={mailtoUrl}
                    className={`min-w-0 break-all font-semibold text-white ${footerLinkClass} hover:text-blue-300`}
                  >
                    {CONTACT.email}
                  </a>
                </li>

                <li className="pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-bold text-white transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5 fill-none stroke-white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5A8.5 8.5 0 1 1 21 11.5z" />
                      <path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.3-1.4-2.1-1-1 .9a4 4 0 0 1-1.9-1.9l.9-1-1-2.1L9 9.5z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </li>

                {SOCIAL.length > 0 && (
                  <li className="flex items-center gap-3 pt-1">
                    {SOCIAL.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        title={s.name}
                        className="rounded-full border border-white/15 p-2 transition hover:border-blue-400 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-5 w-5 fill-none stroke-blue-400"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {socialIcons[s.name]}
                        </svg>
                      </a>
                    ))}
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row">
              <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
              <p>Sylhet, Bangladesh</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}