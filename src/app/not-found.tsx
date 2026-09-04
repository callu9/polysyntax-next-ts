'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/useTranslation';
import { usePathname } from 'next/navigation';
import { getLocaleFromPath, localePath } from '@/lib/localeRoutes';

export default function NotFound() {
  const pathname = usePathname();
  const routeLanguage = getLocaleFromPath(pathname);
  const { t } = useTranslation(routeLanguage ?? undefined);
  const href = (path: string) => routeLanguage ? localePath(routeLanguage, path) : path;

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">404</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">{t('common.notFoundTitle')}</h1>
      <p className="mt-4 text-muted-foreground">{t('common.notFoundDescription')}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href={href('/')} className="min-h-11 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{t('common.goHome')}</Link>
        <Link href={href('/blog')} className="min-h-11 border border-border px-4 py-3 text-sm font-semibold text-primary">{t('common.browseBlog')}</Link>
      </div>
    </main>
  );
}
