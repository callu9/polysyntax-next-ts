export const LOCALES = ['en', 'ko', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && LOCALES.includes(value as Locale));
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  return isLocale(segment) ? segment : null;
}

export function stripLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (!locale) return pathname;
  return pathname.slice(locale.length + 1) || '/';
}

export function localePath(locale: Locale, pathname: string): string {
  return `/${locale}${pathname === '/' ? '' : pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
