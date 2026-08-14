"use client";

import Link from "next/link";
import { getAllBlogPosts } from "@/content/blog/metadata";
import { useTranslation } from "@/i18n/useTranslation";
import { useLanguageStore } from "@/store/languageStore";

export default function Home() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const featuredArticle = getAllBlogPosts(language)[0];

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Issue 001</p>
        <div className="grid gap-12 border-b border-border pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">{t("home.title")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{t("home.subtitle")}</p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">Frontend ideas, read at the pace and in the language that lets the details land.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("home.latestArticles")}</h2>
          <Link href="/blog" className="text-sm font-medium text-primary transition-opacity hover:opacity-80">Archive →</Link>
        </div>

        {featuredArticle && (
          <Link href={`/blog/${featuredArticle.id}`} className="group block border border-border bg-card p-6 transition-colors hover:bg-secondary sm:p-8">
            <div className="mb-12 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span>{new Date(featuredArticle.date).toLocaleDateString(language === "ko" ? "ko-KR" : language === "ja" ? "ja-JP" : "en-US")}</span>
              <span>{featuredArticle.readTime} {t("blog.readTime")}</span>
              <span>{language.toUpperCase()}</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{featuredArticle.title}</h3>
              <div>
                <p className="leading-7 text-muted-foreground">{featuredArticle.excerpt}</p>
                <span className="mt-5 inline-block text-sm font-semibold text-primary">{t("home.readMore")} →</span>
              </div>
            </div>
          </Link>
        )}
      </section>
    </main>
  );
}
