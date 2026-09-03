'use client';

import { getArticleNeighbors, getBlogContent, getBlogPost, getRelatedBlogPosts, type BlogPost } from '@/content/blog/metadata';
import { getTranslations } from '@/content/translations';
import { useTranslation } from '@/i18n/useTranslation';
import {
  canCommitRequest,
  getArticleScrollRatio,
  getArticleScrollTarget,
  LANGUAGE_TIMEOUT_MS,
} from '@/lib/multilingualReading';
import { useLanguageStore } from '@/store/languageStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type ArticleSnapshot = { article: BlogPost; content: string };
type ReadingPosition = { headingOrdinal: number | null; ratio: number };

const markdownComponents: Components = {
  h1: () => null,
  h2: ({ node, ...props }) => {
    void node;
    return <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight" {...props} />;
  },
  h3: ({ node, ...props }) => {
    void node;
    return <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight" {...props} />;
  },
  p: ({ node, ...props }) => {
    void node;
    return <p className="mb-5 leading-8 text-muted-foreground" {...props} />;
  },
  ul: ({ node, ...props }) => {
    void node;
    return <ul className="mb-5 list-inside list-disc space-y-2 leading-8 text-muted-foreground" {...props} />;
  },
  ol: ({ node, ...props }) => {
    void node;
    return <ol className="mb-5 list-inside list-decimal space-y-2 leading-8 text-muted-foreground" {...props} />;
  },
  code: ({ node, className, ...props }) => {
    void node;
    return className ? (
      <code className="mb-5 block overflow-x-auto border border-border bg-card p-4 font-mono text-sm leading-6 text-foreground" {...props} />
    ) : (
      <code className="bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground" {...props} />
    );
  },
  pre: ({ node, ...props }) => {
    void node;
    return <pre className="mb-5" {...props} />;
  },
  blockquote: ({ node, ...props }) => {
    void node;
    return <blockquote className="my-6 border-l-2 border-primary pl-5 italic leading-8 text-muted-foreground" {...props} />;
  },
  a: ({ node, ...props }) => {
    void node;
    return <a className="font-medium text-primary underline underline-offset-4 hover:opacity-80" {...props} />;
  },
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
    window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top });
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

