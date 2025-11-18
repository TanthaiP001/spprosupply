import { NextRequest, NextResponse } from 'next/server';
import { getAccessTokenCookie } from './cookies';
import { verifyAccessToken } from './jwt';
import { rateLimiters } from './rateLimit';
import { csrfProtection } from './csrf';

/**
 * Authentication middleware
 * Verifies JWT token from httpOnly cookie
 */
export async function authenticate(request: NextRequest): Promise<{
  user: { userId: string; email: string; role: string } | null;
  error: NextResponse | null;
}> {
  const token = await getAccessTokenCookie();

  if (!token) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      ),
    };
  }

  return {
    user: payload,
    error: null,
  };
}

/**
 * Admin authorization middleware
 * Must be used after authenticate()
 */
export async function requireAdmin(
  user: { userId: string; email: string; role: string } | null
): Promise<NextResponse | null> {
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Combined middleware helper
 */
export interface MiddlewareOptions {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  rateLimit?: (request: NextRequest) => Promise<NextResponse | null>;
  requireCSRF?: boolean;
}

export async function applyMiddleware(
  request: NextRequest,
  options: MiddlewareOptions = {}
): Promise<{
  user: { userId: string; email: string; role: string } | null;
  error: NextResponse | null;
}> {
  const {
    requireAuth = false,
    requireAdmin: requireAdminRole = false,
    rateLimit: customRateLimit,
    requireCSRF = false,
  } = options;

  // Rate limiting
  if (customRateLimit) {
    const rateLimitResponse = await customRateLimit(request);
    if (rateLimitResponse) {
      return { user: null, error: rateLimitResponse };
    }
  }

  // CSRF protection
  if (requireCSRF) {
    const csrfResponse = await csrfProtection(request);
    if (csrfResponse) {
      return { user: null, error: csrfResponse };
    }
  }

  // Authentication
  let user = null;
  if (requireAuth || requireAdminRole) {
    const authResult = await authenticate(request);
    if (authResult.error) {
      return authResult;
    }
    user = authResult.user;

    // Admin check
    if (requireAdminRole) {
      const adminError = await requireAdmin(user);
      if (adminError) {
        return { user: null, error: adminError };
      }
    }
  }

  return { user, error: null };
}

