'use client';


import { useState, FormEvent } from 'react';


// Type definitions
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
    { id: 'start', name: 'I want to start a business' },
    { id: 'grow', name: 'I want to grow my business' },
    { id: 'automate', name: 'I want to automate' },
  ];


  const optionsStep2: StepOption[] = [
    { id: 'erp', name: 'ERP and inventory solution' },
    { id: 'ecommerce', name: 'E-commerce website' },
    { id: 'custom', name: 'Custom software' },
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


    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Please provide both your name and phone number.');
      return;
    }


    setIsSubmitting(true);


    try {
      // At production level, your API call or database save logic will go here
      // For example: await fetch('/api/calculator', { method: 'POST', body: JSON.stringify({ goal, selectedProduct, ...formData }) });
      
      // Waited 1 second for simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));


      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage('Sorry, there was a problem. Please try again.');
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
        
        {/* Progress indicator */}
        {!isSubmitted && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Step {step} / 3
            </span>
            <div className="flex space-x-1.5">
              <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            </div>
          </div>
        )}


        {/* Error message display */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {errorMessage}
          </div>
        )}


        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
              1/ What could be the process for moving to the next step?
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


        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4">
              2/ Which service do you need?
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
              ← Go back
            </button>
          </div>
        )}


        {/* Step 3 */}
        {step === 3 && !isSubmitted && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              3/ Provide your information
            </h2>
            <div className="bg-slate-50 p-3 rounded-xl mb-4 text-sm text-slate-600">
              <p>Goal: <span className="font-semibold text-slate-800">{goal}</span></p>
              <p>Service: <span className="font-semibold text-slate-800">{selectedProduct}</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mobile number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                  placeholder="For example: 01700000000"
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
                ← Go back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}


        {/* After successful submission */}
        {isSubmitted && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h2>
            <p className="text-slate-600 mb-6">
              Your information has been received successfully. We will contact you very soon.
            </p>
            <button
              onClick={resetCalculator}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all text-sm"
            >
              Start again
            </button>
          </div>
        )}


      </div>
    </div>
  );
}