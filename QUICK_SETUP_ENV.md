# ⚡ Quick Fix: DATABASE_URL Error

## ❌ Error ที่เจอ

```
Error code: P1012
error: Environment variable not found: DATABASE_URL.
```

## ✅ วิธีแก้ไข

### ขั้นตอนที่ 1: สร้างไฟล์ `.env.local`

สร้างไฟล์ `.env.local` ใน root directory (ที่เดียวกับ `package.json`)

### ขั้นตอนที่ 2: เพิ่ม DATABASE_URL

เลือกวิธีใดวิธีหนึ่ง:

#### วิธีที่ 1: ใช้ Database เดียวกับ Vercel (แนะนำ)

1. ไปที่ **Vercel Dashboard** → Project ของคุณ
2. ไปที่ **Settings** → **Environment Variables**
3. Copy ค่า `DATABASE_URL`
4. วางในไฟล์ `.env.local`:

```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

#### วิธีที่ 2: ใช้ Local PostgreSQL

ถ้าคุณมี PostgreSQL ติดตั้งอยู่แล้ว หรือใช้ Docker:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sppro?sslmode=prefer"
```

#### วิธีที่ 3: ใช้ Cloud PostgreSQL (Supabase/Neon)

สร้าง database ใหม่ใน Supabase หรือ Neon แล้วใช้ connection string:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### ขั้นตอนที่ 3: เพิ่ม Environment Variables อื่นๆ (ถ้าต้องการ)

```env
# Vercel Blob Storage (ถ้าต้องการ upload ไฟล์)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"

# Admin Create Secret (ถ้าต้องการสร้าง admin)
ADMIN_CREATE_SECRET="your-secret-key-here"
```

### ขั้นตอนที่ 4: Generate Prisma Client

```bash
npx prisma generate
```

### ขั้นตอนที่ 5: สร้าง Database Tables

```bash
# ถ้าใช้ database ใหม่
npx prisma db push

# หรือใช้ migration
npx prisma migrate dev --name init
```

---

## 📝 ตัวอย่างไฟล์ `.env.local` เต็มรูปแบบ

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Vercel Blob Storage (optional)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"

# Admin Create Secret (optional)
ADMIN_CREATE_SECRET="your-secret-key-here"

# Node Environment
NODE_ENV="development"
```

---

## ⚠️ หมายเหตุ

- ไฟล์ `.env.local` อยู่ใน `.gitignore` แล้ว (จะไม่ถูก commit)
- อย่า commit ไฟล์ `.env.local` เข้า git
- ถ้าใช้ database เดียวกับ production ระวังการแก้ไขข้อมูล

---

## 🧪 ทดสอบ

หลังจากตั้งค่าแล้ว:

```bash
# ทดสอบ connection
npx prisma studio

# หรือรัน dev server
npm run dev
```

---

## 🆘 ยังมีปัญหา?

ดูเอกสารเพิ่มเติม:
- [SETUP_LOCAL_ENV.md](./SETUP_LOCAL_ENV.md) - วิธีตั้งค่า local environment แบบละเอียด
- [LOCAL_ENV_VERCEL_SETUP.md](./LOCAL_ENV_VERCEL_SETUP.md) - วิธีตั้งค่าให้เหมือน Vercel

