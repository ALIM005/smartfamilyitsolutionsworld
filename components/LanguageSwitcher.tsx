'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // ব্রাউজারে মাউন্ট হওয়ার পর রেন্ডার নিশ্চিত করা
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // সার্ভার সাইড রেন্ডারিংয়ের সময় ফ্লিফারিং রোধ করতে প্রাথমিক অবস্থায় খালি রাখবে
  }

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');

    window.location.href = newPathname;
  };

  return (
    <div className="relative z-50 flex gap-1.5 items-center bg-slate-100 p-1 rounded-full border border-slate-200 shadow-sm">
      <button
        onClick={() => switchLanguage('bn')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
          locale === 'bn'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        বাংলা
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        English
      </button>
    </div>
  );
}