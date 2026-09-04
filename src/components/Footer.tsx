'use client';

import { useTranslation } from '@/i18n/useTranslation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocaleFromPath, localePath } from '@/lib/localeRoutes';

export const Footer = () => {
  const pathname = usePathname();
  const routeLanguage = getLocaleFromPath(pathname);
  const { t } = useTranslation(routeLanguage ?? undefined);
  const href = (path: string) => routeLanguage ? localePath(routeLanguage, path) : path;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-3 text-base font-semibold text-foreground">{t('common.siteName')}</h3>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">{t('common.siteDescription')}</p>
          </div>
          <nav aria-label={t('common.navigation')}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t('common.navigation')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={href('/')} className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-primary">{t('common.home')}</Link></li>
              <li><Link href={href('/blog')} className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-primary">{t('common.blog')}</Link></li>
              <li><Link href={href('/about')} className="inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-primary">{t('common.about')}</Link></li>
            </ul>
          </nav>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t('common.contact')}</h4>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:contact@polysyntax.dev" className="inline-flex min-h-11 items-center transition-colors hover:text-primary">
                contact@polysyntax.dev
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>&copy; {year}{' '}{t('common.siteName')}. {t('common.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};
