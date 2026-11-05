import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { COMPANY } from '@/lib/products';
import { CALENDLY_URL } from '@/lib/contact';


export const metadata: Metadata = {
  title: 'Marketplace Contact',
  description:
    'Contact us for any support or inquiries regarding the Smart Family Point Marketplace.',
  alternates: { canonical: '/marketplace/contact' },
};


export default function MarketplaceContactPage() {
  return (
    <div className="mx-auto max-w-xl space-y-8 py-12 px-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Marketplace Contact</h1>
        <p className="mt-2 text-slate-600">
          Fill out the form for any questions regarding orders or products, or email us at:{' '}
          <a href={`mailto:${COMPANY.email}`} className="text-blue-600 underline">
            {COMPANY.email}
          </a>
        </p>
      </div>


      {/* Meeting booking */}
      <section
        aria-labelledby="book-meeting"
        className="rounded-2xl border border-blue-100 bg-blue-50 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-3xl" aria-hidden="true">📅</div>
          <div className="min-w-0">
            <h2 id="book-meeting" className="text-lg font-black text-slate-900">
              Book a 30-minute meeting
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              If you would like to speak directly about the marketplace or a project, choose a convenient time.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-bold text-white shadow transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Choose a time →
            </a>
          </div>
        </div>
      </section>


      {/* Form */}
      <section aria-labelledby="send-message">
        <h2 id="send-message" className="mb-4 text-lg font-black text-slate-900">
          Or send a message
        </h2>
        <ContactForm />
      </section>
    </div>
  );
}