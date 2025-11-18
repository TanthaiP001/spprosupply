import { cookies } from 'next/headers';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const CSRF_TOKEN_COOKIE = 'csrf_token';

/**
 * Set access token in httpOnly cookie
 */
export async function setAccessTokenCookie(token: string, maxAge: number = 15 * 60) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge,
  });
}

/**
 * Set refresh token in httpOnly cookie
 */
export async function setRefreshTokenCookie(token: string, maxAge: number = 7 * 24 * 60 * 60) {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge,
  });
}

/**
 * Get access token from cookie
 */
export async function getAccessTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Get refresh token from cookie
 */
export async function getRefreshTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFRESH_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Clear access token cookie
 */
export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}

/**
 * Clear refresh token cookie
 */
export async function clearRefreshTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}

/**
 * Clear all auth cookies
 */
export async function clearAuthCookies() {
  await clearAccessTokenCookie();
  await clearRefreshTokenCookie();
}

/**
 * Set CSRF token in cookie
 */
export async function setCSRFTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    ...COOKIE_OPTIONS,
    maxAge: 60 * 60, // 1 hour
  });
}

/**
 * Get CSRF token from cookie
 */
export async function getCSRFTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CSRF_TOKEN_COOKIE);
  return token?.value || null;
}

/**
 * Clear CSRF token cookie
 */
export async function clearCSRFTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(CSRF_TOKEN_COOKIE);
}

