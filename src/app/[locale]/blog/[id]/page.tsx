import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/content/blog/metadata';
import { ArticleStructuredData } from '@/components/ArticleStructuredData';
import BlogPostPage from '../../../blog/react-reconciliation/page';
import { isLocale, localePath, type Locale } from '@/lib/localeRoutes';
import { absoluteUrl, getArticleMetadata, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';

type LocaleArticlePageProps = { params: Promise<{ locale: string; id: string }> };

async function getParams(params: LocaleArticlePageProps['params']): Promise<{ locale: Locale; id: string }> {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, id };
}

export async function generateMetadata({ params }: LocaleArticlePageProps): Promise<Metadata> {
  const { locale, id } = await getParams(params);
  const post = getBlogPost(id, locale);
  if (!post) return { title: 'Page not found | PolySyntax', robots: { index: false, follow: false } };
  const origin = await getSiteOrigin();
  const pathname = `/blog/${id}`;
  return getArticleMetadata(post, absoluteUrl(origin, localePath(locale, pathname)), await getLocaleAlternates(origin, pathname));
}

export default async function LocaleArticlePage({ params }: LocaleArticlePageProps) {
  const { locale, id } = await getParams(params);
  const post = getBlogPost(id, locale);
  if (!post) notFound();
  const canonical = absoluteUrl(await getSiteOrigin(), localePath(locale, `/blog/${id}`));
  return (
    <>
      <ArticleStructuredData post={post} canonical={canonical} />
      <BlogPostPage postId={id} forcedLanguage={locale} />
    </>
  );
}
