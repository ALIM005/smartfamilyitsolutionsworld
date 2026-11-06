'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CONTACT } from '@/lib/contact';

/* =====================================================================
   CONFIG
   ===================================================================== */

/** Endpoint that receives the lead. Adjust the payload in buildPayload() if your
 *  /api/contact route expects different field names. */
const API_ENDPOINT = '/api/contact';
const DRAFT_KEY = 'sf_requirement_wizard_v1';
const REQUEST_TIMEOUT_MS = 15000;

/* =====================================================================
   TYPES
   ===================================================================== */

interface AccordionItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  category: string;
}

type FieldKey = 'name' | 'phone' | 'email' | 'consent';
type FieldErrors = Partial<Record<FieldKey, string>>;

interface FormState {
  name: string;
  phone: string;
  email: string;
  company: string;
  budget: string;
  timeline: string;
  contactVia: string;
  details: string;
  consent: boolean;
  website: string; // honeypot – real users never see / fill this
}

/* =====================================================================
   DATA
   ===================================================================== */

const GOALS: AccordionItem[] = [
  {
    id: 'start_business',
    titleEn: 'I want to start a new business',
    titleBn: 'নতুন ব্যবসা শুরু করতে চাই (Start a New Business)',
    descriptionEn: 'Complete digital setup, professional branding, domain registration, and high-converting e-commerce platform.',
    descriptionBn: 'সম্পূর্ণ ডিজিটাল সেটআপ, প্রফেশনাল ব্র্যান্ডিং, ডোমেইন রেজিস্ট্রেশন এবং হাই-কনভার্টিং ই-কমার্স প্ল্যাটফর্ম।',
    category: 'Core Services',
  },
  {
    id: 'grow_sales',
    titleEn: 'I want to grow sales & reach more customers',
    titleBn: 'বিক্রয় বাড়াতে এবং বেশি গ্রাহকের কাছে পৌঁছাতে চাই (Grow Sales)',
    descriptionEn: 'Targeted Meta ads, local SEO, automated lead generation, and promotional campaign management.',
    descriptionBn: 'টার্গেটেড মেটা অ্যাডস, লোকাল এসইও, অটোমেটেড লিড জেনারেশন এবং প্রমোশনাল ক্যাম্পেইন ম্যানেজমেন্ট।',
    category: 'Digital Marketing & SEO',
  },
  {
    id: 'automate_operations',
    titleEn: 'I want to automate business operations',
    titleBn: 'ব্যবসায়িক কার্যক্রম স্বয়ংক্রিয় ও সহজ করতে চাই (Automate Operations)',
    descriptionEn: 'Integrated ERP, smart inventory tracking, point of sale (POS) systems, and cloud spreadsheet automation.',
    descriptionBn: 'ইন্টিগ্রেটেড ইআরপি, স্মার্ট ইনভেন্টরি ট্র্যাকিং, পয়েন্ট অব সেল (POS) সিস্টেম এবং ক্লাউড স্প্রেডশিট অটোমেশন।',
    category: 'ERP & Business Software',
  },
  {
    id: 'custom_software',
    titleEn: 'I need custom software development',
    titleBn: 'কাস্টম সফটওয়্যার ও অ্যাপ্লিকেশন তৈরি করতে চাই (Custom Software)',
    descriptionEn: 'Tailored web applications, enterprise management portals, and native mobile apps built with modern tech stacks.',
    descriptionBn: 'টেইলর্ড ওয়েব অ্যাপ্লিকেশন, এন্টারপ্রাইজ ম্যানেজমেন্ট পোর্টাল এবং আধুনিক টেকনোলজিতে তৈরি নেটিভ মোবাইল অ্যাপ।',
    category: 'Custom Dev',
  },
  {
    id: 'garments_manufacturing',
    titleEn: 'I operate a Garments / Manufacturing unit',
    titleBn: 'গার্মেন্টস বা টেক্সটাইল ও উৎপাদন কারখানা পরিচালনা করি (Garments ERP)',
    descriptionEn: 'Specialized ERP for production floor control, fabric estimation, merchandising, costing, and export documentation.',
    descriptionBn: 'প্রোডাকশন ফ্লোর কন্ট্রোল, ফেব্রিক এস্টিমেশন, মার্চেন্ডাইজিং, কস্টিং এবং এক্সপোর্ট ডক্যুমেন্টেশনের জন্য বিশেষায়িত ইআরপি।',
    category: 'Industry Solutions',
  },
  {
    id: 'retail_restaurant',
    titleEn: 'I run a Retail Shop or Restaurant',
    titleBn: 'রিটেইল শপ, সুপারশপ বা রেস্টুরেন্ট পরিচালনা করি (Retail / POS)',
    descriptionEn: 'Fast billing POS, barcode scanning, thermal receipt printing, kitchen display system, and daily sales analytics.',
    descriptionBn: 'ফাস্ট বিলিং পিওএস, বারকোড স্ক্যানিং, থার্মাল রিসিট প্রিন্টিং, কিচেন ডিসপ্লে সিস্টেম এবং দৈনিক বিক্রির অ্যানালিটিক্স।',
    category: 'Industry Solutions',
  },
  {
    id: 'ai_automation',
    titleEn: 'I want AI Automation & Chatbots',
    titleBn: 'এআই অটোমেশন ও স্মার্ট চ্যাটবট যুক্ত করতে চাই (AI Automation)',
    descriptionEn: 'Intelligent AI chatbots for customer support, automated order taking, and workflow streamlining.',
    descriptionBn: 'কাস্টমার সাপোর্টের জন্য ইন্টেলিজেন্ট এআই চ্যাটবট, অটোমেটেড অর্ডার টেকিং এবং ওয়ার্কফ্লো স্ট্রিমলাইনিং।',
    category: 'AI Solutions',
  },
  {
    id: 'real_estate_travel',
    titleEn: 'Real Estate CRM & Travel Tourism Solutions',
    titleBn: 'রিয়েল এস্টেট সিআরএম এবং ট্রাভেল ট্যুরিজম সল্যুশন (Real Estate & Tourism)',
    descriptionEn: 'Lead management for real estate and booking/management systems for tour and travel agencies.',
    descriptionBn: 'রিয়েল এস্টেটের জন্য লিড ম্যানেজমেন্ট এবং ট্যুর ও ট্রাভেল এজেন্সির জন্য বুকিং ও ম্যানেজমেন্ট সিস্টেম।',
    category: 'Industry Solutions',
  },
];

