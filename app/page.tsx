// app/page.tsx
import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import ShareButton from '@/components/ShareButton';
import { COMPANY, products } from '@/lib/products';
import { CONTACT } from '@/lib/contact';
import FAQSection from "@/components/FaqSection";

/* =====================================================================
   CONSTANTS & HELPERS
   ===================================================================== */

const SITE_URL = 'https://smartfamilyitsolutionsworld.com';
const OG_IMAGE = `${SITE_URL}/logo.png`; // replace with a 1200x630 image when available

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

const FULL_BLEED = 'relative w-screen ml-[calc(50%-50vw)]';
const WRAP = 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 2xl:px-16';
const HERO_MIN_H = 'min-h-[100svh]';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400';

/* ---------- VIP THEME (shared by every card) ---------- */

/** Dark royal-navy card with a gold border and soft gold glow. */
const vipCard =
  'relative overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-b from-[#0b1150] via-[#080d4a] to-[#060a3d] shadow-[0_0_22px_rgba(251,191,36,0.18)]';

/** Hover: lift + stronger gold glow. */
const vipLift =
  'transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

/** Gold round icon badge. */
const vipIcon =
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-100/70 bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 text-2xl shadow-[0_0_14px_rgba(251,191,36,0.55)]';

const vipTitle = 'font-bold text-amber-300';
const vipText = 'text-sm text-slate-200';

/** Thin glowing gold line along the top edge of a card. */
function VipShine() {
  return (
    <span
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
      aria-hidden="true"
    />
  );
}

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

/* ---------- TECHNOLOGY STACK (grouped) ---------- */

type TechItem = { icon: string; name: string; desc: string };
type TechGroup = { icon: string; title: string; text: string; items: TechItem[] };

const techGroups: TechGroup[] = [
  {
    icon: '🖥️',
    title: 'Frontend',
    text: 'Fast, responsive and SEO-friendly user interfaces.',
    items: [
      { icon: '▲', name: 'Next.js', desc: 'Server rendering, routing and SEO' },
      { icon: '⚛️', name: 'React', desc: 'Reusable, component-driven UI' },
      { icon: '🔷', name: 'TypeScript', desc: 'Type-safe code with fewer bugs' },
      { icon: '🎨', name: 'Tailwind CSS', desc: 'Consistent, modern styling' },
    ],
  },
  {
    icon: '⚙️',
    title: 'Backend',
    text: 'Reliable business logic and clean integrations.',
    items: [
      { icon: '🟢', name: 'Node.js', desc: 'Scalable server runtime' },
      { icon: '🔌', name: 'REST APIs', desc: 'Standard, easy-to-connect endpoints' },
    ],
  },
  {
    icon: '🗄️',
    title: 'Database',
    text: 'Flexible and fast data storage.',
    items: [{ icon: '🍃', name: 'MongoDB', desc: 'Flexible document database' }],
  },
  {
    icon: '☁️',
    title: 'Cloud',
    text: 'Always-on, scalable deployment.',
    items: [{ icon: '🚀', name: 'Cloud Hosting', desc: 'Secure and scalable hosting' }],
  },
];

const techItems: TechItem[] = techGroups.flatMap((g) => g.items);

/** Scoped CSS for the technology marquee (pause on hover, off for reduced motion). */
const techMarqueeCss = `
@keyframes tech-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.tech-marquee { overflow: hidden; }
.tech-marquee-track { display: flex; width: max-content; animation: tech-scroll 34s linear infinite; }
.tech-marquee:hover .tech-marquee-track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .tech-marquee { overflow-x: auto; }
  .tech-marquee-track { animation: none; }
  .tech-marquee-dup { display: none; }
}
`;

/** Bottom VIP strip: all payment and courier methods. */
const payMethods = [
  { icon: '📲', name: 'bKash', color: 'text-pink-600' },
  { icon: '📲', name: 'Nagad', color: 'text-orange-600' },
  { icon: '📲', name: 'Rocket', color: 'text-purple-700' },
  { icon: '💳', name: 'Debit & Credit Cards', color: 'text-blue-800' },
  { icon: '💵', name: 'Cash on Delivery', color: 'text-emerald-700' },
  { icon: '🚚', name: 'Courier Services', color: 'text-amber-700' },
  { icon: '🔐', name: 'Selfin', color: 'text-indigo-700' },
  { icon: '🏦', name: 'Bank Transfer', color: 'text-slate-800' },
] as const;

