// app/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY, products } from '@/lib/products';
import { CONTACT } from '@/lib/contact';

const SITE_URL = 'https://smartfamilyitsolutionsworld.com';

const SHOW_ECOMMERCE_DEMO = false;

export const metadata: Metadata = {
  title: `${COMPANY.name} | ওয়েব, ERP ও ক্লাউড সফটওয়্যার সলিউশন`,
  description: COMPANY.description,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: COMPANY.name,
    description: COMPANY.description,
    url: SITE_URL,
    siteName: COMPANY.name,
    type: 'website',
  },
};

const services = [
  {
    icon: '🌐',
    title: 'Web Development',
    href: '/services/web-development',
    text: 'আধুনিক, দ্রুত ও SEO-বান্ধব ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন।',
  },
  {
    icon: '📦',
    title: 'ERP & Business Software',
    href: '/services/erp-software',
    text: 'ব্যবসার প্রয়োজন অনুযায়ী কাস্টম সফটওয়্যার সলিউশন।',
  },
  {
    icon: '☁️',
    title: 'Cloud Applications',
    href: '/services/cloud-applications',
    text: 'ক্লাউড-ভিত্তিক নিরাপদ অ্যাপ, যেকোনো জায়গা থেকে ব্যবহারযোগ্য।',
  },
  {
    icon: '🛠️',
    title: 'IT Support',
    href: '/services/it-support',
    text: 'সফটওয়্যার রক্ষণাবেক্ষণ ও টেকনিক্যাল সাপোর্ট।',
  },
];

const modules = [
  { icon: '📦', title: 'ইনভেন্টরি ম্যানেজমেন্ট', text: 'স্টকের হিসাব, লো-স্টক অ্যালার্ট ও পণ্যের তথ্য এক জায়গায়।' },
  { icon: '🧾', title: 'POS ও ইনভয়েস', text: 'দোকানে বিক্রি, মেমো ও ইনভয়েস প্রিন্ট বা ডাউনলোড।' },
  { icon: '📊', title: 'অ্যাকাউন্টিং', text: 'আয়-ব্যয়, বাকি-পাওনা ও রিপোর্ট সহজে দেখুন।' },
  { icon: '👥', title: 'HRM ও পে-রোল', text: 'কর্মী তথ্য, হাজিরা ও বেতনের হিসাব।' },
  { icon: '🏬', title: 'ওয়্যারহাউস', text: 'একাধিক গুদাম বা শাখার স্টক ট্র্যাকিং।' },
  { icon: '🛍️', title: 'ই-কমার্স স্টোর', text: 'কার্ট, উইশলিস্ট, কুপন ও চেকআউট সহ অনলাইন শপ।' },
  { icon: '🏪', title: 'ভেন্ডর ড্যাশবোর্ড', text: 'মাল্টি-ভেন্ডর মার্কেটপ্লেসের জন্য আলাদা প্যানেল।' },
  { icon: '📈', title: 'অ্যানালিটিক্স', text: 'বিক্রি, স্টক ও কাস্টমারের ডেটা থেকে সহজ ড্যাশবোর্ড।' },
  { icon: '🤝', title: 'CRM', text: 'কাস্টমারের তথ্য, যোগাযোগ ও ফলো-আপ ম্যানেজমেন্ট।' },
  { icon: '🔐', title: 'সিকিউর লগইন', text: 'রোল-ভিত্তিক অ্যাক্সেস, পাসওয়ার্ড সুরক্ষা ও OTP/সোশ্যাল লগইন।' },
  { icon: '🔔', title: 'SMS ও নোটিফিকেশন', text: 'অর্ডার, পেমেন্ট ও অ্যালার্টের স্বয়ংক্রিয় বার্তা।' },
  { icon: '🗂️', title: 'ক্লাউড স্প্রেডশিট', text: 'ব্রাউজারে স্প্রেডশিট, ক্লাউডে অটো সিঙ্ক।' },
];

const integrations = [
  'bKash',
  'Nagad',
  'Rocket',
  'Card Payment',
  'Cash on Delivery',
  'Courier API',
  'SMS Gateway',
  'Google Login',
  'Facebook Login',
];

const orderSteps = ['Pending', 'Processing', 'Packaging', 'Shipped', 'Delivered'];

