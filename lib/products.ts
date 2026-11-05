// ============================================================
// The single source of truth for all products and domains
// To add a new product: place an object in the products array below.
// If there is a custom domain, also add it to the domains list in next.config.js.
// ============================================================


export const COMPANY = {
  name: 'Smart Family IT Solutions World',
  shortName: 'SmartFamily',
  domain: 'smartfamilyitsolutionsworld.com',
  email: 'support@smartfamilyitsolutionsworld.com', // TODO: put your actual support email here
  description:
    'Web and software solutions: ERP, cloud spreadsheets, and business applications.',
};


export const PORTAL_TENANT = 'portal';


export type ProductStatus = 'live' | 'coming-soon';


export type Product = {
  slug: string; // Used as URL and tenantId; do not change it once set
  name: string;
  tagline: string;
  description: string;
  features: string[];
  domain: string | null; // If there is a separate custom domain (without www)
  appPath: string | null; // If there is an app route inside this project
  status?: ProductStatus; // If not provided, it will be considered 'live'
  icon?: string;
};


export const products: Product[] = [
  {
    slug: 'awm-erp',
    name: 'AWM ERP',
    tagline: 'A complete ERP solution for managing business',
    description:
      'ERP software built to manage accounting, inventory, sales, and employee management in one place.',
    features: ['Accounting and inventory', 'Sales and purchase management', 'Reports and dashboard'],
    domain: 'awmearp.com',
    appPath: null,
    status: 'live',
    icon: '📦',
  },
  {
    slug: 'spreadsheet',
    name: 'Smart Spreadsheet',
    tagline: 'Cloud-synced spreadsheet right in the browser',
    description:
      'Enter data through a simple interface and securely access your sheets from any device.',
    features: ['Cloud save', 'User-based separate data', 'Fast and simple interface'],
    domain: null,
    appPath: '/apps/spreadsheet',
    status: 'live',
    icon: '📊',
  },
];


// ---------- Helpers ----------


export const TENANT_IDS: string[] = [PORTAL_TENANT, ...products.map((p) => p.slug)];


export const isValidTenant = (t: string) => TENANT_IDS.includes(t);


export const getProduct = (slug: string) => products.find((p) => p.slug === slug);


// Removes port and www, in lowercase
export const normalizeHost = (host: string) =>
  host.split(':')[0].trim().toLowerCase().replace(/^www\./, '');


export const getProductByHost = (host: string) => {
  const h = normalizeHost(host);
  return products.find((p) => p.domain === h);
};


export const getProductByPath = (path: string) =>
  products.find(
    (p) => p.appPath && (path === p.appPath || path.startsWith(p.appPath + '/'))
  );


// The correct origin according to the domain (for sitemap, robots, canonical)
export function getOrigin(host: string) {
  const raw = host.split(':')[0].trim().toLowerCase();


  // Local development
  if (raw === 'localhost' || raw === '127.0.0.1') return `http://${host}`;


  // Vercel preview deployment: return its own link
  if (raw.endsWith('.vercel.app')) return `https://${raw}`;


  const product = getProductByHost(raw);
  return `https://${product?.domain ?? COMPANY.domain}`;
}