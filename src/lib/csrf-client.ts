/**
 * Client-side CSRF token management
 */

let csrfToken: string | null = null;

/**
 * Get CSRF token (fetch if not cached)
 */
export async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch('/api/csrf-token', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrfToken;
      return csrfToken;
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }

  return null;
}

/**
 * Clear CSRF token cache
 */
export function clearCSRFToken() {
  csrfToken = null;
}

/**
 * Get headers with CSRF token
 */
export async function getHeadersWithCSRF(additionalHeaders: Record<string, string> = {}): Promise<HeadersInit> {
  const token = await getCSRFToken();
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'X-CSRF-Token': token }),
    ...additionalHeaders,
  };
}