const steps = [
  { n: '০১', title: 'প্রয়োজন বোঝা', text: 'আপনার ব্যবসার কাজের ধরন ও সমস্যাগুলো শুনি।' },
  { n: '০২', title: 'পরিকল্পনা ও ডিজাইন', text: 'ফিচার, সময় ও খরচের স্পষ্ট পরিকল্পনা দিই।' },
  { n: '০৩', title: 'ডেভেলপমেন্ট ও টেস্ট', text: 'ধাপে ধাপে তৈরি করি এবং প্রিভিউ দেখিয়ে মতামত নিই।' },
  { n: '০৪', title: 'লাইভ ও সাপোর্ট', text: 'চালু করার পর রক্ষণাবেক্ষণ ও টেকনিক্যাল সাপোর্ট।' },
];

const trust = [
  { icon: '🔒', title: 'নিরাপদ', text: 'HTTPS, এনক্রিপ্টেড ডেটা ও রোল-ভিত্তিক অ্যাক্সেস।' },
  { icon: '📱', title: 'রেসপন্সিভ', text: 'মোবাইল, ট্যাবলেট ও ডেস্কটপে সমান সুন্দর।' },
  { icon: '🔎', title: 'SEO-বান্ধব', text: 'দ্রুত লোড, সঠিক মেটাডেটা ও সার্চ ইঞ্জিনের উপযোগী কাঠামো।' },
  { icon: '📈', title: 'বড় হওয়ার সুযোগ', text: 'ব্যবসা বাড়লে নতুন ফিচার যোগ করা যায় সহজে।' },
];

const faqs = [
  {
    q: 'আপনারা কী ধরনের সফটওয়্যার তৈরি করেন?',
    a: 'ওয়েবসাইট, ই-কমার্স, ERP, ইনভেন্টরি, POS ও ক্লাউড অ্যাপ্লিকেশন। ব্যবসার প্রয়োজন অনুযায়ী কাস্টমাইজ করে দিই।',
  },
  {
    q: 'আমার ব্যবসার জন্য কি আলাদা করে সফটওয়্যার বানানো যাবে?',
    a: 'হ্যাঁ। আপনার কাজের ধাপ বুঝে ফিচার ঠিক করা হয়, তাই অপ্রয়োজনীয় কিছু বহন করতে হয় না।',
  },
  {
    q: 'বাংলাদেশের পেমেন্ট মাধ্যম কি যুক্ত করা যায়?',
    a: 'bKash, Nagad, Rocket, কার্ড ও ক্যাশ অন ডেলিভারি সহ প্রয়োজনীয় পেমেন্ট ও কুরিয়ার ইন্টিগ্রেশন যুক্ত করা যায়।',
  },
  {
    q: 'চালু হওয়ার পর কি সাপোর্ট পাবো?',
    a: 'হ্যাঁ। রক্ষণাবেক্ষণ, বাগ ফিক্স ও টেকনিক্যাল সহায়তা দিই।',
  },
  {
    q: 'কীভাবে শুরু করবো?',
    a: 'যোগাযোগ পেজে আপনার প্রয়োজন লিখে পাঠান। আমরা আলোচনা করে পরিকল্পনা ও সময় জানাবো।',
  },
];

