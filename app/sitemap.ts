import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { getOrigin, getProductByHost, products } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get('host') || '';
  const origin = getOrigin(host);
  const now = new Date();

  // প্রোডাক্টের নিজস্ব ডোমেইন হলে শুধু তার হোমপেজ
  if (getProductByHost(host)) {
    return [{ url: origin, lastModified: now, priority: 1 }];
  }

  return [
    { url: origin, lastModified: now, priority: 1 },
    { url: `${origin}/products`, lastModified: now, priority: 0.8 },
    ...products.map((p) => ({
      url: `${origin}/products/${p.slug}`,
      lastModified: now,
      priority: 0.7,
    })),
    { url: `${origin}/contact`, lastModified: now, priority: 0.5 },
    { url: `${origin}/privacy`, lastModified: now, priority: 0.3 },
  ];
}
