"use client";

import Link from "next/link";
import { getAllBlogPosts } from "@/content/blog/metadata";
import { getHomeEditorial } from "@/lib/blogDiscovery";
import { useTranslation } from "@/i18n/useTranslation";
import { useLanguageStore } from "@/store/languageStore";
import { usePathname } from 'next/navigation';
import { getLocaleFromPath, localePath, type Locale } from '@/lib/localeRoutes';

export default function Home({ forcedLanguage }: { forcedLanguage?: Locale } = {}) {
  const { t } = useTranslation(forcedLanguage);
  const { language } = useLanguageStore();
  const pathname = usePathname();
  const routeLanguage = getLocaleFromPath(pathname);
  const activeLanguage = forcedLanguage ?? routeLanguage ?? language;
  const href = (path: string) => routeLanguage ? localePath(routeLanguage, path) : path;
  const editorial = getHomeEditorial(getAllBlogPosts(activeLanguage));
  const featuredArticle = editorial.featured;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t('blog.sampleArchive')}</p>
        <div className="grid gap-12 border-b border-border pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">{t("home.title")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{t("home.subtitle")}</p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{t('home.editorialNote')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("home.latestArticles")}</h2>
            <span className="text-xs text-muted-foreground">{editorial.total} {t('home.articleCount')}</span>
          </div>
          <Link href="/blog" className="inline-flex min-h-11 items-center text-sm font-medium text-primary transition-opacity hover:opacity-80">{t('home.viewAll')} →</Link>
        </div>

        {!featuredArticle ? (
          <p className="border border-border py-16 text-center text-muted-foreground">{t('home.noArticles')}</p>
        ) : (
          <>
          <Link href={href(`/blog/${featuredArticle.id}`)} className="group block border border-border bg-card p-6 transition-colors hover:bg-secondary sm:p-8">
            <div className="mb-12 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground">
              <span>{t('blog.sampleArchive')}</span>
              <span>{new Date(featuredArticle.date).toLocaleDateString(activeLanguage === "ko" ? "ko-KR" : activeLanguage === "ja" ? "ja-JP" : "en-US")}</span>
              <span>{featuredArticle.readTime}{activeLanguage === 'ja' ? '' : ' '}{t("blog.readTime")}</span>
              <span>{activeLanguage.toUpperCase()}</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{featuredArticle.title}</h3>
              <div>
                <p className="leading-7 text-muted-foreground">{featuredArticle.excerpt}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-primary">{t("home.readMore")} →</span>
              </div>
            </div>
          </Link>
            {editorial.latest.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {editorial.latest.map((article) => (
                  <Link key={article.id} href={href(`/blog/${article.id}`)} className="group border border-border bg-card p-5 transition-colors hover:bg-secondary">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                      <span>{t('blog.sampleArchive')}</span>
                      <span>{new Date(article.date).toLocaleDateString(activeLanguage === "ko" ? "ko-KR" : activeLanguage === "ja" ? "ja-JP" : "en-US")}</span>
                    </div>
                    <h3 className="mt-8 text-xl font-semibold tracking-tight group-hover:text-primary">{article.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
