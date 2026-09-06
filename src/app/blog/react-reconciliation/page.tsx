import ArticlePage from '@/components/ArticlePage';
import { getInitialArticleData } from '@/lib/articleData';
import { notFound } from 'next/navigation';

export default async function ReactReconciliationRoute() {
  const data = getInitialArticleData('react-reconciliation', 'en');
  if (!data) notFound();

  return <ArticlePage key={data.article.slug} initialArticle={data.article} initialContent={data.content} />;
}
