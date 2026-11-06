"use client";
import React, { useState } from "react";

type FaqItem = {
  q: string;
  a: string;
  selected: boolean;
};

type FAQSectionProps = {
  selectedFaqs?: string[];
  onSelectedFaqsChange?: (selected: string[]) => void;
};

export default function FAQSection({ onSelectedFaqsChange }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      q: "What types of software do you build? / আপনারা কী ধরনের সফটওয়্যার তৈরি করেন?",
      a: "We build custom web applications, e-commerce platforms, ERP systems, inventory software, POS, and cloud solutions tailored to your business needs. / আমরা আপনার ব্যবসার প্রয়োজন অনুযায়ী কাস্টম ওয়েব অ্যাপ্লিকেশন, ই-কমার্স প্ল্যাটফর্ম, ইআরপি সিস্টেম, ইনভেন্টরি সফটওয়্যার, পিওএস এবং ক্লাউড সলিউশন তৈরি করে থাকি।",
      selected: false,
    },
    {
      q: "Can software be built specifically for my business? / আমার ব্যবসার জন্য কি নির্দিষ্ট করে সফটওয়্যার তৈরি করা যাবে?",
      a: "Yes, features are defined after thoroughly understanding your workflow, so you do not have to carry unnecessary functionality. / হ্যাঁ, আপনার কাজের প্রক্রিয়া (Workflow) ভালোভাবে বুঝে ফিচারগুলো নির্ধারণ করা হয়, যাতে আপনার অপ্রয়োজনীয় কোনো ফিচার বহন করতে না হয়।",
      selected: false,
    },
    {
      q: "Can Bangladeshi payment methods be integrated? / বাংলাদেশি পেমেন্ট পদ্ধতি কি ইন্টিগ্রেট করা যাবে?",
      a: "Yes, required payment gateways (bKash, Nagad, Rocket, card) and courier integrations can be seamlessly added. / হ্যাঁ, রিকোয়ারমেন্ট অনুযায়ী বিকাশ, নগদ, রকেট, কার্ড এবং কুরিয়ার ইন্টিগ্রেটর খুব সহজেই যুক্ত করা যাবে।",
      selected: false,
    },
    {
      q: "Will I receive support after launch? / প্রজেক্ট লঞ্চ করার পর কি কোনো সাপোর্ট পাবো?",
      a: "Yes, we provide post-launch maintenance, bug fixes, and technical assistance to keep your platform running smoothly. / হ্যাঁ, আপনার প্ল্যাটফর্ম সচল রাখতে আমরা লঞ্চের পরেও মেইনটেন্যান্স, বাগ ফিক্স এবং টেকনিক্যাল সহায়তা প্রদান করে থাকি।",
      selected: false,
    },
    {
      q: "How can I get started? / কীভাবে কাজ শুরু করতে পারি?",
      a: "Send your requirements through the contact or calculator page. We will discuss them and share a clear plan and timeline. / কন্টাক্ট বা ক্যালকুলেটর পেজের মাধ্যমে আপনার রিকোয়ারমেন্ট পাঠান। আমরা আলোচনা করে একটি সুনির্দিষ্ট পরিকল্পনা ও সময়সীমা শেয়ার করব।",
      selected: false,
    },
  ]);

  const handleSelectToggle = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index].selected = !updatedFaqs[index].selected;
    setFaqs(updatedFaqs);

    // সিলেক্ট করা প্রশ্নগুলোর টেকনিক্যাল অ্যারে প্যারেন্ট ফর্মে পাঠিয়ে দেওয়া
    if (onSelectedFaqsChange) {
      const selectedQuestions = updatedFaqs.filter((f) => f.selected).map((f) => f.q);
      onSelectedFaqsChange(selectedQuestions);
    }
  };

  return (
    <section aria-labelledby="faq">
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-400/50 bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 p-8 shadow-[0_0_40px_rgba(244,63,94,0.3)] sm:p-12">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <span className="inline-block rounded-full bg-pink-500/10 border border-pink-400/50 px-5 py-1.5 text-xs font-black uppercase tracking-widest text-pink-300 shadow-sm mb-3">
            💬 Got Questions? / কোনো প্রশ্ন আছে?
          </span>
          <h2 id="faq" className="text-3xl font-black text-white sm:text-4xl lg:text-5xl tracking-tight">
            Frequently Asked Questions <span className="text-amber-300 text-2xl sm:text-3xl block mt-1">/ সাধারণ জিজ্ঞাসা</span>
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-300 via-pink-500 to-amber-300" aria-hidden="true" />
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((f, index) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg backdrop-blur transition-all duration-300 hover:border-amber-400/40"
            >
              <summary className="cursor-pointer list-none rounded-md font-bold text-white text-base sm:text-lg marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500">
                <span className="flex items-center justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-amber-300 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </span>
              </summary>
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-sm sm:text-base leading-relaxed text-slate-300">{f.a}</p>
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectToggle(index)}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-extrabold shadow-md transition transform active:scale-95 ${
                      f.selected
                        ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30"
                        : "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 hover:scale-105"
                    }`}
                  >
                    <span>{f.selected ? "✓ Selected / নির্বাচিত" : "✓ Select / সিলেক্ট করুন"}</span>
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}