// lib/features.ts
// Feature data in one place. To change the text, edit only this file.


export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  details: string;
}


export const featuresData: Feature[] = [
  {
    id: 'inventory',
    icon: '📦',
    title: 'Inventory Management',
    description: 'Stock calculation, stock alerts, and product information in one place.',
    details:
      'Manage stock updates, low-stock alerts, and product information from one place to keep your warehouse accounts under control.',
  },
  {
    id: 'warehouse',
    icon: '🏬',
    title: 'Warehouse',
    description: 'Stock tracking for multiple warehouses or branches.',
    details:
      'Easily manage stock transfers across multiple locations or warehouses and centralized monitoring.',
  },
  {
    id: 'pos',
    icon: '🧾',
    title: 'POS and Invoice',
    description: 'Quick sales, POS, memo, and invoice printing and generation.',
    details:
      'Fast billing at the cash counter, memo creation, and the ability to print or download professional invoices. Required hardware connections, including a barcode scanner, can be added according to your needs.',
  },
  {
    id: 'ecommerce',
    icon: '🛍️',
    title: 'E-commerce Store',
    description: 'An integrated solution for online store, customer, and order management.',
    details:
      'Online shop with cart, coupons, and checkout. Online orders can be matched with stock and customer information in the same system.',
  },
  {
    id: 'accounting',
    icon: '📊',
    title: 'Accounting',
    description: 'Easily view income-expenses, dues-receivables, and reports.',
    details:
      'View daily ledgers, profit-loss calculations, and required financial reports from one place.',
  },
  {
    id: 'vendor',
    icon: '🏪',
    title: 'Vendor Dashboard',
    description: 'A separate management panel for multi-vendor marketplaces.',
    details:
      'A system for vendors to upload products, calculate commissions, and track separate payments.',
  },
  {
    id: 'hrm',
    icon: '👥',
    title: 'HRM and Payroll',
    description: 'Employee information, attendance, and salary calculation.',
    details:
      'Features for employee attendance, leave management, and creating salary sheets.',
  },
  {
    id: 'analytics',
    icon: '📈',
    title: 'Analytics',
    description: 'Business dashboards from sales, stock, and customer data.',
    details:
      'You will be able to make business decisions by viewing sales, stock, and customer trends through graphs and reports.',
  },
  {
    id: 'spreadsheet',
    icon: '🗂️',
    title: 'Cloud Spreadsheet',
    description: 'Cloud-based spreadsheet, private data, and auto sync.',
    details:
      'The ability to manage data directly in the browser, like Excel or Google Sheets; data automatically syncs to the cloud.',
  },
  {
    id: 'sms',
    icon: '🔔',
    title: 'SMS and Notifications',
    description: 'Automatic SMS, email, and notifications for order updates and payments.',
    details:
      'Automatic SMS and email messages for orders, payments, and alerts to stay in touch with customers.',
  },
  {
    id: 'security',
    icon: '🔐',
    title: 'Secure Login',
    description: 'Role-based access, password security, and OTP/code verification.',
    details:
      'Determine who can view or change what through roles, password security, and OTP verification when needed. Data is securely exchanged over HTTPS.',
  },
  {
    id: 'crm',
    icon: '🤝',
    title: 'CRM',
    description: 'Customer information, communication, and relationship management.',
    details:
      'A tool to store customer information, follow-up reminders, and communication history in one place.',
  },
];