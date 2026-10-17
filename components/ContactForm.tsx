'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'পাঠানো যায়নি।');
      setStatus('ok');
      setForm({ name: '', email: '', subject: '', message: '', website: '' });
    } catch (err: any) {
      setError(err instanceof TypeError ? 'ইন্টারনেট সংযোগে সমস্যা।' : err.message);
      setStatus('error');
    }
  };

  const input = 'w-full mt-1 border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white';
  const label = 'text-xs font-bold text-slate-500 uppercase';

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      {status === 'ok' && (
        <div role="status" className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg">
          বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <div>
        <label htmlFor="c-name" className={label}>নাম</label>
        <input id="c-name" required maxLength={100} value={form.name} onChange={set('name')} className={input} />
      </div>
      <div>
        <label htmlFor="c-email" className={label}>ইমেইল</label>
        <input id="c-email" type="email" required value={form.email} onChange={set('email')} className={input} />
      </div>
      <div>
        <label htmlFor="c-subject" className={label}>বিষয়</label>
        <input id="c-subject" maxLength={150} value={form.subject} onChange={set('subject')} className={input} />
      </div>
      <div>
        <label htmlFor="c-message" className={label}>বার্তা</label>
        <textarea id="c-message" required minLength={10} maxLength={3000} rows={5} value={form.message} onChange={set('message')} className={input} />
      </div>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white p-3 rounded-lg font-bold transition"
      >
        {status === 'sending' ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}
      </button>
    </form>
  );
}
