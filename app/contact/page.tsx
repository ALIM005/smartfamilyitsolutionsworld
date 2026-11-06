// app/contact/page.tsx
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { COMPANY } from '@/lib/products';
import { CALENDLY_URL } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact us for support or any inquiries, or book a 30-minute meeting.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-white px-4 sm:px-8 lg:px-16 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-[1400px] flex flex-col gap-8">
        
        {/* ১. ওপরের কার্ড দুটি (সাদা ব্যাকগ্রাউন্ডে পরিপাটি ডিজাইন) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full">
          
          {/* হেডার টেক্সট কার্ড */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Marketplace <span className="text-blue-600">Contact</span>
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fill out the form for any questions regarding orders or products, or email us at:{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-blue-600 underline font-semibold hover:text-blue-800 break-all">
                {COMPANY.email}
              </a>
            </p>
          </div>

          {/* মিটিং বুকিং কার্ড */}
          <div className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-8 shadow-sm flex items-center">
            <div className="flex items-center gap-4 w-full">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-2xl text-blue-600 shadow-inner">
                📅
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Book a 30-minute meeting
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Speak directly about the marketplace or a project.
                </p>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-full bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow transition hover:scale-105"
                >
                  Choose a time →
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ২. ফর্ম সেকশন (সম্পূর্ণ সাদা ব্যাকগ্রাউন্ড ও ডার্ক টেক্সট) */}
        <div className="rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 sm:p-10 shadow-sm w-full">
          <h2 className="mb-6 text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-200 pb-3">
            Or send a message
          </h2>
          
          {/* ইনপুট ফিল্ড স্টাইল: পরিষ্কার সাদা ব্যাকগ্রাউন্ড ও স্পষ্ট ডার্ক টেক্সট */}
          <div className="w-full text-slate-900 
            [&_form]:space-y-5
            [&_input]:w-full [&_textarea]:w-full 
            [&_input]:rounded-xl [&_textarea]:rounded-xl 
            [&_input]:bg-white [&_textarea]:bg-white 
            [&_input]:border [&_textarea]:border 
            [&_input]:border-slate-300 [&_textarea]:border-slate-300 
            [&_input]:text-slate-900 [&_textarea]:text-slate-900 
            [&_input]:placeholder:text-slate-400 [&_textarea]:placeholder:text-slate-400
            [&_input]:px-4 [&_input]:py-3 [&_textarea]:p-4 
            [&_input]:text-sm [&_textarea]:text-sm 
            [&_input:focus]:border-blue-600 [&_textarea:focus]:border-blue-600 
            [&_input:focus]:outline-none [&_textarea:focus]:outline-none 
            [&_input:focus]:ring-2 [&_textarea:focus]:ring-2 
            [&_input:focus]:ring-blue-600/20 [&_textarea:focus]:ring-blue-600/20
            [&_label]:text-slate-800 [&_label]:font-bold [&_label]:text-xs sm:[&_label]:text-sm [&_label]:mb-1.5 [&_label]:block
            [&_button[type=submit]]:w-full sm:[&_button[type=submit]]:w-auto
            [&_button[type=submit]]:rounded-full 
            [&_button[type=submit]]:bg-blue-600 hover:[&_button[type=submit]]:bg-blue-700
            [&_button[type=submit]]:px-8 [&_button[type=submit]]:py-3 
            [&_button[type=submit]]:text-sm [&_button[type=submit]]:font-bold 
            [&_button[type=submit]]:text-white 
            [&_button[type=submit]]:shadow transition hover:[&_button[type=submit]]:scale-105"
          >
            <ContactForm />
          </div>
        </div>

      </div>
    </div>
  );
}