export function formatArchiveDate(date: string, locale: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(locale, { timeZone: 'UTC' });
}
