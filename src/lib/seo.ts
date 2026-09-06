import type { Metadata } from 'next';
import type { BlogPost } from '@/content/blog/metadata';
import type { Locale } from './localeRoutes';

export function parseSiteOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.origin : null;
  } catch {
    return null;
  }
}

export async function getSiteOrigin(): Promise<string | null> {
  return parseSiteOrigin(process.env.SITE_URL);
}

export function absoluteUrl(origin: string | null, path: string): string {
  return origin ? new URL(path, origin).toString() : path;
}

function ogImage(canonical: string): string {
  return canonical.startsWith('http') ? new URL('/opengraph-image.svg', canonical).toString() : '/opengraph-image.svg';
}

export async function getLocaleAlternates(origin: string | null, pathname: string): Promise<Record<string, string>> {
  const { LOCALES, localePath } = await import('./localeRoutes');
  return Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(origin, localePath(locale, pathname))]));
}

export async function getLocalizedPageMetadata(title: string, description: string, locale: Locale, pathname: string, origin: string | null): Promise<Metadata> {
  if (!origin) {
    return {
      title,
      description,
      openGraph: { title, description, siteName: 'PolySyntax' },
      twitter: { card: 'summary', title, description },
    };
  }

  const languages = await getLocaleAlternates(origin, pathname);
  const canonical = languages[locale];
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: { title, description, url: canonical, siteName: 'PolySyntax', images: [{ url: ogImage(canonical), width: 1200, height: 630, alt: 'PolySyntax' }] },
    twitter: { card: 'summary', title, description, images: [ogImage(canonical)] },
  };
}

export function getArticleMetadata(post: BlogPost, canonical: string, languages?: Record<string, string>): Metadata {
  const hasAbsoluteCanonical = canonical.startsWith('http://') || canonical.startsWith('https://');
  return {
    title: `${post.title} | PolySyntax`,
    description: post.excerpt,
    ...(hasAbsoluteCanonical ? { alternates: { canonical, ...(languages ? { languages } : {}) } } : {}),
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      siteName: 'PolySyntax',
      ...(hasAbsoluteCanonical ? {
        url: canonical,
        images: [{ url: ogImage(canonical), width: 1200, height: 630, alt: 'PolySyntax' }],
      } : {}),
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.excerpt,
      ...(hasAbsoluteCanonical ? { images: [ogImage(canonical)] } : {}),
    },
  };
}
