import { NextRequest, NextResponse } from 'next/server';

/**
 * SEO-friendly 301 redirects from legacy PHP URLs to new Next.js routes.
 * Runs only on requests for .php paths (see config.matcher).
 */

/** Static mapping: legacy PHP path (no leading slash) → new path */
const STATIC_PHP_REDIRECTS: Record<string, string> = {
  'index.php': '/',
  'contactme.php': '/contact',
  'aboutus.php': '/about',
  'products.php': '/products',
  'news.php': '/news',
};

/** PHP files that use query param `id` → base path for redirect */
const QUERY_ID_REDIRECTS: Record<string, string> = {
  'product-detail.php': '/products',
  'category.php': '/category',
};

function getRedirectDestination(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  if (!pathname.endsWith('.php')) {
    return null;
  }

  // Normalize: strip leading slash and get the PHP filename (e.g. "product-detail.php")
  const phpFile = pathname.replace(/^\//, '').toLowerCase();

  // 1) Query-param redirects: /product-detail.php?id=25 → /products/25
  const id = searchParams.get('id');
  if (id != null && id.trim() !== '') {
    const base = QUERY_ID_REDIRECTS[phpFile];
    if (base) {
      return `${base}/${encodeURIComponent(id.trim())}`;
    }
  }

  // 2) Static redirects: /contactme.php → /contact, etc.
  const staticDest = STATIC_PHP_REDIRECTS[phpFile];
  if (staticDest !== undefined) {
    return staticDest;
  }

  // 3) Known PHP files without id: send to base path or home
  if (phpFile === 'product-detail.php') {
    return '/products';
  }
  if (phpFile === 'category.php') {
    return '/category';
  }

  // 4) Any other .php URL → homepage
  return '/';
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
