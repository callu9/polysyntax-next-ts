import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/content/blog/metadata';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';
import { getIndexablePaths } from '@/lib/localeRoutes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin();
  if (!origin) return [];
  return getIndexablePaths(getAllBlogPosts('en').map((post) => post.id))
    .map((path) => ({ url: absoluteUrl(origin, path) }));
}
