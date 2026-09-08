'use client';

import { getTranslations } from '@/content/translations';
import { useTranslation } from '@/i18n/useTranslation';
import type { Locale } from '@/lib/localeRoutes';

export default function ProfilePage({ locale }: { locale?: Locale } = {}) {
  const { language } = useTranslation(locale);
  const copy = getTranslations(language)?.profile;
  if (!copy) return null;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{copy.publication}</p>
        <h1 className="border-b border-border pb-8 text-5xl font-semibold tracking-tight sm:text-6xl">{copy.title}</h1>
        <div className="mt-12">
          <section className="border-b border-border pb-10">
            <h2 className="text-3xl font-semibold tracking-tight">{copy.name}</h2>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">{copy.role}</p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{copy.bio}</p>
          </section>
          <section className="border-b border-border py-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.mission}</h2>
            <p className="text-lg leading-8 text-muted-foreground">{copy.missionDescription}</p>
          </section>
          <section className="border-b border-border py-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.topicsTitle}</h2>
            <ul className="list-inside list-disc space-y-2 text-lg leading-8 text-muted-foreground">{copy.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </section>
          <section className="py-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{copy.contact}</h2>
            <a href={`mailto:${copy.contactEmail}`} className="inline-flex min-h-11 items-center text-lg text-primary transition-colors hover:text-foreground">{copy.contactEmail}</a>
          </section>
        </div>
      </section>
    </main>
  );
}
