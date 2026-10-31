'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    // NEXT_LOCALE কুকিতে নতুন ভাষা সেট করা
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // পেজ রিফ্রেশ করে নতুন ভাষার ডাটা লোড করা
    router.refresh();
  };

  return (
    <div className="flex gap-1.5 items-center bg-slate-100 p-1 rounded-full border border-slate-200">
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