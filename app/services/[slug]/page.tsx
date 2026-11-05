// app/services/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COMPANY } from '@/lib/products';
import { whatsappUrl } from '@/lib/contact';

const SITE_URL = 'https://smartfamilyitsolutionsworld.com';

type Feature = { icon: string; title: string; text: string };
type Step = { title: string; text: string };
type Faq = { q: string; a: string };

type Service = {
  icon: string;
  title: string;
  tagline: string;
  description: string;
  metaDescription: string;
  highlights: string[];
  features: Feature[];
  deliverables: string[];
  useCases: string[];
  tech: string[];
  process: Step[];
  faqs: Faq[];
};

const serviceData: Record<string, Service> = {
  'web-development': {
    icon: '🌐',
    title: 'Web & E-Commerce Dev',
    tagline: 'দ্রুত, আধুনিক ও সার্চ ইঞ্জিন-বান্ধব ওয়েবসাইট ও ই-কমার্স সলিউশন',
    description:
      'কোম্পানি ওয়েবসাইট, ল্যান্ডিং পেজ, ই-কমার্স স্টোর থেকে শুরু করে জটিল ওয়েব অ্যাপ্লিকেশন পর্যন্ত আপনার ব্যবসার প্রয়োজন অনুযায়ী তৈরি করে দিই। ডিজাইন, ডেভেলপমেন্ট, ডিপ্লয়মেন্ট ও রক্ষণাবেক্ষণ সব এক জায়গায়।',
    metaDescription:
      'আধুনিক, দ্রুত ও SEO-বান্ধব ওয়েবসাইট, ই-কমার্স ও ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট। মোবাইল-ফ্রেন্ডলি ডিজাইন, বাংলা ও ইংরেজি ইন্টারফেস এবং বাংলাদেশি পেমেন্ট ইন্টিগ্রেশন সহ।',
    highlights: ['রেসপন্সিভ ডিজাইন', 'SEO-বান্ধব কাঠামো', 'দ্রুত লোডিং', 'বাংলা + English'],
    features: [
      { icon: '📱', title: 'রেসপন্সিভ ডিজাইন', text: 'মোবাইল, ট্যাবলেট ও ডেস্কটপ সব স্ক্রিনে সমানভাবে সুন্দর ও ব্যবহারযোগ্য।' },
      { icon: '🔎', title: 'SEO-বান্ধব কাঠামো', text: 'সঠিক মেটাডেটা, সেমান্টিক কাঠামো ও দ্রুত লোডের মাধ্যমে সার্চ ইঞ্জিনে ভালো উপস্থিতির ভিত্তি।' },
      { icon: '🛍️', title: 'ই-কমার্স', text: 'প্রোডাক্ট ক্যাটালগ, কার্ট, কুপন, অর্ডার ট্র্যাকিং ও চেকআউট সহ অনলাইন শপ।' },
      { icon: '💳', title: 'পেমেন্ট ইন্টিগ্রেশন', text: 'bKash, Nagad, Rocket, কার্ড ও ক্যাশ অন ডেলিভারি সহ প্রয়োজনীয় পেমেন্ট ও কুরিয়ার যুক্ত করা যায়।' },
      { icon: '🔐', title: 'নিরাপদ লগইন', text: 'রোল-ভিত্তিক অ্যাক্সেস, পাসওয়ার্ড সুরক্ষা এবং প্রয়োজনে OTP বা সোশ্যাল লগইন।' },
      { icon: '🧩', title: 'অ্যাডমিন প্যানেল', text: 'কনটেন্ট, প্রোডাক্ট ও অর্ডার নিজে পরিচালনার জন্য সহজ অ্যাডমিন ড্যাশবোর্ড।' },
    ],
    deliverables: [
      'ডিজাইন ও পেজ কাঠামো',
      'সম্পূর্ণ ফ্রন্টএন্ড ও ব্যাকএন্ড ডেভেলপমেন্ট',
      'ডোমেইন ও হোস্টিং সেটআপে সহায়তা',
      'HTTPS ও মৌলিক সিকিউরিটি কনফিগারেশন',
      'মেটাডেটা ও সার্চ ইঞ্জিনের জন্য প্রাথমিক সেটআপ',
      'লাইভ হওয়ার পর হ্যান্ডওভার ও ব্যবহার-নির্দেশনা',
    ],
    useCases: ['কোম্পানি বা প্রতিষ্ঠানের ওয়েবসাইট', 'অনলাইন শপ ও মার্কেটপ্লেস', 'বুকিং বা অর্ডার ম্যানেজমেন্ট সিস্টেম', 'ক্লায়েন্ট পোর্টাল ও ড্যাশবোর্ড'],
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Prisma', 'PostgreSQL / MongoDB', 'Vercel'],
    process: [
      { title: 'প্রয়োজন বোঝা', text: 'আপনার ব্যবসা, গ্রাহক ও লক্ষ্য নিয়ে আলোচনা করে ফিচারের তালিকা ঠিক করি।' },
      { title: 'পরিকল্পনা ও ডিজাইন', text: 'পেজ কাঠামো, ডিজাইন ও সময়সীমার স্পষ্ট পরিকল্পনা দিই।' },
      { title: 'ডেভেলপমেন্ট ও প্রিভিউ', text: 'ধাপে ধাপে তৈরি করি এবং প্রিভিউ দেখিয়ে আপনার মতামত নিই।' },
      { title: 'টেস্ট ও লাইভ', text: 'বিভিন্ন ডিভাইসে পরীক্ষা করে সাইট লাইভ করি।' },
      { title: 'রক্ষণাবেক্ষণ', text: 'লাইভ হওয়ার পর আপডেট, বাগ ফিক্স ও টেকনিক্যাল সহায়তা।' },
    ],
    faqs: [
      { q: 'ওয়েবসাইট তৈরিতে কত সময় লাগে?', a: 'সময় নির্ভর করে পেজ ও ফিচারের সংখ্যার উপর। প্রয়োজন জানার পর পরিকল্পনার সাথেই নির্দিষ্ট সময়সীমা জানিয়ে দিই।' },
      { q: 'সাইটটি কি মোবাইলে ঠিকভাবে চলবে?', a: 'হ্যাঁ। সব সাইট রেসপন্সিভ করে তৈরি হয় এবং মোবাইল, ট্যাবলেট ও ডেস্কটপে পরীক্ষা করা হয়।' },
      { q: 'বাংলা ও ইংরেজি দুই ভাষায় সাইট করা যাবে?', a: 'হ্যাঁ, প্রয়োজন অনুযায়ী বাংলা ও ইংরেজি দুই ভাষার ইন্টারফেস যুক্ত করা যায়।' },
      { q: 'নিজে কনটেন্ট বদলাতে পারব কি?', a: 'হ্যাঁ। অ্যাডমিন প্যানেল দিয়ে আপনি নিজেই কনটেন্ট, প্রোডাক্ট ও অর্ডার পরিচালনা করতে পারবেন।' },
      { q: 'লাইভ হওয়ার পর কি সাপোর্ট পাব?', a: 'হ্যাঁ। রক্ষণাবেক্ষণ, বাগ ফিক্স ও টেকনিক্যাল সহায়তা দিই। সাপোর্টের শর্ত শুরুতেই আলোচনা করে নির্ধারিত হয়।' },
    ],
  },

  'erp-software': {
    icon: '📦',
    title: 'ERP & Business Software',
    tagline: 'আপনার ব্যবসার কাজের ধাপ অনুযায়ী কাস্টম ERP ও ব্যবসায়িক সফটওয়্যার',
    description:
      'ইনভেন্টরি, POS, অ্যাকাউন্টিং, HRM, CRM ও ওয়্যারহাউস মডিউল দরকার অনুযায়ী বেছে নিয়ে একটি সমন্বিত সিস্টেম তৈরি করি। ফলে হাতে-কলমে বা বিচ্ছিন্ন স্প্রেডশিটে হিসাব রাখার ঝামেলা কমে এবং এক জায়গা থেকে পুরো ব্যবসা দেখা যায়।',
    metaDescription:
      'ব্যবসার প্রয়োজন অনুযায়ী কাস্টম ERP: ইনভেন্টরি, POS ও ইনভয়েস, অ্যাকাউন্টিং, HRM, CRM ও ওয়্যারহাউস ম্যানেজমেন্ট। রোল-ভিত্তিক অ্যাক্সেস ও রিপোর্ট সহ ক্লাউড সফটওয়্যার।',
    highlights: ['কাস্টম মডিউল', 'রোল-ভিত্তিক অ্যাক্সেস', 'রিপোর্ট ও অ্যানালিটিক্স', 'ক্লাউড-ভিত্তিক'],
    features: [
      { icon: '📦', title: 'ইনভেন্টরি ম্যানেজমেন্ট', text: 'স্টকের হিসাব, লো-স্টক অ্যালার্ট ও পণ্যের তথ্য এক জায়গায়।' },
      { icon: '🧾', title: 'POS ও ইনভয়েস', text: 'দোকানে বিক্রি, মেমো ও ইনভয়েস তৈরি, প্রিন্ট বা ডাউনলোড।' },
      { icon: '📊', title: 'অ্যাকাউন্টিং', text: 'আয়-ব্যয়, বাকি-পাওনা ও আর্থিক রিপোর্ট সহজে দেখা।' },
      { icon: '👥', title: 'HRM ও পে-রোল', text: 'কর্মী তথ্য, হাজিরা ও বেতনের হিসাব।' },
      { icon: '🏬', title: 'ওয়্যারহাউস ও শাখা', text: 'একাধিক গুদাম বা শাখার স্টক আলাদাভাবে ট্র্যাকিং।' },
      { icon: '🤝', title: 'CRM', text: 'কাস্টমারের তথ্য, যোগাযোগ ও ফলো-আপ ম্যানেজমেন্ট।' },
    ],
    deliverables: [
      'আপনার কাজের ধাপ অনুযায়ী মডিউল নির্বাচন ও কাস্টমাইজেশন',
      'ইউজার রোল ও পারমিশন সেটআপ',
      'ড্যাশবোর্ড ও প্রয়োজনীয় রিপোর্ট',
      'বিদ্যমান ডেটা (এক্সেল/CSV) ইমপোর্টে সহায়তা',
      'টিমের জন্য ব্যবহার-নির্দেশনা',
      'লাইভ হওয়ার পর রক্ষণাবেক্ষণ ও সহায়তা',
    ],
    useCases: ['খুচরা ও পাইকারি ব্যবসা', 'ডিস্ট্রিবিউশন ও একাধিক শাখা', 'সেবা ও সার্ভিস ভিত্তিক প্রতিষ্ঠান', 'মাল্টি-ভেন্ডর মার্কেটপ্লেস'],
    tech: ['Next.js', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL / MongoDB', 'REST API', 'Role-based Access', 'Cloud Hosting'],
    process: [
      { title: 'কাজের ধাপ বিশ্লেষণ', text: 'বর্তমানে আপনি কীভাবে কাজ করেন তা বুঝে সমস্যা ও চাহিদা চিহ্নিত করি।' },
      { title: 'মডিউল পরিকল্পনা', text: 'কোন মডিউল দরকার, ফিচার, সময় ও খরচের স্পষ্ট পরিকল্পনা দিই।' },
      { title: 'ধাপে ধাপে ডেভেলপমেন্ট', text: 'একটি একটি মডিউল তৈরি করে দেখিয়ে মতামত নিই।' },
      { title: 'ডেটা ইমপোর্ট ও টেস্ট', text: 'আপনার বিদ্যমান ডেটা আনা এবং বাস্তব পরিস্থিতিতে পরীক্ষা।' },
      { title: 'লাইভ ও সাপোর্ট', text: 'চালু করার পর প্রশিক্ষণ, রক্ষণাবেক্ষণ ও আপডেট।' },
    ],
    faqs: [
      { q: 'সব মডিউল কি একসাথে নিতে হবে?', a: 'না। আপনার প্রয়োজনীয় মডিউল দিয়ে শুরু করা যায়, ব্যবসা বাড়লে পরে নতুন মডিউল যোগ করা যায়।' },
      { q: 'একাধিক শাখা বা গুদাম পরিচালনা করা যাবে?', a: 'হ্যাঁ। ওয়্যারহাউস ও শাখাভিত্তিক স্টক ট্র্যাকিং যুক্ত করা যায়।' },
      { q: 'কর্মীদের আলাদা অ্যাক্সেস দেওয়া যাবে?', a: 'হ্যাঁ। রোল-ভিত্তিক অ্যাক্সেসের মাধ্যমে কে কী দেখতে বা বদলাতে পারবে তা নির্ধারণ করা যায়।' },
      { q: 'আমার পুরোনো এক্সেল ডেটা কি আনা যাবে?', a: 'সাধারণত এক্সেল বা CSV ফরম্যাটের ডেটা ইমপোর্ট করা যায়। ডেটার কাঠামো দেখে নিশ্চিত করে জানাই।' },
      { q: 'ডেটা কি নিরাপদ থাকবে?', a: 'HTTPS, রোল-ভিত্তিক অ্যাক্সেস ও পাসওয়ার্ড সুরক্ষা সহ নিরাপদ কাঠামোতে তৈরি করা হয়। বিস্তারিত নিরাপত্তা ব্যবস্থা প্রকল্প অনুযায়ী আলোচনা হয়।' },
    ],
  },

  'digital-marketing': {
    icon: '📈',
    title: 'Digital Marketing & SEO',
    tagline: 'আপনার ব্র্যান্ডের প্রচার, টার্গেটেড কাস্টমার ও অনলাইন সেলস বৃদ্ধি',
    description:
      'সোশ্যাল মিডিয়া মার্কেটিং, ফেসবুক ও গুগল অ্যাডস, ইউটিউব প্রমোশন এবং এসইও (SEO)-এর মাধ্যমে আপনার ব্যবসার সঠিক গ্রাহকদের কাছে পৌঁছাতে সাহায্য করি।',
    metaDescription:
      'প্রফেশনাল ডিজিটাল মার্কেটিং, ফেসবুক অ্যাডস, গুগল অ্যাডস ও এসইও (SEO) সার্ভিস। অনলাইনে ব্যবসা ও ব্র্যান্ডের প্রসার বাড়াতে আজই যোগাযোগ করুন।',
    highlights: ['টার্গেটেড অ্যাডস', 'SEO অপ্টিমাইজেশন', 'ব্র্যান্ড গ্রোথ', 'ROI অ্যানালিসিস'],
    features: [
      { icon: '👥', title: 'Facebook & Instagram Ads', text: 'সঠিক অডিয়েন্স টার্গেট করে সেলস ও লিড জেনারেট করার বিজ্ঞাপন ক্যাম্পেইন।' },
      { icon: '🔍', title: 'Google Ads & SEO', text: 'গুগল সার্চ ও ম্যাপে আপনার ব্যবসাকে এগিয়ে রাখা এবং ট্রাফিক বাড়ানো।' },
      { icon: '▶️', title: 'YouTube Marketing', text: 'ভিডিও প্রমোশন ও চ্যানেলের রিচ বৃদ্ধি।' },
      { icon: '📱', title: 'Social Media Management', text: 'নিয়মিত পোস্ট, ডিজাইন ও পেজ ম্যানেজমেন্ট।' },
    ],
    deliverables: [
      'ক্যাম্পেইন স্ট্র্যাটেজি ও প্ল্যানিং',
      'অ্যাড ক্রিয়েটিভ ও কপিরাইটিং',
      'পিক্সেল ও ট্র্যাকিং সেটআপ',
      'নিয়মিত রিপোর্ট ও পারফরম্যান্স অ্যানালিসিস',
    ],
    useCases: ['ই-কমার্স ব্র্যান্ড ও শপ', 'সার্ভিস ভিত্তিক কোম্পানি', 'নতুন স্টার্টআপ ও লোকাল বিজনেস'],
    tech: ['Meta Business Suite', 'Google Ads', 'Google Analytics', 'SEO Tools'],
    process: [
      { title: 'লক্ষ্য নির্ধারণ', text: 'আপনার ব্যবসা ও টার্গেট কাস্টমার নিয়ে আলোচনা।' },
      { title: 'ক্যাম্পেইন সেটআপ', text: 'অ্যাড ও অডিয়েন্স টার্গেটিং কনফিগারেশন।' },
      { title: 'মনিটরিং ও অপ্টিমাইজেশন', text: 'টাকা সাশ্রয় করে সেরা রেজल्ट নিশ্চিত করা।' },
    ],
    faqs: [
      { q: 'বিজ্ঞাপনের বাজেট কেমন হওয়া উচিত?', a: 'আপনার ব্যবসার ধরন ও লক্ষ্য অনুযায়ী বাজেট নির্ধারণ করা হয়।' },
      { q: 'কবে থেকে রেজल्ट দেখতে পাব?', a: 'বিজ্ঞাপন চালু করার পর থেকেই সাধারণত এনগেজমেন্ট ও লিড আসতে শুরু করে।' },
    ],
  },

  'design-branding': {
    icon: '🎨',
    title: 'Design, Branding & IT',
    tagline: 'আকর্ষণীয় গ্রাফিক্স ডিজাইন, ব্র্যান্ডিং ও আইটি কনসালটেন্সি',
    description:
      'লোগো ডিজাইন, ব্র্যান্ড আইডেন্টিটি, সোশ্যাল মিডিয়া ব্যানার, ভিডিও এডিটিং এবং কমপ্লিট আইটি সলিউশন ও মেইনটেনেন্স সার্ভিস।',
    metaDescription:
      'প্রফেশনাল গ্রাফিক্স ডিজাইন, ব্র্যান্ডিং, লোগো এবং আইটি কনসালটেন্সি সার্ভিস। আপনার ব্যবসার প্রফেশনাল লুক তৈরি করুন।',
    highlights: ['প্রিমিয়াম ডিজাইন', 'কাস্টম ব্র্যান্ডিং', 'ভিডিও এডিটিং', 'আইটি সাপোর্ট'],
    features: [
      { icon: '🎨', title: 'Graphics Design', text: 'লোগো, ব্যানার, ফ্লায়ার ও প্রফেশনাল মার্কেটিং ম্যাটেরিয়াল।' },
      { icon: '✂️', title: 'Video Editing', text: 'প্রমোশনাল ভিডিও, রিলস ও ইউটিউব ভিডিও এডিটিং।' },
      { icon: '🗣️', title: 'IT Consultancy', text: 'সফটওয়্যার ও টেকনিক্যাল কনসালটেন্সি।' },
      { icon: '🔧', title: 'Website Maintenance', text: 'নিয়মিত আপডেট ও টেকনিক্যাল মেইনটেনেন্স।' },
    ],
    deliverables: [
      'হাই-কোয়ালিটি ডিজাইন ফাইল (AI, PNG, JPG, PDF)',
      'ব্র্যান্ড গাইডলাইন',
      'এডিটেড ভিডিও ক্লিপস',
      'টেকনিক্যাল মেইনটেনেন্স রিপোর্ট',
    ],
    useCases: ['ব্র্যান্ড রি-ব্র্যান্ডিং', 'সোশ্যাল মিডিয়া মার্কেটিং কনটেন্ট', 'কর্পোরেট আইডেন্টিটি তৈরি'],
    tech: ['Adobe Photoshop', 'Illustrator', 'Premiere Pro', 'Figma'],
    process: [
      { title: 'কনসেপ্ট আলোচনা', text: 'আপনার পছন্দ ও ব্র্যান্ড ভ্যালু বুঝে ডিজাইন আইডিয়া তৈরি।' },
      { title: 'ড্রাফট ও রিভিশন', text: 'প্রিভিউ দেখিয়ে আপনার পছন্দমতো পরিমার্জন।' },
      { title: 'চূড়ান্ত ডেলিভারি', text: 'সকল ফরম্যাটে ফাইনাল ফাইল হস্তান্তর।' },
    ],
    faqs: [
      { q: 'ডিজাইনে কয়টি রিভিশন পাওয়া যাবে?', a: 'প্যাকেজ অনুযায়ী সন্তুষ্ট হওয়া পর্যন্ত রিভিশন সুবিধা দেওয়া হয়।' },
    ],
  },
};

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(serviceData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) return {};

  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: `${service.title} | ${COMPANY.name}`,
      description: service.metaDescription,
      url: `/services/${slug}`,
      siteName: COMPANY.name,
      type: 'website',
    },
  };
}

