// app/page.tsx
import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import { COMPANY, products } from '@/lib/products';
import { CONTACT } from '@/lib/contact';

/* =====================================================================
   CONSTANTS & HELPERS
   ===================================================================== */

const SITE_URL = 'https://smartfamilyitsolutionsworld.com';
const OG_IMAGE = `${SITE_URL}/logo.png`; // replace with a 1200x630 image (e.g. /og-image.jpg) when available

/** Escape "<" so JSON-LD can never break out of its <script> tag. */
const safeJson = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** Build a wa.me number (digits only, Bangladesh country code 880 when missing). */
const waDigits = (() => {
  const d = String(CONTACT.whatsappDisplay ?? '').replace(/\D/g, '');
  if (d.startsWith('880')) return d;
  if (d.startsWith('0')) return `88${d}`;
  return d;
})();
const WHATSAPP_URL = waDigits
  ? `https://wa.me/${waDigits}?text=${encodeURIComponent('Hello! I would like to discuss a software project.')}`
  : '/contact';

const FULL_ADDRESS = [
  CONTACT.address.village,
  CONTACT.address.thana,
  CONTACT.address.division,
  CONTACT.address.postCode,
]
  .filter(Boolean)
  .join(', ');

/* ---------- Full-screen / responsive layout helpers ----------
   FULL_BLEED  : makes a section span the whole screen width on every device,
                 even if the layout (SiteShell) wraps the page in a container.
   WRAP        : fluid inner container – grows with the screen (up to 1600px)
   HERO_MIN_H  : hero fills the whole visible screen. "svh" = real visible height
                 on mobile browsers (address bar aware). If your header is fixed/tall,
                 change to e.g. 'min-h-[calc(100svh-4rem)]'.                      */
const FULL_BLEED = 'relative w-screen ml-[calc(50%-50vw)]';
const WRAP = 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 2xl:px-16';
const HERO_MIN_H = 'min-h-[100svh]';

/** Shared hover / focus classes (respect "reduce motion"). */
const lift =
  'transition hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0';
const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';

