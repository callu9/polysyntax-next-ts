'use client';

import { useTranslation } from '@/i18n/useTranslation';

export default function About() {
  const { t } = useTranslation();

  return (
    <main>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Publication</p>
        <h1 className="border-b border-border pb-8 text-5xl font-semibold tracking-tight sm:text-6xl">{t('common.about')}</h1>

        <div className="mt-12">
          <section className="border-b border-border pb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">About PolySyntax</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            PolySyntax is your go-to source for the latest frontend technology news, trends, and insights.
            We provide in-depth articles, tutorials, and best practices to help you stay ahead in the ever-evolving
            world of web development.
          </p></section>

          <section className="border-b border-border py-10"><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Our Mission</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            To empower frontend developers by delivering high-quality content that bridges the gap between
            beginners and advanced practitioners. We believe in making technology knowledge accessible to everyone,
            regardless of their experience level.
          </p></section>

          <section className="border-b border-border py-10"><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What We Cover</h2>
          <ul className="list-inside list-disc space-y-2 text-lg leading-8 text-muted-foreground">
            <li>React and Next.js frameworks</li>
            <li>TypeScript and modern JavaScript</li>
            <li>CSS and TailwindCSS</li>
            <li>Web performance optimization</li>
            <li>Development tools and workflows</li>
            <li>Industry best practices</li>
          </ul></section>

          <section className="py-10"><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Supported Languages</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            PolySyntax is available in English, Korean, and Japanese to serve our global developer community.
          </p></section>
        </div>
      </section>
    </main>
  );
}
