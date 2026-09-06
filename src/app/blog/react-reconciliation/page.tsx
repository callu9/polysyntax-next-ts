import ArticlePage from '@/components/ArticlePage';
import { ArticleStructuredData } from '@/components/ArticleStructuredData';
import { getInitialArticleData } from '@/lib/articleData';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';
import { localePath } from '@/lib/localeRoutes';
import { notFound } from 'next/navigation';

export default async function ReactReconciliationRoute() {
  const data = getInitialArticleData('react-reconciliation', 'en');
  if (!data) notFound();
  const canonical = absoluteUrl(await getSiteOrigin(), localePath('en', '/blog/react-reconciliation'));

  return (
    <>
      <ArticleStructuredData post={data.article} canonical={canonical} />
      <ArticlePage key={data.article.slug} initialArticle={data.article} initialContent={data.content} />
    </>
  );
}
