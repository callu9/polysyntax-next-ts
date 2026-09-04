'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { getAllBlogPosts } from '@/content/blog/metadata';
import { getBlogFilterOptions, filterBlogPosts } from '@/lib/blogDiscovery';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguageStore } from '@/store/languageStore';
import { getLocaleFromPath, localePath, type Locale } from '@/lib/localeRoutes';

const PAGE_SIZE = 6;

export default function Blog({ forcedLanguage }: { forcedLanguage?: Locale } = {}) {
  return (
    <Suspense fallback={<main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8" />}>
      <BlogArchive forcedLanguage={forcedLanguage} />
    </Suspense>
  );
}

function BlogArchive({ forcedLanguage }: { forcedLanguage?: Locale }) {
  const pathname = usePathname();
  const routeLanguage = getLocaleFromPath(pathname);
  const { t } = useTranslation(forcedLanguage ?? routeLanguage ?? undefined);
  const { language } = useLanguageStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLanguage = forcedLanguage ?? routeLanguage ?? language;
  const href = (path: string) => routeLanguage ? localePath(routeLanguage, path) : path;
  const articles = getAllBlogPosts(activeLanguage);
  const options = getBlogFilterOptions(articles);
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const tag = searchParams.get('tag') ?? '';
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const result = filterBlogPosts(articles, { query, category, tag, page: requestedPage, pageSize: PAGE_SIZE });
  const locale = activeLanguage === 'ko' ? 'ko-KR' : activeLanguage === 'ja' ? 'ja-JP' : 'en-US';
  const hasFilters = Boolean(query || category || tag || result.page > 1);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const previousPage = useRef(result.page);

  useEffect(() => {
    const rawPage = searchParams.get('page');
    if (rawPage && rawPage !== String(result.page)) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(result.page));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, result.page, router, searchParams]);

  useEffect(() => {
    if (previousPage.current === result.page) return;
    previousPage.current = result.page;
    resultsHeadingRef.current?.scrollIntoView({ block: 'start' });
    resultsHeadingRef.current?.focus({ preventScroll: true });
  }, [result.page]);

  const buildHref = (changes: Partial<Record<'q' | 'category' | 'tag' | 'page', string>>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ['q', 'category', 'tag', 'page'] as const) {
      const value = changes[key];
      if (value === undefined) continue;
      if (value) params.set(key, value);
      else params.delete(key);
    }
    if (!('page' in changes)) params.delete('page');
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const updateQuery = (key: string, value: string) => {
    router.replace(buildHref({ [key]: value }), { scroll: false });
  };

  const clearFilters = () => router.push(pathname, { scroll: false });

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t('blog.archive')}</p>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{t('blog.title')}</h1>
          <p aria-live="polite" className="text-sm text-muted-foreground">{result.total} {t('blog.results')} · {activeLanguage.toUpperCase()}</p>
        </div>

        <div className="grid gap-4 border-b border-border py-6 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-end">
          <div>
            <label htmlFor="article-search" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.searchPlaceholder')}</label>
            <input
              id="article-search"
              type="search"
              value={query}
              onChange={(event) => updateQuery('q', event.target.value)}
              placeholder={t('blog.searchPlaceholder')}
              className="min-h-11 w-full border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.category')}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('blog.category')}>
              <Link href={buildHref({ category: '' })} aria-current={!category ? 'page' : undefined} className={`min-h-11 border px-3 py-2 text-sm ${!category ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                {t('blog.allCategories')}
              </Link>
              {options.categories.map((option) => (
                <Link key={option.id} href={buildHref({ category: option.id })} aria-current={category === option.id ? 'page' : undefined} className={`min-h-11 border px-3 py-2 text-sm ${category === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.tag')}</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t('blog.tag')}>
              <Link href={buildHref({ tag: '' })} aria-current={!tag ? 'page' : undefined} className={`min-h-11 border px-3 py-2 text-sm ${!tag ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                {t('blog.allTags')}
              </Link>
              {options.tags.map((option) => (
                <Link key={option.id} href={buildHref({ tag: option.id })} aria-current={tag === option.id ? 'page' : undefined} className={`min-h-11 border px-3 py-2 text-sm ${tag === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
                  #{option.label}
                </Link>
              ))}
            </div>
          </div>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="min-h-11 border border-border px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary">
              {t('blog.clearFilters')}
            </button>
          )}
        </div>

        <h2 ref={resultsHeadingRef} id="article-results" tabIndex={-1} className="sr-only">{t('blog.resultsHeading')}</h2>

        {result.total === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">{t('blog.noMatchingArticles')}</p>
            <button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">{t('blog.resetFilters')}</button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {result.posts.map((article) => (
                <article key={article.id} className="group grid gap-5 py-8 md:grid-cols-[10rem_1fr] md:gap-10">
                  <div className="font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground">
                    <p>{new Date(article.date).toLocaleDateString(locale)}</p>
                    <p className="mt-2">{article.readTime}{activeLanguage === 'ja' ? '' : ' '}{t('blog.readTime')}</p>
                    <p className="mt-2">{article.category}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      <Link href={href(`/blog/${article.id}`)} className="transition-colors group-hover:text-primary">{article.title}</Link>
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{article.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {article.tags.map((articleTag) => <span key={articleTag} className="border border-border px-2 py-1">#{articleTag}</span>)}
                    </div>
                    <Link href={href(`/blog/${article.id}`)} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-primary">{t('home.readMore')} →</Link>
                  </div>
                </article>
              ))}
            </div>

            {result.totalPages > 1 && (
              <nav aria-label={t('blog.pagination')} className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                {result.page > 1 ? <Link href={buildHref({ page: String(result.page - 1) })} className="min-h-11 py-3 text-sm font-semibold text-primary">← {t('blog.previous')}</Link> : <span className="min-h-11 py-3 text-sm text-muted-foreground/50">← {t('blog.previous')}</span>}
                <div className="flex items-center gap-2" aria-label={t('blog.pagination')}>
                  {Array.from({ length: result.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <Link key={pageNumber} href={buildHref({ page: String(pageNumber) })} aria-current={pageNumber === result.page ? 'page' : undefined} aria-label={`${t('blog.page')} ${pageNumber}`} className={`min-h-11 min-w-11 border px-3 py-3 text-center text-sm font-semibold ${pageNumber === result.page ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-primary hover:bg-secondary'}`}>
                      {pageNumber}
                    </Link>
                  ))}
                </div>
                {result.page < result.totalPages ? <Link href={buildHref({ page: String(result.page + 1) })} className="min-h-11 py-3 text-sm font-semibold text-primary">{t('blog.next')} →</Link> : <span className="min-h-11 py-3 text-sm text-muted-foreground/50">{t('blog.next')} →</span>}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
