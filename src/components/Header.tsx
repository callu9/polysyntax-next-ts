'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';
import type { Language } from '@/store/languageStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { ChevronDown, LogOut, LogIn } from 'lucide-react';

export const Header = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { language, requestedLanguage, setLanguage, requestLanguage, clearRequestedLanguage } = useLanguageStore();
  const { user, logout, isAuthenticated } = useAuthStore();
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

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            {t('common.siteName')}
          </Link>

          <nav className="hidden gap-7 md:flex" aria-label="Primary navigation">
            <Link href="/" className={`border-b pb-1 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${pathname === '/' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t('common.home')}
            </Link>
            <Link href="/blog" className={`border-b pb-1 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${pathname.startsWith('/blog') ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t('common.blog')}
            </Link>
            <Link href="/about" className={`border-b pb-1 text-xs font-medium uppercase tracking-[0.16em] transition-colors ${pathname === '/about' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {t('common.about')}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 border border-border bg-card px-3 py-2 text-xs font-medium tracking-[0.12em] text-foreground transition-colors hover:bg-secondary">
                {selectedLanguage.toUpperCase()}
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.value}
                    onClick={() => selectLanguage(lang.value)}
                    className={`cursor-pointer ${selectedLanguage === lang.value ? 'bg-accent text-accent-foreground font-semibold' : ''}`}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
                  <div className="text-sm">{user.name}</div>
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      {t('common.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                    <LogOut size={16} className="mr-2" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-2 bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 sm:flex"
              >
                <LogIn size={16} />
                {t('common.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
