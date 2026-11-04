import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Smart Family IT Solutions World',
  description: 'Refund, return and cancellation policy for Smart Family IT Solutions World and Smart Family Point.',
};

export default function RefundPolicyPage() {
  const lastUpdated = 'নভেম্বর ২০২৬';

  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Refund & Return Policy
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            রিফান্ড, রিটার্ন এবং পণ্য ফেরত প্রদান সংক্রান্ত নীতিমালা
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
              ১. রিটার্ন বা পণ্য ফেরত নীতি (Return Policy)
            </h2>
            <p className="mb-2">
              আমাদের প্ল্যাটফর্ম থেকে ক্রিত পণ্য বা সার্ভিসের ক্ষেত্রে নির্দিষ্ট শর্ত সাপেক্ষে রিটার্ন বা পরিবর্তনের সুযোগ রয়েছে:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>পণ্য ডেলিভারি পাওয়ার পর সর্বোচ্চ ৩ থেকে ৭ দিনের মধ্যে রিটার্নের আবেদন করতে হবে।</li>
              <li>পণ্যটি অব্যবহৃত, ত্রুটিহীন এবং মূল প্যাকেজিংয়ে থাকতে হবে।</li>
              <li>ডিজিটাল সফটওয়্যার লাইসেন্স বা সাবস্ক্রিপশনের ক্ষেত্রে পলিসি আলাদা হতে পারে (অ্যাক্টিভ হওয়ার পর সাধারণত রিফান্ডযোগ্য নয়)।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ২. রিফান্ড বা টাকা ফেরত প্রক্রিয়া (Refund Process)
            </h2>
            <p className="mb-2">
              যদি আপনার রিফান্ড অনুরোধ অনুমোদিত হয়, তবে টাকা ফেরতের প্রক্রিয়াটি যেভাবে সম্পন্ন হবে:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>অনলাইন পেমেন্ট (SSLCommerz / MFS) বা কার্ডের মাধ্যমে পেমেন্ট করা থাকলে নির্দিষ্ট ট্রানজেকশনের বিপরীতে ৭ থেকে ১০ কার্যদিবসের মধ্যে সংশ্লিষ্ট অ্যাকাউন্ট বা কার্ডে টাকা ফেরত পাঠানো হবে।</li>
              <li>ক্যাশ অন ডেলিভারির ক্ষেত্রে ব্যাংক ট্রান্সফার বা মোবাইল ফাইন্যান্সিয়াল সার্ভিসের (বিকাশ/নগদ) মাধ্যমে রিফান্ড প্রদান করা হবে।</li>
              <li>গেটেওয়ে চার্জ বা প্রসেসিং ফি (যদি প্রযোজ্য হয়) বাদ দিয়ে মূল পণ্যের মূল্য রিফান্ড করা হতে পারে।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              ৩. অর্ডার বাতিলকরণ নীতি (Cancellation Policy)
            </h2>
            <p>
              অর্ডার কনফার্ম হওয়ার পর পণ্য শিপিং বা ডিজিটাল সার্ভিস প্রভিশনিং হওয়ার পূর্বে আপনি যেকোনো সময় অর্ডার ক্যানসেল করতে পারবেন। অর্ডার ক্যানসেলের জন্য অবিলম্বে আমাদের কাস্টমার সাপোর্ট বা হটলাইনে যোগাযোগ করতে হবে।
            </p>
          </section>

          {/* Contact Box */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              রিফান্ড ও রিটার্ন সংক্রান্ত সহায়তা
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              রিফান্ড বা রিটার্ন সংক্রান্ত যেকোনো সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন:
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
              <Link href="/privacy" className="text-gray-600 hover:text-[#B0124F]">
                Privacy Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}