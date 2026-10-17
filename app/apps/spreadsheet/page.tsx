'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MAX_ROWS = 200;
const MAX_COLS = 26;
const LOGIN_URL = '/login?tenant=spreadsheet&next=/apps/spreadsheet';

const createGrid = (rows = 20, cols = 10): string[][] =>
  Array.from({ length: rows }, () => Array(cols).fill('') as string[]);

export default function SpreadsheetPage() {
  const router = useRouter();
  const [sheet, setSheet] = useState<string[][]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/sync');
        if (res.status === 401 || res.status === 403) {
          router.replace(LOGIN_URL);
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error();
        setSheet(Array.isArray(data.data) && data.data.length ? data.data : createGrid());
        setEmail(data.email || '');
      } catch {
        setLoadFailed(true);
        setNotice({ type: 'error', text: 'ডাটা লোড করা যায়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।' });
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const changeCell = (r: number, c: number, value: string) => {
    setSheet((prev) =>
      prev.map((row, ri) => row.map((cell, ci) => (ri === r && ci === c ? value.slice(0, 1000) : cell)))
    );
    setDirty(true);
  };

  const addRow = () => {
    if (sheet.length >= MAX_ROWS) return;
    setSheet((prev) => [...prev, Array(prev[0]?.length || 10).fill('')]);
    setDirty(true);
  };

  const addColumn = () => {
    if ((sheet[0]?.length || 0) >= MAX_COLS) return;
    setSheet((prev) => prev.map((row) => [...row, '']));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: sheet }),
      });
      if (res.status === 401 || res.status === 403) {
        router.replace(LOGIN_URL);
        return;
      }
      if (!res.ok) throw new Error();
      setDirty(false);
      setNotice({ type: 'success', text: 'ডাটা সফলভাবে সেভ হয়েছে।' });
    } catch {
      setNotice({ type: 'error', text: 'সেভ করা যায়নি। আবার চেষ্টা করুন।' });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth?action=logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Smart Spreadsheet</h1>
          <p className="text-slate-500 text-sm">{email}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving || !dirty || loadFailed}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition"
          >
            {saving ? 'সেভ হচ্ছে...' : 'Save Changes'}
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          aria-live="polite"
          className={`p-3 rounded-lg text-sm ${
            notice.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {notice.text}
        </div>
      )}

      {!loadFailed && (
        <>
          <div className="flex gap-3">
            <button type="button" onClick={addRow} className="px-4 py-2 text-sm font-semibold border border-slate-300 bg-white rounded-lg hover:bg-slate-100">
              + Row
            </button>
            <button type="button" onClick={addColumn} className="px-4 py-2 text-sm font-semibold border border-slate-300 bg-white rounded-lg hover:bg-slate-100">
              + Column
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {sheet.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className="border border-slate-200 p-1 min-w-[27.5 px]">
                        <input
                          type="text"
                          value={cell}
                          aria-label={`Row ${r + 1}, column ${c + 1}`}
                          onChange={(e) => changeCell(r, c, e.target.value)}
                          className={`w-full p-2 text-sm outline-none ${
                            r === 0 ? 'font-bold bg-slate-100' : 'bg-transparent'
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
