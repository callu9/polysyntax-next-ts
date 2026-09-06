import type { Metadata } from 'next';
import { getTranslations } from '@/content/translations';
import { getLocalizedPageMetadata, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getTranslations('en')?.about;
  if (!copy) return { title: 'About | PolySyntax', robots: { index: false, follow: false } };
  return getLocalizedPageMetadata(copy.title, copy.description, 'en', '/about', await getSiteOrigin());
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
