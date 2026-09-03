'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { getTranslations } from '@/content/translations';

export default function About() {
  const { language } = useTranslation();
  const copy = getTranslations(language)?.about;

  if (!copy) return null;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.publication}</p>
        <h1 className="border-b border-border pb-8 text-5xl font-semibold tracking-tight sm:text-6xl">{copy.title}</h1>

        <div className="mt-12">
          <section className="border-b border-border pb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.title}</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {copy.description}
          </p></section>

          <section className="border-b border-border py-10"><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.mission}</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {copy.missionDescription}
          </p></section>

          <section className="border-b border-border py-10"><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.topicsTitle}</h2>
          <ul className="list-inside list-disc space-y-2 text-lg leading-8 text-muted-foreground">
            {copy.topics.map((topic) => <li key={topic}>{topic}</li>)}
          </ul></section>

          <section className="py-10"><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.supportedLanguages}</h2>
          <p className="text-lg leading-8 text-muted-foreground">
            {copy.supportedLanguagesDescription}
          </p></section>
        </div>
      </section>
    </main>
  );
}
