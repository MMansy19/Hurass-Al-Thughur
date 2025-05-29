import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';

const LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'ar';

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .filter(Boolean);
    
    return match(languages, LOCALES, DEFAULT_LOCALE);
  }

  return DEFAULT_LOCALE;
}

function isMissingLocale(pathname: string): boolean {
  if (LOCALES.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)) {
    return false;
  }
  return !pathname.match(/^\/(_next|favicon\.ico|api|public|images|pdfs|assets)\//);
}

export function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  if (!isMissingLocale(pathname)) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);

  return NextResponse.redirect(newUrl, { status: 307 });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|images|pdfs|assets).*)',
    '/',
  ],
};