export default function BlogPostPage({ postId: providedPostId }: { postId?: string } = {}) {
  const params = useParams<{ id?: string }>();
  const postId = providedPostId ?? params?.id ?? 'react-reconciliation';
  const { language, requestedLanguage, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const targetLanguage = requestedLanguage ?? language;
  const [snapshot, setSnapshot] = useState<ArticleSnapshot | null>(null);
  const [failedTarget, setFailedTarget] = useState<BlogPost['language'] | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const articleRef = useRef<HTMLElement>(null);
  const pendingPosition = useRef<ReadingPosition | null>(null);
  const latestRequestId = useRef(0);
  const targetArticle = useMemo(() => getBlogPost(postId, targetLanguage), [postId, targetLanguage]);

  useEffect(() => {
    if (!targetArticle) return;

    const requestId = ++latestRequestId.current;
    const startedAt = performance.now();
    const controller = new AbortController();
    const position = articleRef.current ? captureReadingPosition(articleRef.current) : null;
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
  }, [postId, retryCount, targetArticle, targetLanguage]);

  useLayoutEffect(() => {
    if (!snapshot) return;

    setLanguage(snapshot.article.language);

    const position = pendingPosition.current;
    pendingPosition.current = null;
    if (!articleRef.current || !position) return;

    const frame = window.requestAnimationFrame(() => {
      if (articleRef.current) restoreReadingPosition(articleRef.current, position);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [setLanguage, snapshot]);

  const article = snapshot?.article;
  const content = snapshot?.content ?? '';
  const articleTranslations = article ? getTranslations(article.language) : null;
  const relatedArticles = article ? getRelatedBlogPosts(article.id, article.language) : [];
  const neighbors = article ? getArticleNeighbors(article.id, article.language) : { previous: null, next: null };
  const isError = failedTarget === targetLanguage;
  const isNotFound = !targetArticle;
  const isLoading = !isNotFound && !isError && (!snapshot || requestedLanguage !== null);

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        {article ? (
          <nav aria-label={t('blog.breadcrumb')} className="mb-12 overflow-x-auto text-sm">
            <ol className="flex min-w-max items-center gap-2 text-muted-foreground">
              <li><Link href="/blog" className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline">{t('blog.title')}</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href={`/blog?category=${encodeURIComponent(article.categoryId)}`} className="inline-flex min-h-11 items-center font-medium text-primary underline-offset-4 hover:underline">{article.category}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="max-w-[16rem] truncate">{article.title}</li>
            </ol>
          </nav>
        ) : (
          <Link href="/blog" className="mb-12 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
            <ArrowLeft size={20} aria-hidden="true" />
            {t('blog.title')}
          </Link>
        )}

        {isLoading && (
          <p role="status" aria-live="polite" className="mb-6 text-sm text-primary">
            {t('blog.loading')} {targetLanguage.toUpperCase()}…
          </p>
        )}

        {isError && (
          <div role="alert" className="mb-6 border border-destructive/50 bg-card p-4">
            <p className="mb-3 text-sm leading-6 text-destructive">
              {t('blog.couldNotLoad')} {targetLanguage.toUpperCase()}. {t('blog.currentArticleUnchanged')}
            </p>
            <button
              type="button"
              onClick={() => {
                setFailedTarget(null);
                setRetryCount((count) => count + 1);
              }}
              className="min-h-11 bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
            >
              {t('blog.retry')} {targetLanguage.toUpperCase()}
            </button>
          </div>
        )}

        {isNotFound && (
          <p className="py-12 text-center text-muted-foreground">{t('blog.articleNotFound')}</p>
        )}

        {!article && !isNotFound && !isError && (
          <p className="py-12 text-center text-muted-foreground">{t('blog.loading')}…</p>
        )}

        {article && (
          <article ref={articleRef} className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs font-medium tracking-[0.14em] text-muted-foreground">
              <span>{article.language.toUpperCase()}</span>
              <span>{new Date(article.date).toLocaleDateString(article.language === 'ko' ? 'ko-KR' : article.language === 'ja' ? 'ja-JP' : 'en-US')}</span>
              <span>{article.author}</span>
              <span>{article.readTime}{article.language === 'ja' ? '' : ' '}{articleTranslations?.blog.readTime}</span>
            </div>
            <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>

            <div className="border-t border-border pt-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
              </ReactMarkdown>
            </div>
          </article>
        )}

        {relatedArticles.length > 0 && (
          <section className="mx-auto mt-16 max-w-3xl border-t border-border pt-8">
            <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{articleTranslations?.blog.relatedArticles}</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/blog/${relatedArticle.id}`} className="border border-border bg-card p-4 transition-colors hover:bg-secondary">
                  <h3 className="font-semibold tracking-tight">{relatedArticle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{relatedArticle.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {article && (neighbors.previous || neighbors.next) && (
          <nav aria-label={t('blog.articleNavigation')} className="mx-auto mt-16 grid max-w-3xl gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {neighbors.previous ? (
              <Link href={`/blog/${neighbors.previous.id}`} className="border border-border bg-card p-5 transition-colors hover:bg-secondary">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">← {t('blog.previousArticle')}</span>
                <h2 className="mt-3 text-lg font-semibold tracking-tight">{neighbors.previous.title}</h2>
              </Link>
            ) : <span aria-hidden="true" />}
            {neighbors.next ? (
              <Link href={`/blog/${neighbors.next.id}`} className="border border-border bg-card p-5 text-right transition-colors hover:bg-secondary">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('blog.nextArticle')} →</span>
                <h2 className="mt-3 text-lg font-semibold tracking-tight">{neighbors.next.title}</h2>
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </main>
  );
}
