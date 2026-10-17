import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products, getProduct } from '@/lib/products';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.name, description: p.tagline };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-slate-900">{p.name}</h1>
        <p className="text-xl text-blue-600 font-medium">{p.tagline}</p>
        <p className="text-slate-600">{p.description}</p>
      </div>

      <section aria-labelledby="features" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 id="features" className="font-bold mb-3">মূল ফিচার</h2>
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          {p.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        {p.appPath && (
          <Link href={p.appPath} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition">
            অ্যাপ খুলুন
          </Link>
        )}
        <Link href="/contact" className="border border-slate-300 bg-white hover:bg-slate-100 px-6 py-3 rounded-xl font-bold transition">
          যোগাযোগ করুন
        </Link>
      </div>
    </div>
  );
}
