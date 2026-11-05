// lib/contact.ts
// Contact information in one place. The footer (app/layout.tsx) and SEO structured data (app/page.tsx) take it from here.
// To change the information, edit only this file.


export const CONTACT = {
  name: 'H M ALIM UDDIN',
  email: 'alim@smartfamilyitsolutionsworld.com',
  whatsappNumber: '8801934111005', // With country code, without + and spaces (for the wa.me link)
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
  'Assalamu Alaikum, I would like to know about Smart Family IT Solutions World.';


export const whatsappUrl = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
export const mailtoUrl = `mailto:${CONTACT.email}`;


// Meeting booking (Calendly)
export const CALENDLY_URL = 'https://calendly.com/smartfamilyitsolutionsworld/30min';


// One-line address (thana and division are the same as the district, so they have been omitted)
export const addressLine = `${CONTACT.address.village}, ${CONTACT.address.postOffice}-${CONTACT.address.postCode}, ${CONTACT.address.district}`;


// Social media profiles. To add a new one, provide name ('Facebook' or 'YouTube') and url.
export const SOCIAL = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/1DzCBa7ejy/' },
  { name: 'YouTube', url: 'https://youtube.com/@analimtv?si=SwsHozn1jeiIBA9E' },
] as const;