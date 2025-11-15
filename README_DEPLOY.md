# คู่มือการ Deploy SP Pro Supply

## 📋 สารบัญ
1. [เตรียมความพร้อมก่อน Deploy](#เตรียมความพร้อมก่อน-deploy)
2. [เปลี่ยน Database จาก SQLite เป็น PostgreSQL](#เปลี่ยน-database-จาก-sqlite-เป็น-postgresql)
3. [Deploy บน Vercel (แนะนำ)](#deploy-บน-vercel-แนะนำ)
4. [Deploy บน Platform อื่นๆ](#deploy-บน-platform-อื่นๆ)
5. [จัดการ File Uploads](#จัดการ-file-uploads)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🚀 เตรียมความพร้อมก่อน Deploy

### 1. ตรวจสอบไฟล์ที่จำเป็น

```bash
# ตรวจสอบว่า build ได้หรือไม่
npm run build

# ทดสอบ production build
npm start
```

### 2. ตรวจสอบ Dependencies

```bash
npm install
```

---

## 🗄️ เปลี่ยน Database จาก SQLite เป็น PostgreSQL

**⚠️ สำคัญ:** SQLite ไม่เหมาะกับ production บน serverless platforms ต้องเปลี่ยนเป็น PostgreSQL

### ขั้นตอนที่ 1: สร้าง PostgreSQL Database

**ตัวเลือกที่แนะนำ:**
- **Vercel Postgres** (ฟรี, ง่าย, ใช้กับ Vercel)
- **Supabase** (ฟรี, มี dashboard)
- **Railway** (ฟรี tier)
- **Neon** (ฟรี tier, serverless PostgreSQL)

### ขั้นตอนที่ 2: อัปเดต Prisma Schema

แก้ไขไฟล์ `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### ขั้นตอนที่ 3: สร้าง Migration

```bash
# สร้าง migration ใหม่
npm run db:migrate

# หรือใช้ db:push สำหรับ development
npm run db:push
```

### ขั้นตอนที่ 4: Migrate ข้อมูลจาก SQLite (ถ้ามี)

```bash
# Export ข้อมูลจาก SQLite
npx prisma db pull --schema=./prisma/schema.sqlite.prisma

# Import ไปยัง PostgreSQL
npx prisma db push
```

---

## ☁️ Deploy บน Vercel (แนะนำ)

Vercel เป็น platform ที่เหมาะกับ Next.js มากที่สุด

### ขั้นตอนที่ 1: ติดตั้ง Vercel CLI

```bash
npm i -g vercel
```

### ขั้นตอนที่ 2: Login และ Deploy

```bash
# Login
vercel login

# Deploy (ครั้งแรก)
vercel

# Deploy production
vercel --prod
```

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables

เพิ่มตัวแปรต่อไปนี้:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NEXTAUTH_SECRET=your-secret-key-here (ถ้าใช้ NextAuth)
NEXTAUTH_URL=https://your-domain.vercel.app (ถ้าใช้ NextAuth)
```

### ขั้นตอนที่ 4: ตั้งค่า Vercel Postgres (แนะนำ)

1. ไปที่ Vercel Dashboard → Storage → Create Database
2. เลือก **Postgres**
3. ตั้งชื่อ database
4. Vercel จะสร้าง `DATABASE_URL` อัตโนมัติ

### ขั้นตอนที่ 5: รัน Prisma Migrations

สร้างไฟล์ `vercel.json` ใน root directory:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "installCommand": "npm install"
}
```

หรือเพิ่ม script ใน `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma migrate deploy && next build"
  }
}
```

### ขั้นตอนที่ 6: ตั้งค่า Build Command

ใน Vercel Dashboard → Settings → General → Build & Development Settings:

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## 🌐 Deploy บน Platform อื่นๆ

### Railway

1. สร้าง account ที่ [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. เพิ่ม PostgreSQL service
4. ตั้งค่า Environment Variables
5. Deploy

### Render

1. สร้าง account ที่ [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. ตั้งค่า:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. เพิ่ม PostgreSQL database
6. ตั้งค่า Environment Variables

### DigitalOcean App Platform

1. สร้าง account ที่ [digitalocean.com](https://digitalocean.com)
2. Create → App → GitHub
3. ตั้งค่า Build และ Run commands
4. เพิ่ม Managed Database (PostgreSQL)
5. ตั้งค่า Environment Variables

---

## 📁 จัดการ File Uploads

**⚠️ สำคัญ:** `public/uploads/` จะถูกลบทุกครั้งที่ deploy ใหม่ ต้องใช้ Cloud Storage

### ตัวเลือกที่แนะนำ:

#### 1. Vercel Blob Storage (ง่ายที่สุด)

```bash
npm install @vercel/blob
```

สร้างไฟล์ `src/lib/upload.ts`:

```typescript
import { put } from '@vercel/blob';

export async function uploadFile(file: File, folder: string) {
  const blob = await put(`${folder}/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}
```

#### 2. AWS S3

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### 3. Cloudinary

```bash
npm install cloudinary
```

#### 4. Supabase Storage

```bash
npm install @supabase/supabase-js
```

### อัปเดต API Upload

แก้ไข `src/app/api/admin/upload/route.ts` ให้ใช้ cloud storage แทน local file system

---

## 🔐 Environment Variables

สร้างไฟล์ `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# NextAuth (ถ้าใช้)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Cloud Storage (ถ้าใช้)
BLOB_READ_WRITE_TOKEN=your-token
# หรือ
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket
```

**⚠️ อย่าลืม:** เพิ่ม `.env` ใน `.gitignore` แล้ว

---

## ✅ Post-Deployment Checklist

### 1. ตรวจสอบ Database

```bash
# ตรวจสอบ connection
npx prisma studio
```

### 2. สร้าง Admin User

```bash
# ใช้ script ที่มีอยู่
npm run create-admin
```

### 3. ตรวจสอบ API Endpoints

- [ ] `/api/products` - ดูสินค้า
- [ ] `/api/users/login` - เข้าสู่ระบบ
- [ ] `/api/admin/products` - จัดการสินค้า (ต้อง login)

### 4. ตรวจสอบ File Uploads

- [ ] อัปโหลดรูปภาพสินค้า
- [ ] อัปโหลด banner
- [ ] ตรวจสอบว่าไฟล์แสดงผลได้

### 5. ตรวจสอบ Performance

- [ ] ใช้ Lighthouse ตรวจสอบ performance
- [ ] ตรวจสอบ loading time
- [ ] ตรวจสอบ image optimization

### 6. ตั้งค่า Custom Domain (ถ้าต้องการ)

**Vercel:**
1. ไปที่ Project Settings → Domains
2. เพิ่ม domain
3. ตั้งค่า DNS records ตามที่ Vercel แนะนำ

---

## 🐛 Troubleshooting

### ปัญหา: Database connection error

**แก้ไข:**
- ตรวจสอบ `DATABASE_URL` ถูกต้อง
- ตรวจสอบ SSL mode (production ต้องใช้ `?sslmode=require`)
- ตรวจสอบ firewall/network settings

### ปัญหา: Prisma Client not generated

**แก้ไข:**
```bash
# เพิ่มใน package.json
"postinstall": "prisma generate"
```

### ปัญหา: File uploads ไม่ทำงาน

**แก้ไข:**
- เปลี่ยนไปใช้ cloud storage
- ตรวจสอบ file size limits
- ตรวจสอบ CORS settings

### ปัญหา: Build failed

**แก้ไข:**
- ตรวจสอบ TypeScript errors: `npm run lint`
- ตรวจสอบ dependencies: `npm install`
- ตรวจสอบ Node.js version (ต้อง 18+)

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

---

## 🆘 ต้องการความช่วยเหลือ?

หากพบปัญหาหรือต้องการคำแนะนำเพิ่มเติม:
1. ตรวจสอบ logs ใน Vercel Dashboard
2. ตรวจสอบ Prisma logs
3. ตรวจสอบ Next.js build logs

---

**หมายเหตุ:** เอกสารนี้อัปเดตล่าสุดเมื่อ: 2025-01-15