const SERVICES: AccordionItem[] = [
  {
    id: 'awm_erp',
    titleEn: 'AWM ERP & Enterprise Management',
    titleBn: 'AWM ERP এবং এন্টারপ্রাইজ ম্যানেজমেন্ট সিস্টেম (AWM ERP)',
    descriptionEn: 'Complete business management solution covering core accounting, procurement, sales, and executive dashboards.',
    descriptionBn: 'কোর অ্যাকাউন্টিং, প্রকিউরমেন্ট, সেলস এবং এক্সিকিউটিভ ড্যাশবোর্ড কভার করে সম্পূর্ণ বিজনেস ম্যানেজমেন্ট সল্যুশন।',
    category: 'ERP & Products',
  },
  {
    id: 'inventory_warehouse',
    titleEn: 'Inventory & Warehouse Management',
    titleBn: 'ইনভেন্টরি এবং মাল্টি-ওয়্যারহাউস ম্যানেজমেন্ট সিস্টেম (Inventory Management)',
    descriptionEn: 'Real-time stock tracking, low-stock alerts, multi-branch inventory sync, and supplier management.',
    descriptionBn: 'রিয়েল-টাইম স্টক ট্র্যাকিং, লো-স্টক অ্যালার্ট, মাল্টি-ব্রাঞ্চ ইনভেন্টরি সিঙ্ক এবং সাপ্লায়ার ম্যানেজমেন্ট।',
    category: 'Modules',
  },
  {
    id: 'pos_invoicing',
    titleEn: 'Point of Sale (POS) & Billing System',
    titleBn: 'পয়েন্ট অব সেল (POS) এবং ইনভয়েসিং সিস্টেম (POS & Invoicing)',
    descriptionEn: 'Seamless counter sales, tax calculation, payment integration (bKash, Nagad, Cards, COD), and instant invoice printing.',
    descriptionBn: 'সিমলেস কাউন্টার সেলস, ট্যাক্স ক্যালকুলেশন, পেমেন্ট ইন্টিগ্রেশন (বিকাশ, নগদ, কার্ড, ক্যাশ অন ডেলিভারি) এবং ইনস্ট্যান্ট ইনভয়েস প্রিন্টিং।',
    category: 'POS Systems',
  },
  {
    id: 'ecommerce_store',
    titleEn: 'E-commerce Website & Storefront',
    titleBn: 'ফুল-ফিচারড ই-কমার্স ওয়েবসাইট এবং অনলাইন স্টোর (E-commerce Store)',
    descriptionEn: 'Custom online store with shopping cart, product variants, wishlist, order tracking, and local payment gateways.',
    descriptionBn: 'শপিং কার্ট, প্রোডাক্ট ভেরিয়েন্ট, উইশলিস্ট, অর্ডার ট্র্যাকিং এবং লোকাল পেমেন্ট গেটওয়ে সহ কাস্টম অনলাইন স্টোর।',
    category: 'E-commerce',
  },
  {
    id: 'accounting_hrm',
    titleEn: 'Accounting, HRM & Payroll System',
    titleBn: 'অ্যাকাউন্টিং, এইচআরএম এবং পেরোল ম্যানেজমেন্ট সিস্টেম (Accounting & HR)',
    descriptionEn: 'Automated salary calculation, employee attendance tracking, leave management, profit/loss statements, and tax reports.',
    descriptionBn: 'অটোমেটেড স্যালারি ক্যালকুলেশন, এমপ্লয়ি অ্যাটেন্ডেন্স ট্র্যাকিং, লিভ ম্যানেজমেন্ট, লাভ-ক্ষতির হিসাব এবং ট্যাক্স রিপোর্ট।',
    category: 'HR & Accounting',
  },
  {
    id: 'smart_spreadsheet',
    titleEn: 'Smart Cloud Spreadsheet Automation',
    titleBn: 'স্মার্ট ক্লাউড স্প্রেডশিট অটোমেশন (Smart Spreadsheet)',
    descriptionEn: 'Collaborative cloud-synced spreadsheets with custom formulas, automated reporting, and browser accessibility.',
    descriptionBn: 'কাস্টম ফর্মুলা, অটোমেটেড রিপোর্টিং এবং ব্রাউজার অ্যাক্সেসিবিলিটি সহ কোলাবোরেটিভ ক্লাউড-সিঙ্কড স্প্রেডশিট।',
    category: 'Cloud Tools',
  },
  {
    id: 'digital_marketing_seo',
    titleEn: 'Digital Marketing, SMM & Global SEO',
    titleBn: 'ডিজিটাল মার্কেটিং, সোশ্যাল মিডিয়া মার্কেটিং এবং গ্লোবাল এসইও (Digital Marketing & SEO)',
    descriptionEn: 'Comprehensive growth strategy including Meta/Google ads, content marketing, on-page SEO, and backlink building.',
    descriptionBn: 'মেটা/গুগল অ্যাডস, কন্টেন্ট মার্কেটিং, অন-পেজ এসইও এবং ব্যাকলিংক বিল্ডিং সহ কমপ্রিহেনসিভ গ্রোথ স্ট্র্যাটেজি।',
    category: 'Marketing',
  },
  {
    id: 'custom_web_app',
    titleEn: 'Custom Web & Mobile Application Development',
    titleBn: 'কাস্টম ওয়েব এবং মোবাইল অ্যাপ্লিকেশন ডেভেলপমেন্ট (Custom Web & App)',
    descriptionEn: 'High-performance applications built using Next.js, React, Node.js, and MongoDB tailored to complex business logic.',
    descriptionBn: 'জটিল ব্যবসায়িক লজিকের সাথে সামঞ্জস্য রেখে নেক্সট জেএস, রিয়্যাক্ট, নোড জেএস এবং মঙ্গোডিবি দিয়ে তৈরি হাই-পারফরম্যান্স অ্যাপ্লিকেশন।',
    category: 'Custom Dev',
  },
];