/* =====================================================================
   SEO
   ===================================================================== */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} | Web, ERP & Cloud Software Solutions`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  keywords: [
    'software company Bangladesh',
    'ERP software',
    'POS software',
    'inventory management',
    'garments ERP',
    'e-commerce development',
    'web development Bangladesh',
    'digital marketing',
    'SEO',
    'Smart Family IT Solutions World',
  ],
  applicationName: COMPANY.name,
  authors: [{ name: 'H. M. Alim Uddin', url: SITE_URL }],
  creator: 'H. M. Alim Uddin',
  publisher: COMPANY.name,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: COMPANY.name,
    description: COMPANY.description,
    url: SITE_URL,
    siteName: COMPANY.name,
    type: 'website',
    locale: 'en_US',
    images: [{ url: OG_IMAGE, alt: `${COMPANY.name} logo` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: COMPANY.name,
    description: COMPANY.description,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060a3d',
};

/* =====================================================================
   CONTENT DATA
   ===================================================================== */

const services = [
  {
    icon: '🌐',
    title: 'Web & E-Commerce Dev',
    href: '/services/web-development',
    text: 'Custom web design, e-commerce and landing page solutions.',
  },
  {
    icon: '📦',
    title: 'ERP & Business Software',
    href: '/services/erp-software',
    text: 'Inventory, POS, garments ERP and ERP software.',
  },
  {
    icon: '📈',
    title: 'Digital Marketing & SEO',
    href: '/services/digital-marketing',
    text: 'Facebook Ads, local SEO and full digital marketing.',
  },
  {
    icon: '🎨',
    title: 'Design, Branding & IT',
    href: '/services/design-branding',
    text: 'Graphic design, video editing and IT consultancy.',
  },
] as const;

const industrySolutions = [
  { icon: '🛒', title: 'E-commerce Automation', text: 'A complete automated solution for growing e-commerce businesses.' },
  { icon: '🏷️', title: 'Personal Branding', text: 'A means of personal branding and increasing online presence.' },
  { icon: '🏥', title: 'Healthcare IT', text: 'Modern software for hospital and clinic management.' },
  { icon: '🏪', title: 'Retail & Restaurant POS', text: 'Easy POS and billing systems for shops and restaurants.' },
  { icon: '📦', title: 'B2B & Export Global SEO', text: 'Business promotion in international markets and global SEO.' },
  { icon: '👔', title: 'Garments ERP', text: 'Specialized software for production and stock management in the apparel industry.' },
  { icon: '🏢', title: 'Real Estate CRM', text: 'Customer and lead management for real estate companies.' },
  { icon: '✈️', title: 'Travel Tourism', text: 'Booking and management systems for tour and travel agencies.' },
] as const;

const modules = [
  { icon: '📦', title: 'Inventory Management', text: 'Stock records, low-stock alerts and product information in one place.' },
  { icon: '🧾', title: 'POS & Invoices', text: 'In-store sales, memos, and invoice printing or downloading.' },
  { icon: '📊', title: 'Accounting', text: 'Easily view income, expenses, receivables, payables and reports.' },
  { icon: '👥', title: 'HRM & Payroll', text: 'Employee information, attendance and salary records.' },
  { icon: '🏬', title: 'Warehouse', text: 'Stock tracking across multiple warehouses or branches.' },
  { icon: '🛍️', title: 'E-commerce Store', text: 'An online shop with cart, wishlist, coupons and checkout.' },
  { icon: '🤖', title: 'AI Automation', text: 'Smart chatbot and AI automation solutions.' },
  { icon: '📈', title: 'Analytics', text: 'Simple dashboards based on sales, stock and customer data.' },
] as const;

/* Links to pages that already exist in /app */
const explore = [
  { icon: '🛍️', title: 'Marketplace', href: '/marketplace', text: 'Browse ready-made products and digital goods.' },
  { icon: '🏪', title: 'E-commerce App', href: '/apps/e-commerce', text: 'Launch your own online store.' },
  { icon: '📊', title: 'Online Spreadsheet', href: '/apps/spreadsheet', text: 'Work with spreadsheets right in your browser.' },
  { icon: '🎁', title: 'Packages', href: '/packages', text: 'Compare plans and pick what fits your business.' },
  { icon: '✨', title: 'Features', href: '/features', text: 'Explore everything our software can do.' },
  { icon: '💼', title: 'Portfolio', href: '/portfolio', text: 'See projects we have delivered.' },
  { icon: '📰', title: 'Blog', href: '/blog', text: 'Tips, guides and updates from our team.' },
  { icon: '📦', title: 'Track Order', href: '/track-order', text: 'Check the status of your order.' },
  { icon: '🧑‍💻', title: 'Our Team', href: '/team', text: 'Meet the people behind your software.' },
] as const;

const steps = [
  { n: '01', title: 'Understanding Requirements', text: 'We listen to your business workflow and challenges.' },
  { n: '02', title: 'Planning & Design', text: 'We provide a clear plan covering features, timeline and cost.' },
  { n: '03', title: 'Development & Testing', text: 'We build it step by step and share previews for your feedback.' },
  { n: '04', title: 'Launch & Support', text: 'After launch, we provide maintenance and technical support.' },
] as const;

const trust = [
  { icon: '🔒', title: 'Secure', text: 'HTTPS, encrypted data and role-based access.' },
  { icon: '📱', title: 'Responsive', text: 'Looks equally great on mobile, tablet and desktop.' },
  { icon: '🔎', title: 'SEO-Friendly', text: 'Fast loading, proper metadata and search-engine-friendly structure.' },
  { icon: '📈', title: 'Scalable', text: 'New features can be added easily as your business grows.' },
] as const;

const techStack = [
  'Next.js',
  'React',
  'TypeScript',
  'Node.js',
  'MongoDB',
  'Tailwind CSS',
  'REST APIs',
  'Cloud Hosting',
] as const;

const integrations = [
  { icon: '📲', name: 'bKash' },
  { icon: '📲', name: 'Nagad' },
  { icon: '📲', name: 'Rocket' },
  { icon: '💳', name: 'Debit & Credit Cards' },
  { icon: '💵', name: 'Cash on Delivery' },
  { icon: '🚚', name: 'Courier Services' },
] as const;

const faqs = [
  {
    q: 'What types of software do you build?',
    a: 'Websites, e-commerce, ERP, inventory, POS and cloud applications. We customize them according to your business needs.',
  },
  {
    q: 'Can software be built specifically for my business?',
    a: 'Yes. Features are defined after understanding your workflow, so you do not have to carry unnecessary functionality.',
  },
  {
    q: 'Can Bangladeshi payment methods be integrated?',
    a: 'Yes. Required payment and courier integrations can be added, including bKash, Nagad, Rocket, cards and cash on delivery.',
  },
  {
    q: 'Will I receive support after launch?',
    a: 'Yes. We provide maintenance, bug fixes and technical assistance.',
  },
  {
    q: 'How can I get started?',
    a: 'Send your requirements through the contact page. We will discuss them and share a plan and timeline.',
  },
] as const;

/* Image setting: If you provide a background-removed (transparent) PNG, set HAS_CUTOUT = true */
const HERO_PHOTO = '/images/alim-uddin.jpg';
const HAS_CUTOUT = false;

/* The 4 feature cards on the right side of the banner */
const heroFeatures = [
  {
    icon: '☁️',
    line1: 'Cloud Based',
    line2: 'Solutions',
    card: 'from-sky-500/90 via-blue-700/90 to-indigo-900/90 border-sky-300/50',
    iconBg: 'bg-sky-400/30',
  },
  {
    icon: '✅',
    line1: 'SEO Optimized',
    line2: '& Secure',
    card: 'from-fuchsia-500/90 via-pink-600/90 to-purple-800/90 border-pink-300/50',
    iconBg: 'bg-emerald-400/25',
  },
  {
    icon: '⚡',
    line1: 'Fast & Reliable',
    line2: '',
    card: 'from-emerald-600/90 via-green-700/90 to-green-950/90 border-emerald-300/50',
    iconBg: 'bg-yellow-300/20',
  },
  {
    icon: '24/7',
    line1: '24/7 Support',
    line2: '',
    card: 'from-amber-400/90 via-yellow-500/90 to-orange-600/90 border-yellow-200/60',
    iconBg: 'bg-blue-700/80',
  },
] as const;

/* Stats bar below the banner */
const heroStats = [
  { icon: '🤝', value: '105+', label: 'Active Clients' },
  { icon: '✔️', value: '10+', label: 'Projects Done' },
  { icon: '👥', value: '15+', label: 'Team Advisors' },
  { icon: '🏆', value: '2+', label: 'Glorious Years' },
] as const;

/* =====================================================================
   STRUCTURED DATA (JSON-LD)
   ===================================================================== */

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: COMPANY.name,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: COMPANY.description,
      email: CONTACT.email,
      telephone: CONTACT.whatsappDisplay,
      founder: {
        '@type': 'Person',
        name: 'H. M. Alim Uddin',
        jobTitle: 'Founder & CEO',
      },
      areaServed: 'BD',
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT.address.village,
        addressLocality: CONTACT.address.thana,
        addressRegion: CONTACT.address.division,
        postalCode: CONTACT.address.postCode,
        addressCountry: 'BD',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT.email,
        telephone: CONTACT.whatsappDisplay,
        availableLanguage: ['en', 'bn'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: COMPANY.name,
      description: COMPANY.description,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en',
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE_URL}/#services`,
      name: 'Our Services',
      itemListElement: services.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: s.title,
          description: s.text,
          url: `${SITE_URL}${s.href}`,
          provider: { '@id': `${SITE_URL}/#organization` },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

