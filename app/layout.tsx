import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import './globals.css';

import { COMPANY } from '@/lib/products';
import {
  CONTACT,
  SOCIAL,
  addressLine,
  mailtoUrl,
  whatsappUrl,
} from '@/lib/contact';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import FloatingChat from '@/components/FloatingChat';
import MobileMenu from '@/components/MobileMenu';


const siteUrl = process.env.SITE_URL || `https://${COMPANY.domain}`;


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `${COMPANY.name} | ওয়েব, ERP ও ক্লাউড সফটওয়্যার সলিউশন`,
    template: `%s | ${COMPANY.name}`,
  },

  description: COMPANY.description,

  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },

  openGraph: {
    title: COMPANY.name,
    description: COMPANY.description,
    siteName: COMPANY.name,
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
  },
};


/* ------------------------------------------------------------------ */
/* SHARED ICONS                                                        */
/* ------------------------------------------------------------------ */

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
  Facebook: (
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z" />
  ),

  YouTube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3V9z" />
    </>
  ),
};


const footerLinkClass =
  'rounded transition hover:text-white ' +
  'focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-blue-400';


/* ------------------------------------------------------------------ */
/* HEADER STYLES                                                       */
/* ------------------------------------------------------------------ */

const goldGradient =
  'bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_30%,#e8a817_65%,#b97a05_100%)]';


const goldPill =
  `${goldGradient} inline-flex shrink-0 items-center gap-2 rounded-full ` +
  'border border-[#fff3b8] px-2.5 py-1.5 text-xs font-extrabold ' +
  'text-[#0a1f5c] sm:px-4 sm:text-sm ' +
  'shadow-[0_0_14px_rgba(255,200,60,0.55),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-2px_3px_rgba(120,70,0,0.35)] ' +
  'transition hover:brightness-110 ' +
  'focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-white';


const navLinkClass =
  'whitespace-nowrap rounded px-1 text-[15px] font-extrabold ' +
  'text-[#0a1f5c] transition hover:text-[#b97a05] ' +
  'focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-[#0a1f5c]';


const dropItemClass =
  'block rounded-xl px-3 py-2 text-xs font-bold ' +
  'text-[#0a1f5c] hover:bg-[#fff1c2] ' +
  'focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-[#b97a05]';


const mainNav = [
  { href: '/products', label: 'Products' },
  { href: '/features', label: 'Features' },
  { href: '/marketplace', label: 'Marketplace' },
];


const serviceLinks = [
  {
    href: '/services/web-development',
    label: '🌐 Web & E-Commerce Dev',
  },
  {
    href: '/services/erp-software',
    label: '📦 ERP & Business Software',
  },
  {
    href: '/services/digital-marketing',
    label: '📈 Digital Marketing & SEO',
  },
  {
    href: '/services/design-branding',
    label: '🎨 Design, Branding & IT',
  },
];


const companyLinks = [
  { href: '/about', label: '🏢 About Us' },
  { href: '/portfolio', label: '💼 Portfolio' },
  { href: '/team', label: '👥 Our Team' },
  { href: '/packages', label: '🏷️ Packages / Price' },
];


/* ------------------------------------------------------------------ */
/* HEADER HELPERS                                                      */
/* ------------------------------------------------------------------ */

function Chevron({
  className = 'stroke-[#0a1f5c]',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-3.5 w-3.5 fill-none ${className}`}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


function Divider() {
  return (
    <span
      aria-hidden="true"
      className="hidden h-5 w-px bg-gradient-to-b from-transparent via-[#c9961a] to-transparent sm:block"
    />
  );
}


function VipBulb() {
  return (
    <Link
      href="/admin"
      prefetch={false}
      rel="nofollow"
      aria-label="VIP"
      className={`${goldGradient} group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#3a2600] shadow-[0_0_14px_rgba(255,200,60,0.8),inset_0_2px_3px_rgba(255,255,255,0.7)] transition hover:scale-110 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1f5c] motion-reduce:transition-none motion-reduce:hover:scale-100`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(255,244,170,0.9)_0%,transparent_70%)] motion-reduce:animate-none"
      />

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="relative h-6 w-6 stroke-[#3a2600]"
        fill="#fff7c2"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M12 1v1.5M3.6 4.6l1 1M20.4 4.6l-1 1M1.5 11H3M21 11h1.5"
          fill="none"
        />

        <path d="M12 4a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 4z" />

        <path
          d="M9.8 19.5h4.4M10.6 21.5h2.8"
          fill="none"
        />
      </svg>
    </Link>
  );
}


