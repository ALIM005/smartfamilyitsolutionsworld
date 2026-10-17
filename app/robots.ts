import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getOrigin } from '@/lib/products';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') || '';
  const origin = getOrigin(host);

  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/apps/', '/login'] }],
    sitemap: `${origin}/sitemap.xml`,
  };
}
