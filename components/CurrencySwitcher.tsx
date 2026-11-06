'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ⚠️ রেট আনুমানিক – প্রয়োজনমতো নিজে আপডেট করুন (১ BDT = ? অন্য মুদ্রা) */
export const CURRENCIES = [
  { code: 'BDT', symbol: '৳', label: 'Bangladeshi Taka', rate: 1 },
  { code: 'USD', symbol: '$', label: 'US Dollar', rate: 0.0082 },
  { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.0076 },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal', rate: 0.0308 },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

const STORAGE_KEY = 'currency';
const EVENT_NAME = 'currency-change';

function readCurrency(): CurrencyCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && CURRENCIES.some((c) => c.code === saved)) return saved;
  } catch {}
  return 'BDT';
}

/** যেকোনো কম্পোনেন্টে বর্তমান কারেন্সি পেতে এই hook ব্যবহার করুন */
export function useCurrency() {
  const [code, setCode] = useState<CurrencyCode>('BDT');

  useEffect(() => {
    setCode(readCurrency());
    const onChange = () => setCode(readCurrency());
    window.addEventListener(EVENT_NAME, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(EVENT_NAME, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const currency = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

  /** BDT মূল্যকে নির্বাচিত কারেন্সিতে রূপান্তর করে ফরম্যাট করে */
  const formatPrice = useCallback(
    (amountInBdt: number) => {
      const value = amountInBdt * currency.rate;
      const digits = currency.code === 'BDT' ? 0 : 2;
      return `${currency.symbol}${value.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })}`;
    },
    [currency],
  );

  return { currency, formatPrice };
}

export default function CurrencySwitcher() {
  const { currency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const select = (code: CurrencyCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {}
    window.dispatchEvent(new Event(EVENT_NAME));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select currency"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#fff3b8] bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_30%,#e8a817_65%,#b97a05_100%)] px-3.5 py-1.5 text-sm font-extrabold text-[#0a1f5c] shadow-[0_0_14px_rgba(255,200,60,0.55),inset_0_1px_0_rgba(255,255,255,0.8),inset_0_-2px_3px_rgba(120,70,0,0.35)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="text-base leading-none">{currency.symbol}</span>
        {currency.code}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-3.5 w-3.5 fill-none stroke-[#0a1f5c] transition-transform ${open ? 'rotate-180' : ''}`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-[60] mt-2 w-52 rounded-2xl border border-[#e0b030] bg-white p-1.5 shadow-2xl dark:bg-slate-900"
        >
          {CURRENCIES.map((c) => (
            <li key={c.code} role="option" aria-selected={c.code === currency.code}>
              <button
                type="button"
                onClick={() => select(c.code)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-[#0a1f5c] hover:bg-[#fff1c2] dark:text-slate-100 dark:hover:bg-slate-800 ${
                  c.code === currency.code ? 'bg-[#fff1c2] dark:bg-slate-800' : ''
                }`}
              >
                <span className="w-5 text-center text-sm">{c.symbol}</span>
                <span className="flex-1">{c.code}</span>
                <span className="text-[10px] font-medium opacity-70">{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}