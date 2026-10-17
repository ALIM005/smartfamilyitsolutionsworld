'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();

  const tenant = params.get('tenant') || undefined;
  const rawNext = params.get('next') || '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isLogin && password.length < 8) {
      setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth?action=${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password, tenant }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'কিছু একটা ভুল হয়েছে।');
      setPassword('');
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err instanceof TypeError ? 'ইন্টারনেট সংযোগে সমস্যা।' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const input = 'w-full mt-1 border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white';

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isLogin ? 'অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট খুলুন'}
      </h1>

      {error && (
        <div role="alert" className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={isLogin ? undefined : 8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white p-3 rounded-lg font-bold transition"
        >
          {loading ? 'অপেক্ষা করুন...' : isLogin ? 'লগইন' : 'রেজিস্টার'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        {isLogin ? 'অ্যাকাউন্ট নেই?' : 'আগেই অ্যাকাউন্ট আছে?'}
        <button
          type="button"
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="text-blue-600 font-bold underline ml-1"
        >
          {isLogin ? 'রেজিস্টার করুন' : 'লগইন করুন'}
        </button>
      </div>
    </div>
  );
}
