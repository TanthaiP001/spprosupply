import { randomBytes, createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCSRFTokenCookie, setCSRFTokenCookie } from './cookies';

const CSRF_SECRET = process.env.CSRF_SECRET || 'your-csrf-secret-change-in-production';

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const token = randomBytes(32).toString('hex');
  const hmac = createHmac('sha256', CSRF_SECRET);
  hmac.update(token);
  const signature = hmac.digest('hex');
  return `${token}.${signature}`;
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string): boolean {
  try {
    const [tokenPart, signature] = token.split('.');
    if (!tokenPart || !signature) {
      return false;
    }

    const hmac = createHmac('sha256', CSRF_SECRET);
    hmac.update(tokenPart);
    const expectedSignature = hmac.digest('hex');

    // Use timing-safe comparison
    return timingSafeEqual(signature, expectedSignature);
  } catch (error) {
    return false;
  }
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Get CSRF token from request (header or body)
 */
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Try to get from header first
  const headerToken = request.headers.get('x-csrf-token');
  if (headerToken) {
    return headerToken;
  }

  // Try to get from form data
  // Note: This requires async handling in the route handler
  return null;
}

/**
 * CSRF protection middleware
 */
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  const method = request.method;
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return null;
  }

  // Get CSRF token from cookie
  const cookieToken = await getCSRFTokenCookie();
  if (!cookieToken) {
    return NextResponse.json(
      { error: 'CSRF token missing' },
      { status: 403 }
    );
  }

  // Verify cookie token
  if (!verifyCSRFToken(cookieToken)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }

  // Get CSRF token from request
  const requestToken = request.headers.get('x-csrf-token');
  if (!requestToken) {
    return NextResponse.json(
      { error: 'CSRF token required in header' },
      { status: 403 }
    );
  }

  // Verify request token matches cookie token
  if (requestToken !== cookieToken) {
    return NextResponse.json(
      { error: 'CSRF token mismatch' },
      { status: 403 }
    );
  }

  return null; // CSRF check passed
}

/**
 * Generate and set CSRF token in cookie
 */
export async function generateAndSetCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  await setCSRFTokenCookie(token);
  return token;
}

