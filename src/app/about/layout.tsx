import type { Metadata } from 'next';
import { getTranslations } from '@/content/translations';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getTranslations('en')?.about;
  if (!copy) return { title: 'About | PolySyntax', robots: { index: false, follow: false } };
  const canonical = absoluteUrl(await getSiteOrigin(), '/about');
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical },
    openGraph: { title: copy.title, description: copy.description, url: canonical, siteName: 'PolySyntax' },
    twitter: { card: 'summary', title: copy.title, description: copy.description },
  };
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
