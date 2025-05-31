import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'ar';

function isMissingLocale(pathname: string): boolean {
  // Check if the pathname already includes a locale
  if (LOCALES.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)) {
    return false;
  }
  // Exclude static files, API routes, and special files
  return !pathname.match(/^\/(_next|favicon\.ico|api|public|images|pdfs|assets|pdf-worker)\//);
}

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (!isMissingLocale(pathname)) {
    return NextResponse.next();
  }

  const locale = DEFAULT_LOCALE;
  const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);

  return NextResponse.redirect(newUrl, { status: 307 });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|images|pdfs|assets|pdf-worker).*)',
    '/',
  ],
};
