import type { Metadata } from 'next';
import ProfilePage from '@/components/ProfilePage';
import { getTranslations } from '@/content/translations';
import { getLocalizedPageMetadata, getSiteOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const copy = getTranslations('en')?.profile;
  if (!copy) return { title: 'Profile | PolySyntax', robots: { index: false, follow: false } };
  return getLocalizedPageMetadata(copy.title, copy.bio, 'en', '/profile', await getSiteOrigin());
}

export default function ProfileRoute() {
  return <ProfilePage />;
}
