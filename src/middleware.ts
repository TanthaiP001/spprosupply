import { NextRequest, NextResponse } from 'next/server';

/**
 * SEO-friendly 301 redirects from legacy PHP URLs to new Next.js routes.
 * Runs only on requests for .php paths (see config.matcher).
 */

/** Static mapping: legacy PHP path (no leading slash) → new path */
const STATIC_PHP_REDIRECTS: Record<string, string> = {
  'index.php': '/',
  'contactme.php': '/contact',
  'aboutus.php': '/contact',
  'products.php': '/products',
  'news.php': '/',
  'product-detail.php': '/products',
  'category.php': '/products',
};

function getRedirectDestination(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;

  if (!pathname.endsWith('.php')) {
    return null;
  }

  // Normalize: strip leading slash and get the PHP filename (e.g. "product-detail.php")
  const phpFile = pathname.replace(/^\//, '').toLowerCase();

  // Legacy numeric ids (e.g. product-detail.php?id=25) have no mapping to current slugs,
  // so they land on the listing instead of a 404.
  return STATIC_PHP_REDIRECTS[phpFile] ?? '/';
}

export function middleware(request: NextRequest) {
  const destination = getRedirectDestination(request);
  if (destination === null) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = destination;
  url.search = ''; // drop query string on redirect
  return NextResponse.redirect(url, 301);
}

export const config = {
  // Exclude static assets and Next internals; PHP check is done inside (pathname.endsWith('.php'))
  matcher: ["/((?!_next/|api/|favicon.ico).*)"],
};
