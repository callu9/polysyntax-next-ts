'use client';

import Link from 'next/link';
import { getAllBlogPosts } from '@/content/blog/metadata';
import { useTranslation } from '@/i18n/useTranslation';
import { useLanguageStore } from '@/store/languageStore';

export default function Blog() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const articles = getAllBlogPosts(language);
  const locale = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Archive</p>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-8">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">{t('blog.title')}</h1>
          <p className="text-sm text-muted-foreground">{articles.length} {articles.length === 1 ? 'entry' : 'entries'} · {language.toUpperCase()}</p>
        </div>

        {articles.length === 0 ? (
          <p className="py-16 text-lg text-muted-foreground">{t('blog.noArticles')}</p>
        ) : (
          <div className="divide-y divide-border">
            {articles.map((article) => (
              <article key={article.id} className="group grid gap-5 py-8 md:grid-cols-[10rem_1fr] md:gap-10">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <p>{new Date(article.date).toLocaleDateString(locale)}</p>
                  <p className="mt-2">{article.readTime} {t('blog.readTime')}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    <Link href={`/blog/${article.id}`} className="transition-colors group-hover:text-primary">{article.title}</Link>
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{article.excerpt}</p>
                  <Link href={`/blog/${article.id}`} className="mt-5 inline-block text-sm font-semibold text-primary">{t('home.readMore')} →</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