const toBn = (n: number) =>
  String(n)
    .padStart(2, '0')
    .replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);

export default async function ServiceDetail({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceData[slug];

  if (!service) notFound();

  const pageUrl = `${SITE_URL}/services/${slug}`;
  const others = Object.entries(serviceData).filter(([s]) => s !== slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: service.title,
        description: service.metaDescription,
        url: pageUrl,
        serviceType: service.title,
        areaServed: { '@type': 'Country', name: 'Bangladesh' },
        provider: { '@type': 'Organization', name: COMPANY.name, url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: service.title, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: service.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="space-y-16 py-10 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* HERO */}
      <section aria-labelledby="service-title">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <Link href="/" className="font-bold text-blue-600 hover:underline">
            হোম
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span>{service.title}</span>
        </nav>

        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-indigo-900 p-8 text-white shadow-xl md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)]" />
          <div className="relative max-w-3xl">
            <div className="mb-4 text-5xl" aria-hidden="true">{service.icon}</div>
            <h1 id="service-title" className="text-3xl font-black leading-tight md:text-5xl">
              {service.title}
            </h1>
            <p className="mt-3 text-lg font-semibold text-blue-200">{service.tagline}</p>
            <p className="mt-4 text-slate-200">{service.description}</p>

            <ul className="mt-6 flex flex-wrap gap-2 text-xs font-bold sm:text-sm">
              {service.highlights.map((h) => (
                <li key={h} className="rounded-full border border-white/15 bg-white/10 px-3 py-1">
                  ✓ {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900 shadow-lg transition hover:scale-105 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                যোগাযোগ করুন
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/60 px-6 py-3 font-bold transition hover:bg-white hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                WhatsApp-এ কথা বলুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section aria-labelledby="features">
        <h2 id="features" className="mb-2 text-3xl font-black text-slate-900">
          কী কী পাচ্ছেন
        </h2>
        <p className="mb-8 text-slate-600">আপনার প্রয়োজন অনুযায়ী নিচের সুবিধাগুলো থেকে বেছে নেওয়া যায়।</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-3 text-3xl" aria-hidden="true">{f.icon}</div>
              <h3 className="mb-1 font-bold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DELIVERABLES + USE CASES */}
      <section aria-label="ডেলিভারেবল ও ব্যবহার ক্ষেত্র" className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-7">
          <h2 className="mb-4 text-2xl font-black text-slate-900">আপনি যা বুঝে পাবেন</h2>
          <ul className="space-y-3">
            {service.deliverables.map((d) => (
              <li key={d} className="flex gap-3 text-slate-700">
                <span className="mt-0.5 font-black text-green-600" aria-hidden="true">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-slate-50 p-7">
          <h2 className="mb-4 text-2xl font-black text-slate-900">কাদের জন্য উপযোগী</h2>
          <ul className="space-y-3">
            {service.useCases.map((u) => (
              <li key={u} className="flex gap-3 text-slate-700">
                <span className="mt-0.5 font-black text-blue-600" aria-hidden="true">→</span>
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TECH */}
      <section aria-labelledby="tech" className="text-center">
        <h2 id="tech" className="text-3xl font-black text-slate-900">
          ব্যবহৃত প্রযুক্তি
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-600">
          আধুনিক ও নির্ভরযোগ্য প্রযুক্তি ব্যবহার করা হয়। প্রকল্পের প্রয়োজন অনুযায়ী স্ট্যাকে পরিবর্তন হতে পারে।
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {service.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* PROCESS */}
      <section aria-labelledby="process">
        <h2 id="process" className="mb-8 text-3xl font-black text-slate-900">
          কাজের ধাপ
        </h2>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.process.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-3xl font-black text-blue-600">{toBn(i + 1)}</span>
              <h3 className="mt-2 font-bold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="mx-auto max-w-3xl">
        <h2 id="faq" className="mb-6 text-3xl font-black text-slate-900">
          সচরাচর জিজ্ঞাসা
        </h2>
        <div className="space-y-3">
          {service.faqs.map((f) => (
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

      {/* CTA */}
      <section
        aria-labelledby="cta"
        className="rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-12 text-center text-white shadow-xl md:py-16"
      >
        <h2 id="cta" className="text-3xl font-black md:text-4xl">
          {service.title} নিয়ে কথা বলতে চান?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          আপনার প্রয়োজনটা জানান। আমরা আলোচনা করে পরিকল্পনা ও সময় জানিয়ে দেবো।
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-white px-8 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            যোগাযোগ করুন
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/60 px-8 py-3.5 font-bold transition hover:bg-white hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* RELATED SERVICES */}
      <section aria-labelledby="related">
        <h2 id="related" className="mb-6 text-2xl font-black text-slate-900">
          আমাদের অন্যান্য সার্ভিস
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {others.map(([s, o]) => (
            <Link
              key={s}
              href={`/services/${s}`}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <div className="mb-2 text-3xl" aria-hidden="true">{o.icon}</div>
              <h3 className="font-bold text-slate-900 transition group-hover:text-blue-600">{o.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{o.tagline}</p>
              <span className="mt-3 inline-block text-sm font-bold text-blue-600 transition group-hover:translate-x-1">
                বিস্তারিত দেখুন →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}