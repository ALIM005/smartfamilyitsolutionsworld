import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';
import { CONTACT } from '@/lib/contact';

const SITE_URL = 'https://smartfamilyitsolutionsworld.com';

export const metadata: Metadata = {
  title: `আমাদের সম্পর্কে | ${COMPANY.name}`,
  description: 'Smart Family IT Solutions World-এর লক্ষ্য, উদ্দেশ্য, নেতৃত্ব এবং আমাদের সফটওয়্যার ও সলিউশন সম্পর্কে জানুন।',
  alternates: { canonical: `${SITE_URL}/about` },
};

const LEADERS = [
  { name: 'MD HAFIZ SHAMSUDDUHA', role: 'Chairman' },
  { name: 'H M ALIM UDDIN', role: 'Managing Director (MD)' },
  { name: 'MD BALAL HOSSAIN', role: 'Director' },
  { name: 'MD ISLAM UDDIN', role: 'Director' },
];

const VALUES = [
  {
    icon: '💡',
    title: 'উদ্ভাবন ও আধুনিক প্রযুক্তি',
    text: 'সর্বাধুনিক প্রযুক্তির ব্যবহার করে ব্যবসার কার্যক্রমকে সহজ ও গতিশীল করা।',
  },
  {
    icon: '🤝',
    title: 'গ্রাহক সন্তুষ্টি ও আস্থা',
    text: 'প্রতিটি ক্লায়েন্টের প্রয়োজনকে সর্বোচ্চ গুরুত্ব দিয়ে দীর্ঘমেয়াদী সম্পর্ক গড়ে তোলা।',
  },
  {
    icon: '🛡️',
    title: 'নিরাপত্তা ও নির্ভরযোগ্যতা',
    text: 'উচ্চমানের সিকিউরিটি এবং ১০০% নির্ভরযোগ্য ক্লাউড সলিউশন নিশ্চিত করা।',
  },
  {
    icon: '🎧',
    title: '২৪/৭ কাস্টমার সাপোর্ট',
    text: 'যেকোনো টেকনিক্যাল প্রয়োজনে সর্বদা পাশে থাকা এবং দ্রুত সমাধান দেওয়া।',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 sm:text-sm">
          ⚡ আমাদের সম্পর্কে জানুন
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          {COMPANY.name}
        </h1>
        <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
          {COMPANY.description} আমরা ব্যবসা প্রতিষ্ঠানের ডিজিটালাইজেশন, কাস্টম সফটওয়্যার ডেভেলপমেন্ট এবং আধুনিক ক্লাউড সলিউশন প্রদানে কাজ করে যাচ্ছি।
        </p>
      </section>

      {/* MISSION & VISION */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
          <div className="text-4xl">🎯</div>
          <h2 className="text-2xl font-black text-slate-900">আমাদের লক্ষ্য (Mission)</h2>
          <p className="text-slate-600 leading-relaxed">
            বাংলাদেশের প্রতিটি ব্যবসা প্রতিষ্ঠানে সাশ্রয়ী মূল্যে বিশ্বমানের সফটওয়্যার ও অটোমেশন পৌঁছে দেওয়া, যাতে দাপ্তরিক কাজ ও হিসাব-নিকাশ হয় আরও সহজ ও নির্ভুল।
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
          <div className="text-4xl">🚀</div>
          <h2 className="text-2xl font-black text-slate-900">আমাদের ভিশন (Vision)</h2>
          <p className="text-slate-600 leading-relaxed">
            প্রযুক্তির উৎকর্ষ সাধনের মাধ্যমে দেশের শীর্ষস্থানীয় সফটওয়্যার ও আইটি সলিউশন প্রদানকারী প্রতিষ্ঠান হিসেবে নিজেদের প্রতিষ্ঠিত করা এবং বৈশ্বিক মানে উন্নীত হওয়া।
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-slate-900">আমাদের মূল বৈশিষ্ট্যসমূহ</h2>
          <p className="mt-2 text-slate-600">যে নীতিগুলোর ওপর ভিত্তি করে আমাদের প্রতিটি সেবা পরিচালিত হয়।</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="text-3xl" aria-hidden="true">{v.icon}</div>
              <h3 className="font-bold text-slate-900">{v.title}</h3>
              <p className="text-sm text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERSHIP */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-slate-900">পরিচালনা পর্ষদ (Leadership)</h2>
          <p className="mt-2 text-slate-600">যাদের দিকনির্দেশনায় Smart Family IT Solutions পরিচালিত হচ্ছে।</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERS.map((leader) => (
            <div key={leader.name} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-amber-400 text-2xl font-bold shadow-md">
                👑
              </div>
              <h3 className="font-extrabold text-slate-900">{leader.name}</h3>
              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                {leader.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="rounded-3xl bg-slate-950 px-6 py-12 text-center text-white space-y-6">
        <h2 className="text-3xl font-black">আপনার প্রজেক্ট নিয়ে কথা বলতে চান?</h2>
        <p className="max-w-xl mx-auto text-slate-300">
          আমাদের এক্সপার্ট টিমের সাথে যোগাযোগ করুন অথবা সরাসরি মিটিং বুক করুন।
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            যোগাযোগ করুন
          </Link>
          <a
            href={`tel:${CONTACT.whatsappDisplay}`}
            className="rounded-xl border border-white/30 px-8 py-3.5 font-bold transition hover:bg-white hover:text-slate-950"
          >
            কল করুন: {CONTACT.whatsappDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}