# การเปลี่ยนจาก SQLite เป็น PostgreSQL

## ✅ สิ่งที่ทำแล้ว

1. ✅ เปลี่ยน Prisma schema จาก SQLite เป็น PostgreSQL
2. ✅ อัปเดต datasource ให้ใช้ `env("DATABASE_URL")`

## 📋 ขั้นตอนต่อไป

### 1. สร้าง Migration

```bash
# สร้าง migration ใหม่สำหรับ PostgreSQL
npx prisma migrate dev --name init-postgresql
```

หรือถ้าต้องการ push schema โดยตรง (สำหรับ development):

```bash
npx prisma db push
```

### 2. ตั้งค่า DATABASE_URL

#### สำหรับ Local Development

สร้างไฟล์ `.env` (ถ้ายังไม่มี):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?sslmode=prefer"
```

#### สำหรับ Vercel Production

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables

เพิ่ม:
```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. (Optional) ตรวจสอบ Database

```bash
# เปิด Prisma Studio
npx prisma studio
```

---

## 🔗 วิธีสร้าง PostgreSQL Database

### ตัวเลือกที่ 1: Vercel Postgres (แนะนำ)

1. ไปที่ Vercel Dashboard → Storage
2. สร้าง Postgres Database
3. Copy connection string
4. ตั้งค่าเป็น `DATABASE_URL` ใน Environment Variables

### ตัวเลือกที่ 2: Supabase (ฟรี)

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง project ใหม่
3. ไปที่ Settings → Database
4. Copy connection string (URI format)
5. ตั้งค่าเป็น `DATABASE_URL`

### ตัวเลือกที่ 3: Neon (ฟรี)

1. ไปที่ [neon.tech](https://neon.tech)
2. สร้าง project ใหม่
3. Copy connection string
4. ตั้งค่าเป็น `DATABASE_URL`

### ตัวเลือกที่ 4: Railway / Render / PlanetScale

ใช้บริการ PostgreSQL อื่นๆ ตามต้องการ

---

## ⚠️ หมายเหตุสำคัญ

1. **ข้อมูลเดิมจะหาย:** การเปลี่ยนจาก SQLite เป็น PostgreSQL จะต้องสร้าง database ใหม่
2. **Migration:** ต้องรัน migration ใหม่บน PostgreSQL database
3. **Local Development:** ต้องมี PostgreSQL database สำหรับ development
4. **Production:** ต้องตั้งค่า `DATABASE_URL` ใน Vercel ก่อน deploy

---

## 🧪 ทดสอบ

หลังจากตั้งค่าแล้ว ทดสอบด้วย:

```bash
# ทดสอบ connection
npm run db:studio

# หรือใช้ API test endpoint
curl https://your-domain.vercel.app/api/test-db
```

---

## 📝 Checklist

- [ ] เปลี่ยน Prisma schema เป็น PostgreSQL ✅
- [ ] สร้าง PostgreSQL database
- [ ] ตั้งค่า `DATABASE_URL` ใน local `.env`
- [ ] ตั้งค่า `DATABASE_URL` ใน Vercel Environment Variables
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] สร้าง migration: `npx prisma migrate dev --name init-postgresql`
- [ ] ทดสอบ connection
- [ ] Deploy ใหม่บน Vercel

