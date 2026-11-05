import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';
import { CONTACT } from '@/lib/contact';


const SITE_URL = 'https://smartfamilyitsolutionsworld.com';


export const metadata: Metadata = {
  title: `About Us | ${COMPANY.name}`,
  description: 'Learn about Smart Family IT Solutions World\'s goals, objectives, leadership, and our software and solutions.',
  alternates: { canonical: `${SITE_URL}/about` },
};


const LEADERS = [
  { name: 'MD HAFIZ SHAMSUDDUHA', role: 'Chairman' },
  { name: 'H M ALIM UDDIN', role: 'Managing Director (MD)' },
  { name: 'MD BALAL HOSSAIN', role: 'Director' },
  { name: 'MD ISLAM UDDIN', role: 'Director' },
];


const VALUES = [
  {
    icon: '💡',
    title: 'Innovation and Modern Technology',
    text: 'Making business operations easier and more dynamic by using the latest technology.',
  },
  {
    icon: '🤝',
    title: 'Customer Satisfaction and Trust',
    text: 'Building long-term relationships by giving the highest importance to every client\'s needs.',
  },
  {
    icon: '🛡️',
    title: 'Security and Reliability',
    text: 'Ensuring high-quality security and 100% reliable cloud solutions.',
  },
  {
    icon: '🎧',
    title: '24/7 Customer Support',
    text: 'Always being there for any technical need and providing quick solutions.',
  },
];


export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 sm:text-sm">
          ⚡ Learn about us
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          {COMPANY.name}
        </h1>
        <p className="text-base text-slate-600 sm:text-lg leading-relaxed">
          {COMPANY.description} We work to provide business digitalization, custom software development, and modern cloud solutions.
        </p>
      </section>


      {/* MISSION & VISION */}
      <section className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
          <div className="text-4xl">🎯</div>
          <h2 className="text-2xl font-black text-slate-900">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            To deliver world-class software and automation to every business in Bangladesh at an affordable price, so that office work and accounting become easier and more accurate.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
          <div className="text-4xl">🚀</div>
          <h2 className="text-2xl font-black text-slate-900">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            To establish ourselves as the country's leading software and IT solutions provider through excellence in technology and to rise to global standards.
          </p>
        </div>
      </section>


      {/* VALUES */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-slate-900">Our Core Features</h2>
          <p className="mt-2 text-slate-600">The principles on which every one of our services is based.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3">
              <div className="text-3xl" aria-hidden="true">{v.icon}</div>
              <h3 className="font-bold text-slate-900">{v.title}</h3>
              <p className="text-sm text-slate-600">{v.text}</p>
            </div>
          ))}
        </div>
      </section>


      {/* LEADERSHIP */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-slate-900">Board of Directors (Leadership)</h2>
          <p className="mt-2 text-slate-600">Those under whose guidance Smart Family IT Solutions is being run.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LEADERS.map((leader) => (
            <div key={leader.name} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-amber-400 text-2xl font-bold shadow-md">
                👑
              </div>
              <h3 className="font-extrabold text-slate-900">{leader.name}</h3>
              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                {leader.role}
              </span>
            </div>
          ))}
        </div>
      </section>


      {/* CONTACT CTA */}
      <section className="rounded-3xl bg-slate-950 px-6 py-12 text-center text-white space-y-6">
        <h2 className="text-3xl font-black">Want to talk about your project?</h2>
        <p className="max-w-xl mx-auto text-slate-300">
          Contact our expert team or book a meeting directly.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            Contact us
          </Link>
          <a
            href={`tel:${CONTACT.whatsappDisplay}`}
            className="rounded-xl border border-white/30 px-8 py-3.5 font-bold transition hover:bg-white hover:text-slate-950"
          >
            Call: {CONTACT.whatsappDisplay}
          </a>
        </div>
      </section>
    </div>
  );
}