/** Goal → services that fit best (shown with a "Recommended" badge in step 2). */
const RECOMMENDED: Record<string, string[]> = {
  start_business: ['ecommerce_store', 'custom_web_app', 'digital_marketing_seo'],
  grow_sales: ['digital_marketing_seo', 'ecommerce_store'],
  automate_operations: ['awm_erp', 'inventory_warehouse', 'smart_spreadsheet'],
  custom_software: ['custom_web_app', 'awm_erp'],
  garments_manufacturing: ['awm_erp', 'inventory_warehouse', 'accounting_hrm'],
  retail_restaurant: ['pos_invoicing', 'inventory_warehouse', 'accounting_hrm'],
  ai_automation: ['custom_web_app', 'smart_spreadsheet'],
  real_estate_travel: ['custom_web_app', 'awm_erp'],
};

const STEP_LABELS = ['Goal / লক্ষ্য', 'Service / সার্ভিস', 'Details / তথ্য'] as const;

const BUDGETS = [
  'Below ৳20,000',
  '৳20,000 – ৳50,000',
  '৳50,000 – ৳1,50,000',
  '৳1,50,000 – ৳5,00,000',
  'Above ৳5,00,000',
  'Not sure / পরামর্শ চাই',
] as const;

const TIMELINES = [
  'ASAP (within 2 weeks)',
  'Within 1 month',
  '2 – 3 months',
  'Flexible / সময় নমনীয়',
] as const;

const CONTACT_VIA = ['WhatsApp', 'Phone Call', 'Email'] as const;

/* =====================================================================
   HELPERS
   ===================================================================== */

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const PHONE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const normalizePhone = (v: string) =>
  v
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[\s\-()]/g, '');