/* =====================================================================
   PAGE
   ===================================================================== */

export default function HomePage() {
  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }}
      />

      {/* ================= HERO BANNER (full screen on every device) ================= */}
      <section
        aria-label="Smart Family IT Solutions World"
        className={`${FULL_BLEED} ${HERO_MIN_H} flex items-center overflow-hidden bg-[#060a3d] py-10 text-white md:py-14`}
      >
        {/* Background: dark blue + magenta and gold glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(59,91,255,0.35),transparent_60%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-0 h-full w-72 rounded-full bg-fuchsia-600/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-0 h-full w-72 rounded-full bg-pink-500/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-2/3 rotate-[-6deg] rounded-full bg-gradient-to-r from-amber-400/60 via-yellow-300/30 to-transparent blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-16 right-0 h-32 w-1/2 rotate-[4deg] rounded-full bg-gradient-to-l from-amber-400/50 to-transparent blur-2xl" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 2xl:px-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* ---------- Left side: text ---------- */}
            <div className="space-y-4 text-left lg:col-span-5">
              {/* Software Architect pill */}
              <div className="flex items-center gap-2">
                <span className="text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" aria-hidden="true">👑</span>
                <span className="rounded-full border-2 border-pink-300/70 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 px-5 py-1.5 text-base font-extrabold shadow-[0_0_20px_rgba(236,72,153,0.7)] sm:px-6 sm:text-2xl">
                  Software Architect
                </span>
              </div>

              {/* Name (metallic silver) – a <p> so the page has a single, correct <h1> */}
              <p className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-black uppercase leading-none tracking-tight text-transparent drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-6xl 2xl:text-7xl">
                H. M. Alim Uddin
              </p>

              {/* Founder & CEO gold pill */}
              <div className="inline-flex items-center gap-3 rounded-full border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 px-5 py-1.5 text-lg font-extrabold text-slate-900 shadow-[0_0_22px_rgba(251,191,36,0.7)] sm:px-6 sm:text-2xl">
                <span aria-hidden="true">👑</span>
                Founder &amp; CEO
                <span aria-hidden="true">👑</span>
              </div>

              {/* Company name (H1 for SEO) */}
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl xl:text-[2.6rem] 2xl:text-5xl">
                Smart Family <span className="text-yellow-300">IT Solutions</span> World
              </h1>

              <p className="max-w-md text-sm italic text-slate-100 sm:text-base 2xl:max-w-lg 2xl:text-lg">
                {COMPANY.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 to-amber-500 px-6 py-3 font-extrabold text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.6)] transition hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span aria-hidden="true">🚀</span> Start Now <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-purple-300/70 bg-gradient-to-b from-purple-600 to-indigo-800 px-6 py-3 font-extrabold shadow-[0_0_20px_rgba(147,51,234,0.6)] transition hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span aria-hidden="true">🎧</span> Contact Us
                </Link>
              </div>
            </div>

            {/* ---------- Middle: globe + server + your image ---------- */}
            <div className="relative min-h-[430px] lg:col-span-7 lg:min-h-[600px] lg:self-stretch 2xl:min-h-[700px]">
              {/* Globe */}
              <div
                className="pointer-events-none absolute left-[45%] top-[46%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/30 bg-[radial-gradient(circle_at_35%_30%,rgba(120,160,255,0.55),rgba(60,40,160,0.55)_55%,rgba(20,10,80,0.2)_100%)] shadow-[0_0_80px_rgba(80,110,255,0.6)] sm:h-[380px] sm:w-[380px] lg:left-[42%] lg:h-[460px] lg:w-[460px] 2xl:h-[540px] 2xl:w-[540px]"
                aria-hidden="true"
              />

              {/* Cloud + arrows */}
              <svg
                className="absolute left-[10%] top-[24%] h-24 w-24 drop-shadow-[0_0_14px_rgba(125,211,252,0.95)] sm:h-28 sm:w-28 lg:left-[6%] lg:h-32 lg:w-32"
                viewBox="0 0 100 80"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M28 62h46a16 16 0 0 0 2-31.9A22 22 0 0 0 33 26a18 18 0 0 0-5 36Z"
                  stroke="#7dd3fc"
                  strokeWidth="4"
                  fill="rgba(30,64,175,0.35)"
                />
                <path d="M42 54V30m0 0-7 8m7-8 7 8" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M60 28v24m0 0-7-8m7 8 7-8" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Server rack */}
              <div className="absolute bottom-14 left-0 flex items-end gap-1.5 lg:bottom-16" aria-hidden="true">
                {[70, 100, 130, 165].map((h) => (
                  <div
                    key={h}
                    style={{ height: h }}
                    className="w-10 rounded-sm border border-blue-300/50 bg-gradient-to-b from-slate-700 to-slate-950 p-1 shadow-[0_0_16px_rgba(96,165,250,0.7)] sm:w-12 lg:w-14"
                  >
                    <div className="h-full w-full bg-[repeating-linear-gradient(0deg,rgba(96,165,250,0.9)_0_2px,transparent_2px_7px)] opacity-80" />
                  </div>
                ))}
              </div>

              {/* Golden wave */}
              <div className="pointer-events-none absolute bottom-24 left-0 h-3 w-full rotate-[-8deg] rounded-full bg-gradient-to-r from-transparent via-amber-300 to-transparent blur-sm" aria-hidden="true" />

              {/* Your image: public/images/alim-uddin.jpg (next/image: priority + responsive sizes) */}
              <Image
                src={HERO_PHOTO}
                alt="H. M. Alim Uddin, Founder and CEO of Smart Family IT Solutions World"
                width={720}
                height={960}
                priority
                sizes="(min-width: 1536px) 520px, (min-width: 1024px) 480px, 90vw"
                className={`absolute bottom-0 right-1/2 z-10 h-[400px] w-auto max-w-none translate-x-1/2 object-contain object-bottom sm:h-[460px] lg:right-44 lg:h-[640px] lg:translate-x-0 2xl:right-56 2xl:h-[720px] ${
                  HAS_CUTOUT
                    ? 'drop-shadow-[0_0_30px_rgba(99,102,241,0.7)]'
                    : 'rounded-t-[2.5rem] shadow-[0_0_45px_rgba(99,102,241,0.8)] ring-2 ring-blue-300/60'
                }`}
              />
            </div>

            {/* ---------- Right side: feature cards ---------- */}
            <ul className="grid gap-2 sm:grid-cols-2 lg:absolute lg:right-0 lg:top-0 lg:z-20 lg:w-52 lg:grid-cols-1 2xl:w-56">
              {heroFeatures.map((f) => (
                <li
                  key={f.line1}
                  className={`flex items-center gap-2 rounded-xl border bg-gradient-to-r px-3 py-2 shadow-lg backdrop-blur ${f.card}`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                      f.icon === '24/7' ? 'border-2 border-yellow-300 text-white' : 'text-lg'
                    } ${f.iconBg}`}
                    aria-hidden="true"
                  >
                    {f.icon}
                  </span>
                  <span className="text-xs font-extrabold leading-tight sm:text-sm">
                    <span className="block">{f.line1}</span>
                    {f.line2 && <span className="block text-yellow-300">{f.line2}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Bottom stats bar ---------- */}
          <ul
            aria-label="Company statistics"
            className="relative z-20 -mt-8 grid grid-cols-2 gap-4 rounded-3xl border border-white/25 bg-slate-950/80 px-4 py-4 shadow-[0_0_30px_rgba(99,102,241,0.5)] backdrop-blur sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-yellow-400/40"
          >
            {heroStats.map((s) => (
              <li key={s.label} className="flex items-center justify-center gap-3 lg:px-4">
                <span className="text-3xl sm:text-4xl" aria-hidden="true">{s.icon}</span>
                <div className="leading-tight">
                  <p className="text-2xl font-extrabold sm:text-3xl">{s.value}</p>
                  <p className="text-xs font-semibold text-slate-200 sm:text-sm">{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= MAIN CONTENT (full width, fluid container) ================= */}
      <div className={FULL_BLEED}>
        <div className={`${WRAP} space-y-20 pb-16 pt-16 md:pt-20`}>
          {/* LEAD CALCULATOR */}
          <section aria-labelledby="need" className="rounded-3xl bg-slate-50 px-4 py-10 md:py-14">
            <div className="mx-auto max-w-xl text-center">
              <h2 id="need" className="text-3xl font-black text-slate-900">
                Tell Us Your Requirements
              </h2>
              <p className="mt-2 text-slate-600">
                Choose your goal and required services in three simple steps. We will understand your needs and share a plan.
              </p>
            </div>
            <Calculator />
          </section>

          {/* SERVICES */}
          <section aria-labelledby="services">
            <div className="mb-8">
              <h2 id="services" className="text-3xl font-black text-slate-900">
                Our Services
              </h2>
              <p className="mt-2 text-slate-600">Everything you need, from concept to launch.</p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {services.map((s) => (
                <li key={s.title}>
                  <Link
                    href={s.href}
                    className={`group block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${lift} ${focusRing}`}
                  >
                    <div className="mb-3 text-4xl" aria-hidden="true">{s.icon}</div>
                    <h3 className="mb-1 font-bold text-slate-900 transition group-hover:text-blue-600">{s.title}</h3>
                    <p className="text-sm text-slate-600">{s.text}</p>
                    <span className="mt-4 inline-block text-sm font-bold text-blue-600 transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                      View Details <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* INDUSTRY SOLUTIONS */}
          <section aria-labelledby="industries">
            <div className="mb-8">
              <h2 id="industries" className="text-3xl font-black text-slate-900">
                Industry Solutions
              </h2>
              <p className="mt-2 text-slate-600">Specific and customized software services for businesses across different industries.</p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {industrySolutions.map((ind) => (
                <li
                  key={ind.title}
                  className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${lift}`}
                >
                  <div className="mb-3 text-3xl" aria-hidden="true">{ind.icon}</div>
                  <h3 className="mb-1 font-bold text-slate-900">{ind.title}</h3>
                  <p className="text-sm text-slate-600">{ind.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* PRODUCTS */}
          {products.length > 0 && (
            <section aria-labelledby="products">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="products" className="text-3xl font-black text-slate-900">
                    Our Products
                  </h2>
                  <p className="mt-2 text-slate-600">Ready-to-use software solutions.</p>
                </div>
                <Link href="/products" className={`font-bold text-blue-600 hover:underline ${focusRing}`}>
                  View All Products <span aria-hidden="true">→</span>
                </Link>
              </div>
              <ul className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.slug}`}
                      className={`group block h-full rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg motion-reduce:transition-none ${focusRing}`}
                    >
                      <h3 className="text-xl font-bold text-blue-600">{p.name}</h3>
                      <p className="mt-2 text-slate-600">{p.tagline}</p>
                      <span className="mt-4 inline-block text-sm font-bold text-slate-900 transition group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                        View Details <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* MODULES */}
          <section aria-labelledby="modules">
            <div className="mb-8">
              <h2 id="modules" className="text-3xl font-black text-slate-900">
                What We Build
              </h2>
              <p className="mt-2 text-slate-600">
                ERP, POS, e-commerce and automation. Choose the modules you need according to your requirements.
              </p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {modules.map((m) => (
                <li
                  key={m.title}
                  className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${lift}`}
                >
                  <div className="mb-3 text-3xl" aria-hidden="true">{m.icon}</div>
                  <h3 className="mb-1 font-bold text-slate-900">{m.title}</h3>
                  <p className="text-sm text-slate-600">{m.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* EXPLORE MORE – links to existing pages */}
          <section aria-labelledby="explore">
            <div className="mb-8">
              <h2 id="explore" className="text-3xl font-black text-slate-900">
                Explore More
              </h2>
              <p className="mt-2 text-slate-600">Apps, plans, work samples and tools in one place.</p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {explore.map((e) => (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    className={`group flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${lift} ${focusRing}`}
                  >
                    <span className="text-3xl" aria-hidden="true">{e.icon}</span>
                    <span>
                      <span className="block font-bold text-slate-900 transition group-hover:text-blue-600">{e.title}</span>
                      <span className="mt-1 block text-sm text-slate-600">{e.text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* PROCESS */}
          <section aria-labelledby="process">
            <h2 id="process" className="mb-8 text-3xl font-black text-slate-900">
              How We Work
            </h2>
            <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((s) => (
                <li key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="text-3xl font-black text-blue-600" aria-hidden="true">{s.n}</span>
                  <h3 className="mt-2 font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* TECHNOLOGY & INTEGRATIONS */}
          <section aria-label="Technology and integrations" className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 id="tech" className="text-3xl font-black text-slate-900">
                Technology We Use
              </h2>
              <p className="mt-2 text-slate-600">Modern, proven tools for fast and maintainable software.</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-labelledby="tech">
                {techStack.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 id="integrations" className="text-3xl font-black text-slate-900">
                Payments &amp; Courier Integrations
              </h2>
              <p className="mt-2 text-slate-600">Local payment and delivery options your customers already use.</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-labelledby="integrations">
                {integrations.map((i) => (
                  <li
                    key={i.name}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
                  >
                    <span aria-hidden="true">{i.icon}</span>
                    {i.name}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* TRUST */}
          <section aria-labelledby="why">
            <h2 id="why" className="mb-8 text-3xl font-black text-slate-900">
              Why Smart Family IT?
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {trust.map((t) => (
                <li key={t.title} className="rounded-2xl bg-slate-50 p-6">
                  <div className="mb-3 text-3xl" aria-hidden="true">{t.icon}</div>
                  <h3 className="mb-1 font-bold text-slate-900">{t.title}</h3>
                  <p className="text-sm text-slate-600">{t.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mx-auto max-w-3xl 2xl:max-w-4xl">
            <h2 id="faq" className="mb-6 text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <summary className="cursor-pointer list-none rounded-md font-bold text-slate-900 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span
                        className="text-blue-600 transition group-open:rotate-45 motion-reduce:transition-none"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CONTACT QUICK LINKS */}
          <section aria-labelledby="reach">
            <h2 id="reach" className="mb-8 text-3xl font-black text-slate-900">
              Get in Touch
            </h2>
            <ul className="grid gap-5 md:grid-cols-3">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${lift} ${focusRing}`}
                >
                  <div className="mb-2 text-3xl" aria-hidden="true">💬</div>
                  <h3 className="font-bold text-slate-900">WhatsApp</h3>
                  <p className="mt-1 text-sm text-slate-600">{CONTACT.whatsappDisplay}</p>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={`block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${lift} ${focusRing}`}
                >
                  <div className="mb-2 text-3xl" aria-hidden="true">✉️</div>
                  <h3 className="font-bold text-slate-900">Email</h3>
                  <p className="mt-1 break-all text-sm text-slate-600">{CONTACT.email}</p>
                </a>
              </li>
              <li>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-2 text-3xl" aria-hidden="true">📍</div>
                  <h3 className="font-bold text-slate-900">Office</h3>
                  <address className="mt-1 text-sm not-italic text-slate-600">{FULL_ADDRESS}</address>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section
        aria-labelledby="cta"
        className={`${FULL_BLEED} bg-gradient-to-r from-blue-600 to-indigo-700 py-12 text-center text-white md:py-16`}
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
          <h2 id="cta" className="text-3xl font-black md:text-4xl">
            Want to build software for your business?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            Tell us your requirements. We will share a plan and timeline.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="rounded-xl border border-white/60 px-8 py-3.5 font-bold transition hover:bg-white hover:text-blue-700 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FLOATING WHATSAPP BUTTON =================
          Placed on the LEFT so it does not overlap components/FloatingChat.tsx (usually right side).
          If FloatingChat already offers WhatsApp, delete this whole <a> block. */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp (opens in a new tab)"
        className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true" focusable="false">
          <path d="M16.002 3C9.373 3 4 8.373 4 15c0 2.385.697 4.607 1.894 6.48L4 29l7.7-1.857A11.94 11.94 0 0 0 16.002 27C22.63 27 28 21.627 28 15S22.63 3 16.002 3Zm0 21.8c-1.86 0-3.59-.54-5.05-1.47l-.36-.22-4.57 1.1 1.14-4.45-.24-.38A9.76 9.76 0 0 1 6.2 15c0-5.42 4.38-9.8 9.8-9.8 5.42 0 9.8 4.38 9.8 9.8 0 5.41-4.38 9.8-9.8 9.8Zm5.4-7.34c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </div>
  );
}