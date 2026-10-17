// ============================================================
// সব প্রোডাক্ট ও ডোমেইনের একমাত্র উৎস (single source of truth)
// নতুন প্রোডাক্ট যোগ করতে: নিচের products অ্যারেতে একটি অবজেক্ট বসান।
// কাস্টম ডোমেইন থাকলে next.config.js-এর domains তালিকায়ও যোগ করুন।
// ============================================================

export const COMPANY = {
  name: 'Smart Family IT Solutions World',
  shortName: 'SmartFamily',
  domain: 'smartfamilyitsolutionsworld.com',
  email: 'support@smartfamilyitsolutionsworld.com', // TODO: আপনার আসল সাপোর্ট ইমেইল বসান
  description:
    'ওয়েব ও সফটওয়্যার সলিউশন: ERP, ক্লাউড স্প্রেডশিট ও ব্যবসায়িক অ্যাপ্লিকেশন।',
};

export const PORTAL_TENANT = 'portal';

export type ProductStatus = 'live' | 'coming-soon';

export type Product = {
  slug: string; // URL ও tenantId হিসেবে ব্যবহৃত হয়, একবার দিলে বদলাবেন না
  name: string;
  tagline: string;
  description: string;
  features: string[];
  domain: string | null; // আলাদা কাস্টম ডোমেইন থাকলে (www ছাড়া)
  appPath: string | null; // এই প্রজেক্টের ভেতরের অ্যাপ রুট থাকলে
  status?: ProductStatus; // না দিলে 'live' ধরা হবে
  icon?: string;
};

export const products: Product[] = [
  {
    slug: 'awm-erp',
    name: 'AWM ERP',
    tagline: 'ব্যবসা পরিচালনার জন্য সম্পূর্ণ ERP সলিউশন',
    description:
      'হিসাব, ইনভেন্টরি, বিক্রয় ও কর্মী ব্যবস্থাপনা এক জায়গায় পরিচালনার জন্য তৈরি ERP সফটওয়্যার।',
    features: ['হিসাব ও ইনভেন্টরি', 'বিক্রয় ও ক্রয় ব্যবস্থাপনা', 'রিপোর্ট ও ড্যাশবোর্ড'],
    domain: 'awmearp.com',
    appPath: null,
    status: 'live',
    icon: '📦',
  },
  {
    slug: 'spreadsheet',
    name: 'Smart Spreadsheet',
    tagline: 'ব্রাউজারেই ক্লাউড-সিঙ্ক স্প্রেডশিট',
    description:
      'সহজ ইন্টারফেসে ডাটা এন্ট্রি করুন এবং যেকোনো ডিভাইস থেকে নিরাপদে আপনার শিট অ্যাক্সেস করুন।',
    features: ['ক্লাউড সেভ', 'ইউজার-ভিত্তিক আলাদা ডাটা', 'দ্রুত ও সহজ ইন্টারফেস'],
    domain: null,
    appPath: '/apps/spreadsheet',
    status: 'live',
    icon: '📊',
  },
];

// ---------- হেল্পার ----------

export const TENANT_IDS: string[] = [PORTAL_TENANT, ...products.map((p) => p.slug)];

export const isValidTenant = (t: string) => TENANT_IDS.includes(t);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

// পোর্ট ও www বাদ দিয়ে, ছোট হাতের অক্ষরে
export const normalizeHost = (host: string) =>
  host.split(':')[0].trim().toLowerCase().replace(/^www\./, '');

export const getProductByHost = (host: string) => {
  const h = normalizeHost(host);
  return products.find((p) => p.domain === h);
};

export const getProductByPath = (path: string) =>
  products.find(
    (p) => p.appPath && (path === p.appPath || path.startsWith(p.appPath + '/'))
  );

// ডোমেইন অনুযায়ী সঠিক ওরিজিন (sitemap, robots, canonical-এর জন্য)
export function getOrigin(host: string) {
  const raw = host.split(':')[0].trim().toLowerCase();

  // লোকাল ডেভেলপমেন্ট
  if (raw === 'localhost' || raw === '127.0.0.1') return `http://${host}`;

  // Vercel প্রিভিউ ডিপ্লয়মেন্ট: নিজের লিংকই ফেরত দিন
  if (raw.endsWith('.vercel.app')) return `https://${raw}`;

  const product = getProductByHost(raw);
  return `https://${product?.domain ?? COMPANY.domain}`;
}
