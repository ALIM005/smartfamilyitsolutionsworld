import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/products';


export const metadata: Metadata = {
  title: 'Cancellation Policy | Smart Family IT Solutions World',
  description: 'Order cancellation and product/service revocation policy for Smart Family IT Solutions World.',
};


export default function CancellationPage() {
  const lastUpdated = 'November 2026';


  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Cancellation Policy
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            Policies regarding order cancellation and service revocation
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
              1. Order Cancellation Rules
            </h2>
            <p className="mb-2">
              As a customer, you have the full right to cancel your order, but it must be done within certain conditions and timeframes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>If you wish to cancel a product or service order after placing it, you must contact us before the product is shipped.</li>
              <li>If a physical product has already been sent via courier or is out for delivery, the cancellation policy will not apply; in that case, you must follow the return policy after receiving the product.</li>
              <li>Once digital software or service provisioning has started, the order generally cannot be cancelled.</li>
            </ul>
          </section>


          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              2. Order Cancellation by the Company
            </h2>
            <p className="mb-2">
              Due to unforeseen circumstances, <strong>{COMPANY.name}</strong> reserves the right to cancel any order:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>If the product is out of stock or the price is displayed incorrectly due to a technical error.</li>
              <li>If payment verification from the payment gateway (SSLCommerz) is not successfully completed.</li>
              <li>If the provided delivery address appears suspicious or incomplete.</li>
            </ul>
          </section>


          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              3. Payment Refund After Cancellation
            </h2>
            <p>
              If your order is successfully cancelled after completing an online payment, the money will be refunded to your respective account within 7-10 business days according to our refund policy.
            </p>
          </section>


          {/* Contact Box */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              Contact us quickly to cancel an order
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              To cancel an order urgently or to get information, please contact:
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
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-[#B0124F]">
                Privacy
              </Link>
              <Link href="/refund-policy" className="text-gray-600 hover:text-[#B0124F]">
                Refund Policy
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}