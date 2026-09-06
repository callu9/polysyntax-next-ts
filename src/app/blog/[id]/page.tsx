import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePage from '@/components/ArticlePage';
import { ArticleStructuredData } from '@/components/ArticleStructuredData';
import { getInitialArticleData } from '@/lib/articleData';
import { absoluteUrl, getArticleMetadata, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';
import { localePath } from '@/lib/localeRoutes';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = getInitialArticleData(id, 'en');
  if (!data) return { title: 'Page not found | PolySyntax', robots: { index: false, follow: false } };
  const origin = await getSiteOrigin();
  return getArticleMetadata(data.article, absoluteUrl(origin, localePath('en', `/blog/${id}`)), await getLocaleAlternates(origin, `/blog/${id}`));
}

export default async function ArticleRoute({ params }: PageProps) {
  const { id } = await params;
  const data = getInitialArticleData(id, 'en');
  if (!data) notFound();
  const canonical = absoluteUrl(await getSiteOrigin(), localePath('en', `/blog/${id}`));
  return (
    <>
      <ArticleStructuredData post={data.article} canonical={canonical} />
      <ArticlePage key={data.article.slug} initialArticle={data.article} initialContent={data.content} />
    </>
  );
}
