import { NextResponse, type NextRequest } from 'next/server';

/**
 * Every page has a markdown twin at `<path>.md`. Rewriting here keeps those
 * URLs clean while the article pages keep owning /blog/<slug>.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.endsWith('.md')) return NextResponse.next();

  const path = pathname.slice(1, -'.md'.length) || 'index';
  return NextResponse.rewrite(new URL(`/md/${path}`, request.url));
}

export const config = {
  matcher: '/((?!api|_next|.*\\.(?:svg|png|jpg|jpeg|ico|txt|xml)$).*)',
};
