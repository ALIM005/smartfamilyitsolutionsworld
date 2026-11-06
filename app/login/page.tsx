// app/login/page.tsx
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import AuthForm from '@/components/AuthForm';
import { COMPANY } from '@/lib/products';

/* =====================================================================
   CONSTANTS
   ===================================================================== */

const FULL_BLEED = 'relative w-screen ml-[calc(50%-50vw)]';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400';

const perks = [
  { icon: '🔒', title: 'Secure sign-in', text: 'HTTPS, encrypted data and role-based access.' },
  { icon: '📦', title: 'Track your orders', text: 'Check the status of your order whenever you need.' },
  { icon: '🎧', title: '24/7 support', text: 'Our team is ready to help you at any time.' },
] as const;

const quickLinks = [
  { href: '/', label: 'Back to Home', icon: '←' },
  { href: '/track-order', label: 'Track Order', icon: '📦' },
  { href: '/contact', label: 'Contact Support', icon: '🎧' },
] as const;

/* =====================================================================
   SEO & SECURITY (private page: never indexed, never cached by crawlers)
   ===================================================================== */

export const metadata: Metadata = {
  title: 'Sign in or create account',
  description: `Sign in to or create your ${COMPANY.name} account.`,
  referrer: 'strict-origin-when-cross-origin',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060a3d',
};

/* =====================================================================
   LOADING FALLBACK (shown while AuthForm reads the URL on the client)
   ===================================================================== */

function AuthFormSkeleton() {
  return (
    <div role="status" aria-live="polite" className="space-y-4 py-2">
      <span className="sr-only">Loading the sign-in form...</span>

      <div className="mx-auto h-6 w-40 animate-pulse rounded-full bg-amber-200/70 motion-reduce:animate-none" aria-hidden="true" />
      <div className="h-11 animate-pulse rounded-xl bg-slate-200 motion-reduce:animate-none" aria-hidden="true" />
      <div className="h-11 animate-pulse rounded-xl bg-slate-200 motion-reduce:animate-none" aria-hidden="true" />
      <div className="h-11 animate-pulse rounded-xl bg-slate-200 motion-reduce:animate-none" aria-hidden="true" />
      <div className="h-12 animate-pulse rounded-full bg-amber-300/70 motion-reduce:animate-none" aria-hidden="true" />
    </div>
  );
}

/* =====================================================================
   PAGE
   ===================================================================== */

export default function LoginPage() {
  return (
    <section
      aria-labelledby="login-heading"
      className={`${FULL_BLEED} flex min-h-[70svh] items-center overflow-hidden bg-[#060a3d] py-10 text-white sm:py-14`}
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(59,91,255,0.35),transparent_60%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-0 h-full w-72 rounded-full bg-fuchsia-600/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 top-0 h-full w-72 rounded-full bg-amber-400/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-8 lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* ---------- LEFT: BRAND PANEL ---------- */}
          <div className="space-y-5 text-center lg:col-span-5 lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/50 bg-pink-500/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-pink-300 shadow-sm">
              <span aria-hidden="true">👑</span>
              <span>{COMPANY.name}</span>
            </div>

            <h1
              id="login-heading"
              className="text-3xl font-black leading-tight sm:text-4xl xl:text-5xl"
            >
              Welcome to your{' '}
              <span className="bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-600 bg-clip-text text-transparent">
                VIP account
              </span>
            </h1>

            <p className="mx-auto max-w-md text-sm text-slate-200 sm:text-base lg:mx-0">
              Sign in or create an account in a few seconds.
            </p>

            <div className="mx-auto h-1.5 w-32 rounded-full bg-gradient-to-r from-amber-300 via-pink-500 to-amber-300 lg:mx-0" aria-hidden="true" />

            <ul className="hidden gap-3 sm:grid">
              {perks.map((p) => (
                <li
                  key={p.title}
                  className="flex items-start gap-3 rounded-2xl border border-amber-300/40 bg-white/5 p-4 text-left backdrop-blur"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-100/70 bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 text-xl shadow-[0_0_14px_rgba(251,191,36,0.55)]"
                    aria-hidden="true"
                  >
                    {p.icon}
                  </span>
                  <span>
                    <span className="block font-bold text-amber-300">{p.title}</span>
                    <span className="block text-sm text-slate-200">{p.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- RIGHT: FORM CARD ---------- */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border-2 border-amber-300/70 bg-gradient-to-b from-[#fffaf0] to-white p-5 text-slate-900 shadow-[0_0_45px_rgba(251,191,36,0.35)] sm:p-8">
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300"
                aria-hidden="true"
              />

              <Suspense fallback={<AuthFormSkeleton />}>
                <AuthForm />
              </Suspense>

              <noscript>
                <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-900">
                  Please enable JavaScript in your browser to sign in.
                </p>
              </noscript>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-300">
              <span aria-hidden="true">🔒</span>
              Your connection is protected with HTTPS and encrypted data.
            </p>

            <nav aria-label="Helpful links" className="mt-4">
              <ul className="flex flex-wrap justify-center gap-2">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`inline-flex items-center gap-2 rounded-full border border-amber-300/60 bg-white/5 px-4 py-1.5 text-xs font-bold text-amber-100 transition hover:border-amber-300 hover:bg-white/10 motion-reduce:transition-none sm:text-sm ${focusRing}`}
                    >
                      <span aria-hidden="true">{l.icon}</span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}