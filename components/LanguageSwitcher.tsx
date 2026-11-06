'use client';

import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

function BangladeshFlag() {
  return (
    <svg viewBox="0 0 30 18" aria-hidden="true" className="h-3.5 w-[22px] shrink-0 rounded-[2px] shadow-sm">
      <rect width="30" height="18" fill="#006a4e" />
      <circle cx="13" cy="9" r="5.4" fill="#f42a41" />
    </svg>
  );
}

function UsaFlag() {
  return (
    <svg viewBox="0 0 30 18" aria-hidden="true" className="h-3.5 w-[22px] shrink-0 rounded-[2px] shadow-sm">
      <rect width="30" height="18" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 18) / 13} width="30" height={18 / 13} fill="#b22234" />
      ))}
      <rect width="13" height={(18 / 13) * 7} fill="#3c3b6e" />
      {[2.5, 6.5, 10.5].flatMap((x) => [2, 4.5, 7].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.6" fill="#fff" />))}
    </svg>
  );
}

const LANGS: { code: string; short: string; label: string; flag: ReactNode }[] = [
  { code: 'bn', short: 'বাংলা', label: 'বাংলা', flag: <BangladeshFlag /> },
  { code: 'en', short: 'EN', label: 'English', flag: <UsaFlag /> },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (code: string) => {
    setOpen(false);
    if (code === locale) return;
    document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#e0a820] bg-[linear-gradient(180deg,#0a2f86,#031038)] px-2 py-0.5 text-xs font-bold text-white shadow-[0_0_10px_rgba(255,200,60,0.5),inset_0_0_8px_rgba(0,0,0,0.5)] transition hover:brightness-125 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
      >
        {current.flag}
        <span>{current.short}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className={`h-3 w-3 fill-none stroke-white transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul role="listbox" className="absolute right-0 top-full z-[60] mt-2 w-36 rounded-xl border border-[#e0b030] bg-white p-1 shadow-2xl dark:bg-slate-900">
          {LANGS.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale}>
              <button
                type="button"
                onClick={() => choose(l.code)}
                className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold text-[#0a1f5c] hover:bg-[#fff1c2] dark:text-slate-100 dark:hover:bg-slate-800 ${
                  l.code === locale ? 'bg-[#fff1c2] dark:bg-slate-800' : ''
                }`}
              >
                {l.flag}
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}