function NavDropdown({
  label,
  items,
  width,
}: {
  label: string;
  items: { href: string; label: string }[];
  width: string;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center gap-1 ${navLinkClass}`}
      >
        {label}
        <Chevron />
      </button>

      <div
        className={`absolute left-0 top-full z-50 hidden ${width} rounded-2xl border border-[#e0b030] bg-white p-2 shadow-2xl group-hover:block group-focus-within:block`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={dropItemClass}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* VIP HEADER                                                          */
/* ------------------------------------------------------------------ */

function VipHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="relative border-y-2 border-[#e0a820] bg-[linear-gradient(90deg,#04143f_0%,#0a3a9e_28%,#0b47c2_50%,#0a3a9e_72%,#04143f_100%)] shadow-[0_6px_24px_rgba(0,20,80,0.55)]">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(90,170,255,0.9) 1.1px, transparent 1.6px)',
            backgroundSize: '6px 6px',
            WebkitMaskImage:
              'radial-gradient(ellipse 22% 55% at 47% 30%, #000 40%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 22% 55% at 47% 30%, #000 40%, transparent 100%)',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-[radial-gradient(ellipse_at_center,rgba(255,210,90,0.9),transparent_70%)] opacity-70"
        />

        <div className="relative mx-auto flex w-full max-w-[1700px] flex-col gap-2 px-2 py-2 sm:px-3 lg:flex-row lg:items-stretch lg:gap-0 lg:py-0 lg:pl-0 lg:pr-4">
          {/* Mobile: brand left, hamburger right */}
          {/* Desktop: original brand panel */}
          <div className="flex w-full min-w-0 items-center gap-3 lg:w-auto lg:shrink-0 lg:items-start">
            <Link
              href="/"
              aria-label={`${COMPANY.name} — Home`}
              className="group relative flex min-w-0 flex-1 items-center gap-2 self-start rounded-r-[28px] border-y-2 border-r-2 border-[#e0a820] bg-[linear-gradient(135deg,#031038_0%,#0a2f86_100%)] py-2 pl-2 pr-3 shadow-[0_0_18px_rgba(255,200,60,0.35),inset_0_0_20px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300 sm:gap-3 lg:my-2 lg:min-w-[420px] lg:flex-none lg:shrink-0 lg:rounded-r-[48px] lg:pl-3 lg:pr-10"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#f3c443] bg-white shadow-[0_0_14px_rgba(255,210,90,0.7)] sm:h-14 sm:w-14 lg:h-[72px] lg:w-[72px]">
                <Image
                  src="/logo.png"
                  alt=""
                  width={64}
                  height={64}
                  priority
                  sizes="(min-width: 1024px) 52px, (min-width: 640px) 40px, 32px"
                  className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 lg:h-[52px] lg:w-[52px]"
                />
              </span>

              <span
                aria-hidden="true"
                className="hidden h-12 w-[2px] shrink-0 bg-gradient-to-b from-transparent via-[#f3c443] to-transparent sm:block sm:h-14"
              />

              <span className="flex min-w-0 flex-col leading-none">
                <span className="truncate text-lg font-black tracking-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] sm:text-2xl lg:text-[34px]">
                  Smart Family
                </span>

                <span className="mt-1 truncate bg-[linear-gradient(180deg,#fff7a8,#ffd22e_55%,#e09a00)] bg-clip-text text-xs font-black text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] sm:text-base lg:text-[25px]">
                  IT Solutions World
                </span>
              </span>
            </Link>

            {/* Only one MobileMenu instance */}
            <div className="shrink-0 lg:hidden">
              <MobileMenu />
            </div>
          </div>

          {/* Actions and desktop navigation */}
          <div className="flex min-w-0 flex-1 flex-col gap-2 lg:pb-2 lg:pl-3 lg:pt-2">
            {/* Wishlist / Compare / Currency / Theme */}
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className={goldPill}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-[#3a1a1a] sm:h-5 sm:w-5"
                >
                  <path d="M12 21s-8-5.3-8-11.2A4.8 4.8 0 0 1 12 7a4.8 4.8 0 0 1 8 2.8C20 15.7 12 21 12 21z" />
                </svg>

                <span className="hidden sm:inline">
                  Wishlist
                </span>
              </Link>

              <Link
                href="/compare"
                aria-label="Compare"
                className={goldPill}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 fill-none stroke-[#0a1f5c] sm:h-5 sm:w-5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v18M5 21h14M5 7h14" />

                  <path d="m5 7-3 7a3.5 3.5 0 0 0 6 0L5 7zM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7z" />
                </svg>

                <span className="hidden sm:inline">
                  Compare
                </span>
              </Link>

              <CurrencySwitcher />

              <span className="hidden sm:inline-flex">
                <ThemeSwitcher />
              </span>
            </div>

            {/* Desktop navigation / language / mobile theme */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 lg:justify-start">
              <nav
                aria-label="Main"
                className="relative hidden min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 rounded-full border-2 border-[#e0a820] bg-[linear-gradient(180deg,#fffdf2_0%,#fff4cc_100%)] py-1.5 pl-1.5 pr-4 shadow-[0_0_16px_rgba(255,200,60,0.5),inset_0_-3px_6px_rgba(200,150,30,0.25)] sm:gap-x-4 lg:flex"
              >
                <Link
                  href="/"
                  aria-label="Home"
                  className={`${goldGradient} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#3a2600] shadow-[0_0_12px_rgba(255,200,60,0.7),inset_0_2px_3px_rgba(255,255,255,0.7)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1f5c]`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 fill-[#3a2600]"
                  >
                    <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3L12 3z" />
                  </svg>
                </Link>

                <Divider />

                <Link href="/" className={navLinkClass}>
                  Home
                </Link>

                {mainNav.map((item) => (
                  <span key={item.href} className="contents">
                    <Divider />

                    <Link
                      href={item.href}
                      className={navLinkClass}
                    >
                      {item.label}
                    </Link>
                  </span>
                ))}

                <Divider />

                <NavDropdown
                  label="Services"
                  items={serviceLinks}
                  width="w-60"
                />

                <Divider />

                <NavDropdown
                  label="Company"
                  items={companyLinks}
                  width="w-48"
                />

                <Divider />

                <Link
                  href="/contact"
                  className={navLinkClass}
                >
                  Contact
                </Link>

                <Divider />

                <VipBulb />
              </nav>

              <div className="shrink-0">
                <LanguageSwitcher />
              </div>

              <span className="inline-flex shrink-0 sm:hidden">
                <ThemeSwitcher />
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


/* ------------------------------------------------------------------ */
/* ROOT LAYOUT                                                         */
/* ------------------------------------------------------------------ */

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col overflow-x-clip">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
          >
            {/* Header */}
            <VipHeader />

            {/* Main content */}
            <main className="w-full flex-1">
              {children}
            </main>

            {/* Floating chat */}
            <FloatingChat />

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 dark:bg-slate-950">
              <div className="mx-auto grid max-w-[1700px] items-start gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-12">
                {/* Company */}
                <div className="min-w-0 space-y-2 lg:col-span-5">
                  <Link
                    href="/"
                    className={`inline-flex items-center gap-2.5 ${footerLinkClass}`}
                  >
                    <Image
                      src="/logo.png"
                      alt=""
                      width={36}
                      height={36}
                      sizes="36px"
                      className="h-9 w-9 shrink-0 object-contain"
                    />

                    <span className="text-base font-black leading-tight text-white sm:text-lg">
                      {COMPANY.name}
                    </span>
                  </Link>

                  <p className="max-w-sm text-xs leading-relaxed text-slate-400">
                    Software Solutions &amp; Business Applications:
                    ERP, Cloud Spreadsheets, Custom Web Applications
                    &amp; IT Services.
                  </p>
                </div>

                {/* Quick links */}
                <nav
                  aria-label="Footer"
                  className="lg:col-span-2"
                >
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                    Quick Links
                  </h2>

                  <ul className="mt-2 space-y-1.5 text-xs">
                    <li>
                      <Link href="/" className={footerLinkClass}>
                        Home
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/products"
                        className={footerLinkClass}
                      >
                        Products
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/features"
                        className={footerLinkClass}
                      >
                        Features
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/marketplace"
                        className={footerLinkClass}
                      >
                        Marketplace
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/contact"
                        className={footerLinkClass}
                      >
                        Contact
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/privacy"
                        className={footerLinkClass}
                      >
                        Privacy Policy
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/login"
                        className={footerLinkClass}
                      >
                        Login
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/admin"
                        className={footerLinkClass}
                      >
                        Admin
                      </Link>
                    </li>
                  </ul>
                </nav>

                {/* Contact */}
                <div className="min-w-0 sm:col-span-2 lg:col-span-5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                    Contact Us
                  </h2>

                  <ul className="mt-2 space-y-2 text-xs">
                    <li className="flex items-center gap-2.5">
                      <Icon>
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                      </Icon>

                      <span className="font-semibold text-white">
                        {CONTACT.name}
                      </span>
                    </li>

                    <li className="flex items-center gap-2.5">
                      <Icon>
                        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </Icon>

                      <address className="not-italic">
                        {addressLine}
                      </address>
                    </li>

                    <li className="flex items-center gap-2.5">
                      <Icon>
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
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
                      <li className="flex flex-wrap items-center gap-2 pt-0.5">
                        {SOCIAL.map((social) => (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                            title={social.name}
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
                              {socialIcons[social.name]}
                            </svg>
                          </a>
                        ))}
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Footer bottom */}
              <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-2 px-4 py-3 text-[11px] text-slate-400 sm:flex-row">
                  <p>
                    © {new Date().getFullYear()} {COMPANY.name}.
                    {' '}All rights reserved.
                  </p>

                  <p className="flex items-center gap-3">
                    <span>Sylhet, Bangladesh</span>

                    <span aria-hidden="true">·</span>

                    <Link
                      href="/admin"
                      rel="nofollow"
                      className={footerLinkClass}
                    >
                      Admin
                    </Link>
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