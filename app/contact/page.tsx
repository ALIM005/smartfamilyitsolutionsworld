import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { COMPANY } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'সাপোর্ট বা যেকোনো জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন।',
};

export default function ContactPage() {
  return (
    <div className="py-12 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black">যোগাযোগ</h1>
        <p className="text-slate-600 mt-2">
          সাপোর্ট বা যেকোনো প্রশ্নের জন্য ফর্মটি পূরণ করুন, অথবা ইমেইল করুন:{' '}
          <a href={`mailto:${COMPANY.email}`} className="text-blue-600 underline">{COMPANY.email}</a>
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
