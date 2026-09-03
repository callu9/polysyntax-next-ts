import type { Metadata } from 'next';
import type { BlogPost } from '@/content/blog/metadata';

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

export function getArticleMetadata(post: BlogPost, canonical: string): Metadata {
  return {
    title: `${post.title} | PolySyntax`,
    description: post.excerpt,
    alternates: { canonical },
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
