import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Privacy Policy | Smart Family IT Solutions World',
  description: `${COMPANY.name}-এর প্রাইভেসি পলিসি ও ডাটা সুরক্ষা নীতি।`,
};

export default function PrivacyPage() {
  const lastUpdated = 'নভেম্বর ২০২৬';

  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            গোপনীয়তা নীতি ও ব্যক্তিগত তথ্য সুরক্ষা নির্দেশিকা
          </p>
          <p className="text-xs text-[#FBD3DE]/80 mt-3">
            সর্বশেষ হালনাগাদ: {lastUpdated}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-800 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ১. আমরা কোন তথ্য সংগ্রহ করি (Information We Collect)
            </h2>
            <p className="mb-2">
              আমাদের প্ল্যাটফর্মে অ্যাকাউন্ট খোলা, ডিজিটাল সার্ভিস ব্যবহার কিংবা পণ্য অর্ডার করার সময় আমরা নিচের তথ্যগুলো সংগ্রহ করে থাকি:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li><strong>ব্যক্তিগত তথ্য:</strong> আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর এবং পণ্য ডেলিভারির পূর্ণাঙ্গ ঠিকানা।</li>
              <li><strong>অ্যাকাউন্ট সিকিউরিটি:</strong> পাসওয়ার্ড পাসওয়ার্ড এনক্রিপ্টেড হ্যাশ (Encrypted Hash) আকারে সম্পূর্ণ নিরাপদভাবে আমাদের ডাটাবেজে সংরক্ষিত থাকে।</li>
              <li><strong>অর্ডার ও ট্রানজেকশন তথ্য:</strong> অর্ডারের বিবরণ, ডেলিভারি স্ট্যাটাস এবং ট্রানজেকশন আইডি (আমরা কখনো আপনার ব্যাংক কার্ড নম্বর বা PIN সংরক্ষণ করি না)।</li>
              <li><strong>যোগাযোগের তথ্য:</strong> কন্টাক্ট ফর্মে আপনার দেওয়া মেসেজ ও ফিডব্যাক।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ২. তথ্যের ব্যবহারের উদ্দেশ্য (How We Use Your Information)
            </h2>
            <p className="mb-2">সংগৃহীত তথ্য আমরা নিম্নোক্ত উদ্দেশ্যে ব্যবহার করি:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>আপনার অর্ডার প্রসেস করা এবং সঠিক ঠিকানায় পণ্য পৌঁছে দেওয়া।</li>
              <li>লগইন সিকিউরিটি ও অ্যাকাউন্টের পরিচয় নিশ্চিত করা।</li>
              <li>অর্ডারের আপডেট, ইনভয়েস এবং জরুরি নোটিফিকেশন ইমেইল বা এসএমএসের মাধ্যমে পাঠানো।</li>
              <li>কাস্টমার সাপোর্ট প্রদান করা এবং প্রযুক্তিগত সমস্যার সমাধান করা।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৩. কুকিজ নীতি (Cookie Policy)
            </h2>
            <p>
              আপনার লগইন সেশন সক্রিয় রাখতে এবং ওয়েবসাইটের পারফরম্যান্স বজায় রাখতে আমরা নিরাপদ (httpOnly) এনক্রিপ্টেড সেশন কুকিজ ব্যবহার করি। আমরা কোনো বাণিজ্যিক বা অনাকাঙ্ক্ষিত থার্ড-পার্টি বিজ্ঞাপনের জন্য কুকি ব্যবহার করি না।
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৪. তৃতীয় পক্ষের সেবা ও পেমেন্ট সিকিউরিটি (Third-Party Services)
            </h2>
            <p className="mb-2">
              আমরা আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি করি না। তবে সার্ভিস পরিচালনার জন্য বিশ্বস্ত থার্ড-পার্টি প্ল্যাটফর্ম ব্যবহার করি:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li><strong>অনলাইন পেমেন্ট:</strong> আমাদের পেমেন্ট পার্টনার (SSLCommerz / MFS) এনক্রিপ্টেড চ্যানেলের মাধ্যমে আপনার অনলাইন লেনদেন প্রসেস করে।</li>
              <li><strong>ইনফ্রাস্ট্রাকচার:</strong> ক্লাউড হোস্টিং (Vercel), এনক্রিপ্টেড ডাটাবেস (MongoDB Atlas) এবং নোটিফিকেশন সার্ভিস (Resend)।</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৫. গ্রাহকের অধিকার ও তথ্য নিয়ন্ত্রণ (Your Rights)
            </h2>
            <p>
              একজন ব্যবহারকারী হিসেবে আপনার অধিকার রয়েছে যেকোনো সময় আপনার ব্যক্তিগত তথ্য দেখার, সংশোধন করার বা আমাদের ডাটাবেজ থেকে মুছে ফেলার অনুরোধ করার। এ সম্পর্কিত যেকোনো সহায়তার জন্য আমাদের সাপোর্ট ইমেইলে যোগাযোগ করুন।
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              প্রাইভেসি সংক্রান্ত যোগাযোগ
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              আমাদের প্রাইভেসি পলিসি বা ডাটা সুরক্ষা সম্পর্কে কোনো জিজ্ঞাসা থাকলে আমাদের সাথে যোগাযোগ করতে পারেন:
            </p>
            <div className="text-sm space-y-1 font-medium text-gray-800">
              <p>🏢 <strong>{COMPANY.name}</strong></p>
              <p>📍 Burdeo, Companyganj-3140, Sylhet, Bangladesh</p>
              <p>
                ✉️ Email:{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-[#B0124F] hover:underline font-bold">
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200 gap-4 text-sm font-semibold">
            <Link 
              href="/" 
              className="text-[#B0124F] hover:text-[#4A0F2E] transition-colors"
            >
              ← হোমপেজে ফিরে যান
            </Link>
            <div className="space-x-4">
              <Link href="/terms" className="text-gray-600 hover:text-[#B0124F]">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="text-gray-600 hover:text-[#B0124F]">
                Refund Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}