const dashboardCards = [
  { label: 'মোট প্রোডাক্ট', value: '১২৮', icon: '📦' },
  { label: 'মোট স্টক', value: '৩,৪২০', icon: '🏬' },
  { label: 'আজকের অর্ডার', value: '২৬', icon: '🧾' },
  { label: 'মাসিক বিক্রি', value: '৳ ৪.২ লাখ', icon: '💰' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: COMPANY.description,
  email: CONTACT.email,
  telephone: CONTACT.whatsappDisplay,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CONTACT.address.village,
    addressLocality: CONTACT.address.thana,
    addressRegion: CONTACT.address.division,
    postalCode: CONTACT.address.postCode,
    addressCountry: 'BD',
  },
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-20 px-4 pb-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO BANNER */}
      <section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 py-12 text-white md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-14 sm:px-16 md:px-[88px] lg:px-24">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7 text-left">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur sm:text-sm">
                ⚡ ব্যবসার জন্য ওয়েব ও সফটওয়্যার সলিউশন
              </span>
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Smart Family <span className="text-blue-400">IT Solutions</span> World
              </h1>
              <p className="max-w-xl text-base text-slate-200 sm:text-lg">
                {COMPANY.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/products"
                  className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900 shadow-lg transition hover:scale-105 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  আমাদের সফটওয়্যার
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border border-white/60 px-6 py-3 font-bold transition hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  যোগাযোগ করুন
                </Link>
              </div>
              <ul className="flex flex-wrap gap-2 pt-2 text-xs font-bold sm:text-sm">
                {['রেসপন্সিভ ডিজাইন', 'SEO-বান্ধব', 'নিরাপদ ক্লাউড', 'বাংলা সাপোর্ট'].map((t) => (
                  <li key={t} className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                    ✓ {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-slate-300">Smart Family IT Dashboard</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-xs font-bold text-blue-200">কাস্টম সমাধান</p>
                    <p className="text-sm font-semibold">ERP, POS, ই-কমার্স ও অটোমেশন</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-xs font-bold text-green-200">সিস্টেম স্ট্যাটাস</p>
                    <p className="text-sm font-semibold">১০০% ক্লাউড সিঙ্ক এবং নিরাপদ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section aria-label="এক নজরে" className="-mt-10 relative z-10">
        <dl className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'কোর সার্ভিস', v: String(services.length) },
            { k: 'নিজস্ব প্রোডাক্ট', v: String(products.length) },
            { k: 'ইন্টারফেস', v: 'বাংলা + English' },
            { k: 'অ্যাক্সেস', v: 'যেকোনো ডিভাইস' },
          ].map((s) => (
            <div key={s.k} className="flex flex-col-reverse rounded-2xl bg-slate-50 p-5 text-center">
              <dt className="mt-1 text-sm font-bold text-slate-500">{s.k}</dt>
              <dd className="text-2xl font-black text-blue-600">{s.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* SERVICES */}
      <section aria-labelledby="services">
        <div className="mb-8">
          <h2 id="services" className="text-3xl font-black text-slate-900">
            আমাদের সার্ভিস
          </h2>
          <p className="mt-2 text-slate-600">ধারণা থেকে লাইভ করা পর্যন্ত প্রয়োজনীয় সবকিছু।</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <div className="mb-3 text-4xl" aria-hidden="true">{s.icon}</div>
              <h3 className="mb-1 font-bold text-slate-900 transition group-hover:text-blue-600">{s.title}</h3>
              <p className="text-sm text-slate-600">{s.text}</p>
              <span className="mt-4 inline-block text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                বিস্তারিত দেখুন →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section aria-labelledby="products">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="products" className="text-3xl font-black text-slate-900">
              আমাদের প্রোডাক্ট
            </h2>
            <p className="mt-2 text-slate-600">তৈরি ও ব্যবহারের জন্য প্রস্তুত সফটওয়্যার।</p>
          </div>
          <Link href="/products" className="font-bold text-blue-600 hover:underline">
            সব প্রোডাক্ট দেখুন →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group block rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-blue-600">{p.name}</h3>
              <p className="mt-2 text-slate-600">{p.tagline}</p>
              <span className="mt-4 inline-block text-sm font-bold text-slate-900 transition group-hover:translate-x-1">
                বিস্তারিত দেখুন →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section aria-labelledby="modules">
        <div className="mb-8">
          <h2 id="modules" className="text-3xl font-black text-slate-900">
            যা যা তৈরি করে দিই
          </h2>
          <p className="mt-2 text-slate-600">
            ERP, POS, ই-কমার্স ও অটোমেশন। আপনার প্রয়োজন অনুযায়ী যে মডিউল দরকার সেগুলো বেছে নিন।
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-3xl" aria-hidden="true">{m.icon}</div>
              <h3 className="mb-1 font-bold">{m.title}</h3>
              <p className="text-sm text-slate-600">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section aria-labelledby="dashboard" className="rounded-3xl bg-slate-900 p-6 text-white md:p-10 shadow-xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="dashboard" className="text-3xl font-black">
              ব্যবসার ড্যাশবোর্ড
            </h2>
            <p className="mt-2 max-w-xl text-slate-300">
              বিক্রি, স্টক ও অর্ডারের অবস্থা এক স্ক্রিনে। নিচেরটি একটি নমুনা চিত্র।
            </p>
          </div>
          <span className="rounded-full bg-amber-400/20 px-4 py-1.5 text-sm font-bold text-amber-300">
            নমুনা ডেটা
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardCards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400">{c.label}</p>
                  <p className="mt-1 text-2xl font-black">{c.value}</p>
                </div>
                <span className="text-4xl" aria-hidden="true">{c.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 font-bold">অর্ডার ট্র্যাকিং</p>
            <ol className="grid grid-cols-5 gap-2">
              {orderSteps.map((step, i) => (
                <li
                  key={step}
                  className={`rounded-xl p-2 text-center text-[11px] font-bold sm:text-xs ${
                    i <= 2 ? 'bg-green-600 text-white' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 font-bold">অ্যালার্ট</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between rounded-xl bg-red-500/15 px-4 py-2 text-red-200">
                <span>লো স্টক পণ্য</span>
                <b>৫টি</b>
              </li>
              <li className="flex justify-between rounded-xl bg-amber-500/15 px-4 py-2 text-amber-200">
                <span>পেন্ডিং অর্ডার</span>
                <b>৯টি</b>
              </li>
              <li className="flex justify-between rounded-xl bg-green-500/15 px-4 py-2 text-green-200">
                <span>ডেলিভারি সম্পন্ন (আজ)</span>
                <b>১৭টি</b>
              </li>
            </ul>
          </div>
        </div>

        {SHOW_ECOMMERCE_DEMO && (
          <div className="mt-8 text-center">
            <Link
              href="/apps/e-commerce"
              className="inline-block rounded-xl bg-white px-7 py-3 font-bold text-slate-900 transition hover:bg-slate-100"
            >
              ই-কমার্স ডেমো দেখুন
            </Link>
          </div>
        )}
      </section>

      {/* INTEGRATIONS */}
      <section aria-labelledby="integrations" className="text-center">
        <h2 id="integrations" className="text-3xl font-black text-slate-900">
          পেমেন্ট ও ইন্টিগ্রেশন
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-600">
          বাংলাদেশের জনপ্রিয় পেমেন্ট, কুরিয়ার ও লগইন মাধ্যম আপনার সফটওয়্যারে যুক্ত করা যায়।
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {integrations.map((i) => (
            <li
              key={i}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm"
            >
              {i}
            </li>
          ))}
        </ul>
      </section>

      {/* PROCESS */}
      <section aria-labelledby="process">
        <h2 id="process" className="mb-8 text-3xl font-black text-slate-900">
          আমরা যেভাবে কাজ করি
        </h2>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-3xl font-black text-blue-600">{s.n}</span>
              <h3 className="mt-2 font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* TRUST */}
      <section aria-labelledby="why">
        <h2 id="why" className="mb-8 text-3xl font-black text-slate-900">
          কেন Smart Family IT?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.title} className="rounded-2xl bg-slate-50 p-6">
              <div className="mb-3 text-3xl" aria-hidden="true">{t.icon}</div>
              <h3 className="mb-1 font-bold">{t.title}</h3>
              <p className="text-sm text-slate-600">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-3xl">
        <h2 id="faq" className="mb-6 text-3xl font-black text-slate-900">
          সচরাচর জিজ্ঞাসা
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-bold text-slate-900 marker:hidden">
                <span className="flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-blue-600 transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section
        aria-labelledby="cta"
        className="ml-[calc(50%-50vw)] w-screen bg-gradient-to-r from-blue-600 to-indigo-700 py-12 text-center text-white md:py-16"
      >
        <div className="mx-auto max-w-6xl px-14 sm:px-16 md:px-[88px] lg:px-24">
          <h2 id="cta" className="text-3xl font-black md:text-4xl">
            আপনার ব্যবসার সফটওয়্যার তৈরি করতে চান?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            আপনার প্রয়োজনটা জানান। আমরা পরিকল্পনা ও সময় জানিয়ে দেবো।
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              যোগাযোগ করুন
            </Link>
            <Link
              href="/products"
              className="rounded-xl border border-white/60 px-8 py-3.5 font-bold transition hover:bg-white hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              প্রোডাক্ট দেখুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}