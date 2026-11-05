import React from 'react';
import Link from 'next/link';


export const metadata = {
  title: 'Terms & Conditions | Smart Family IT Solutions World',
  description: 'Terms and conditions for using Smart Family IT Solutions World and Smart Family Point services.',
};


export default function TermsPage() {
  const lastUpdated = 'November 3, 2026';


  return (
    <div className="min-h-screen bg-[#FFF4F6] text-[#2E0A1C] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F3C6D3] overflow-hidden">
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#4A0F2E] via-[#6E0F3D] to-[#4A0F2E] text-white p-8 sm:p-10 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-[#E3B964] italic">
            Terms of Smart Family IT Solutions World and Smart Family Point
          </p>
          <p className="text-xs text-[#FBD3DE]/80 mt-3">
            Last Updated: {lastUpdated}
          </p>
        </div>


        {/* Content Section */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-800 leading-relaxed text-sm sm:text-base">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              1. Introduction & Acceptance
            </h2>
            <p>
              Welcome to <strong>Smart Family IT Solutions World</strong> and its e-commerce ecosystem, <strong>Smart Family Point</strong>. By accessing this website or purchasing any digital solution/product, you agree to accept all of these terms and conditions. If you do not agree with these terms, please refrain from using the website.
            </p>
          </section>


          {/* User Accounts */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              2. User Account & Security
            </h2>
            <p className="mb-2">
              When creating an account to place orders or receive services on our platform, you must provide accurate and up-to-date information.
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>You are entirely responsible for maintaining the confidentiality of your password and account.</li>
              <li>You must immediately notify our support team of any unauthorized use.</li>
            </ul>
          </section>


          {/* Services & Products */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              3. Services & Pricing
            </h2>
            <p>
              We make every effort to display accurate descriptions and prices for all our software solutions (ERP, POS, Spreadsheet Apps) and products. However, if there is an error in the price or description of any product due to a technical fault, we reserve the right to correct it or cancel the order at any stage of order processing.
            </p>
          </section>


          {/* Orders & Payments */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              4. Orders & Online Payment
            </h2>
            <p className="mb-2">
              For online payments, we use completely secure payment gateways (SSLCommerz / MFS Gateway).
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>An order will only be considered confirmed after the payment has been successfully processed.</li>
              <li>If there is any complication regarding payment or the order is not processed even after money has been deducted from your account, you must contact customer support with the transaction ID within 24-48 hours.</li>
            </ul>
          </section>


          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              5. Intellectual Property
            </h2>
            <p>
              All content, software code, logos, designs, and brand names of Smart Family IT Solutions World are protected under Bangladeshi and international copyright laws. Reproducing or using these materials for commercial purposes without the company's prior permission is strictly prohibited.
            </p>
          </section>


          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-bold text-[#4A0F2E] mb-3 border-b-2 border-[#F3C6D3] pb-1">
              6. Governing Law
            </h2>
            <p>
              These terms and conditions shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any unforeseen disputes shall be resolved under the jurisdiction of the appropriate courts of Bangladesh.
            </p>
          </section>


          {/* Contact Information */}
          <section className="bg-[#FFF4F6] p-6 rounded-xl border border-[#F3C6D3]">
            <h2 className="text-lg font-bold text-[#4A0F2E] mb-2">
              Contact us directly
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              If you have any questions regarding the terms or our services, you can contact us directly:
            </p>
            <div className="text-sm space-y-1 font-medium text-gray-800">
              <p>🏢 <strong>Smart Family IT Solutions World</strong></p>
              <p>📍 Burdeo, Companyganj-3140, Sylhet, Bangladesh</p>
              <p>✉️ Email: <a href="mailto:alim@smartfamilyitsolutionsworld.com" className="text-[#B0124F] hover:underline">alim@smartfamilyitsolutionsworld.com</a></p>
            </div>
          </section>


          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-between pt-6 border-t border-gray-200 gap-4 text-sm font-semibold">
            <Link 
              href="/" 
              className="text-[#B0124F] hover:text-[#4A0F2E] transition-colors"
            >
              ← Back to homepage
            </Link>
            <div className="space-x-4">
              <Link href="/privacy" className="text-gray-600 hover:text-[#B0124F]">
                Privacy Policy
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