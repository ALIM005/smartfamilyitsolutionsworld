// components/FeatureExplorer.tsx
'use client';


import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { Feature } from '@/lib/features';


export default function FeatureExplorer({ features }: { features: Feature[] }) {
  const [selected, setSelected] = useState<Feature | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);


  // Open/close the dialog when selected changes
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;


    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);


  // Stop the background page from scrolling while the popup is open
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);


  return (
    <>
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <li key={feature.id}>
            <button
              type="button"
              onClick={() => setSelected(feature)}
              aria-haspopup="dialog"
              className="group flex h-full w-full flex-col rounded-2xl border border-slate-700 bg-slate-800 p-6 text-left shadow-lg transition hover:border-blue-500 hover:bg-slate-700/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              <span className="mb-3 text-3xl" aria-hidden="true">
                {feature.icon}
              </span>
              <span className="mb-2 text-xl font-semibold text-blue-400">{feature.title}</span>
              <span className="text-sm text-slate-300">{feature.description}</span>
              <span className="mt-4 text-sm font-bold text-white transition group-hover:translate-x-1">
                Details →
              </span>
            </button>
          </li>
        ))}
      </ul>


      <dialog
        ref={dialogRef}
        aria-labelledby="feature-dialog-title"
        aria-describedby="feature-dialog-details"
        onClose={() => setSelected(null)}
        onClick={(e) => {
          // Close when clicking the backdrop (outside the dialog)
          if (e.target === dialogRef.current) setSelected(null);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-slate-700 bg-slate-800 p-0 text-white shadow-2xl backdrop:bg-black/60"
      >
        {selected && (
          <div className="p-6 sm:p-8">
            <div className="mb-3 text-4xl" aria-hidden="true">
              {selected.icon}
            </div>
            <h2 id="feature-dialog-title" className="mb-4 text-2xl font-bold text-blue-400">
              {selected.title}
            </h2>
            <p id="feature-dialog-details" className="mb-6 leading-relaxed text-slate-300">
              {selected.details}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Talk about this
              </Link>
              <button
                type="button"
                onClick={() => setSelected(null)}
                autoFocus
                className="rounded-lg border border-slate-600 px-5 py-2 font-medium text-slate-200 transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}