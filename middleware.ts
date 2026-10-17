import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getProductByHost, getProductByPath } from '@/lib/products';

const COOKIE = 'sf_token';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';

  // ১. কাস্টম ডোমেইনের হোম → ঐ প্রোডাক্টের ল্যান্ডিং পেজ
  if (pathname === '/') {
    const product = getProductByHost(host);
    if (product) {
      const url = req.nextUrl.clone();
      url.pathname = `/products/${product.slug}`;
      return NextResponse.rewrite(url);
    }
  }

  // ২. /apps/* লগইন ছাড়া নয়
  if (pathname.startsWith('/apps')) {
    const token = req.cookies.get(COOKIE)?.value;
    let valid = false;
    if (token && process.env.JWT_SECRET) {
      try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        valid = true;
      } catch {
        valid = false;
      }
    }
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.search = '';
      url.searchParams.set('next', pathname);
      const product = getProductByPath(pathname);
      if (product) url.searchParams.set('tenant', product.slug);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/apps/:path*'],
};
