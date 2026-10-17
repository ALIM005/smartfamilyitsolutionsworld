import type { Metadata } from 'next';
import { COMPANY } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `${COMPANY.name}-এর প্রাইভেসি পলিসি।`,
};

export default function PrivacyPage() {
  return (
    <article className="py-12 max-w-3xl mx-auto space-y-6 leading-relaxed">
      <h1 className="text-3xl font-black">Privacy Policy</h1>
      <p className="text-sm text-slate-500">সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬</p>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">১. আমরা কোন তথ্য সংগ্রহ করি</h2>
        <p>অ্যাকাউন্ট খোলার সময় ইমেইল ও পাসওয়ার্ড (পাসওয়ার্ড এনক্রিপ্টেড হ্যাশ আকারে সংরক্ষিত হয়), আপনার তৈরি করা শিট বা অ্যাপের ডাটা, এবং যোগাযোগ ফর্মে দেওয়া নাম, ইমেইল ও বার্তা।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">২. তথ্য কেন ব্যবহার করি</h2>
        <p>সেবা প্রদান, লগইন নিরাপত্তা, সাপোর্ট দেওয়া এবং জরুরি নোটিফিকেশন পাঠানোর জন্য। আমরা আপনার তথ্য বিক্রি করি না।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">৩. কুকি</h2>
        <p>লগইন অবস্থা ধরে রাখতে আমরা একটি নিরাপদ (httpOnly) সেশন কুকি ব্যবহার করি। বিজ্ঞাপনের কুকি ব্যবহার করা হয় না।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">৪. তৃতীয় পক্ষ সেবা</h2>
        <p>হোস্টিং (Vercel), ডাটাবেস (MongoDB Atlas) এবং ইমেইল পাঠানো (Resend) এর জন্য আমরা বিশ্বস্ত তৃতীয় পক্ষ সেবা ব্যবহার করি।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">৫. আপনার অধিকার</h2>
        <p>আপনি যেকোনো সময় আপনার তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলার অনুরোধ করতে পারেন।</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">৬. যোগাযোগ</h2>
        <p>প্রশ্ন থাকলে ইমেইল করুন: <a href={`mailto:${COMPANY.email}`} className="text-blue-600 underline">{COMPANY.email}</a></p>
      </section>
    </article>
  );
}
