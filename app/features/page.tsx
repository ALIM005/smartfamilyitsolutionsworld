// app/features/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import FeatureExplorer from '@/components/FeatureExplorer';
import { featuresData } from '@/lib/features';
import { CALENDLY_URL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'ফিচারসমূহ',
  description:
    'ইনভেন্টরি, POS ও ইনভয়েস, অ্যাকাউন্টিং, HRM, CRM, ই-কমার্স, অ্যানালিটিক্স ও সিকিউর লগইন সহ আমাদের ERP ও বিজনেস সফটওয়্যারের সব ফিচার এক জায়গায় দেখুন।',
  alternates: { canonical: '/features' },
};

export default function FeaturesPage() {
  return (
    <div className="space-y-10 py-10 md:py-14">
      <section
        aria-labelledby="features-title"
        className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl md:p-10"
      >
        <header className="mb-8 text-center">
          <h1 id="features-title" className="text-3xl font-black md:text-4xl">
            আমাদের ফিচারসমূহ
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            আপনার প্রয়োজন অনুযায়ী যে মডিউলগুলো দরকার সেগুলো বেছে নেওয়া যায়। বিস্তারিত দেখতে যেকোনো কার্ডে ক্লিক করুন।
          </p>
        </header>

        <FeatureExplorer features={featuresData} />
      </section>

      <section
        aria-labelledby="features-cta"
        className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-12 text-center text-white shadow-xl"
      >
        <h2 id="features-cta" className="text-3xl font-black">
          কোন মডিউল আপনার দরকার?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          আপনার ব্যবসার কাজের ধাপ জানান। আমরা আলোচনা করে প্রয়োজনীয় মডিউল, সময় ও খরচের পরিকল্পনা দেবো।
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            যোগাযোগ করুন
          </Link>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/60 px-8 py-3.5 font-bold transition hover:bg-white hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ৩০ মিনিটের মিটিং বুক করুন
          </a>
        </div>
      </section>
    </div>
  );
}