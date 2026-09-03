import type { MetadataRoute } from 'next';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteOrigin();
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(origin ? { sitemap: absoluteUrl(origin, '/sitemap.xml') } : {}),
  };
}
