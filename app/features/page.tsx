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

const goldGradient = 'bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_30%,#e8a817_65%,#b97a05_100%)]';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen w-full bg-white px-4 sm:px-6 lg:px-12 py-10 text-slate-900 relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] space-y-10 relative z-10">
        
        {/* Compact Header Section */}
        <section aria-labelledby="features-title" className="flex flex-col md:flex-row items-center justify-between gap-6 py-2">
          <div className="space-y-2 text-center md:text-left">
            <h1 id="features-title" className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Our <span className="text-[#0e3b9f]">Features</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl font-medium">
              Choose the modules you need for your business workflow. Click on any card to see details.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className={`${goldGradient} flex items-center gap-2 rounded-full px-7 py-3 text-sm font-black text-slate-950 shadow-[0_4px_20px_rgba(232,168,23,0.45)] transition hover:scale-105 border border-yellow-200`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-amber-400">►</span>
              Get Started
            </Link>
          </div>
        </section>

        {/* Feature Explorer Container - VIP Royal Blue Cards with Metallic Gold Borders & Glow */}
        <section aria-labelledby="explorer-title" className="w-full">
          <h2 id="explorer-title" className="sr-only">Available Modules</h2>
          
          <div className="
            [&_div.grid]:gap-7 
            [&_div.group]:relative 
            [&_div.group]:overflow-hidden 
            [&_div.group]:rounded-3xl 
            [&_div.group]:border-2 
            [&_div.group]:border-[#ffd700] 
            [&_div.group]:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
            [&_div.group]:from-[#0d3b9f] 
            [&_div.group]:via-[#051a54] 
            [&_div.group]:to-[#020b24] 
            [&_div.group]:p-7 
            [&_div.group]:text-white 
            [&_div.group]:shadow-[0_10px_30px_rgba(4,18,60,0.5),0_0_20px_rgba(255,215,0,0.35)] 
            [&_div.group]:transition-all 
            [&_div.group]:duration-300 
            hover:[&_div.group]:shadow-[0_15px_35px_rgba(4,18,60,0.7),0_0_30px_rgba(255,215,0,0.6)] 
            hover:[&_div.group]:scale-[1.02]
            
            /* First Card Highlight (Golden VIP Card Effect) */
            [&_div.group:first-child]:border-[2.5px]
            [&_div.group:first-child]:border-amber-300
            [&_div.group:first-child]:bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))]
            [&_div.group:first-child]:from-[#b8860b]/70
            [&_div.group:first-child]:via-[#051a54]
            [&_div.group:first-child]:to-[#020b24]
            [&_div.group:first-child]:shadow-[0_0_30px_rgba(255,215,0,0.5)]

            [&_h3]:text-2xl 
            [&_h3]:font-black 
            [&_h3]:text-white 
            [&_p]:text-slate-200 
            [&_p]:text-xs 
            sm:[&_p]:text-sm 
            [&_p]:leading-relaxed
            
            /* VIP Gold Pill Button inside cards */
            [&_a]:mt-5
            [&_a]:inline-flex
            [&_a]:items-center
            [&_a]:gap-1.5
            [&_a]:rounded-full
            [&_a]:bg-[linear-gradient(180deg,#fff0a8_0%,#ffd34d_40%,#e8a817_100%)]
            [&_a]:px-6
            [&_a]:py-2.5
            [&_a]:text-xs
            [&_a]:font-black
            [&_a]:text-slate-950
            [&_a]:shadow-[0_4px_15px_rgba(232,168,23,0.4)]
            [&_a]:border
            [&_a]:border-yellow-100
            hover:[&_a]:scale-105
            hover:[&_a]:brightness-110
          ">
            <FeatureExplorer features={featuresData} />
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section
          aria-labelledby="features-cta"
          className="relative overflow-hidden rounded-3xl border-2 border-[#e0a820] bg-[linear-gradient(90deg,#04143f_0%,#0a3a9e_50%,#04143f_100%)] px-6 py-12 sm:py-16 text-center text-white shadow-[0_0_35px_rgba(255,200,60,0.25)]"
        >
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 id="features-cta" className="text-3xl sm:text-4xl font-black text-white">
              Which module do you need?
            </h2>
            <p className="mx-auto text-slate-200 text-sm sm:text-base leading-relaxed">
              Tell us about your business workflow. We will discuss and provide a plan for the necessary modules, timeline, and cost.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className={`${goldGradient} rounded-full border border-[#fff3b8] px-8 py-3.5 text-sm font-black text-[#0a1f5c] shadow-[0_0_20px_rgba(255,200,60,0.5)] transition hover:scale-105 hover:brightness-110`}
              >
                Contact us
              </Link>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-[#e0a820] bg-[#031033]/80 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#e0a820] hover:text-[#04143f]"
              >
                Book a 30-minute meeting →
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}