const waNumber = (() => {
  const d = String(CONTACT.whatsappDisplay ?? '').replace(/\D/g, '');
  if (d.startsWith('880')) return d;
  if (d.startsWith('0')) return `88${d}`;
  return d;
})();
const buildWaUrl = (text: string) =>
  waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}` : '/contact';

const makeRef = () => `SF-${Date.now().toString(36).toUpperCase()}`;

const INITIAL_FORM: FormState = {
  name: '',
  phone: '',
  email: '',
  company: '',
  budget: '',
  timeline: '',
  contactVia: 'WhatsApp',
  details: '',
  consent: false,
  website: '',
};

/* ---------- shared class names (VIP theme: navy + gold) ---------- */
const goldBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-yellow-200 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 px-6 py-3 text-sm font-extrabold text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.45)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';
const ghostBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:border-amber-300/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none';
const inputCls =
  'w-full rounded-2xl border-2 border-white/15 bg-white/5 p-4 text-base font-medium text-white placeholder-slate-400 shadow-sm transition focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-400/20 aria-[invalid=true]:border-rose-400 motion-reduce:transition-none [&>option]:text-slate-900';
const labelCls = 'mb-2 block text-sm font-bold text-slate-100';
const errCls = 'mt-1.5 text-sm font-semibold text-rose-300';

/* =====================================================================
   OPTION LIST (accessible accordion)
   ===================================================================== */

interface OptionListProps {
  items: AccordionItem[];
  idPrefix: string;
  selectedId: string;
  expandedId: string | null;
  recommended?: string[];
  onToggle: (id: string) => void;
  onSelect: (item: AccordionItem) => void;
}

function OptionList({
  items,
  idPrefix,
  selectedId,
  expandedId,
  recommended = [],
  onToggle,
  onSelect,
}: OptionListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center text-slate-300">
        No match found / কোনো ফলাফল পাওয়া যায়নি। Try a different keyword.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const isSelected = selectedId === item.id;
        const isRecommended = recommended.includes(item.id);
        const panelId = `${idPrefix}-panel-${item.id}`;
        const btnId = `${idPrefix}-btn-${item.id}`;

        return (
          <li
            key={item.id}
            className={`overflow-hidden rounded-2xl border-2 transition motion-reduce:transition-none ${isSelected
              ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_24px_rgba(251,191,36,0.25)]'
              : isExpanded
                ? 'border-indigo-300/60 bg-white/10'
                : 'border-white/15 bg-white/5 hover:border-amber-300/50'
              }`}
          >
            <h3>
              <button
                type="button"
                id={btnId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => onToggle(item.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-300 sm:p-6"
              >
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold text-white sm:text-lg">{item.titleBn}</span>
                    {isRecommended && (
                      <span className="rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-slate-900">
                        ★ Recommended
                      </span>
                    )}
                    {isSelected && (
                      <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wide text-emerald-300">
                        ✓ Selected
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold text-amber-300 sm:text-sm">{item.titleEn}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl font-black transition-transform motion-reduce:transition-none ${isExpanded ? 'rotate-45 bg-rose-500/20 text-rose-300' : 'bg-white/10 text-amber-300'
                    }`}
                >
                  +
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isExpanded}
              className="space-y-4 border-t border-white/10 bg-black/20 px-5 pb-6 pt-4 sm:px-6"
            >
              <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-medium leading-relaxed text-slate-100 sm:text-base">
                {item.descriptionBn}
              </p>
              <p className="rounded-xl border border-indigo-300/20 bg-indigo-400/10 p-3 text-xs font-semibold text-indigo-100 sm:text-sm">
                {item.descriptionEn}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  aria-pressed={isSelected}
                  className={
                    isSelected
                      ? 'rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-extrabold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                      : goldBtn
                  }
                >
                  {isSelected ? '✓ Selected / নির্বাচিত' : 'Select This / সিলেক্ট করুন'}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* =====================================================================
   MAIN COMPONENT
   ===================================================================== */

