import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogArchivePage from '@/components/BlogArchivePage';
import { getTranslations } from '@/content/translations';
import { isLocale, type Locale } from '@/lib/localeRoutes';
import { getLocalizedPageMetadata, getSiteOrigin } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

async function getLocale(params: PageProps['params']): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const copy = getTranslations(locale);
  if (!copy) return { title: 'PolySyntax', robots: { index: false, follow: false } };
  return await getLocalizedPageMetadata(copy.blog.title, copy.common.siteDescription, locale, '/blog', await getSiteOrigin());
}

export default async function LocaleBlog({ params }: PageProps) {
  return <BlogArchivePage locale={await getLocale(params)} />;
}
