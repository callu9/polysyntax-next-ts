'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguageStore } from '@/store/languageStore';
import type { Language } from '@/store/languageStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';

const navigationItems = [
  { href: '/', key: 'common.home' },
  { href: '/blog', key: 'common.blog' },
  { href: '/about', key: 'common.about' },
] as const;

export const Header = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { language, requestedLanguage, setLanguage, requestLanguage, clearRequestedLanguage } = useLanguageStore();
  const selectedLanguage = requestedLanguage ?? language;
  const isArticleRoute = pathname.startsWith('/blog/');

  useEffect(() => {
    useLanguageStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!isArticleRoute) clearRequestedLanguage();
  }, [clearRequestedLanguage, isArticleRoute]);

  const selectLanguage = (nextLanguage: Language) => {
    if (isArticleRoute) {
      requestLanguage(nextLanguage);
      return;
    }

    setLanguage(nextLanguage);
  };

  const languages: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ko', label: '한국어' },
    { value: 'ja', label: '日本語' },
  ];

  const isActive = (href: string) => href === '/' ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:bg-primary focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground">
        {t('common.skipToContent')}
      </a>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="inline-flex min-h-11 items-center text-lg font-semibold tracking-tight text-foreground">
            {t('common.siteName')}
          </Link>

          <nav className="hidden gap-7 md:flex" aria-label={t('common.navigation')}>
            {navigationItems.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`inline-flex min-h-11 items-center border-b pb-1 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${isActive(href) ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex min-h-11 items-center gap-2 border border-border bg-card px-3 py-2 text-xs font-medium tracking-[0.12em] text-foreground transition-colors hover:bg-secondary md:hidden"
                aria-label={t('common.menu')}
              >
                <Menu size={16} aria-hidden="true" />
                <span>{t('common.menu')}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48 md:hidden">
                {navigationItems.map(({ href, key }) => (
                  <DropdownMenuItem
                    key={href}
                    asChild
                    className={isActive(href) ? 'bg-accent text-accent-foreground font-semibold' : undefined}
                  >
                    <Link href={href} aria-current={isActive(href) ? 'page' : undefined} className="min-h-11 cursor-pointer px-3 py-2">
                      {t(key)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex min-h-11 items-center gap-1 border border-border bg-card px-3 py-2 text-xs font-medium tracking-[0.12em] text-foreground transition-colors hover:bg-secondary"
                aria-label={t('common.language')}
              >
                {selectedLanguage.toUpperCase()}
                <ChevronDown size={16} aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.value}
                    onClick={() => selectLanguage(lang.value)}
                    className={`min-h-11 cursor-pointer ${selectedLanguage === lang.value ? 'bg-accent text-accent-foreground font-semibold' : ''}`}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
