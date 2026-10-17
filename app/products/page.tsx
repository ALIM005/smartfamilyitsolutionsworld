import type { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Smart Family IT Solutions World-এর সকল সফটওয়্যার ও অ্যাপ্লিকেশন।',
};

export default function ProductsPage() {
  return (
    <div className="py-10 space-y-8">
      <h1 className="text-3xl font-black">আমাদের সফটওয়্যার</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {products.map((p) => (
          <article key={p.slug} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-blue-600">{p.name}</h2>
            <p className="text-slate-600">{p.description}</p>
            <div className="flex gap-3 pt-2">
              <Link href={`/products/${p.slug}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                বিস্তারিত
              </Link>
              {p.domain && (
                <a href={`https://${p.domain}`} className="border border-slate-300 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-semibold transition">
                  {p.domain} ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
