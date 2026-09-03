import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/content/blog/metadata';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin();
  if (!origin) return [];
  return [
    '/',
    '/about',
    '/blog',
    ...getAllBlogPosts('en').map((post) => `/blog/${post.id}`),
  ].map((path) => ({ url: absoluteUrl(origin, path) }));
}
