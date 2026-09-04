import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/content/blog/metadata';
import { ArticleStructuredData } from '@/components/ArticleStructuredData';
import BlogPostPage from '../react-reconciliation/page';
import { absoluteUrl, getArticleMetadata, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';

type ArticlePageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const post = getBlogPost(id, 'en');
  if (!post) return { title: 'Page not found | PolySyntax', robots: { index: false, follow: false } };
  const origin = await getSiteOrigin();
  return getArticleMetadata(post, absoluteUrl(origin, `/blog/${id}`), await getLocaleAlternates(origin, `/blog/${id}`));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const post = getBlogPost(id, 'en');
  if (!post) notFound();
  const canonical = absoluteUrl(await getSiteOrigin(), `/blog/${id}`);
  return (
    <>
      <ArticleStructuredData post={post} canonical={canonical} />
      <BlogPostPage postId={id} />
    </>
  );
}
