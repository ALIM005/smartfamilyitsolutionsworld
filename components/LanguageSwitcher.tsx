'use client';


import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';


export default function LanguageSwitcher() {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return null;
  }


  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;


    // Setting the cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;


    // Reloading the page will change the language according to the cookie
    window.location.reload();
  };


  return (
    <div className="relative z-50 flex gap-1.5 items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
      <button
        onClick={() => switchLanguage('bn')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
          locale === 'bn'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        Bangla
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
          locale === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        English
      </button>
    </div>
  );
}