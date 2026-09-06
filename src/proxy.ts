import { NextResponse, type NextRequest } from 'next/server';
import { DOCUMENT_LOCALE_HEADER, getDocumentLocale } from '@/lib/localeRoutes';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(DOCUMENT_LOCALE_HEADER, getDocumentLocale(request.nextUrl.pathname));
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.svg|opengraph-image.svg).*)'],
};
