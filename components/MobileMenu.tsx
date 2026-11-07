'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

const mainLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/features', label: 'Features' },
  { href: '/marketplace', label: 'Marketplace' },
];

const serviceLinks = [
  {
    href: '/services/web-development',
    label: 'Web & E-Commerce Dev',
  },
  {
    href: '/services/erp-software',
    label: 'ERP & Business Software',
  },
  {
    href: '/services/digital-marketing',
    label: 'Digital Marketing & SEO',
  },
  {
    href: '/services/design-branding',
    label: 'Design, Branding & IT',
  },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/team', label: 'Our Team' },
  { href: '/packages', label: 'Packages / Price' },
];

const otherLinks = [
  { href: '/contact', label: 'Contact' },
  { href: '/wishlist', label: 'Wishlist' },
  { href: '/compare', label: 'Compare' },
];

const linkGroups = [
  { title: 'Navigation', links: mainLinks },
  { title: 'Services', links: serviceLinks },
  { title: 'Company', links: companyLinks },
  { title: 'More', links: otherLinks },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const menuId = useId();

  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handleOutsidePointer(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointer);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative shrink-0 lg:hidden"
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        className="flex h-11 w-11 items-center justify-center rounded-xl text-[#ffdc73] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffdc73]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-8 w-8"
        >
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <nav
        id={menuId}
        aria-label="Mobile navigation"
        hidden={!open}
        className="absolute right-0 top-full z-[70] mt-3 w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-2xl border-2 border-[#e0a820] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-center justify-between border-b border-[#ecdba7] bg-[#fff8df] px-4 py-3">
          <span className="text-sm font-extrabold text-[#0a1f5c]">
            Menu
          </span>

          <Link
            href="/admin"
            prefetch={false}
            rel="nofollow"
            aria-label="VIP"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0a820] bg-[#ffe18a] text-[#3a2600] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a1f5c]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M12 3a6 6 0 0 0-3.5 10.9c.9.7 1.5 1.8 1.5 3.1h4c0-1.3.6-2.4 1.5-3.1A6 6 0 0 0 12 3Z" />
              <path d="M10 20h4M11 22h2M12 1v1M3 9H1M23 9h-2" />
            </svg>
          </Link>
        </div>

        <div className="max-h-[65vh] overflow-y-auto overscroll-contain p-2">
          {linkGroups.map((group) => (
            <section
              key={group.title}
              className="mb-2 last:mb-0"
            >
              <h2 className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-[#866114]">
                {group.title}
              </h2>

              <ul className="space-y-1">
                {group.links.map((link) => {
                  const active = pathname === link.href;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? 'page' : undefined}
                        className={`block rounded-xl px-3 py-2.5 text-sm font-bold text-[#0a1f5c] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b97a05] ${
                          active
                            ? 'bg-[#fff1c2]'
                            : 'hover:bg-[#fff8df]'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </nav>
    </div>
  );
}