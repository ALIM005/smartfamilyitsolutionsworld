const createNextIntlPlugin = require('next-intl/plugin');


// Specifies the path to the i18n.ts file
const withNextIntl = createNextIntlPlugin('./i18n.ts');


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,


  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
      },
    ];


    return [
      // Security headers for all pages
      { source: '/:path*', headers: securityHeaders },
      // API responses should never be cached (they contain session/user data)
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },


  async redirects() {
    // www → without www (to avoid duplicate content in SEO)
    // When adding a new domain, add an entry here as well
    const domains = [
      'smartfamilyitsolutionsworld.com',
      'awmearp.com',
      'smartfamilypoint.com',
    ];
    return domains.map((d) => ({
      source: '/:path*',
      has: [{ type: 'host', value: `www.${d}` }],
      destination: `https://${d}/:path*`,
      permanent: true,
    }));
  },
};


module.exports = withNextIntl(nextConfig);