# 🚀 Quick Start: Deploy SP Pro Supply

## ขั้นตอนการ Deploy แบบย่อ (Vercel)

### 1. เตรียม Repository

```bash
# Commit และ push code ขึ้น GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. สร้าง Vercel Account

1. ไปที่ [vercel.com](https://vercel.com)
2. Sign up ด้วย GitHub account
3. Import project จาก GitHub

### 3. ตั้งค่า Database (PostgreSQL)

**ตัวเลือกที่ 1: ใช้ Vercel Postgres (แนะนำ)**

1. ใน Vercel Dashboard → Storage → Create Database
2. เลือก **Postgres**
3. ตั้งชื่อ database (เช่น `sppro-db`)
4. Vercel จะสร้าง `POSTGRES_PRISMA_URL` และ `POSTGRES_URL_NON_POOLING` อัตโนมัติ

**ตัวเลือกที่ 2: ใช้ Supabase (ฟรี)**

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง project ใหม่
3. ไปที่ Settings → Database
4. Copy **Connection string** (URI format)

### 4. อัปเดต Prisma Schema

แก้ไข `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. สร้าง Migration

```bash
# สร้าง migration
npm run db:migrate

# ตั้งชื่อ migration (เช่น: "init")
```

### 6. ตั้งค่า Environment Variables ใน Vercel

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables

เพิ่ม:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

**สำหรับ Vercel Postgres:** ใช้ `POSTGRES_PRISMA_URL` แทน `DATABASE_URL`

### 7. Deploy

```bash
# วิธีที่ 1: ใช้ Vercel CLI
vercel --prod

# วิธีที่ 2: Push ไป GitHub (auto-deploy)
git push origin main
```

### 8. รัน Migrations หลัง Deploy

หลังจาก deploy สำเร็จ:

```bash
# ใช้ Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

หรือเพิ่มใน Build Command ใน Vercel Dashboard:
```
prisma generate && prisma migrate deploy && next build
```

### 9. สร้าง Admin User

```bash
# ตั้งค่า DATABASE_URL ใน local
export DATABASE_URL="your-production-database-url"

# สร้าง admin
npm run create-admin
```

---

## ⚠️ สิ่งที่ต้องแก้ไขก่อน Deploy

### 1. File Uploads

ไฟล์ใน `public/uploads/` จะหายทุกครั้งที่ deploy ใหม่

**แก้ไข:** เปลี่ยนไปใช้ Cloud Storage (Vercel Blob, S3, Cloudinary)

### 2. Database

SQLite ไม่ทำงานบน serverless → เปลี่ยนเป็น PostgreSQL

### 3. Environment Variables

ตั้งค่าใน Vercel Dashboard:
- `DATABASE_URL`
- อื่นๆ ตามที่ใช้

---

## 📝 Checklist ก่อน Deploy

- [ ] Code ทำงานได้ใน local (`npm run build` สำเร็จ)
- [ ] เปลี่ยน Prisma schema เป็น PostgreSQL
- [ ] สร้าง migration
- [ ] ตั้งค่า Environment Variables
- [ ] แก้ไข file uploads ให้ใช้ cloud storage
- [ ] ทดสอบ build: `npm run build`
- [ ] Commit และ push code

---

## 🔗 Links ที่เป็นประโยชน์

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

---

**คำแนะนำ:** อ่าน `README_DEPLOY.md` สำหรับรายละเอียดเพิ่มเติม

