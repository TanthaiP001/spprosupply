# 🔒 Security Implementation Guide

## Overview

ระบบได้เพิ่ม security features ครบถ้วนตามมาตรฐาน:

1. ✅ **JWT Authentication** with httpOnly cookies
2. ✅ **Refresh Token** mechanism
3. ✅ **Rate Limiting** protection
4. ✅ **CSRF Protection**

---

## 📦 Dependencies

```json
{
  "jsonwebtoken": "^9.x",
  "@types/jsonwebtoken": "^9.x",
  "cookie": "^0.6.x",
  "csrf": "^3.x"
}
```

---

## 🔑 Environment Variables

เพิ่ม environment variables ต่อไปนี้ใน `.env`:

```env
# JWT Secrets (ใช้ strong random strings ใน production)
JWT_SECRET=your-very-secure-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-min-32-chars

# CSRF Secret
CSRF_SECRET=your-csrf-secret-key-min-32-chars
```

**⚠️ สำคัญ:** ใช้ strong random strings ใน production:
```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🏗️ Architecture

### 1. JWT Token System

#### Access Token
- **Lifetime**: 15 minutes
- **Storage**: httpOnly cookie
- **Purpose**: Authentication for API requests

#### Refresh Token
- **Lifetime**: 7 days
- **Storage**: httpOnly cookie
- **Purpose**: Refresh access token when expired

### 2. Cookie Configuration

```typescript
{
  httpOnly: true,        // Prevent XSS attacks
  secure: true,          // HTTPS only in production
  sameSite: 'strict',    // CSRF protection
  path: '/',
}
```

### 3. Rate Limiting

| Endpoint Type | Window | Max Requests |
|--------------|--------|--------------|
| Authentication | 15 min | 5 |
| General API | 1 min | 60 |
| Admin | 1 min | 30 |
| File Upload | 1 min | 10 |

### 4. CSRF Protection

- CSRF token stored in httpOnly cookie
- Token sent in `X-CSRF-Token` header
- Required for all state-changing operations (POST, PUT, DELETE)

---

## 📁 File Structure

```
src/
├── lib/
│   ├── jwt.ts              # JWT token generation/verification
│   ├── cookies.ts          # Cookie management
│   ├── rateLimit.ts        # Rate limiting middleware
│   ├── csrf.ts             # CSRF protection
│   ├── middleware.ts       # Combined middleware helper
│   └── csrf-client.ts      # Client-side CSRF token management
├── app/
│   └── api/
│       ├── users/
│       │   ├── login/route.ts      # ✅ Updated with JWT + Rate Limit + CSRF
│       │   ├── register/route.ts   # ✅ Updated with JWT + Rate Limit + CSRF
│       │   ├── logout/route.ts     # ✅ New endpoint
│       │   ├── refresh/route.ts    # ✅ New refresh token endpoint
│       │   └── profile/route.ts    # ✅ Updated with JWT auth
│       └── csrf-token/route.ts     # ✅ CSRF token endpoint
└── contexts/
    └── AuthContext.tsx     # ✅ Updated to use cookies instead of localStorage
```

---

## 🔐 API Endpoints

### Authentication

#### POST `/api/users/login`
- **Rate Limit**: 5 requests / 15 minutes
- **CSRF**: Required
- **Response**: User data + CSRF token
- **Cookies**: Sets `access_token` and `refresh_token`

#### POST `/api/users/register`
- **Rate Limit**: 5 requests / 15 minutes
- **CSRF**: Required
- **Response**: User data + CSRF token
- **Cookies**: Sets `access_token` and `refresh_token`

#### POST `/api/users/logout`
- **Cookies**: Clears all auth cookies

#### POST `/api/users/refresh`
- **Purpose**: Refresh access token
- **Cookies**: Reads `refresh_token`, sets new `access_token`

### CSRF Token

#### GET `/api/csrf-token`
- **Purpose**: Get CSRF token for client
- **Response**: `{ csrfToken: string }`
- **Cookies**: Sets `csrf_token`

### Protected Endpoints

#### GET `/api/users/profile`
- **Auth**: Required (JWT)
- **Rate Limit**: 60 requests / minute

#### PUT `/api/users/profile`
- **Auth**: Required (JWT)
- **CSRF**: Required
- **Rate Limit**: 60 requests / minute

---

## 💻 Client-Side Usage

### AuthContext

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();

  // Login
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // User is logged in, cookies are set automatically
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout(); // Clears cookies automatically
  };
}
```

