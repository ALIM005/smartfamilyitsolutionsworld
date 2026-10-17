import Link from 'next/link';
import { COMPANY, products } from '@/lib/products';

const services = [
  { icon: '🌐', title: 'Web Development', text: 'আধুনিক, দ্রুত ও SEO-বান্ধব ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন।' },
  { icon: '📦', title: 'ERP & Business Software', text: 'ব্যবসার প্রয়োজন অনুযায়ী কাস্টম সফটওয়্যার সলিউশন।' },
  { icon: '☁️', title: 'Cloud Applications', text: 'ক্লাউড-ভিত্তিক নিরাপদ অ্যাপ, যেকোনো জায়গা থেকে ব্যবহারযোগ্য।' },
  { icon: '🛠️', title: 'IT Support', text: 'সফটওয়্যার রক্ষণাবেক্ষণ ও টেকনিক্যাল সাপোর্ট।' },
];

export default function HomePage() {
  return (
    <div className="space-y-20 py-10">
      <section className="text-center space-y-6 py-10">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">
          {COMPANY.name}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">{COMPANY.description}</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold shadow transition">
            আমাদের সফটওয়্যার
          </Link>
          <Link href="/contact" className="border border-slate-300 bg-white hover:bg-slate-100 px-7 py-3 rounded-xl font-bold transition">
            যোগাযোগ করুন
          </Link>
        </div>
      </section>

      <section aria-labelledby="services">
        <h2 id="services" className="text-2xl font-bold mb-6">আমাদের সার্ভিস</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div key={s.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-bold mb-1">{s.title}</h3>
              <p className="text-sm text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="products">
        <h2 id="products" className="text-2xl font-bold mb-6">আমাদের প্রোডাক্ট</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition block"
            >
              <h3 className="text-xl font-bold text-blue-600">{p.name}</h3>
              <p className="text-slate-600 mt-1">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
