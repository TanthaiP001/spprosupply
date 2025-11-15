# วิธีตั้งค่า Local Environment

## ปัญหา: DATABASE_URL not found

หลังจากเปลี่ยนเป็น PostgreSQL แล้ว ต้องตั้งค่า `DATABASE_URL` ในไฟล์ `.env` หรือ `.env.local`

---

## วิธีที่ 1: ใช้ PostgreSQL สำหรับ Local (แนะนำ)

### 1. สร้าง PostgreSQL Database

#### ตัวเลือก A: ใช้ Docker

```bash
# รัน PostgreSQL ด้วย Docker
docker run --name postgres-dev -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=sppro -p 5432:5432 -d postgres:15
```

#### ตัวเลือก B: ติดตั้ง PostgreSQL

ดาวน์โหลดและติดตั้งจาก [postgresql.org](https://www.postgresql.org/download/)

### 2. สร้างไฟล์ `.env.local`

สร้างไฟล์ `.env.local` ใน root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sppro?sslmode=prefer"
```

**ปรับแต่งตามการตั้งค่าของคุณ:**
- `postgres` = username
- `postgres` = password  
- `localhost:5432` = host:port
- `sppro` = database name

### 3. สร้าง Database และ Tables

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# หรือสร้าง migration
npx prisma migrate dev --name init
```

---

## วิธีที่ 2: ใช้ SQLite สำหรับ Local (ง่ายกว่า)

ถ้ายังไม่พร้อมใช้ PostgreSQL ใน local สามารถใช้ SQLite ชั่วคราวได้:

### 1. แก้ไข `prisma/schema.prisma`

```prisma
datasource db {
  provider = "sqlite"  // เปลี่ยนกลับเป็น sqlite
  url      = "file:./dev.db"
}
```

### 2. Generate และ Push

```bash
npx prisma generate
npx prisma db push
```

**⚠️ หมายเหตุ:** วิธีนี้ใช้ได้เฉพาะ local development เท่านั้น บน Vercel ต้องใช้ PostgreSQL

---

## วิธีที่ 3: ใช้ Cloud PostgreSQL (แนะนำสำหรับ Production)

### ใช้ Supabase (ฟรี)

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง project ใหม่
3. ไปที่ Settings → Database
4. Copy connection string
5. สร้างไฟล์ `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### ใช้ Neon (ฟรี)

1. ไปที่ [neon.tech](https://neon.tech)
2. สร้าง project ใหม่
3. Copy connection string
4. สร้างไฟล์ `.env.local`:

```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]/[DATABASE]?sslmode=require"
```

---

## ✅ Checklist

- [ ] สร้าง PostgreSQL database (local หรือ cloud)
- [ ] สร้างไฟล์ `.env.local` ด้วย `DATABASE_URL`
- [ ] รัน `npx prisma generate`
- [ ] รัน `npx prisma db push` หรือ `npx prisma migrate dev`
- [ ] ทดสอบด้วย `npm run dev`

---

## 🧪 ทดสอบ

หลังจากตั้งค่าแล้ว:

```bash
# ทดสอบ connection
npx prisma studio

# หรือใช้ API
curl http://localhost:3000/api/test-db
```

---

## 📝 ตัวอย่างไฟล์ `.env.local`

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sppro?sslmode=prefer"

# หรือใช้ Supabase/Neon
# DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

---

## ⚠️ สำคัญ

- ไฟล์ `.env.local` อยู่ใน `.gitignore` แล้ว (จะไม่ถูก commit)
- ใช้ `.env.local` สำหรับ local development
- ใช้ Vercel Environment Variables สำหรับ production
- อย่า commit `.env` หรือ `.env.local` ขึ้น git

