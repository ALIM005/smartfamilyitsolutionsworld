import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';


export const metadata: Metadata = {
  title: 'Refund & Return Policy | Smart Family IT Solutions World',
  description: 'Refund, return and cancellation policy for Smart Family IT Solutions World and Smart Family Point.',
};


export default function RefundPolicyPage() {
  const lastUpdated = 'November 2026';


  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Refund & Return Policy
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            Policies regarding refunds, returns, and product returns
          </p>
          <p className="text-xs text-[#FBD3DE]/80 mt-3">
            Last updated: {lastUpdated}
          </p>
        </div>


        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-800 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              1. Return Policy
            </h2>
            <p className="mb-2">
              For products or services purchased from our platform, there is an opportunity for return or exchange subject to certain conditions:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>A return request must be submitted within a maximum of 3 to 7 days after receiving the product delivery.</li>
              <li>The product must be unused, defect-free, and in its original packaging.</li>
              <li>For digital software licenses or subscriptions, the policy may be different (generally not refundable after activation).</li>
            </ul>
          </section>


          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              2. Refund Process
            </h2>
            <p className="mb-2">
              If your refund request is approved, the refund process will be completed as follows:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>If payment was made via online payment (SSLCommerz / MFS) or card, the money will be refunded to the respective account or card within 7 to 10 business days against the specific transaction.</li>
              <li>In the case of Cash on Delivery, the refund will be provided via bank transfer or mobile financial services (bKash/Nagad).</li>
              <li>The original product price may be refunded, excluding gateway charges or processing fees (if applicable).</li>
            </ul>
          </section>


          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              3. Cancellation Policy
            </h2>
            <p>
              After an order is confirmed, you can cancel the order at any time before the product is shipped or digital service provisioning begins. To cancel an order, you must immediately contact our customer support or hotline.
            </p>
          </section>


          {/* Contact Box */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              Refund and return support
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              Contact us for any support regarding refunds or returns:
            </p>
            <div className="text-sm space-y-1 font-medium text-gray-800">
              <p>🏢 <strong>{COMPANY.name}</strong></p>
              <p>📍 Burdeo, Companyganj-3140, Sylhet, Bangladesh</p>
              <p>
                ✉️ Email:{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-[#B0124F] hover:underline font-bold">
                  {COMPANY.email}
                </a>
              </p>
            </div>
          </section>


          {/* Footer Navigation */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200 gap-4 text-sm font-semibold">
            <Link 
              href="/" 
              className="text-[#B0124F] hover:text-[#4A0F2E] transition-colors"
            >
              ← Back to homepage
            </Link>
            <div className="space-x-4">
              <Link href="/terms" className="text-gray-600 hover:text-[#B0124F]">
                Terms & Conditions
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-[#B0124F]">
                Privacy Policy
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}