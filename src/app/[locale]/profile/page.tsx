import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProfilePage from '@/components/ProfilePage';
import { getTranslations } from '@/content/translations';
import { isLocale, LOCALES, type Locale } from '@/lib/localeRoutes';
import { getLocalizedPageMetadata, getSiteOrigin } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

async function getLocale(params: PageProps['params']): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const copy = getTranslations(locale)?.profile;
  if (!copy) return { title: 'Profile | PolySyntax', robots: { index: false, follow: false } };
  return getLocalizedPageMetadata(copy.title, copy.bio, locale, '/profile', await getSiteOrigin());
}

export default async function LocaleProfileRoute({ params }: PageProps) {
  return <ProfilePage locale={await getLocale(params)} />;
}
