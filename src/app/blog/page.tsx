'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getAllBlogPosts } from '@/content/blog/metadata';
import { getBlogFilterOptions, filterBlogPosts } from '@/lib/blogDiscovery';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguageStore } from '@/store/languageStore';

const PAGE_SIZE = 6;

export default function Blog() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8" />}>
      <BlogArchive />
    </Suspense>
  );
}

function BlogArchive() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const articles = getAllBlogPosts(language);
  const options = getBlogFilterOptions(articles);
  const query = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const tag = searchParams.get('tag') ?? '';
  const requestedPage = Number(searchParams.get('page') ?? 1);
  const result = filterBlogPosts(articles, { query, category, tag, page: requestedPage, pageSize: PAGE_SIZE });
  const locale = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';
  const hasFilters = Boolean(query || category || tag || result.page > 1);

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  const clearFilters = () => router.replace(pathname, { scroll: false });

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Archive</p>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{t('blog.title')}</h1>
          <p aria-live="polite" className="text-sm text-muted-foreground">{result.total} {t('blog.results')} · {language.toUpperCase()}</p>
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
              className="w-full border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="article-category" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.category')}</label>
            <select
              id="article-category"
              value={options.categories.includes(category) ? category : ''}
              onChange={(event) => updateQuery('category', event.target.value)}
              className="w-full border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">{t('blog.allCategories')}</option>
              {options.categories.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="article-tag" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.tag')}</label>
            <select
              id="article-tag"
              value={options.tags.includes(tag) ? tag : ''}
              onChange={(event) => updateQuery('tag', event.target.value)}
              className="w-full border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">{t('blog.allTags')}</option>
              {options.tags.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="border border-border px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-secondary">
              {t('blog.clearFilters')}
            </button>
          )}
        </div>

        {result.total === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">{t('blog.noMatchingArticles')}</p>
            <button type="button" onClick={clearFilters} className="mt-5 text-sm font-semibold text-primary underline underline-offset-4">{t('blog.resetFilters')}</button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {result.posts.map((article) => (
                <article key={article.id} className="group grid gap-5 py-8 md:grid-cols-[10rem_1fr] md:gap-10">
                  <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    <p>{new Date(article.date).toLocaleDateString(locale)}</p>
                    <p className="mt-2">{article.readTime} {t('blog.readTime')}</p>
                    <p className="mt-2">{article.category}</p>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      <Link href={`/blog/${article.id}`} className="transition-colors group-hover:text-primary">{article.title}</Link>
                    </h2>
                    <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{article.excerpt}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {article.tags.map((articleTag) => <span key={articleTag} className="border border-border px-2 py-1">#{articleTag}</span>)}
                    </div>
                    <Link href={`/blog/${article.id}`} className="mt-5 inline-block text-sm font-semibold text-primary">{t('home.readMore')} →</Link>
                  </div>
                </article>
              ))}
            </div>

            {result.totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-between border-t border-border pt-6">
                <button type="button" disabled={result.page === 1} onClick={() => updateQuery('page', String(result.page - 1))} className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40">← {t('blog.previous')}</button>
                <span className="text-sm text-muted-foreground">{t('blog.page')} {result.page} / {result.totalPages}</span>
                <button type="button" disabled={result.page === result.totalPages} onClick={() => updateQuery('page', String(result.page + 1))} className="text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-40">{t('blog.next')} →</button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
