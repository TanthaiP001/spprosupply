# Vercel Deployment Troubleshooting

## ปัญหา: Error 500 เมื่อสมัครสมาชิก

### สาเหตุที่เป็นไปได้:

1. **DATABASE_URL ไม่ได้ตั้งค่า**
2. **Prisma Schema ยังใช้ SQLite** (ต้องเปลี่ยนเป็น PostgreSQL)
3. **Prisma Migrations ยังไม่ได้รัน**
4. **Prisma Client ไม่ได้ generate**

---

## ✅ วิธีแก้ไข

### 1. ตรวจสอบ Environment Variables ใน Vercel

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables

ตรวจสอบว่ามี:
- `DATABASE_URL` - PostgreSQL connection string

**ตัวอย่าง DATABASE_URL:**
```
postgresql://user:password@host:port/database?sslmode=require
```

---

### 2. เปลี่ยน Prisma Schema เป็น PostgreSQL

แก้ไข `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // เปลี่ยนจาก "sqlite"
  url      = env("DATABASE_URL")
}
```

**⚠️ สำคัญ:** 
- ใช้ `env("DATABASE_URL")` แทน hardcode URL
- เปลี่ยน provider เป็น `postgresql`

---

### 3. สร้าง Migration

```bash
# สร้าง migration ใหม่
npx prisma migrate dev --name init

# หรือ push schema (สำหรับ development)
npx prisma db push
```

---

### 4. ตรวจสอบ Build Command ใน Vercel

ไปที่ Vercel Dashboard → Project → Settings → General → Build & Development Settings

**Build Command:**
```bash
prisma generate && prisma migrate deploy && next build
```

หรือตรวจสอบ `vercel.json`:
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

---

### 5. ตรวจสอบ Error Logs

ไปที่ Vercel Dashboard → Project → Deployments → เลือก deployment ล่าสุด → Functions

ดู error logs เพื่อหาสาเหตุที่แท้จริง

**Error ที่พบบ่อย:**

#### P1001: Can't reach database server
- ตรวจสอบ DATABASE_URL
- ตรวจสอบว่า database server อนุญาต connection จาก Vercel
- ตรวจสอบ firewall/security groups

#### P2002: Unique constraint failed
- อีเมลถูกใช้งานแล้ว (ไม่ใช่ error จริง)

#### Prisma Client not generated
- ตรวจสอบว่า `prisma generate` รันใน build command

---

### 6. ทดสอบ Database Connection

สร้าง API endpoint สำหรับทดสอบ:

```typescript
// src/app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      success: true, 
      message: "Database connected",
      userCount 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

เรียกใช้: `https://your-domain.vercel.app/api/test-db`

---

## 🔍 Checklist

- [ ] DATABASE_URL ตั้งค่าใน Vercel Environment Variables
- [ ] Prisma schema เปลี่ยนเป็น PostgreSQL
- [ ] สร้าง migration ใหม่
- [ ] Build command มี `prisma generate && prisma migrate deploy`
- [ ] Deploy ใหม่หลังจากแก้ไข
- [ ] ตรวจสอบ error logs ใน Vercel

---

## 📝 Quick Fix Steps

1. **แก้ไข `prisma/schema.prisma`:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **สร้าง migration:**
   ```bash
   npx prisma migrate dev --name change-to-postgresql
   ```

3. **Commit และ Push:**
   ```bash
   git add .
   git commit -m "Change to PostgreSQL"
   git push
   ```

4. **ตั้งค่า DATABASE_URL ใน Vercel:**
   - ไปที่ Vercel Dashboard
   - Settings → Environment Variables
   - เพิ่ม `DATABASE_URL` = `your-postgresql-connection-string`

5. **Redeploy:**
   - Vercel จะ auto-deploy เมื่อ push code
   - หรือกด "Redeploy" ใน Vercel Dashboard

---

## 🆘 ยังแก้ไม่ได้?

1. ตรวจสอบ error logs ใน Vercel Functions
2. ทดสอบ database connection ด้วย `/api/test-db`
3. ตรวจสอบว่า PostgreSQL database ทำงานและ accessible
4. ตรวจสอบ Prisma Client version compatibility

