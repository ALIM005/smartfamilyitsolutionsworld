import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const routing = {
  locales: ['en', 'bn'],
  defaultLocale: 'en',
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = localeCookie && routing.locales.includes(localeCookie) ? localeCookie : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});