import type { Metadata } from 'next';
import { absoluteUrl, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Blog | PolySyntax';
  const description = 'Browse PolySyntax frontend articles about rendering, CSS, accessibility, and performance.';
  const canonical = absoluteUrl(await getSiteOrigin(), '/blog');
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'PolySyntax' },
    twitter: { card: 'summary', title, description },
  };
}

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
