import type { Metadata } from 'next';
import { absoluteUrl, getLocaleAlternates, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Blog | PolySyntax';
  const description = 'Browse PolySyntax frontend articles about rendering, CSS, accessibility, and performance.';
  const origin = await getSiteOrigin();
  const canonical = absoluteUrl(origin, '/blog');
  const image = absoluteUrl(origin, '/opengraph-image.svg');
  return {
    title,
    description,
    alternates: { canonical, languages: await getLocaleAlternates(origin, '/blog') },
    openGraph: { title, description, url: canonical, siteName: 'PolySyntax', images: [{ url: image, width: 1200, height: 630, alt: 'PolySyntax' }] },
    twitter: { card: 'summary', title, description, images: [image] },
  };
}

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
