export const LOCALES = ['en', 'ko', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];
export const DOCUMENT_LOCALE_HEADER = 'x-polysyntax-locale';

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

export function getDocumentLocale(pathname: string): Locale {
  return getLocaleFromPath(pathname) ?? 'en';
}

export function resolveArticleLanguage(pathname: string, language: Locale): Locale {
  return getLocaleFromPath(pathname) ?? language;
}

export function changeLocalePath(pathname: string, locale: Locale): string {
  return localePath(locale, stripLocale(pathname));
}

export function profileRedirectPath(locale?: Locale): string {
  return locale ? localePath(locale, '/about') : '/about';
}

export function resolveLanguageSwitch(pathname: string, locale: Locale, query: string):
  | { type: 'load-article' }
  | { type: 'navigate'; href: string } {
  if (stripLocale(pathname).startsWith('/blog/')) return { type: 'load-article' };
  return { type: 'navigate', href: `${changeLocalePath(pathname, locale)}${query}` };
}

export function getIndexablePaths(postIds: string[]): string[] {
  return LOCALES.flatMap((locale) => [
    localePath(locale, '/'),
    localePath(locale, '/about'),
    localePath(locale, '/blog'),
    ...postIds.map((id) => localePath(locale, `/blog/${id}`)),
  ]);
}