export default function Calculator() {
  const [step, setStep] = useState<number>(1);
  const [goalId, setGoalId] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [stepError, setStepError] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [refId, setRefId] = useState<string>('');
  const [hydrated, setHydrated] = useState<boolean>(false);

  const wizardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const userNav = useRef<boolean>(false);

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId), [goalId]);
  const service = useMemo(() => SERVICES.find((s) => s.id === serviceId), [serviceId]);

  /* ---------- restore draft (selections only – no personal data is stored) ---------- */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw) as {
          step?: number;
          goalId?: string;
          serviceId?: string;
          budget?: string;
          timeline?: string;
        };
        const g = GOALS.find((x) => x.id === d.goalId);
        const s = SERVICES.find((x) => x.id === d.serviceId);
        if (g) setGoalId(g.id);
        if (s) setServiceId(s.id);
        const maxStep = !g ? 1 : !s ? 2 : 3;
        if (typeof d.step === 'number' && d.step >= 1) setStep(Math.min(d.step, maxStep));
        const budget = (BUDGETS as readonly string[]).includes(d.budget ?? '') ? (d.budget as string) : '';
        const timeline = (TIMELINES as readonly string[]).includes(d.timeline ?? '') ? (d.timeline as string) : '';
        if (budget || timeline) setForm((f) => ({ ...f, budget, timeline }));
      }
    } catch {
      /* storage unavailable (private mode etc.) – ignore */
    }
    setHydrated(true);
  }, []);

  /* ---------- save draft ---------- */
  useEffect(() => {
    if (!hydrated || isSubmitted) return;
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step, goalId, serviceId, budget: form.budget, timeline: form.timeline }),
      );
    } catch {
      /* ignore */
    }
  }, [hydrated, isSubmitted, step, goalId, serviceId, form.budget, form.timeline]);

  /* ---------- focus + scroll after user navigation ---------- */
  useEffect(() => {
    if (!userNav.current) return;
    userNav.current = false;
    headingRef.current?.focus({ preventScroll: true });
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    wizardRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [step, isSubmitted]);

  const goToStep = (n: number) => {
    userNav.current = true;
    setStepError('');
    setQuery('');
    setExpandedId(null);
    setStep(n);
  };

  /* ---------- handlers ---------- */
  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setStepError('');
  };

  const handleNext = () => {
    if (step === 1) {
      if (!goal) {
        setStepError('Please select your business goal / অনুগ্রহ করে আপনার লক্ষ্য সিলেক্ট করুন।');
        return;
      }
      goToStep(2);
    } else if (step === 2) {
      if (!service) {
        setStepError('Please select a service / অনুগ্রহ করে একটি সার্ভিস সিলেক্ট করুন।');
        return;
      }
      goToStep(3);
    }
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in fieldErrors) setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (form.name.trim().length < 2) {
      errs.name = 'Please enter your full name / অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।';
    }
    if (!PHONE_RE.test(normalizePhone(form.phone))) {
      errs.phone = 'Enter a valid Bangladeshi mobile number (e.g. 01700000000) / সঠিক মোবাইল নম্বর দিন।';
    }
    if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
      errs.email = 'Enter a valid email address / সঠিক ইমেইল দিন।';
    }
    if (!form.consent) {
      errs.consent = 'Please accept to continue / চালিয়ে যেতে সম্মতি দিন।';
    }
    return errs;
  };

  const buildMessage = (ref: string) =>
    [
      `Requirement Request ${ref}`,
      `Goal: ${goal?.titleEn ?? '-'} (${goal?.titleBn ?? '-'})`,
      `Service: ${service?.titleEn ?? '-'} (${service?.titleBn ?? '-'})`,
      `Name: ${form.name.trim()}`,
      `Phone: ${normalizePhone(form.phone)}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : '',
      form.company.trim() ? `Company: ${form.company.trim()}` : '',
      form.budget ? `Budget: ${form.budget}` : '',
      form.timeline ? `Timeline: ${form.timeline}` : '',
      `Preferred contact: ${form.contactVia}`,
      form.details.trim() ? `Details: ${form.details.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

  const buildPayload = (ref: string) => ({
    name: form.name.trim(),
    phone: normalizePhone(form.phone),
    email: form.email.trim(),
    company: form.company.trim(),
    subject: `Requirement: ${service?.titleEn ?? ''}`,
    message: buildMessage(ref),
    source: 'requirement-wizard',
    reference: ref,
    goal: goal?.titleEn,
    service: service?.titleEn,
    budget: form.budget,
    timeline: form.timeline,
    contactVia: form.contactVia,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    const errs = validate();
    setFieldErrors(errs);
    const firstInvalid = (['name', 'phone', 'email', 'consent'] as FieldKey[]).find((k) => errs[k]);
    if (firstInvalid) {
      document.getElementById(`wiz-${firstInvalid}`)?.focus();
      return;
    }

    // Honeypot: bots fill hidden fields. Pretend success, send nothing.
    if (form.website.trim()) {
      userNav.current = true;
      setIsSubmitted(true);
      return;
    }

    const ref = makeRef();
    setIsSubmitting(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(ref)),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setRefId(ref);
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      userNav.current = true;
      setIsSubmitted(true);
    } catch {
      setRefId(ref);
      setSubmitError(
        'Could not send your request. Please try again, or send it directly on WhatsApp / রিকোয়েস্ট পাঠানো যায়নি। আবার চেষ্টা করুন অথবা সরাসরি WhatsApp-এ পাঠান।',
      );
    } finally {
      window.clearTimeout(timer);
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    userNav.current = true;
    setStep(1);
    setGoalId('');
    setServiceId('');
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setExpandedId(null);
    setQuery('');
    setStepError('');
    setSubmitError('');
    setRefId('');
    setIsSubmitted(false);
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
  };

  /* ---------- filtering ---------- */
  const filter = (items: AccordionItem[]) => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.titleEn} ${i.titleBn} ${i.descriptionEn} ${i.descriptionBn} ${i.category}`.toLowerCase().includes(q),
    );
  };
  const filteredGoals = useMemo(() => filter(GOALS), [query]); // eslint-disable-line react-hooks/exhaustive-deps
  const filteredServices = useMemo(() => {
    const list = filter(SERVICES);
    const rec = RECOMMENDED[goalId] ?? [];
    // recommended items first, original order otherwise
    return [...list].sort((a, b) => Number(rec.includes(b.id)) - Number(rec.includes(a.id)));
  }, [query, goalId]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchBox = (
    <div className="relative">
      <label htmlFor="wiz-search" className="sr-only">
        Search options / অপশন খুঁজুন
      </label>
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg" aria-hidden="true">
        🔎
      </span>
      <input
        id="wiz-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search / খুঁজুন…"
        autoComplete="off"
        className={`${inputCls} pl-12`}
      />
    </div>
  );

  /* =====================================================================
     RENDER
     ===================================================================== */
  return (
    <div
      id="calculator-wizard"
      ref={wizardRef}
      className="flex w-full scroll-mt-24 items-center justify-center px-0 py-6 sm:px-2 sm:py-10"
    >
      {/* tiny fade-in keyframes (no tailwind config needed) */}
      <style>{`
        @keyframes wzFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .wz-fade{animation:wzFade .25s ease-out both}
        @media (prefers-reduced-motion:reduce){.wz-fade{animation:none}}
      `}</style>

      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-[#060a3d] via-[#0a1060] to-[#1a0b4a] p-5 text-white shadow-[0_0_60px_rgba(99,102,241,0.35)] sm:p-10 lg:p-12">
        {/* VIP glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-600/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-amber-400/25 blur-3xl" aria-hidden="true" />

        <div className="relative">
          {/* ---------- Header + progress ---------- */}
          {!isSubmitted && (
            <div className="mb-8 border-b border-white/10 pb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="inline-block rounded-full border border-amber-300/50 bg-amber-400/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-amber-300">
                    👑
                  </span>
                  <p className="mt-3 text-xl font-bold text-white">
                    Step {step} of 3
                    <span className="sr-only"> – {STEP_LABELS[step - 1]}</span>
                  </p>
                </div>
                <ol className="flex items-center gap-2 sm:gap-3" aria-label="Progress">
                  {STEP_LABELS.map((label, i) => {
                    const n = i + 1;
                    const done = step > n;
                    const current = step === n;
                    return (
                      <li key={label} className="flex items-center gap-2" aria-current={current ? 'step' : undefined}>
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-black ${done
                            ? 'border-emerald-300 bg-emerald-400 text-slate-900'
                            : current
                              ? 'border-yellow-200 bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-900'
                              : 'border-white/20 bg-white/5 text-slate-300'
                            }`}
                        >
                          <span aria-hidden="true">{done ? '✓' : n}</span>
                          <span className="sr-only">{`${label}${done ? ' (done)' : current ? ' (current)' : ''}`}</span>
                        </span>
                        {n < 3 && (
                          <span
                            aria-hidden="true"
                            className={`h-1 w-8 rounded-full sm:w-16 ${step > n ? 'bg-amber-400' : 'bg-white/15'}`}
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}

          {/* ---------- Step error ---------- */}
          <div aria-live="assertive" role="alert">
            {stepError && (
              <div className="wz-fade mb-6 flex items-center gap-2 rounded-2xl border-2 border-rose-400/50 bg-rose-500/10 p-4 text-sm font-semibold text-rose-200">
                <span aria-hidden="true" className="text-lg">⚠️</span> {stepError}
              </div>
            )}
          </div>

          {/* ================= STEP 1 ================= */}
          {step === 1 && !isSubmitted && (
            <section className="wz-fade space-y-6" aria-labelledby="wiz-h1">
              <div>
                <span className="mb-1 block text-sm font-extrabold uppercase tracking-wider text-amber-300">Discovery</span>
                <h2
                  id="wiz-h1"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-black leading-tight outline-none sm:text-3xl lg:text-4xl"
                >
                  আপনার প্রধান ব্যবসায়িক লক্ষ্য কী?
                </h2>
                <p className="mt-2 text-base text-slate-300">
                  Click the plus (+) on any option to view details and select your primary objective.
                </p>
              </div>

              {searchBox}

              <OptionList
                items={filteredGoals}
                idPrefix="goal"
                selectedId={goalId}
                expandedId={expandedId}
                onToggle={toggleAccordion}
                onSelect={(item) => {
                  setGoalId(item.id);
                  setStepError('');
                }}
              />

              {goal && (
                <div className="wz-fade sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border-2 border-emerald-300/40 bg-[#060a3d]/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">✅</span>
                    <div>
                      <p className="text-sm font-bold text-emerald-300 sm:text-base">Target Selected / লক্ষ্য নির্ধারণ করা হয়েছে</p>
                      <p className="text-xs font-semibold text-slate-200 sm:text-sm">{goal.titleBn}</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleNext} className={goldBtn}>
                    Next Step <span aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </section>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && !isSubmitted && (
            <section className="wz-fade space-y-6" aria-labelledby="wiz-h2">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">Goal Confirmed</span>
                  <span className="max-w-full truncate text-sm font-semibold text-slate-200">{`“${goal?.titleBn ?? ''}”`}</span>
                </div>
                <h2
                  id="wiz-h2"
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-2xl font-black leading-tight outline-none sm:text-3xl lg:text-4xl"
                >
                  2/ Which service do you need? / আপনার কোন সার্ভিসটি প্রয়োজন?
                </h2>
                <p className="mt-2 text-base text-slate-300">
                  Services marked ★ Recommended fit your goal best. You can still choose any option.
                </p>
              </div>

              {searchBox}

              <OptionList
                items={filteredServices}
                idPrefix="service"
                selectedId={serviceId}
                expandedId={expandedId}
                recommended={RECOMMENDED[goalId]}
                onToggle={toggleAccordion}
                onSelect={(item) => {
                  setServiceId(item.id);
                  setStepError('');
                }}
              />

              <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border-2 border-white/15 bg-[#060a3d]/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{service ? '✅' : '👉'}</span>
                  <div>
                    <p className="text-sm font-bold text-white sm:text-base">
                      {service ? 'Service Confirmed / সার্ভিস নিশ্চিত' : 'Select a service to continue / সার্ভিস সিলেক্ট করুন'}
                    </p>
                    {service && <p className="text-xs font-semibold text-slate-200 sm:text-sm">{service.titleBn}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => goToStep(1)} className={ghostBtn}>
                    ← Back
                  </button>
                  <button type="button" onClick={handleNext} disabled={!service} className={goldBtn}>
                    Proceed To Form <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && !isSubmitted && (
            <form onSubmit={handleSubmit} noValidate className="wz-fade space-y-8" aria-labelledby="wiz-h3">
              <div>
                <span className="mb-1 block text-sm font-extrabold uppercase tracking-wider text-amber-300">Phase 3: Finalization</span>
                <h2
                  id="wiz-h3"
                  ref={headingRef}
                  tabIndex={-1}
                  className="mb-3 text-2xl font-black outline-none sm:text-3xl lg:text-4xl"
                >
                  3/ Provide your information / আপনার তথ্য প্রদান করুন
                </h2>
                <p className="text-base text-slate-300">
                  Confirm your selections and submit your details to receive an official proposal and project roadmap.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-4 rounded-2xl border-2 border-amber-400/30 bg-white/5 p-6 shadow-sm">
                <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-3 sm:flex-row sm:items-center">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">Selected Goal / নির্বাচিত লক্ষ্য</span>
                    <p className="mt-0.5 text-base font-extrabold">{goal?.titleBn}</p>
                  </div>
                  <button type="button" onClick={() => goToStep(1)} className="self-start rounded-lg border border-amber-300/40 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-center">
                    Change Goal
                  </button>
                </div>
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-amber-300">Chosen Service / নির্বাচিত সার্ভিস</span>
                    <p className="mt-0.5 text-base font-extrabold">{service?.titleBn}</p>
                  </div>
                  <button type="button" onClick={() => goToStep(2)} className="self-start rounded-lg border border-amber-300/40 px-3 py-1 text-xs font-bold text-amber-300 hover:bg-amber-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:self-center">
                    Change Service
                  </button>
                </div>
              </div>

              <div className="max-w-4xl space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="wiz-name" className={labelCls}>
                      Your Full Name / আপনার নাম <span className="text-rose-300" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="wiz-name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={80}
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'wiz-name-err' : undefined}
                      className={inputCls}
                      placeholder="e.g. Md. Alim Uddin"
                    />
                    {fieldErrors.name && <p id="wiz-name-err" className={errCls}>{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="wiz-phone" className={labelCls}>
                      Mobile Number (WhatsApp) / মোবাইল নম্বর <span className="text-rose-300" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="wiz-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      maxLength={20}
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'wiz-phone-err' : undefined}
                      className={inputCls}
                      placeholder="01700000000"
                    />
                    {fieldErrors.phone && <p id="wiz-phone-err" className={errCls}>{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="wiz-email" className={labelCls}>
                      Email (Optional) / ইমেইল (ঐচ্ছিক)
                    </label>
                    <input
                      id="wiz-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      maxLength={120}
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'wiz-email-err' : undefined}
                      className={inputCls}
                      placeholder="name@example.com"
                    />
                    {fieldErrors.email && <p id="wiz-email-err" className={errCls}>{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="wiz-company" className={labelCls}>
                      Company / Organization (Optional) / কোম্পানির নাম (ঐচ্ছিক)
                    </label>
                    <input
                      id="wiz-company"
                      type="text"
                      autoComplete="organization"
                      maxLength={100}
                      value={form.company}
                      onChange={(e) => setField('company', e.target.value)}
                      className={inputCls}
                      placeholder="Smart Family IT Solutions World"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="wiz-budget" className={labelCls}>Budget Range / বাজেট</label>
                    <select
                      id="wiz-budget"
                      value={form.budget}
                      onChange={(e) => setField('budget', e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select / নির্বাচন করুন</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wiz-timeline" className={labelCls}>Timeline / সময়সীমা</label>
                    <select
                      id="wiz-timeline"
                      value={form.timeline}
                      onChange={(e) => setField('timeline', e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select / নির্বাচন করুন</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="wiz-via" className={labelCls}>Contact Me Via / যোগাযোগ মাধ্যম</label>
                    <select
                      id="wiz-via"
                      value={form.contactVia}
                      onChange={(e) => setField('contactVia', e.target.value)}
                      className={inputCls}
                    >
                      {CONTACT_VIA.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="wiz-details" className={labelCls}>
                    Additional Requirements / অতিরিক্ত রিকোয়েস্ট বা প্রজেক্ট ডিটেইলস (ঐচ্ছিক)
                  </label>
                  <textarea
                    id="wiz-details"
                    rows={4}
                    maxLength={1000}
                    value={form.details}
                    onChange={(e) => setField('details', e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Describe your timeline, budget expectations, or specific module integrations..."
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">{form.details.length}/1000</p>
                </div>

                {/* Honeypot – hidden from humans & assistive tech */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="wiz-website">Website</label>
                  <input
                    id="wiz-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setField('website', e.target.value)}
                  />
                </div>

                {/* Consent */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-200">
                    <input
                      id="wiz-consent"
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => setField('consent', e.target.checked)}
                      aria-invalid={!!fieldErrors.consent}
                      aria-describedby={fieldErrors.consent ? 'wiz-consent-err' : undefined}
                      className="mt-1 h-5 w-5 shrink-0 accent-amber-400"
                    />
                    <span>
                      I agree to be contacted about this request and accept the{' '}
                      <Link href="/privacy" className="font-bold text-amber-300 underline" target="_blank">
                        Privacy Policy
                      </Link>
                      . / আমি যোগাযোগের জন্য সম্মতি দিচ্ছি এবং গোপনীয়তা নীতি মেনে নিচ্ছি।
                    </span>
                  </label>
                  {fieldErrors.consent && <p id="wiz-consent-err" className={errCls}>{fieldErrors.consent}</p>}
                </div>
              </div>

              {/* Submit error + WhatsApp fallback */}
              <div aria-live="assertive" role="alert">
                {submitError && (
                  <div className="wz-fade space-y-3 rounded-2xl border-2 border-rose-400/50 bg-rose-500/10 p-4 text-sm font-semibold text-rose-100">
                    <p>⚠️ {submitError}</p>
                    <a
                      href={buildWaUrl(buildMessage(refId || 'SF-DRAFT'))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${goldBtn} w-full sm:w-auto`}
                    >
                      💬 Send via WhatsApp <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => goToStep(2)} className={ghostBtn}>
                  ← Back / পূর্ববর্তী
                </button>
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`${goldBtn} px-10 py-4 text-base`}>
                  {isSubmitting ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Submitting / সাবমিট হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Requirement Request / রিকোয়েস্ট সাবমিট করুন</span>
                      <span aria-hidden="true">🚀</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ================= SUCCESS ================= */}
          {isSubmitted && (
            <section className="wz-fade px-2 py-10 text-center" aria-labelledby="wiz-done">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-300/40 bg-emerald-400/20 text-4xl text-emerald-300" aria-hidden="true">
                ✓
              </div>
              <h2
                id="wiz-done"
                ref={headingRef}
                tabIndex={-1}
                className="mb-3 text-3xl font-black outline-none sm:text-4xl"
              >
                Requirement Request Received! / রিকোয়েস্ট গৃহীত হয়েছে!
              </h2>
              {refId && (
                <p className="mb-6 inline-block rounded-full border border-amber-300/50 bg-amber-400/10 px-4 py-1.5 text-sm font-black tracking-wider text-amber-300">
                  Reference: {refId}
                </p>
              )}
              <div className="mx-auto mb-8 max-w-lg space-y-2 rounded-2xl border border-white/15 bg-white/5 p-6 text-left text-sm text-slate-200 sm:text-base">
                <p><strong className="text-white">Goal / লক্ষ্য:</strong> {goal?.titleBn}</p>
                <p><strong className="text-white">Service / সার্ভিস:</strong> {service?.titleBn}</p>
                <p><strong className="text-white">Contact / যোগাযোগ:</strong> {form.name} ({normalizePhone(form.phone)})</p>
              </div>
              <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-slate-300">
                Thank you for choosing <strong className="text-white">Smart Family IT Solutions World</strong>. Our technical architects are reviewing your details and will get in touch with a customized proposal shortly.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={buildWaUrl(`Hello! I just submitted a requirement request. Reference: ${refId}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={goldBtn}
                >
                  💬 Continue on WhatsApp <span className="sr-only">(opens in a new tab)</span>
                </a>
                <button type="button" onClick={resetAll} className={ghostBtn}>
                  Submit Another Inquiry / নতুন অনুসন্ধান
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}