import type { Metadata } from 'next';
import { absoluteUrl, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Blog | PolySyntax';
  const description = 'Browse PolySyntax frontend articles about rendering, CSS, accessibility, and performance.';
  const origin = await getSiteOrigin();
  const canonical = absoluteUrl(origin, '/blog');
  return {
    title,
    description,
    alternates: { canonical, languages: await getLocaleAlternates(origin, '/blog') },
    openGraph: { title, description, url: canonical, siteName: 'PolySyntax' },
    twitter: { card: 'summary', title, description },
  };
}

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
