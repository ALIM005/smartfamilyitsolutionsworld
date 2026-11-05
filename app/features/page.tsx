// app/features/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import FeatureExplorer from '@/components/FeatureExplorer';
import { featuresData } from '@/lib/features';
import { CALENDLY_URL } from '@/lib/contact';


export const metadata: Metadata = {
  title: 'Features',
  description:
    'View all the features of our ERP and business software, including inventory, POS and invoicing, accounting, HRM, CRM, e-commerce, analytics, and secure login, in one place.',
  alternates: { canonical: '/features' },
};


export default function FeaturesPage() {
  return (
    <div className="space-y-10 py-10 md:py-14">
      <section
        aria-labelledby="features-title"
        className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl md:p-10"
      >
        <header className="mb-8 text-center">
          <h1 id="features-title" className="text-3xl font-black md:text-4xl">
            Our Features
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            You can choose the modules you need according to your requirements. Click on any card to see the details.
          </p>
        </header>


        <FeatureExplorer features={featuresData} />
      </section>


      <section
        aria-labelledby="features-cta"
        className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-12 text-center text-white shadow-xl"
      >
        <h2 id="features-cta" className="text-3xl font-black">
          Which module do you need?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          Tell us about your business workflow. We will discuss and provide a plan for the necessary modules, timeline, and cost.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact us
          </Link>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/60 px-8 py-3.5 font-bold transition hover:bg-white hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book a 30-minute meeting
          </a>
        </div>
      </section>
    </div>
  );
}