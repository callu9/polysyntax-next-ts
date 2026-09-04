import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Blog from '../../blog/page';
import { getTranslations } from '@/content/translations';
import { isLocale, type Locale } from '@/lib/localeRoutes';
import { getLocalizedPageMetadata, getSiteOrigin } from '@/lib/seo';

type LocalePageProps = { params: Promise<{ locale: string }> };

async function getLocale(params: LocalePageProps['params']): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const copy = getTranslations(locale);
  if (!copy) return { title: 'PolySyntax', robots: { index: false, follow: false } };
  return await getLocalizedPageMetadata(copy.blog.title, copy.common.siteDescription, locale, '/blog', await getSiteOrigin());
}

export default async function LocaleBlog({ params }: LocalePageProps) {
  return <Blog forcedLanguage={await getLocale(params)} />;
}
