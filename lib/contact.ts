// lib/contact.ts
// যোগাযোগের তথ্য একটাই জায়গায়। ফুটার (app/layout.tsx) ও SEO স্ট্রাকচার্ড ডেটা (app/page.tsx) এখান থেকে নেয়।
// তথ্য বদলাতে শুধু এই ফাইল এডিট করুন।

export const CONTACT = {
  name: 'H M ALIM UDDIN',
  email: 'alim@smartfamilyitsolutionsworld.com',
  whatsappNumber: '8801934111005', // দেশের কোড সহ, + ও স্পেস ছাড়া (wa.me লিংকের জন্য)
  whatsappDisplay: '+8801934111005',
  address: {
    village: 'Burdeo',
    postOffice: 'Companyganj',
    postCode: '3140',
    thana: 'Companyganj',
    district: 'Sylhet',
    division: 'Sylhet',
  },
} as const;

export const WHATSAPP_GREETING =
  'আসসালামু আলাইকুম, আমি Smart Family IT Solutions World সম্পর্কে জানতে চাই।';

export const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
export const mailtoUrl = `mailto:${CONTACT.email}`;

// এক লাইনের ঠিকানা (থানা ও বিভাগ জেলার সমান হওয়ায় বাদ দেওয়া হয়েছে)
export const addressLine = `${CONTACT.address.village}, ${CONTACT.address.postOffice}-${CONTACT.address.postCode}, ${CONTACT.address.district}`;

// সোশ্যাল মিডিয়া প্রোফাইল। নতুন যোগ করতে name ('Facebook' বা 'YouTube') ও url দিন।
export const SOCIAL = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/1DzCBa7ejy/' },
  { name: 'YouTube', url: 'https://youtube.com/@analimtv?si=SwsHozn1jeiIBA9E' },
] as const;