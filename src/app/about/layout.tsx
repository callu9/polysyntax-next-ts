import type { Metadata } from 'next';
import { getTranslations } from '@/content/translations';
import { absoluteUrl, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getTranslations('en')?.about;
  if (!copy) return { title: 'About | PolySyntax', robots: { index: false, follow: false } };
  const origin = await getSiteOrigin();
  const canonical = absoluteUrl(origin, '/about');
  const image = absoluteUrl(origin, '/opengraph-image.svg');
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical, languages: await getLocaleAlternates(origin, '/about') },
    openGraph: { title: copy.title, description: copy.description, url: canonical, siteName: 'PolySyntax', images: [{ url: image, width: 1200, height: 630, alt: 'PolySyntax' }] },
    twitter: { card: 'summary', title: copy.title, description: copy.description, images: [image] },
  };
}

export default function AboutLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
