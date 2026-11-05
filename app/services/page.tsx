import React from 'react';
import Link from 'next/link';
import { SERVICES_DATA, ServiceCategory, SubService } from '@/data/data';

export const metadata = {
  title: 'All Services | Smart Family IT Solutions World',
  description: 'Explore our comprehensive end-to-end digital services, software development, digital marketing, SEO, and IT consultancy under one roof.',
};

export default function AllServicesPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            All Services
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            End-to-end digital services under one roof
          </p>
        </header>

        {/* Services Categories List */}
        <section className="space-y-12">
          {SERVICES_DATA.map((category: ServiceCategory, catIndex: number) => (
            <div 
              key={`category-${catIndex}`} 
              className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl p-6 sm:p-8 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b border-gray-100 pb-3 uppercase tracking-wide">
                {category.title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.subservices.map((sub: SubService, subIndex: number) => (
                  <div 
                    key={`sub-${subIndex}`}
                    className="flex items-center p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all bg-gray-50/50 group"
                  >
                    <span className="text-2xl mr-3 group-hover:scale-110 transition-transform" role="img" aria-label={sub.name}>
                      {sub.icon}
                    </span>
                    <span className="text-gray-800 font-medium group-hover:text-blue-600 transition-colors">
                      {sub.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}