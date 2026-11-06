// components/ShareButton.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  /** Absolute URL that will be shared. */
  url: string;
  /** Title used by the share targets. */
  title: string;
  /** Short description used by the share targets. */
  text?: string;
};

type Target = {
  name: string;
  href: string;
  badge: string;
  label: string;
  external: boolean;
};

export default function ShareButton({ url, title, text = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const msg = encodeURIComponent(text ? `${title} - ${text}` : title);

  const targets: Target[] = [
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, badge: 'bg-[#1877F2] text-white', label: 'f', external: true },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, badge: 'bg-[#0A66C2] text-white', label: 'in', external: true },
    { name: 'X', href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, badge: 'bg-black text-white', label: 'X', external: true },
    { name: 'WhatsApp', href: `https://wa.me/?text=${msg}%20${u}`, badge: 'bg-[#25D366] text-white', label: 'W', external: true },
    { name: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}`, badge: 'bg-[#229ED9] text-white', label: 'T', external: true },
    { name: 'Reddit', href: `https://www.reddit.com/submit?url=${u}&title=${t}`, badge: 'bg-[#FF4500] text-white', label: 'R', external: true },
    { name: 'Email', href: `mailto:?subject=${t}&body=${msg}%0A${u}`, badge: 'bg-gradient-to-b from-yellow-200 to-amber-500 text-slate-900', label: '✉', external: false },
  ];

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const nativeShare = useCallback(() => {
    navigator.share({ title, text, url }).catch(() => {
      /* user cancelled */
    });
  }, [title, text, url]);

  const tile =
    'group flex flex-col items-center gap-1.5 rounded-xl p-1.5 text-[11px] font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400';
  const badgeBase =
    'flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-base font-black shadow-md transition group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100';

  return (
    <div
      ref={rootRef}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 z-50 sm:left-6"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Share this page"
          className="absolute bottom-full left-0 mb-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border-2 border-amber-300/70 bg-gradient-to-b from-[#0b1150] via-[#080d4a] to-[#060a3d] p-4 text-white shadow-[0_0_35px_rgba(251,191,36,0.4)]"
        >
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
            aria-hidden="true"
          />

          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-600 bg-clip-text text-sm font-black uppercase tracking-widest text-transparent">
              <span className="[-webkit-text-fill-color:initial]" aria-hidden="true">👑</span>
              Share this page
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close share menu"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/50 text-sm text-amber-200 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <ul className="grid grid-cols-4 gap-1">
            {targets.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={s.external ? `Share on ${s.name} (opens in a new tab)` : `Share by ${s.name}`}
                  className={tile}
                >
                  <span className={`${badgeBase} ${s.badge}`} aria-hidden="true">{s.label}</span>
                  {s.name}
                </a>
              </li>
            ))}
            <li>
              <button type="button" onClick={copyLink} className={`${tile} w-full`} aria-label="Copy link">
                <span
                  className={`${badgeBase} bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 text-slate-900`}
                  aria-hidden="true"
                >
                  {copied ? '✓' : '🔗'}
                </span>
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </li>
          </ul>

          {canNativeShare && (
            <button
              type="button"
              onClick={nativeShare}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/60 bg-white/5 px-3 py-2 text-xs font-bold text-amber-100 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <span aria-hidden="true">📲</span>
              More apps (YouTube, Instagram &amp; others)
            </button>
          )}

          <p className="sr-only" role="status" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Share this page"
        className="flex items-center gap-2 rounded-full border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 px-4 py-3 font-extrabold text-slate-900 shadow-[0_0_22px_rgba(251,191,36,0.7)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  );
}