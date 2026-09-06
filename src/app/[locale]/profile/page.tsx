import { isLocale, profileRedirectPath, type Locale } from '@/lib/localeRoutes';
import { notFound, redirect } from 'next/navigation';

type PageProps = { params: Promise<{ locale: string }> };

export default async function LocaleProfileRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(profileRedirectPath(locale as Locale));
}
