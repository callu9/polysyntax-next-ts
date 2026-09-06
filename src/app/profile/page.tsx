import { profileRedirectPath } from '@/lib/localeRoutes';
import { redirect } from 'next/navigation';

export default function ProfileRoute() {
  redirect(profileRedirectPath());
}