### Making Authenticated Requests

```typescript
import { getHeadersWithCSRF } from '@/lib/csrf-client';

// GET request (no CSRF needed)
const response = await fetch('/api/users/profile', {
  credentials: 'include', // Important: include cookies
  headers: await getHeadersWithCSRF(),
});

// POST/PUT/DELETE request (CSRF required)
const response = await fetch('/api/users/profile', {
  method: 'PUT',
  credentials: 'include',
  headers: await getHeadersWithCSRF(),
  body: JSON.stringify(data),
});
```

---

## 🛡️ Server-Side Usage

### Using Middleware

```typescript
import { applyMiddleware } from '@/lib/middleware';
import { rateLimiters } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Apply authentication + rate limiting
  const { user, error } = await applyMiddleware(request, {
    requireAuth: true,
    rateLimit: rateLimiters.api,
  });

  if (error) {
    return error;
  }

  // User is authenticated, use user.userId, user.email, user.role
}
```

### Admin-Only Endpoints

```typescript
const { user, error } = await applyMiddleware(request, {
  requireAuth: true,
  requireAdmin: true,
  requireCSRF: true,
  rateLimit: rateLimiters.admin,
});
```

---

## 🔄 Token Refresh Flow

1. Client makes request with expired access token
2. Server returns 401 Unauthorized
3. Client calls `/api/users/refresh` with refresh token
4. Server validates refresh token and issues new access token
5. Client retries original request with new access token

**Note**: Implement automatic token refresh in your API client wrapper.

---

## ⚠️ Important Notes

### 1. CSRF Token for Login/Register

Login และ Register endpoints ต้องการ CSRF token แต่ client ยังไม่มี token ในตอนแรก

**Solution**: Client ควรเรียก `/api/csrf-token` ก่อน login/register:

```typescript
// Get CSRF token first
const csrfResponse = await fetch('/api/csrf-token', {
  credentials: 'include',
});
const { csrfToken } = await csrfResponse.json();

// Then use it in login
const loginResponse = await fetch('/api/users/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify({ email, password }),
});
```

### 2. Rate Limiting Storage

Rate limiting ใช้ in-memory storage (Map) ซึ่งเหมาะสำหรับ single server

**Production**: ควรใช้ Redis สำหรับ distributed rate limiting:

```typescript
// Example with Redis (not implemented yet)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### 3. Token Expiration

- Access token: 15 minutes (short-lived for security)
- Refresh token: 7 days (long-lived for UX)

### 4. Cookie Security

- `httpOnly: true` - Prevents JavaScript access (XSS protection)
- `secure: true` - HTTPS only in production
- `sameSite: 'strict'` - CSRF protection

---

## 🧪 Testing

### Test Login Flow

```bash
# 1. Get CSRF token
curl -X GET http://localhost:3000/api/csrf-token \
  -c cookies.txt

# 2. Login (CSRF token from step 1)
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: <token-from-step-1>" \
  -d '{"email":"test@example.com","password":"password"}' \
  -c cookies.txt

# 3. Access protected endpoint
curl -X GET http://localhost:3000/api/users/profile \
  -b cookies.txt
```

### Test Rate Limiting

```bash
# Make 6 requests quickly (5th should succeed, 6th should fail)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/users/login \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: <token>" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo "Request $i"
done
```

---

## 🚀 Migration Checklist

- [x] Install dependencies
- [x] Create JWT utilities
- [x] Create cookie management
- [x] Create rate limiting middleware
- [x] Create CSRF protection
- [x] Update login endpoint
- [x] Update register endpoint
- [x] Create logout endpoint
- [x] Create refresh token endpoint
- [x] Update profile endpoints
- [x] Update AuthContext
- [ ] Update all admin endpoints
- [ ] Update order endpoints
- [ ] Add automatic token refresh in client
- [ ] Set environment variables in production
- [ ] Test all endpoints
- [ ] Update API documentation

---

## 📚 References

- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Rate Limiting Strategies](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

---

**Last Updated**: 2025

