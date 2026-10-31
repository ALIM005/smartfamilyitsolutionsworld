// app/contact/page.tsx
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { COMPANY } from '@/lib/products';
import { CALENDLY_URL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'সাপোর্ট বা যেকোনো জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন অথবা ৩০ মিনিটের মিটিং বুক করুন।',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl space-y-8 py-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900">যোগাযোগ</h1>
        <p className="mt-2 text-slate-600">
          সাপোর্ট বা যেকোনো প্রশ্নের জন্য ফর্মটি পূরণ করুন, অথবা ইমেইল করুন:{' '}
          <a href={`mailto:${COMPANY.email}`} className="text-blue-600 underline">
            {COMPANY.email}
          </a>
        </p>
      </div>

      {/* মিটিং বুকিং */}
      <section
        aria-labelledby="book-meeting"
        className="rounded-2xl border border-blue-100 bg-blue-50 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl" aria-hidden="true">📅</div>
          <div className="min-w-0">
            <h2 id="book-meeting" className="text-lg font-black text-slate-900">
              ৩০ মিনিটের মিটিং বুক করুন
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              আপনার প্রয়োজন নিয়ে সরাসরি কথা বলতে চাইলে সুবিধাজনক সময় বেছে নিন।
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              সময় বেছে নিন →
            </a>
          </div>
        </div>
      </section>

      {/* ফর্ম */}
      <section aria-labelledby="send-message">
        <h2 id="send-message" className="mb-4 text-lg font-black text-slate-900">
          অথবা বার্তা পাঠান
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}