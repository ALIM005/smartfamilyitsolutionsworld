import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Smart Family IT Solutions World',
  description: 'Order cancellation and product/service revocation policy for Smart Family IT Solutions World.',
};

export default function CancellationPage() {
  const lastUpdated = 'নভেম্বর ২০২৬';

  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Cancellation Policy
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            অর্ডার বাতিলকরণ ও সেবা পরিহার সংক্রান্ত নীতিমালা
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
              ১. অর্ডার ক্যান্সেলেশন বা বাতিলকরণের নিয়ম (Order Cancellation)
            </h2>
            <p className="mb-2">
              গ্রাহক হিসেবে আপনার অর্ডার বাতিল করার পূর্ণ অধিকার রয়েছে, তবে তা নির্দিষ্ট কিছু শর্ত ও সময়ের মধ্যে হতে হবে:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>পণ্য বা সার্ভিস অর্ডারের পর যদি আপনি তা বাতিল করতে চান, তবে পণ্য শিপিং (Shipping) হওয়ার আগেই আমাদের সাথে যোগাযোগ করতে হবে।</li>
              <li>যদি কোনো ফিজিক্যাল প্রোডাক্ট ইতিমধ্যে কুরিয়ার বা ডেলিভারিতে চলে যায়, তবে ক্যান্সেলেশন পলিসি কার্যকর হবে না; সেক্ষেত্রে পণ্য হাতে পেয়ে রিটার্ন পলিসি অনুসরণ করতে হবে।</li>
              <li>ডিজিটাল সফটওয়্যার বা সার্ভিস প্রভিশনিং শুরু হয়ে গেলে সাধারণত অর্ডার বাতিল করা যায় না।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ২. কোম্পানি কর্তৃক অর্ডার বাতিল (Cancellation by Authority)
            </h2>
            <p className="mb-2">
              অনাকাঙ্ক্ষিত পরিস্থিতির কারণে <strong>{COMPANY.name}</strong> যেকোনো অর্ডার বাতিল করার অধিকার সংরক্ষণ করে:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>পণ্যের স্টক না থাকা বা কারিগরি ত্রুটির কারণে মূল্য ভুল প্রদর্শিত হলে।</li>
              <li>পেমেন্ট গেটওয়ে (SSLCommerz) থেকে পেমেন্ট ভেরিফিকেশন সফলভাবে সম্পন্ন না হলে।</li>
              <li>প্রদানকৃত ডেলিভারি ঠিকানা সন্দেহজনক বা অসম্পূর্ণ বলে মনে হলে।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৩. ক্যান্সেলেশনের পর পেমেন্ট রিফান্ড
            </h2>
            <p>
              অনলাইন পেমেন্ট সম্পন্ন করার পর যদি আপনার অর্ডার সফলভাবে ক্যানসেল করা হয়, তবে আমাদের রিফান্ড নীতি অনুযায়ী ৭-১০ কার্যদিবসের মধ্যে আপনার সংশ্লিষ্ট অ্যাকাউন্টে টাকা ফেরত প্রদান করা হবে।
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              অর্ডার বাতিল করতে দ্রুত যোগাযোগ করুন
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              জরুরি ভিত্তিতে কোনো অর্ডার ক্যানসেল করতে বা তথ্য জানতে যোগাযোগ করুন:
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
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-[#B0124F]">
                Privacy
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