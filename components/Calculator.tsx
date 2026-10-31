'use client';

import { useState, FormEvent } from 'react';

// টাইপ ডিফিনিশন
interface StepOption {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  phone: string;
}

export default function Calculator() {
  const [step, setStep] = useState<number>(1);
  const [goal, setGoal] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const optionsStep1: StepOption[] = [
    { id: 'start', name: 'ব্যবসা শুরু করতে চাই' },
    { id: 'grow', name: 'ব্যবসা বড় করতে চাই' },
    { id: 'automate', name: 'অটোমেশন করতে চাই' },
  ];

  const optionsStep2: StepOption[] = [
    { id: 'erp', name: 'ইআরপি ও ইনভেন্টরি সলিউশন' },
    { id: 'ecommerce', name: 'ইকমর্স ওয়েবসাইট' },
    { id: 'custom', name: 'কাস্টম সফটওয়্যার' },
  ];

  const handleSelectGoal = (goalTitle: string) => {
    setGoal(goalTitle);
    setStep(2);
    setErrorMessage('');
  };

  const handleSelectProduct = (productTitle: string) => {
    setSelectedProduct(productTitle);
    setStep(3);
    setErrorMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    // সাধারণ ভ্যালিডেশন
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('দয়া করে আপনার নাম এবং ফোন নম্বর উভয়ই প্রদান করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      // প্রোডাকশন লেভেলে এখানে আপনার API কল বা ডাটাবেজ সেভ করার লজিক থাকবে
      // যেমন: await fetch('/api/calculator', { method: 'POST', body: JSON.stringify({ goal, selectedProduct, ...formData }) });
      
      // সিমুলেশনের জন্য ১ সেকেন্ড অপেক্ষা করা হলো
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage('দুঃখিত, কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCalculator = () => {
    setStep(1);
    setGoal('');
    setSelectedProduct('');
    setFormData({ name: '', phone: '' });
    setIsSubmitted(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl transition-all">
        
        {/* প্রোগ্রেস ইন্ডিকেটর */}
        {!isSubmitted && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              ধাপ {step} / ৩
            </span>
            <div className="flex space-x-1.5">
              <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}

        {/* এরর মেসেজ প্রদর্শন */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* স্টেপ ১ */}
        {step === 1 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
              ১/ পরবর্তী ধাপে যাওয়ার প্রক্রিয়া কি হতে পারে?
            </h2>
            <div className="space-y-3">
              {optionsStep1.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectGoal(option.name)}
                  className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-indigo-600">
                    {option.name}
                  </span>
                  <span className="text-slate-400 group-hover:text-indigo-600">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* স্টেপ ২ */}
        {step === 2 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
              ২/ আপনার কোন সার্ভিসটি প্রয়োজন?
            </h2>
            <div className="space-y-3">
              {optionsStep2.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectProduct(option.name)}
                  className="w-full text-left p-4 border border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                >
                  <span className="text-slate-700 font-medium group-hover:text-indigo-600">
                    {option.name}
                  </span>
                  <span className="text-slate-400 group-hover:text-indigo-600">→</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setStep(1);
                setErrorMessage('');
              }}
              className="mt-6 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              ← পেছনে ফিরে যান
            </button>
          </div>
        )}

        {/* স্টেপ ৩ */}
        {step === 3 && !isSubmitted && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              ৩/ আপনার তথ্য প্রদান করুন
            </h2>
            <div className="bg-slate-50 p-3 rounded-xl mb-4 text-sm text-slate-600">
              <p>লক্ষ্য: <span className="font-semibold text-slate-800">{goal}</span></p>
              <p>সার্ভিস: <span className="font-semibold text-slate-800">{selectedProduct}</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="যেমন: 01700000000"
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setErrorMessage('');
                }}
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                ← পেছনে ফিরে যান
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'সাবমিট হচ্ছে...' : 'সাবমিট করুন'}
              </button>
            </div>
          </form>
        )}

        {/* সফলভাবে সাবমিট হওয়ার পর */}
        {isSubmitted && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ধন্যবাদ!</h2>
            <p className="text-slate-600 mb-6">
              আপনার তথ্য সফলভাবে গ্রহণ করা হয়েছে। খুব শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
            </p>
            <button
              onClick={resetCalculator}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all text-sm"
            >
              আবার শুরু করুন
            </button>
          </div>
        )}

      </div>
    </div>
  );
}