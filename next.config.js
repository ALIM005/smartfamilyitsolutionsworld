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
      // সব পেজে সিকিউরিটি হেডার
      { source: '/:path*', headers: securityHeaders },
      // API রেসপন্স যেন কখনো ক্যাশ না হয় (সেশন/ইউজার ডাটা আছে)
      {
        source: '/api/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },

  async redirects() {
    // www → www ছাড়া (SEO-তে ডুপ্লিকেট কনটেন্ট এড়াতে)
    // নতুন ডোমেইন যোগ করলে এখানেও একটি এন্ট্রি যোগ করুন
    const domains = ['smartfamilyitsolutionsworld.com', 'awmearp.com'];
    return domains.map((d) => ({
      source: '/:path*',
      has: [{ type: 'host', value: `www.${d}` }],
      destination: `https://${d}/:path*`,
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
