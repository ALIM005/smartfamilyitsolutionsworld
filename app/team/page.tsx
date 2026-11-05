import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Our Team | Smart Family IT Solutions World',
  description: 'Meet the expert developers and software architects behind Smart Family IT Solutions World.',
};

export default function TeamPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Our Team
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals committed to delivering top-tier software solutions.
          </p>
        </header>

        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            AU
          </div>
          <h2 className="text-2xl font-bold text-gray-900">H M Alim Uddin</h2>
          <p className="text-blue-600 font-medium text-sm mt-1">Founder & Software Architect</p>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            Leading full-stack development, cloud integrations, and enterprise software architecture at Smart Family IT Solutions World.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}