import type { Metadata } from 'next';
import type { BlogPost } from '@/content/blog/metadata';
import type { Locale } from './localeRoutes';

export async function getSiteOrigin(): Promise<string | null> {
  const { headers } = await import('next/headers');
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  if (!host) return null;
  const protocol = requestHeaders.get('x-forwarded-proto')?.split(',')[0].trim() || 'http';
  return `${protocol}://${host}`;
}

export function absoluteUrl(origin: string | null, path: string): string {
  return origin ? new URL(path, origin).toString() : path;
}

export async function getLocaleAlternates(origin: string | null, pathname: string): Promise<Record<string, string>> {
  const { LOCALES, localePath } = await import('./localeRoutes');
  return Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(origin, localePath(locale, pathname))]));
}

export async function getLocalizedPageMetadata(title: string, description: string, locale: Locale, pathname: string, origin: string | null): Promise<Metadata> {
  const languages = await getLocaleAlternates(origin, pathname);
  const canonical = languages[locale];
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: 'PolySyntax' },
    twitter: { card: 'summary', title, description },
  };
}

export function getArticleMetadata(post: BlogPost, canonical: string, languages?: Record<string, string>): Metadata {
  return {
    title: `${post.title} | PolySyntax`,
    description: post.excerpt,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.title,
      description: post.excerpt,
      siteName: 'PolySyntax',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
    },
  };
}
