import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | Smart Family IT Solutions World',
  description: 'Terms and conditions for using Smart Family IT Solutions World and Smart Family Point services.',
};

export default function TermsPage() {
  const lastUpdated = 'November 3, 2026';

  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            স্মার্ট ফ্যামিলি আইটি সলিউশন ওয়ার্ল্ড ও স্মার্ট ফ্যামিলি পয়েন্টের শর্তাবলী
          </p>
          <p className="text-xs text-[#FBD3DE]/80 mt-3">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-800 leading-relaxed text-sm sm:text-base">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ১. সূচনা ও সম্মতি (Introduction & Acceptance)
            </h2>
            <p>
              <strong>Smart Family IT Solutions World</strong> এবং এর ইকমার্স ইকোসিস্টেম <strong>Smart Family Point</strong>-এ স্বাগতম। এই ওয়েবসাইটে প্রবেশ করে বা কোনো ডিজিটাল সলিউশন/প্রোডাক্ট ক্রয় করার মাধ্যমে আপনি আমাদের এই সকল শর্তাবলী মেনে নিতে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলীতে একমত না হন, তবে অনুগ্রহ করে ওয়েবসাইট ব্যবহার করা থেকে বিরত থাকুন।
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ২. অ্যাকাউন্ট রেজিস্ট্রেসণ ও নিরাপত্তা (User Account & Security)
            </h2>
            <p className="mb-2">
              আমাদের প্ল্যাটফর্মে অর্ডার বা সার্ভিস গ্রহণের জন্য অ্যাকাউন্ট তৈরির ক্ষেত্রে আপনাকে সঠিক ও আপডেটেড তথ্য প্রদান করতে হবে।
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>আপনার পাসওয়ার্ড ও অ্যাকাউন্টের গোপনীয়তা রক্ষার সম্পূর্ণ দায়ভার আপনার।</li>
              <li>যেকোনো অননুমোদিত ব্যবহারের জন্য আমাদের সাপোর্ট টিমকে অবিলম্বে অবহিত করতে হবে।</li>
            </ul>
          </section>

          {/* Services & Products */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৩. সেবা ও প্রোডাক্ট সম্পর্কিত বিষয়াবলি (Services & Pricing)
            </h2>
            <p>
              আমরা আমাদের সকল সফটওয়্যার সলিউশন (ERP, POS, Spreadsheet Apps) এবং পণ্যের সঠিক বিবরণ ও মূল্য প্রদর্শনের যথাসাধ্য চেষ্টা করি। তবে কারিগরি ত্রুটির কারণে কোনো পণ্যের মূল্য বা বর্ণনায় ভুল থাকলে, অর্ডার প্রসেসিংয়ের যেকোনো পর্যায়ে আমরা তা সংশোধন বা অর্ডার বাতিল করার অধিকার সংরক্ষণ করি।
            </p>
          </section>

          {/* Orders & Payments */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৪. অর্ডার ও অনলাইন পেমেন্ট (Orders & Online Payment)
            </h2>
            <p className="mb-2">
              অনলাইন পেমেন্টের ক্ষেত্রে আমরা সম্পূর্ণ নিরাপদ পেমেন্ট গেটওয়ে (SSLCommerz / MFS Gateway) ব্যবহার করে থাকি।
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>পেমেন্ট সফলভাবে প্রসেস হওয়ার পরই কেবল অর্ডারটি কনফার্ম হিসেবে গণ্য হবে।</li>
              <li>পেমেন্ট সংক্রান্ত কোনো জটিলতা বা অ্যাকাউন্ট থেকে টাকা কেটে নেওয়ার পরও অর্ডার প্রসেস না হলে ২৪-৪৮ ঘণ্টার মধ্যে ট্রানজেকশন আইডি সহ কাস্টমার সাপোর্টে যোগাযোগ করতে হবে।</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৫. মেধা সত্ত্ব ও কপিরাইট (Intellectual Property)
            </h2>
            <p>
              Smart Family IT Solutions World-এর সমস্ত কন্টেন্ট, সফটওয়্যার কোড, লোগো, ডিজাইন, এবং ব্র্যান্ডের নাম বাংলাদেশ ও আন্তর্জাতিক কপিরাইট আইনের অধীনে সংরক্ষিত। কোম্পানির পূর্ব অনুমতি ছাড়া এসব উপাদান পুনরুৎপাদন বা বাণিজ্যিক কাজে ব্যবহার করা কঠোরভাবে নিষিদ্ধ।
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৬. আইনি এখতিয়ার (Governing Law)
            </h2>
            <p>
              এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত এবং ব্যাখ্যা করা হবে। যেকোনো অনাকাঙ্ক্ষিত বিরোধ বাংলাদেশের উপযুক্ত আদালতের এখতিয়ারের অধীনে নিষ্পন্ন হবে।
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              সরাসরি যোগাযোগ করুন
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              শর্তাবলী বা আমাদের সেবা সংক্রান্ত কোনো প্রশ্ন থাকলে সরাসরি আমাদের সাথে যোগাযোগ করতে পারেন:
            </p>
            <div className="text-sm space-y-1 font-medium text-gray-800">
              <p>🏢 <strong>Smart Family IT Solutions World</strong></p>
              <p>📍 Burdeo, Companyganj-3140, Sylhet, Bangladesh</p>
              <p>✉️ Email: <a href="mailto:alim@smartfamilyitsolutionsworld.com" className="text-[#B0124F] hover:underline">alim@smartfamilyitsolutionsworld.com</a></p>
            </div>
          </section>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200 gap-4 text-sm font-semibold">
            <Link 
              href="/" 
              className="text-[#B0124F] hover:text-[#4A0F2E] transition-colors"
            >
              ← হোমপেজে ফিরে যান
            </Link>
            <div className="space-x-4">
              <Link href="/privacy" className="text-gray-600 hover:text-[#B0124F]">
                Privacy Policy
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