const promises = [
  { icon: '✔', label: 'Premium Quality' },
  { icon: '🤝', label: 'Trusted Brand' },
  { icon: '↻', label: 'Easy Return' },
  { icon: '★', label: 'Best Price' },
] as const;

const HERO_PHOTO = '/images/alim-uddin.jpg';
const HAS_CUTOUT = false;

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

      {/* ================= HERO BANNER ================= */}
      <section
        aria-label="Smart Family IT Solutions World"
        className={`${FULL_BLEED} ${HERO_MIN_H} flex items-center overflow-hidden bg-[#060a3d] py-10 text-white md:py-14`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(59,91,255,0.35),transparent_60%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-24 top-0 h-full w-72 rounded-full bg-fuchsia-600/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-0 h-full w-72 rounded-full bg-pink-500/40 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 2xl:px-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 text-left lg:col-span-5">
              <div className="flex items-center gap-2">
                <span className="text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" aria-hidden="true">👑</span>
                <span className="rounded-full border-2 border-pink-300/70 bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 px-5 py-1.5 text-base font-extrabold shadow-[0_0_20px_rgba(236,72,153,0.7)] sm:px-6 sm:text-2xl">
                  Software Architect
                </span>
              </div>

              <p className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-black uppercase leading-none tracking-tight text-transparent drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-6xl 2xl:text-7xl">
                H. M. Alim Uddin
              </p>

              <div className="inline-flex items-center gap-3 rounded-full border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 px-5 py-1.5 text-lg font-extrabold text-slate-900 shadow-[0_0_22px_rgba(251,191,36,0.7)] sm:px-6 sm:text-2xl">
                <span aria-hidden="true">👑</span>
                Founder &amp; CEO
                <span aria-hidden="true">👑</span>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl xl:text-[2.6rem] 2xl:text-5xl">
                Smart Family <span className="text-yellow-300">IT Solutions</span> World
              </h1>

              <p className="max-w-md text-sm italic text-slate-100 sm:text-base 2xl:max-w-lg 2xl:text-lg">
                {COMPANY.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="#requirements"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 to-amber-500 px-6 py-3 font-extrabold text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.6)] transition hover:scale-105"
                >
                  <span aria-hidden="true">🚀</span> Start Now <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-purple-300/70 bg-gradient-to-b from-purple-600 to-indigo-800 px-6 py-3 font-extrabold shadow-[0_0_20px_rgba(147,51,234,0.6)] transition hover:scale-105"
                >
                  <span aria-hidden="true">🎧</span> Contact Us
                </Link>
              </div>
            </div>

            <div className="relative min-h-[430px] lg:col-span-7 lg:min-h-[600px] lg:self-stretch 2xl:min-h-[700px]">
              <div
                className="pointer-events-none absolute left-[45%] top-[46%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-300/30 bg-[radial-gradient(circle_at_35%_30%,rgba(120,160,255,0.55),rgba(60,40,160,0.55)_55%,rgba(20,10,80,0.2)_100%)] shadow-[0_0_80px_rgba(80,110,255,0.6)] sm:h-[380px] sm:w-[380px] lg:left-[42%] lg:h-[460px] lg:w-[460px] 2xl:h-[540px] 2xl:w-[540px]"
                aria-hidden="true"
              />

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

          <ul
            aria-label="Company statistics"
            className="relative z-20 -mt-8 grid grid-cols-2 gap-4 rounded-3xl border-2 border-amber-300/60 bg-slate-950/80 px-4 py-4 shadow-[0_0_30px_rgba(251,191,36,0.35)] backdrop-blur sm:px-8 lg:grid-cols-4 lg:divide-x lg:divide-yellow-400/40"
          >
            {heroStats.map((s) => (
              <li key={s.label} className="flex items-center justify-center gap-3 lg:px-4">
                <span className="text-3xl sm:text-4xl" aria-hidden="true">{s.icon}</span>
                <div className="leading-tight">
                  <p className="bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-600 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">{s.value}</p>
                  <p className="text-xs font-semibold text-slate-200 sm:text-sm">{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className={FULL_BLEED}>
        <div className={`${WRAP} space-y-20 pb-16 pt-16 md:pt-20`}>

          {/* LEAD CALCULATOR */}
          <section id="requirements" aria-labelledby="need" className="rounded-3xl bg-slate-50 px-4 py-10 md:py-14">
            <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 p-8 text-center shadow-[0_0_40px_rgba(244,63,94,0.3)] sm:p-12 mb-10">
              <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" aria-hidden="true" />

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-400/50 bg-pink-500/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-pink-300 shadow-sm">
                <span aria-hidden="true">👑</span>
                <span>Smart Family IT Solutions World</span>
              </div>

              <h2 id="need" className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
                Tell Us Your Requirements
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-200 sm:text-xl">
                Choose your goal and required services in three simple steps. We will understand your needs and share a plan.
              </p>

              <div className="mx-auto mt-6 h-1.5 w-32 rounded-full bg-gradient-to-r from-amber-300 via-pink-500 to-amber-300" aria-hidden="true" />
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
                    className={`group block h-full p-6 ${vipCard} ${vipLift} ${focusRing}`}
                  >
                    <VipShine />
                    <div className={`mb-4 ${vipIcon}`} aria-hidden="true">{s.icon}</div>
                    <h3 className={`mb-1 ${vipTitle}`}>{s.title}</h3>
                    <p className={vipText}>{s.text}</p>
                    <span className="mt-4 inline-block text-sm font-bold text-yellow-200 transition group-hover:translate-x-1 group-hover:text-amber-300">
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
                  className={`p-6 ${vipCard} ${vipLift}`}
                >
                  <VipShine />
                  <div className={`mb-4 ${vipIcon}`} aria-hidden="true">{ind.icon}</div>
                  <h3 className={`mb-1 ${vipTitle}`}>{ind.title}</h3>
                  <p className={vipText}>{ind.text}</p>
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
                      className={`group block h-full p-7 ${vipCard} ${vipLift} ${focusRing}`}
                    >
                      <VipShine />
                      <h3 className="bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 bg-clip-text text-xl font-extrabold text-transparent">
                        {p.name}
                      </h3>
                      <p className="mt-2 text-slate-200">{p.tagline}</p>
                      <span className="mt-4 inline-block text-sm font-bold text-yellow-200 transition group-hover:translate-x-1 group-hover:text-amber-300">
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
                  className={`p-6 ${vipCard} ${vipLift}`}
                >
                  <VipShine />
                  <div className={`mb-4 ${vipIcon}`} aria-hidden="true">{m.icon}</div>
                  <h3 className={`mb-1 ${vipTitle}`}>{m.title}</h3>
                  <p className={vipText}>{m.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* EXPLORE MORE */}
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
                    className={`group flex h-full items-start gap-4 p-5 ${vipCard} ${vipLift} ${focusRing}`}
                  >
                    <VipShine />
                    <span className={vipIcon} aria-hidden="true">{e.icon}</span>
                    <span>
                      <span className="block font-bold text-amber-300 transition group-hover:text-yellow-100">{e.title}</span>
                      <span className="mt-1 block text-sm text-slate-200">{e.text}</span>
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
                <li key={s.n} className={`p-6 ${vipCard} ${vipLift}`}>
                  <VipShine />
                  <span
                    className="bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-600 bg-clip-text text-4xl font-black text-transparent"
                    aria-hidden="true"
                  >
                    {s.n}
                  </span>
                  <h3 className={`mt-2 ${vipTitle}`}>{s.title}</h3>
                  <p className={`mt-1 ${vipText}`}>{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* TECHNOLOGY (ADVANCED) */}
          <section aria-labelledby="tech">
            <style>{techMarqueeCss}</style>

            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="tech" className="text-3xl font-black text-slate-900">
                  Technology We Use
                </h2>
                <p className="mt-2 text-slate-600">Modern, proven tools for fast and maintainable software.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-900 shadow-[0_0_18px_rgba(251,191,36,0.55)]">
                <span aria-hidden="true">👑</span>
                {techItems.length} Core Technologies
              </span>
            </div>

            {/* How the stack fits together */}
            <ol
              aria-label="How our technology stack fits together"
              className="mb-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-amber-300/50 bg-slate-50 px-4 py-4 sm:gap-3"
            >
              {techGroups.map((g, i) => (
                <li key={g.title} className="flex items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-gradient-to-b from-[#0b1150] to-[#060a3d] px-4 py-1.5 text-sm font-bold text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
                    <span aria-hidden="true">{g.icon}</span>
                    {g.title}
                  </span>
                  {i < techGroups.length - 1 && (
                    <span className="font-black text-amber-500" aria-hidden="true">→</span>
                  )}
                </li>
              ))}
            </ol>

            {/* Grouped technology cards */}
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {techGroups.map((g) => (
                <li
                  key={g.title}
                  className={`flex flex-col p-5 ${vipCard} ${vipLift} ${g.items.length > 2 ? 'sm:col-span-2' : ''}`}
                >
                  <VipShine />
                  <div className="mb-4 flex items-start gap-3">
                    <span className={vipIcon} aria-hidden="true">{g.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-extrabold text-amber-300">{g.title}</h3>
                        <span
                          className="rounded-full border border-amber-300/50 px-2 py-0.5 text-[11px] font-black text-yellow-200"
                          aria-label={`${g.items.length} ${g.items.length === 1 ? 'technology' : 'technologies'}`}
                        >
                          {String(g.items.length).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-300">{g.text}</p>
                    </div>
                  </div>

                  <ul className={`grid flex-1 content-start gap-3 ${g.items.length > 2 ? 'sm:grid-cols-2' : ''}`}>
                    {g.items.map((t) => (
                      <li
                        key={t.name}
                        className="flex items-start gap-3 rounded-xl border border-amber-300/25 bg-white/5 p-3 transition hover:border-amber-300/70 hover:bg-white/10 motion-reduce:transition-none"
                      >
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-100/60 bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 text-lg text-slate-900 shadow-[0_0_10px_rgba(251,191,36,0.45)]"
                          aria-hidden="true"
                        >
                          {t.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-bold text-yellow-100">{t.name}</span>
                          <span className="block text-xs text-slate-300">{t.desc}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {/* Scrolling VIP marquee (pauses on hover) */}
            <div className="relative mt-6 overflow-hidden rounded-3xl border-2 border-amber-300/60 bg-gradient-to-r from-[#060a3d] via-[#0b1150] to-[#060a3d] py-5 shadow-[0_0_30px_rgba(251,191,36,0.25)]">
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"
                aria-hidden="true"
              />
              <p className="mb-4 text-center text-xs font-black uppercase tracking-[0.3em] text-amber-300">
                <span aria-hidden="true">👑</span> Powered by modern technology <span aria-hidden="true">👑</span>
              </p>

              <div
                className="tech-marquee"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
                  maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
                }}
              >
                <div className="tech-marquee-track">
                  <ul aria-label="Technologies we use" className="flex shrink-0">
                    {techItems.map((t) => (
                      <li
                        key={t.name}
                        className="mr-3 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-amber-300/70 bg-white/5 px-5 py-2 text-sm font-bold text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                      >
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-yellow-200 to-amber-500 text-sm text-slate-900"
                          aria-hidden="true"
                        >
                          {t.icon}
                        </span>
                        {t.name}
                      </li>
                    ))}
                  </ul>
                  <ul aria-hidden="true" className="tech-marquee-dup flex shrink-0">
                    {techItems.map((t) => (
                      <li
                        key={t.name}
                        className="mr-3 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-amber-300/70 bg-white/5 px-5 py-2 text-sm font-bold text-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                      >
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-yellow-200 to-amber-500 text-sm text-slate-900"
                          aria-hidden="true"
                        >
                          {t.icon}
                        </span>
                        {t.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* TRUST */}
          <section aria-labelledby="why">
            <h2 id="why" className="mb-8 text-3xl font-black text-slate-900">
              Why Smart Family IT?
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {trust.map((t) => (
                <li key={t.title} className={`p-6 ${vipCard} ${vipLift}`}>
                  <VipShine />
                  <div className={`mb-4 ${vipIcon}`} aria-hidden="true">{t.icon}</div>
                  <h3 className={`mb-1 ${vipTitle}`}>{t.title}</h3>
                  <p className={vipText}>{t.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ SECTION */}
          <FAQSection />

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
                  className={`block h-full p-6 ${vipCard} ${vipLift} ${focusRing}`}
                >
                  <VipShine />
                  <div className={`mb-3 ${vipIcon}`} aria-hidden="true">💬</div>
                  <h3 className={vipTitle}>WhatsApp</h3>
                  <p className={`mt-1 ${vipText}`}>{CONTACT.whatsappDisplay}</p>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className={`block h-full p-6 ${vipCard} ${vipLift} ${focusRing}`}
                >
                  <VipShine />
                  <div className={`mb-3 ${vipIcon}`} aria-hidden="true">✉️</div>
                  <h3 className={vipTitle}>Email</h3>
                  <p className={`mt-1 break-all ${vipText}`}>{CONTACT.email}</p>
                </a>
              </li>
              <li>
                <div className={`h-full p-6 ${vipCard}`}>
                  <VipShine />
                  <div className={`mb-3 ${vipIcon}`} aria-hidden="true">📍</div>
                  <h3 className={vipTitle}>Office</h3>
                  <address className={`mt-1 not-italic ${vipText}`}>{FULL_ADDRESS}</address>
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
              className="rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105"
            >
              Contact Us
            </Link>
            <Link
              href="/products"
              className="rounded-xl border border-white/60 px-8 py-3.5 font-bold transition hover:bg-white hover:text-blue-700"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* ================= VIP PROMISE & PAYMENT STRIP (VERY BOTTOM) ================= */}
      <section
        aria-label="Our promise and accepted payment methods"
        className={`${FULL_BLEED} overflow-hidden border-t-2 border-amber-400 bg-gradient-to-b from-[#fffaf0] to-[#f7ead2] shadow-[0_-4px_24px_rgba(120,20,40,0.15)]`}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {/* ---------- LEFT: OUR PROMISE (maroon + gold slanted edge) ---------- */}
          <div className="relative z-10 shrink-0 bg-gradient-to-b from-amber-200 via-yellow-500 to-amber-300 lg:w-[46%] lg:[clip-path:polygon(0_0,100%_0,93%_100%,0_100%)] 2xl:w-[44%]">
            <div className="relative h-full bg-gradient-to-b from-[#7a0a22] via-[#5e0618] to-[#3f0310] lg:mr-[5px] lg:[clip-path:polygon(0_0,100%_0,93%_100%,0_100%)]">
              {/* gold glow along the bottom */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_14px_3px_rgba(251,191,36,0.8)]" aria-hidden="true" />

              <div className="flex h-full flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:gap-5 lg:pr-[10%] 2xl:px-12">
                <p className="shrink-0 text-2xl font-extrabold text-white sm:text-[1.7rem]">
                  Our <span className="text-amber-400">Promise:</span>
                </p>
                <span className="hidden h-10 w-px shrink-0 bg-gradient-to-b from-transparent via-amber-300 to-transparent lg:block" aria-hidden="true" />

                <ul className="flex flex-nowrap items-center gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-4 xl:gap-6">
                  {promises.map((p) => (
                    <li key={p.label} className="flex shrink-0 items-center gap-2">
                      <span
                        className="flex h-9 w-8 items-center justify-center rounded-t-md rounded-b-[999px] border border-amber-100 bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-700 text-sm font-black text-[#5e0618] shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                        aria-hidden="true"
                      >
                        {p.icon}
                      </span>
                      <span className="whitespace-nowrap text-sm font-semibold text-white">{p.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ---------- RIGHT: PAY WITH (cream) ---------- */}
          <div className="relative flex min-w-0 flex-1 flex-col gap-3 px-4 py-4 sm:px-6 lg:-ml-[4%] lg:flex-row lg:items-center lg:gap-4 lg:pl-[6%] lg:pr-6 2xl:pr-10">
            <p className="shrink-0 text-base font-extrabold text-[#5e0618] sm:text-lg">Pay With:</p>

            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-amber-400 bg-white px-4 py-1.5 text-sm font-extrabold text-[#3f0310] shadow-sm">
              <span aria-hidden="true">৳</span> BDT
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="ml-1">
                <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>

            <span className="hidden h-12 w-px shrink-0 bg-gradient-to-b from-transparent via-amber-500 to-transparent lg:block" aria-hidden="true" />

            {/* Single line: spread on desktop, sideways scroll on small screens */}
            <ul
              aria-label="Accepted payment and courier methods"
              className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-between"
            >
              {payMethods.map((m) => (
                <li
                  key={m.name}
                  className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-extrabold shadow-[0_2px_8px_rgba(120,60,0,0.12)] transition hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-sm"
                >
                  <span aria-hidden="true">{m.icon}</span>
                  <span className={m.color}>{m.name}</span>
                </li>
              ))}

              <li className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-2 border-amber-400 bg-white px-3 py-1.5 shadow-[0_2px_8px_rgba(120,60,0,0.15)]">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1a1a1a] text-sm"
                  aria-hidden="true"
                >
                  🔒
                </span>
                <span className="text-[11px] font-bold leading-tight text-slate-900">
                  <span className="block">SSL</span>
                  <span className="block">Secure Payment</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* maroon base bar like the design */}
        <div className="h-2.5 bg-gradient-to-r from-[#3f0310] via-[#7a0a22] to-[#3f0310]" aria-hidden="true" />
      </section>

      {/* ================= FLOATING SHARE BUTTON (BOTTOM-LEFT) ================= */}
      <ShareButton url={SITE_URL} title={COMPANY.name} text={COMPANY.description} />
    </div>
  );
}