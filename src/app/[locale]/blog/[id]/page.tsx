import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePage from '@/components/ArticlePage';
import { ArticleStructuredData } from '@/components/ArticleStructuredData';
import { getInitialArticleData } from '@/lib/articleData';
import { isLocale, localePath, type Locale } from '@/lib/localeRoutes';
import { absoluteUrl, getArticleMetadata, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string; id: string }> };

async function getParams(params: PageProps['params']): Promise<{ locale: Locale; id: string }> {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, id };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, id } = await getParams(params);
  const data = getInitialArticleData(id, locale);
  if (!data) return { title: 'Page not found | PolySyntax', robots: { index: false, follow: false } };
  const origin = await getSiteOrigin();
  const pathname = `/blog/${id}`;
  return getArticleMetadata(data.article, absoluteUrl(origin, localePath(locale, pathname)), await getLocaleAlternates(origin, pathname));
}

export default async function LocaleArticleRoute({ params }: PageProps) {
  const { locale, id } = await getParams(params);
  const data = getInitialArticleData(id, locale);
  if (!data) notFound();
  const canonical = absoluteUrl(await getSiteOrigin(), localePath(locale, `/blog/${id}`));
  return (
    <>
      <ArticleStructuredData post={data.article} canonical={canonical} />
      <ArticlePage key={data.article.slug} initialArticle={data.article} initialContent={data.content} locale={locale} />
    </>
  );
}
