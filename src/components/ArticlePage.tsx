'use client';

import { getArticleNeighbors, getBlogContent, getBlogPost, getRelatedBlogPosts, type BlogPost } from '@/content/blog/metadata';
import { getTranslations } from '@/content/translations';
import { useTranslation } from '@/i18n/useTranslation';
import {
  canCommitRequest,
  getArticleHeadingScrollTarget,
  getArticleScrollRatio,
  getArticleScrollTarget,
  LANGUAGE_TIMEOUT_MS,
  type ReadingPosition,
} from '@/lib/multilingualReading';
import { useLanguageStore } from '@/store/languageStore';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { changeLocalePath, getLocaleFromPath, localePath, resolveArticleLanguage, type Locale } from '@/lib/localeRoutes';
import { formatArchiveDate } from '@/lib/dateFormatting';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ArticleSnapshot = { article: BlogPost; content: string };

const markdownComponents: Components = {
  h1: () => null,
  h2: ({ node, ...props }) => { void node; return <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight" {...props} />; },
  h3: ({ node, ...props }) => { void node; return <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight" {...props} />; },
  p: ({ node, ...props }) => { void node; return <p className="mb-5 leading-8 text-muted-foreground" {...props} />; },
  ul: ({ node, ...props }) => { void node; return <ul className="mb-5 list-inside list-disc space-y-2 leading-8 text-muted-foreground" {...props} />; },
  ol: ({ node, ...props }) => { void node; return <ol className="mb-5 list-inside list-decimal space-y-2 leading-8 text-muted-foreground" {...props} />; },
  code: ({ node, className, ...props }) => {
    void node;
    return className
      ? <code className="mb-5 block overflow-x-auto border border-border bg-card p-4 font-mono text-sm leading-6 text-foreground" {...props} />
      : <code className="bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground" {...props} />;
  },
  pre: ({ node, ...props }) => { void node; return <pre className="mb-5" {...props} />; },
  blockquote: ({ node, ...props }) => { void node; return <blockquote className="my-6 border-l-2 border-primary pl-5 italic leading-8 text-muted-foreground" {...props} />; },
  a: ({ node, ...props }) => { void node; return <a className="font-medium text-primary underline underline-offset-4 hover:opacity-80" {...props} />; },
};

function captureReadingPosition(article: HTMLElement): ReadingPosition {
  const headings = Array.from(article.querySelectorAll<HTMLElement>('h2, h3'));
  let headingOrdinal: number | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  headings.forEach((heading, index) => {
    const distance = Math.abs(heading.getBoundingClientRect().top);
    if (distance < nearestDistance) {
      headingOrdinal = index;
      nearestDistance = distance;
    }
  });

  const articleTop = window.scrollY + article.getBoundingClientRect().top;
  return {
    headingOrdinal,
    ratio: getArticleScrollRatio(window.scrollY, articleTop, article.scrollHeight, window.innerHeight),
  };
}

function restoreReadingPosition(article: HTMLElement, position: ReadingPosition): void {
  const heading = position.headingOrdinal === null
    ? undefined
    : article.querySelectorAll<HTMLElement>('h2, h3')[position.headingOrdinal];

  if (heading) {
    window.scrollTo({
      top: getArticleHeadingScrollTarget(
        window.scrollY,
        heading.getBoundingClientRect().top,
        document.documentElement.scrollHeight,
        window.innerHeight,
      ),
    });
    return;
  }

  const articleTop = window.scrollY + article.getBoundingClientRect().top;
  window.scrollTo({
    top: getArticleScrollTarget(
      position.ratio,
      articleTop,
      article.scrollHeight,
      window.innerHeight,
      document.documentElement.scrollHeight,
    ),
  });
}

export default function ArticlePage({ initialArticle, initialContent, locale }: {
  initialArticle: BlogPost;
  initialContent: string;
  locale?: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const routeLanguage = getLocaleFromPath(pathname);
  const { language, requestedLanguage, setLanguage, rememberReadingTransition, takeReadingTransition } = useLanguageStore();
  const activeLanguage = locale ?? resolveArticleLanguage(pathname, language);
  const languageStoreHydrated = useLanguageStore.persist.hasHydrated();
  const { t } = useTranslation(activeLanguage);
  const href = (path: string) => routeLanguage ? localePath(routeLanguage, path) : path;
  const [snapshot, setSnapshot] = useState<ArticleSnapshot>(() => ({ article: initialArticle, content: initialContent }));
  const [failedTarget, setFailedTarget] = useState<BlogPost['language'] | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const articleRef = useRef<HTMLElement>(null);
  const pendingPosition = useRef<ReadingPosition | null>(null);
  const latestRequestId = useRef(0);
  const lastStartedRequest = useRef<string | null>(null);
  const isInitialSnapshot = snapshot.article.slug === initialArticle.slug;
  const targetLanguage = requestedLanguage ?? (isInitialSnapshot ? activeLanguage : snapshot.article.language);
  const targetArticle = useMemo(() => getBlogPost(snapshot.article.id, targetLanguage), [snapshot.article.id, targetLanguage]);

  useEffect(() => {
    if (!targetArticle || targetArticle.slug === snapshot.article.slug) return;
    const requestKey = `${snapshot.article.slug}:${targetArticle.slug}:${retryCount}`;
    if (lastStartedRequest.current === requestKey) return;
    lastStartedRequest.current = requestKey;

    const requestId = ++latestRequestId.current;
    const startedAt = performance.now();
    const controller = new AbortController();
    const position = articleRef.current
      ? captureReadingPosition(articleRef.current)
      : pendingPosition.current ?? takeReadingTransition(snapshot.article.id, targetLanguage);
    if (position) pendingPosition.current = position;
    const timeout = window.setTimeout(() => controller.abort(), LANGUAGE_TIMEOUT_MS);

    getBlogContent(targetArticle.slug, controller.signal)
      .then((content) => {
        if (!canCommitRequest(requestId, latestRequestId.current, startedAt, performance.now())) {
          if (requestId === latestRequestId.current) setFailedTarget(targetLanguage);
          return;
        }

        pendingPosition.current = position;
        setSnapshot({ article: targetArticle, content });
        setFailedTarget(null);
      })
      .catch(() => {
        if (requestId === latestRequestId.current) setFailedTarget(targetLanguage);
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [requestedLanguage, retryCount, snapshot.article.id, snapshot.article.slug, takeReadingTransition, targetArticle, targetLanguage]);

  useLayoutEffect(() => {
    if (!languageStoreHydrated) return;

    const isInitialSnapshot = snapshot.article.slug === initialArticle.slug;
    if (isInitialSnapshot && snapshot.article.language !== activeLanguage) return;

    setLanguage(snapshot.article.language);
    document.documentElement.lang = snapshot.article.language;

    const committedPath = routeLanguage !== snapshot.article.language
      ? changeLocalePath(pathname, snapshot.article.language)
      : null;
    const commitRoute = () => {
      if (committedPath) router.replace(`${committedPath}${window.location.search}`, { scroll: false });
    };

    const position = pendingPosition.current ?? takeReadingTransition(snapshot.article.id, snapshot.article.language);
    if (!articleRef.current || !position) {
      pendingPosition.current = null;
      commitRoute();
      return;
    }
    pendingPosition.current = position;

    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (committedPath) {
        rememberReadingTransition(snapshot.article.id, snapshot.article.language, position);
        commitRoute();
        return;
      }

      void document.fonts.ready.then(() => {
        if (cancelled) return;
        pendingPosition.current = null;
        if (articleRef.current) restoreReadingPosition(articleRef.current, position);
      });
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [activeLanguage, initialArticle.slug, languageStoreHydrated, pathname, rememberReadingTransition, routeLanguage, router, setLanguage, snapshot, takeReadingTransition]);

  const article = snapshot.article;
  const articleTranslations = getTranslations(article.language);
  const relatedArticles = getRelatedBlogPosts(article.id, article.language);
  const neighbors = getArticleNeighbors(article.id, article.language);
  const isError = failedTarget === targetLanguage;
  const isLoading = !isError && requestedLanguage !== null;

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <nav aria-label={t('blog.breadcrumb')} className="mb-12 overflow-x-auto text-sm">
          <ol className="flex min-w-max items-center gap-2 text-muted-foreground">
            <li><Link href={href('/blog')} className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline">{t('blog.title')}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={href(`/blog?category=${encodeURIComponent(article.categoryId)}`)} className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline">{article.category}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="max-w-[16rem] truncate">{article.title}</li>
          </ol>
        </nav>

        {isLoading && <p role="status" aria-live="polite" className="mb-6 text-sm text-primary">{t('blog.loading')} {targetLanguage.toUpperCase()}…</p>}
        {isError && (
          <div role="alert" className="mb-6 border border-destructive/50 bg-card p-4">
            <p className="mb-3 text-sm leading-6 text-destructive">{t('blog.couldNotLoad')} {targetLanguage.toUpperCase()}. {t('blog.currentArticleUnchanged')}</p>
            <button type="button" onClick={() => { setFailedTarget(null); setRetryCount((count) => count + 1); }} className="min-h-11 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85">{t('blog.retry')} {targetLanguage.toUpperCase()}</button>
          </div>
        )}

        <article ref={articleRef} className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground">
            <span>{articleTranslations?.blog.sampleArchive}</span><span>{article.language.toUpperCase()}</span>
            <span>{formatArchiveDate(article.date, article.language === 'ko' ? 'ko-KR' : article.language === 'ja' ? 'ja-JP' : 'en-US')}</span>
            <span>{article.author}</span><span>{article.readTime}{article.language === 'ja' ? '' : ' '}{articleTranslations?.blog.readTime}</span>
          </div>
          <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>
          <div className="border-t border-border pt-10"><ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{snapshot.content}</ReactMarkdown></div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="mx-auto mt-16 max-w-3xl border-t border-border pt-8">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{articleTranslations?.blog.relatedArticles}</h2>
            <div className="grid gap-4 sm:grid-cols-3">{relatedArticles.map((relatedArticle) => <Link key={relatedArticle.id} href={href(`/blog/${relatedArticle.id}`)} className="border border-border bg-card p-4 transition-colors hover:bg-secondary"><h3 className="font-semibold tracking-tight">{relatedArticle.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedArticle.excerpt}</p></Link>)}</div>
          </section>
        )}

        {(neighbors.previous || neighbors.next) && (
          <nav aria-label={t('blog.articleNavigation')} className="mx-auto mt-16 grid max-w-3xl gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {neighbors.previous ? <Link href={href(`/blog/${neighbors.previous.id}`)} className="border border-border bg-card p-5 transition-colors hover:bg-secondary"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">← {t('blog.previousArticle')}</span><h2 className="mt-3 text-lg font-semibold tracking-tight">{neighbors.previous.title}</h2></Link> : <span aria-hidden="true" />}
            {neighbors.next ? <Link href={href(`/blog/${neighbors.next.id}`)} className="border border-border bg-card p-5 text-right transition-colors hover:bg-secondary"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.nextArticle')} →</span><h2 className="mt-3 text-lg font-semibold tracking-tight">{neighbors.next.title}</h2></Link> : null}
          </nav>
        )}
      </div>
    </main>
  );
}
