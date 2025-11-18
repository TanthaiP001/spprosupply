# 🔧 Environment Variables Setup Guide

## 📋 Required Environment Variables

### 1. JWT_SECRET
**Purpose**: Secret key for signing JWT access tokens

**How to generate**:
```bash
# Option 1: Use the provided script
node scripts/generate-secrets.js

# Option 2: Generate manually
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Example**:
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

---

### 2. JWT_REFRESH_SECRET
**Purpose**: Secret key for signing JWT refresh tokens (should be different from JWT_SECRET)

**How to generate**: Same as JWT_SECRET (use the script to generate both)

**Example**:
```
JWT_REFRESH_SECRET=f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6
```

---

### 3. CSRF_SECRET
**Purpose**: Secret key for CSRF token generation and verification

**How to generate**: Same as JWT_SECRET (use the script to generate all three)

**Example**:
```
CSRF_SECRET=k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2
```

---

### 4. NEXT_PUBLIC_SITE_URL
**Purpose**: Public URL of your website (used for SEO, sitemap, canonical URLs)

**For Local Development**:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For Production**:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# หรือ
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

---

## 🚀 Quick Setup

### Step 1: Generate Secrets

```bash
# Run the script to generate all secrets
node scripts/generate-secrets.js
```

Output จะเป็น:
```
🔐 Generating secure secrets...

Copy these to your .env file:

============================================================
JWT_SECRET=abc123...
JWT_REFRESH_SECRET=def456...
CSRF_SECRET=ghi789...
============================================================
```

### Step 2: Create .env file

```bash
# Copy from example
cp .env.example .env
```

### Step 3: Edit .env file

เปิดไฟล์ `.env` และใส่ค่าที่ generate มา:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sppro?schema=public"

# JWT Secrets (จาก script)
JWT_SECRET=abc123...
JWT_REFRESH_SECRET=def456...

# CSRF Secret
CSRF_SECRET=ghi789...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🌐 Production Setup

### Vercel

1. ไปที่ Vercel Dashboard → Your Project → Settings → Environment Variables

2. เพิ่ม environment variables:

| Name | Value | Environment |
|------|-------|-------------|
| `JWT_SECRET` | (generated secret) | Production, Preview, Development |
| `JWT_REFRESH_SECRET` | (generated secret) | Production, Preview, Development |
| `CSRF_SECRET` | (generated secret) | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | Production |
| `DATABASE_URL` | (your database URL) | Production, Preview, Development |

3. Click "Save" และ redeploy

### Other Platforms

**Railway, Render, Heroku, etc.**:
- ไปที่ Environment Variables section
- เพิ่ม variables ตามข้างต้น
- Restart application

---

## 🔒 Security Best Practices

### ✅ DO:
- ✅ ใช้ secrets ที่ยาวอย่างน้อย 32 characters
- ✅ ใช้ random strings (ไม่ใช่คำที่เดาได้)
- ✅ เก็บ secrets ใน environment variables เท่านั้น
- ✅ ใช้ secrets ที่แตกต่างกันสำหรับแต่ละ environment
- ✅ หมุนเวียน secrets เป็นระยะ (ทุก 3-6 เดือน)

### ❌ DON'T:
- ❌ อย่า commit secrets ลง git
- ❌ อย่าใช้ secrets เดียวกันในทุก environment
- ❌ อย่าแชร์ secrets ผ่าน email หรือ chat
- ❌ อย่าใช้ secrets ที่เดาได้ง่าย

---

## 📝 .env File Template

```env
# ============================================
# Database Configuration
# ============================================
DATABASE_URL="postgresql://user:password@localhost:5432/sppro?schema=public"

# ============================================
# JWT Configuration
# ============================================
# Generate with: node scripts/generate-secrets.js
JWT_SECRET=your-generated-jwt-secret-here
JWT_REFRESH_SECRET=your-generated-refresh-secret-here

# ============================================
# CSRF Configuration
# ============================================
CSRF_SECRET=your-generated-csrf-secret-here

# ============================================
# Site Configuration
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ============================================
# Optional: Vercel Blob Storage
# ============================================
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# ============================================
# Optional: Admin Creation
# ============================================
ADMIN_CREATE_SECRET=your-admin-create-secret
```

---

## 🧪 Testing

หลังจากตั้งค่า environment variables แล้ว:

```bash
# 1. Restart dev server
npm run dev

# 2. Test login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 3. Check if JWT tokens are set in cookies
# (Use browser DevTools → Application → Cookies)
```

---

## ❓ Troubleshooting

### Error: "JWT_SECRET is not defined"
- ตรวจสอบว่า `.env` file มี JWT_SECRET
- Restart dev server หลังจากแก้ไข `.env`
- ตรวจสอบว่า `.env` อยู่ใน root directory

### Error: "Invalid token"
- ตรวจสอบว่า JWT_SECRET ตรงกันระหว่าง environments
- ตรวจสอบว่า token ยังไม่หมดอายุ
- ลอง logout และ login ใหม่

### Error: "CSRF token mismatch"
- ตรวจสอบว่า CSRF_SECRET ตรงกัน
- ตรวจสอบว่า client ส่ง X-CSRF-Token header
- ลองเรียก `/api/csrf-token` ใหม่

---

**Last Updated**: 2025

