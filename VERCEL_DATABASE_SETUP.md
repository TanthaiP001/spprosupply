# 🗄️ Vercel Database Setup Guide

## ปัญหา: Error 500 - Database Connection Failed

Error message:
```
PrismaClientKnownRequestError: Accelerate was not able to connect to your database
```

**สาเหตุ**: `DATABASE_URL` ไม่ได้ตั้งค่าใน Vercel Environment Variables

---

## ✅ วิธีแก้ไข

### Step 1: สร้าง PostgreSQL Database

#### ตัวเลือกที่ 1: Vercel Postgres (แนะนำ - ง่ายที่สุด)

1. ไปที่ **Vercel Dashboard** → **Storage**
2. Click **Create Database** → เลือก **Postgres**
3. เลือก Plan:
   - **Free**: 256 MB storage
   - **Pro**: 10 GB storage
4. ตั้งชื่อ database (เช่น `sppro-db`)
5. Click **Create**
6. หลังจากสร้างเสร็จ → Click **.env.local** tab
7. Copy connection string ที่มี `DATABASE_URL`

**Connection String Format:**
```
postgres://default:password@host.vercel-storage.com:5432/verceldb
```

#### ตัวเลือกที่ 2: Supabase (ฟรี)

1. ไปที่ [supabase.com](https://supabase.com)
2. Sign up / Login
3. Click **New Project**
4. ตั้งชื่อ project และ password
5. รอให้สร้างเสร็จ (ประมาณ 2 นาที)
6. ไปที่ **Settings** → **Database**
7. Scroll ลงไปหา **Connection string** → เลือก **URI**
8. Copy connection string

**Connection String Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

#### ตัวเลือกที่ 3: Neon (ฟรี, Serverless)

1. ไปที่ [neon.tech](https://neon.tech)
2. Sign up / Login
3. Click **Create Project**
4. ตั้งชื่อ project
5. Copy connection string จากหน้า dashboard

**Connection String Format:**
```
postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

### Step 2: เพิ่ม DATABASE_URL ใน Vercel

1. ไปที่ **Vercel Dashboard** → เลือก Project → **Settings** → **Environment Variables**

2. Click **Add New**

3. ตั้งค่า:
   - **Key**: `DATABASE_URL`
   - **Value**: (paste connection string ที่ copy มา)
   - **Environments**: ☑ Production, ☑ Preview, ☑ Development

4. Click **Save**

**ตัวอย่าง:**
```
Key: DATABASE_URL
Value: postgresql://default:password@host.vercel-storage.com:5432/verceldb?sslmode=require
```

---

### Step 3: Run Database Migration

หลังจากตั้งค่า `DATABASE_URL` แล้ว ต้องสร้าง tables:

#### วิธีที่ 1: ใช้ Vercel CLI (แนะนำ)

```bash
# Install Vercel CLI (ถ้ายังไม่มี)
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migration
npx prisma migrate deploy
```

#### วิธีที่ 2: ใช้ Vercel Build Command

Vercel จะรัน migration อัตโนมัติถ้าเพิ่มใน `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

#### วิธีที่ 3: ใช้ Prisma Studio (Local)

```bash
# Pull environment variables
vercel env pull .env.local

# Run migration
npx prisma migrate deploy

# หรือ push schema (สำหรับ development)
npx prisma db push
```

---

### Step 4: Redeploy

หลังจากตั้งค่า `DATABASE_URL` แล้ว:

1. ไปที่ **Deployments**
2. Click **⋯** (three dots) บน deployment ล่าสุด
3. เลือก **Redeploy**

หรือ push commit ใหม่:
```bash
git commit --allow-empty -m "Add DATABASE_URL"
git push
```

---

## 🔍 ตรวจสอบว่า Database ทำงาน

### 1. ตรวจสอบ Environment Variables

ใน Vercel Dashboard → Settings → Environment Variables:
- ตรวจสอบว่ามี `DATABASE_URL`
- ตรวจสอบว่าเลือก environments ถูกต้อง

### 2. Test Database Connection

สร้าง test endpoint:

```typescript
// src/app/api/test-db/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected',
      result 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

เรียกใช้:
```
https://spprosupplyshop.vercel.app/api/test-db
```

---

## ⚠️ Troubleshooting

### Error: "Accelerate was not able to connect"

**สาเหตุ**: 
- `DATABASE_URL` ไม่ได้ตั้งค่า
- Connection string ไม่ถูกต้อง
- Database server ไม่สามารถเข้าถึงได้

**วิธีแก้**:
1. ตรวจสอบว่า `DATABASE_URL` ตั้งค่าใน Vercel แล้ว
2. ตรวจสอบ connection string format
3. ตรวจสอบว่า database server เปิดอยู่

### Error: "relation does not exist"

**สาเหตุ**: Tables ยังไม่ได้สร้าง

**วิธีแก้**:
```bash
# Run migration
npx prisma migrate deploy

# หรือ push schema
npx prisma db push
```

### Error: "SSL connection required"

**สาเหตุ**: Connection string ไม่มี `?sslmode=require`

**วิธีแก้**: เพิ่ม `?sslmode=require` ที่ท้าย connection string:
```
postgresql://user:password@host:5432/db?sslmode=require
```

---

## 📝 Checklist

- [ ] สร้าง PostgreSQL database (Vercel Postgres / Supabase / Neon)
- [ ] Copy connection string
- [ ] เพิ่ม `DATABASE_URL` ใน Vercel Environment Variables
- [ ] เลือกทั้ง 3 environments (Production, Preview, Development)
- [ ] Run migration (`prisma migrate deploy`)
- [ ] Redeploy project
- [ ] Test database connection

---

## 🔗 Links

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

---

**Last Updated**: 2025

