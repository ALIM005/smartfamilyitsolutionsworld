import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';
import { COMPANY } from '@/lib/products';
import { CONTACT, SOCIAL, addressLine, mailtoUrl, whatsappUrl } from '@/lib/contact';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import FloatingChat from '@/components/FloatingChat'; // ফ্লোটিং চ্যাট ইমপোর্ট করা হয়েছে
import { ThemeProvider } from 'next-themes';

const siteUrl = process.env.SITE_URL || `https://${COMPANY.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${COMPANY.name} | ওয়েব, ERP ও ক্লাউড সফটওয়্যার সলিউশন`,
    template: `%s | ${COMPANY.name}`,
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
      className="h-4 w-4 shrink-0 fill-none stroke-blue-400"
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

const navLinkClass =
  'rounded transition hover:text-blue-600 dark:hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col overflow-x-clip">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider locale={locale} messages={messages}>
            
            {/* HEADER SECTION */}
            <header className="border-b bg-white dark:bg-slate-900 dark:border-slate-800 sticky top-0 z-50 transition-colors">
              <div className="w-full max-w-[1700px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
                <Link
                  href="/"
                  aria-label={`${COMPANY.name} — Home`}
                  className="group flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
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
                  <span className="truncate text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
                    {COMPANY.name}
                  </span>
                  <span className="hidden sm:inline text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold px-2 py-0.5 rounded">
                    IT Solutions &amp; Software
                  </span>
                </Link>

                <nav aria-label="Main" className="flex shrink-0 items-center gap-3 sm:gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <Link href="/" className={navLinkClass}>Home</Link>
                  <Link href="/products" className={navLinkClass}>Products</Link>
                  <Link href="/features" className={navLinkClass}>Features</Link>
                  <Link href="/marketplace" className={navLinkClass}>Marketplace</Link>

                  {/* SERVICES DROPDOWN */}
                  <div className="group relative cursor-pointer py-1">
                    <span className={`flex items-center gap-1 ${navLinkClass}`}>
                      Services ▾
                    </span>
                    <div className="absolute left-0 top-full hidden w-60 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl group-hover:block">
                      <Link href="/services/web-development" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        🌐 Web &amp; E-Commerce Dev
                      </Link>
                      <Link href="/services/erp-software" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        📦 ERP &amp; Business Software
                      </Link>
                      <Link href="/services/digital-marketing" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        📈 Digital Marketing &amp; SEO
                      </Link>
                      <Link href="/services/design-branding" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        🎨 Design, Branding &amp; IT
                      </Link>
                    </div>
                  </div>

                  {/* COMPANY DROPDOWN */}
                  <div className="group relative cursor-pointer py-1">
                    <span className={`flex items-center gap-1 ${navLinkClass}`}>
                      Company ▾
                    </span>
                    <div className="absolute left-0 top-full hidden w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl group-hover:block">
                      <Link href="/about" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        🏢 About Us
                      </Link>
                      <Link href="/portfolio" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        💼 Portfolio
                      </Link>
                      <Link href="/team" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        👥 Our Team
                      </Link>
                      <Link href="/packages" className="block rounded-xl px-3 py-2 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                        🏷️ Packages / Price
                      </Link>
                    </div>
                  </div>

                  <Link href="/contact" className={navLinkClass}>Contact</Link>
                  <Link href="/admin" className={navLinkClass}>Admin</Link>

                  <LanguageSwitcher />
                  <ThemeSwitcher />
                </nav>
              </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-1 w-full">{children}</main>

            {/* FLOATING CHAT WIDGET - এটি সব পেজে ভাসমান থাকবে */}
            <FloatingChat />

            {/* FOOTER SECTION */}
            <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950">
              <div className="mx-auto grid max-w-[1700px] gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-12 items-start">
                <div className="lg:col-span-5 space-y-2">
                  <Link href="/" className={`inline-flex items-center gap-2.5 ${footerLinkClass}`}>
                    <Image src="/logo.png" alt="" width={36} height={36} sizes="36px" className="h-9 w-9 object-contain" />
                    <span className="text-base sm:text-lg font-black text-white leading-tight">
                      {COMPANY.name}
                    </span>
                  </Link>
                  <p className="max-w-sm text-xs leading-relaxed text-slate-400">
                    Software Solutions &amp; Business Applications: ERP, Cloud Spreadsheets, Custom Web Applications &amp; IT Services.
                  </p>
                </div>

                <nav aria-label="Footer" className="lg:col-span-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h2>
                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li><Link href="/" className={footerLinkClass}>Home</Link></li>
                    <li><Link href="/products" className={footerLinkClass}>Products</Link></li>
                    <li><Link href="/features" className={footerLinkClass}>Features</Link></li>
                    <li><Link href="/marketplace" className={footerLinkClass}>Marketplace</Link></li>
                    <li><Link href="/contact" className={footerLinkClass}>Contact</Link></li>
                    <li><Link href="/privacy" className={footerLinkClass}>Privacy Policy</Link></li>
                    <li><Link href="/login" className={footerLinkClass}>Login</Link></li>
                    <li><Link href="/admin" className={footerLinkClass}>Admin</Link></li>
                  </ul>
                </nav>

                <div className="sm:col-span-2 lg:col-span-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">Contact Us</h2>
                  <ul className="mt-2 space-y-2 text-xs">
                    <li className="flex items-center gap-2.5">
                      <Icon>
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                      </Icon>
                      <span className="font-semibold text-white">{CONTACT.name}</span>
                    </li>

                    <li className="flex items-center gap-2.5">
                      <Icon>
                        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </Icon>
                      <address className="not-italic">{addressLine}</address>
                    </li>

                    <li className="flex items-center gap-2.5">
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

                    <li className="pt-0.5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-700"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="h-4 w-4 fill-none stroke-white"
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
                      <li className="flex items-center gap-2 pt-0.5">
                        {SOCIAL.map((s) => (
                          <a
                            key={s.name}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.name}
                            title={s.name}
                            className="rounded-full border border-white/15 p-1.5 transition hover:border-blue-400 hover:bg-white/10"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="h-4 w-4 fill-none stroke-blue-400"
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
                <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-2 px-4 py-3 text-[11px] text-slate-400 sm:flex-row">
                  <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
                  <p className="flex items-center gap-3">
                    <span>Sylhet, Bangladesh</span>
                    <span aria-hidden="true">·</span>
                    <Link href="/admin" rel="nofollow" className={footerLinkClass}>Admin</Link>
                  </p>
                </div>
              </div>
            </footer>

          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}