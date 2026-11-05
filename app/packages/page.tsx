import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Packages & Pricing | Smart Family IT Solutions World',
  description: 'Explore our affordable and flexible software development, ERP, and digital marketing service packages.',
};

export default function PackagesPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Packages & Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transparent and flexible pricing plans tailored for your business growth.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Package */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter Web</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for small businesses and portfolio sites.</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                <li>✓ Responsive Design</li>
                <li>✓ SEO Optimized Structure</li>
                <li>✓ Contact Form & WhatsApp</li>
                <li>✓ Fast Loading Speed</li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="block text-center bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-800 font-bold py-3 rounded-xl transition"
            >
              Choose Plan
            </Link>
          </div>

          {/* Professional Package */}
          <div className="bg-white rounded-2xl shadow-md border-2 border-blue-600 p-8 flex flex-col justify-between relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Most Popular
            </span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business ERP & E-Commerce</h3>
              <p className="text-gray-500 text-sm mb-6">Complete automation for growing retail and enterprises.</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                <li>✓ Inventory & POS System</li>
                <li>✓ Admin Dashboard</li>
                <li>✓ Payment Gateway Integration</li>
                <li>✓ Multi-user Role Access</li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow"
            >
              Choose Plan
            </Link>
          </div>

          {/* Enterprise Package */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Cloud Solution</h3>
              <p className="text-gray-500 text-sm mb-6">Advanced SaaS and custom multi-tenant applications.</p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                <li>✓ Fully Custom Architecture</li>
                <li>✓ Dedicated Cloud Hosting Setup</li>
                <li>✓ Priority IT Support & Maintenance</li>
                <li>✓ Custom API Integrations</li>
              </ul>
            </div>
            <Link
              href="/contact"
              className="block text-center bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-800 font-bold py-3 rounded-xl transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}