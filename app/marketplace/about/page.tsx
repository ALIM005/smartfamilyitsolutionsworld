import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Smart Family Point',
  description:
    'স্মার্ট ফ্যামিলি পয়েন্ট মার্কেটপ্লেস সম্পর্কে জানুন — আমাদের লক্ষ্য, উদ্দেশ্য এবং পরিচালনার সাথে যারা যুক্ত আছেন।',
  alternates: { canonical: '/marketplace/about' },
};

const LEADERS = [
  { name: 'MD HAFIZ SHAMSUDDUHA', role: 'Chairman' },
  { name: 'H M ALIM UDDIN', role: 'Managing Director (MD)' },
  { name: 'MD BALAL HOSSAIN', role: 'Director' },
  { name: 'MD ISLAM UDDIN', role: 'Director' },
];

export default function MarketplaceAboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 py-12 px-4 sm:px-6">
      {/* শিরোনাম অংশ */}
      <div className="text-center">
        <h1 className="font-serif text-3xl font-black text-slate-900 sm:text-4xl">
          আমাদের সম্পর্কে
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
          <span className="font-semibold text-[#B0124F]">Smart Family Point</span> হলো একটি বিশ্বস্ত মার্কেটপ্লেস, যা আপনাদের দৈনন্দিন জীবনকে আরও সহজ, নিরাপদ এবং মানসম্মত করতে প্রতিশ্রুতিবদ্ধ।
        </p>
      </div>

      {/* মূল লক্ষ্য ও উদ্দেশ্য */}
      <section className="rounded-3xl border border-[#F3C6D3] bg-linear-to-br from-[#FFF4F6] to-[#FDE6EC] p-6 sm:p-8 shadow-sm">
        <h2 className="font-serif text-xl font-bold text-[#4A0F2E] mb-3">
          আমাদের লক্ষ্য ও অঙ্গীকার
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
          আমরা সেরা মানের পণ্য সাশ্রয়ী মূল্যে এবং দ্রুততম সময়ে গ্রাহকদের দোরগোড়ায় পৌঁছে দিতে কাজ করে যাচ্ছি। শতভাগ নিরাপদ পেমেন্ট সিস্টেম এবং ২৪/৭ কাস্টমার সাপোর্টের মাধ্যমে আমরা একটি আস্থার সম্পর্ক তৈরি করতে চাই।
        </p>
      </section>

      {/* লিডারশিপ বা পরিচালনা পর্ষদ */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6 text-center">
          Family Leadership
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEADERS.map((leader) => (
            <div
              key={leader.name}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4A0F2E] text-[#E3B964] font-bold">
                👑
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {leader.name}
                </h3>
                <span className="mt-1 inline-block rounded-full bg-linear-to-r from-[#B0124F] to-[#D81B7A] px-3 py-0.5 text-xs font-semibold text-white">
                  {leader.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* কন্টাক্ট বা কল টু অ্যাকশন */}
      <div className="text-center rounded-2xl bg-slate-950 text-white p-8 space-y-4">
        <h3 className="font-serif text-xl font-bold">আমাদের সাথে যোগাযোগ করতে চান?</h3>
        <p className="text-xs sm:text-sm text-slate-300">
          যেকোনো প্রশ্ন বা সহযোগিতার জন্য আমাদের কন্টাক্ট পেজ ভিজিট করুন অথবা সরাসরি মিটিং বুক করুন।
        </p>
        <div>
          <Link
            href="/marketplace/contact"
            className="inline-block rounded-full bg-linear-to-r from-[#E3B964] to-[#C9A24B] px-6 py-2.5 text-sm font-bold text-[#2E0A1C] shadow transition hover:brightness-105"
          >
            যোগাযোগ ও মিটিং বুকিং →
          </Link>
        </div>
      </div>
    </div>
  );
}