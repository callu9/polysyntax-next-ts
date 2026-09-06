import type { Metadata } from 'next';
import { getLocalizedPageMetadata, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Blog | PolySyntax';
  const description = 'Browse PolySyntax frontend articles about rendering, CSS, accessibility, and performance.';
  return getLocalizedPageMetadata(title, description, 'en', '/blog', await getSiteOrigin());
}

export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
