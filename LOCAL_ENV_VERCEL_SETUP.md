# วิธีตั้งค่า Local Environment ให้เหมือน Vercel

## ✅ คำตอบ: ใช้ได้เหมือนกันเลย!

คุณสามารถตั้งค่า local environment ให้ใช้ PostgreSQL และ Vercel Blob Storage เหมือนกับ Vercel ได้เลย

---

## 📋 สิ่งที่ต้องตั้งค่า

### 1. Database (PostgreSQL)

#### วิธีที่ 1: ใช้ PostgreSQL Database เดียวกับ Vercel (แนะนำ)

ใช้ connection string เดียวกับที่ตั้งไว้ใน Vercel:

1. ไปที่ Vercel Dashboard → Project → Settings → Environment Variables
2. Copy `DATABASE_URL` 
3. สร้างไฟล์ `.env.local` ใน root directory:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

**ข้อดี:**
- ใช้ข้อมูลเดียวกันกับ production
- ทดสอบได้เหมือนจริง
- ไม่ต้อง migrate ข้อมูล

**ข้อควรระวัง:**
- ⚠️ ระวังการแก้ไขข้อมูล production
- แนะนำให้ใช้ database แยกสำหรับ development

#### วิธีที่ 2: ใช้ Local PostgreSQL

```bash
# ใช้ Docker (ง่ายที่สุด)
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sppro \
  -p 5432:5432 \
  -d postgres:15
```

สร้างไฟล์ `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sppro?sslmode=prefer"
```

#### วิธีที่ 3: ใช้ Cloud PostgreSQL (Supabase/Neon)

สร้าง database แยกสำหรับ development:

1. สร้าง project ใหม่ใน Supabase หรือ Neon
2. Copy connection string
3. ตั้งค่าใน `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

---

### 2. Vercel Blob Storage

#### ตั้งค่า Vercel Blob Storage Token

1. ไปที่ Vercel Dashboard → Storage → Blob
2. เลือก Blob Store ที่สร้างไว้
3. ไปที่ Settings → Environment Variables
4. Copy `BLOB_READ_WRITE_TOKEN`

สร้างไฟล์ `.env.local` (หรือเพิ่มในไฟล์เดิม):

```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
```

**หมายเหตุ:** Token นี้ใช้ได้ทั้ง local และ production

---

### 3. Environment Variables อื่นๆ (ถ้ามี)

#### Admin Create Secret (ถ้าใช้)

```env
ADMIN_CREATE_SECRET="your-secret-key-here"
```

---

## 📝 ไฟล์ `.env.local` ตัวอย่าง

สร้างไฟล์ `.env.local` ใน root directory:

```env
# Database (ใช้ PostgreSQL เหมือน Vercel)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"

# Admin Create Secret (ถ้าใช้)
ADMIN_CREATE_SECRET="your-secret-key-here"

# Node Environment (optional)
NODE_ENV="development"
```

---

## 🚀 ขั้นตอนการตั้งค่า

### 1. สร้างไฟล์ `.env.local`

```bash
# สร้างไฟล์ .env.local
touch .env.local
```

### 2. เพิ่ม Environment Variables

แก้ไขไฟล์ `.env.local` และเพิ่มค่าตามด้านบน

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. สร้าง Database Tables

```bash
# ถ้าใช้ database ใหม่
npx prisma migrate dev --name init

# หรือ push schema โดยตรง (development)
npx prisma db push
```

### 5. รัน Development Server

```bash
npm run dev
```

---

## ✅ Checklist

- [ ] สร้างไฟล์ `.env.local`
- [ ] ตั้งค่า `DATABASE_URL` (PostgreSQL)
- [ ] ตั้งค่า `BLOB_READ_WRITE_TOKEN`
- [ ] รัน `npx prisma generate`
- [ ] รัน `npx prisma db push` หรือ `npx prisma migrate dev`
- [ ] ทดสอบด้วย `npm run dev`

---

## 🧪 ทดสอบการตั้งค่า

### ทดสอบ Database Connection

```bash
# เปิด Prisma Studio
npx prisma studio

# หรือใช้ API endpoint
curl http://localhost:3000/api/test-db
```

### ทดสอบ Vercel Blob Storage

1. ไปที่หน้า Admin → Products
2. ลองอัพโหลดรูปภาพ
3. ตรวจสอบว่าอัพโหลดสำเร็จและแสดงรูปได้

---

## 🔄 เปรียบเทียบ Local vs Vercel

| Feature | Local | Vercel |
|---------|-------|--------|
| Database | PostgreSQL (via `.env.local`) | PostgreSQL (via Environment Variables) |
| File Storage | Vercel Blob (via `BLOB_READ_WRITE_TOKEN`) | Vercel Blob (via Environment Variables) |
| Code | Same | Same |
| Environment | `.env.local` | Vercel Dashboard |

**สรุป:** ใช้ configuration เดียวกัน ต่างกันแค่ที่เก็บ environment variables

---

## ⚠️ ข้อควรระวัง

1. **ไฟล์ `.env.local`** อยู่ใน `.gitignore` แล้ว (จะไม่ถูก commit)
2. **Database Production:** ถ้าใช้ database เดียวกับ production ระวังการแก้ไขข้อมูล
3. **Blob Storage:** Token เดียวกันใช้ได้ทั้ง local และ production
4. **Migration:** ใช้ `prisma migrate dev` สำหรับ local, `prisma migrate deploy` สำหรับ production

---

## 🆘 Troubleshooting

### Error: DATABASE_URL not found

```bash
# ตรวจสอบว่ามีไฟล์ .env.local
ls -la .env.local

# ตรวจสอบค่า DATABASE_URL
cat .env.local | grep DATABASE_URL
```

### Error: BLOB_READ_WRITE_TOKEN not found

```bash
# ตรวจสอบค่า BLOB_READ_WRITE_TOKEN
cat .env.local | grep BLOB_READ_WRITE_TOKEN
```

### Error: Table does not exist

```bash
# สร้าง tables ใหม่
npx prisma db push

# หรือใช้ migration
npx prisma migrate dev
```

---

## 📚 เอกสารเพิ่มเติม

- [SETUP_LOCAL_ENV.md](./SETUP_LOCAL_ENV.md) - วิธีตั้งค่า local environment
- [VERCEL_BLOB_SETUP.md](./VERCEL_BLOB_SETUP.md) - วิธีตั้งค่า Vercel Blob Storage
- [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md) - วิธี deploy ไป Vercel

