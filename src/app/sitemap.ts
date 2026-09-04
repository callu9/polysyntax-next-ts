import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/content/blog/metadata';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';
import { LOCALES, localePath } from '@/lib/localeRoutes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin();
  if (!origin) return [];
  const legacyPaths = [
    '/',
    '/about',
    '/blog',
    ...getAllBlogPosts('en').map((post) => `/blog/${post.id}`),
  ];
  const localePaths = LOCALES.flatMap((locale) => [
    localePath(locale, '/'),
    localePath(locale, '/about'),
    localePath(locale, '/blog'),
    ...getAllBlogPosts(locale).map((post) => localePath(locale, `/blog/${post.id}`)),
  ]);
  return [...legacyPaths, ...localePaths].map((path) => ({ url: absoluteUrl(origin, path) }));
}
