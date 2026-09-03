import type { Metadata } from 'next';
import { getBlogPost } from '@/content/blog/metadata';
import { ArticleStructuredData } from '@/components/ArticleStructuredData';
import { absoluteUrl, getArticleMetadata, getSiteOrigin } from '@/lib/seo';

const post = getBlogPost('react-reconciliation', 'en');

export async function generateMetadata(): Promise<Metadata> {
  if (!post) return { title: 'Page not found | PolySyntax', robots: { index: false, follow: false } };
  return getArticleMetadata(post, absoluteUrl(await getSiteOrigin(), '/blog/react-reconciliation'));
}

export default async function ArticleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!post) return children;
  return (
    <>
      <ArticleStructuredData post={post} canonical={absoluteUrl(await getSiteOrigin(), '/blog/react-reconciliation')} />
      {children}
    </>
  );
}
