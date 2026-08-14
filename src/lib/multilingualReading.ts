export const SUPPORTED_LANGUAGES = ['en', 'ko', 'ja'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_TIMEOUT_MS = 5000;

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language);
}

export function readPersistedLanguage(raw: string | null): Language | undefined {
  if (!raw) return undefined;

  try {
    const language = (JSON.parse(raw) as { state?: { language?: unknown } }).state?.language;
    return isLanguage(language) ? language : undefined;
  } catch {
    return undefined;
  }
}

export function resolveLanguage(persisted: unknown, browserLanguage?: string): Language {
  if (isLanguage(persisted)) return persisted;

  const primarySubtag = browserLanguage?.toLowerCase().split('-')[0];
  return primarySubtag === 'ko' || primarySubtag === 'ja' ? primarySubtag : 'en';
}

export function canCommitRequest(
  requestId: number,
  latestRequestId: number,
  startedAt: number,
  completedAt: number,
): boolean {
  return requestId === latestRequestId && completedAt - startedAt < LANGUAGE_TIMEOUT_MS;
}

export function getArticleScrollRatio(
  scrollY: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number,
): number {
  return Math.min(1, Math.max(0, (scrollY - articleTop) / Math.max(1, articleHeight - viewportHeight)));
}

export function getArticleScrollTarget(
  ratio: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number,
  documentHeight: number,
): number {
  const target = articleTop + Math.min(1, Math.max(0, ratio)) * Math.max(0, articleHeight - viewportHeight);
  return Math.min(Math.max(0, target), Math.max(0, documentHeight - viewportHeight));
}
