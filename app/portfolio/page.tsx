import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Portfolio | Smart Family IT Solutions World',
  description: 'Explore our successfully completed web applications, ERP systems, and digital solutions.',
};

export default function PortfolioPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Our Portfolio
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Showcasing our successfully deployed web apps, ERP software, and digital platforms.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Enterprise ERP System</h3>
            <p className="text-gray-600 text-sm mb-4">Complete business automation with inventory, POS, and accounting modules.</p>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">Web App</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-blue-600 mb-2">E-Commerce Super Shop</h3>
            <p className="text-gray-600 text-sm mb-4">High-performance multi-vendor online marketplace with secure checkout.</p>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">E-Commerce</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Cloud Spreadsheet Platform</h3>
            <p className="text-gray-600 text-sm mb-4">Custom cloud-based data management tool tailored for business analytics.</p>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">SaaS</span>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-block bg-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Start Your Project
          </Link>
        </div>
      </div>
    </main>
  );
}