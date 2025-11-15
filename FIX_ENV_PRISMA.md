# 🔧 แก้ไข: Prisma CLI ไม่อ่าน .env.local

## ❌ ปัญหา

Prisma CLI ไม่ได้อ่าน `.env.local` โดยอัตโนมัติ จะอ่านเฉพาะ `.env` เท่านั้น

## ✅ วิธีแก้ไข

### วิธีที่ 1: สร้างไฟล์ `.env` (แนะนำ)

1. **Copy เนื้อหาจาก `.env.local` ไป `.env`**

   สร้างไฟล์ `.env` ใน root directory และ copy `DATABASE_URL` จาก `.env.local`:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```

2. **หรือใช้คำสั่ง (Windows PowerShell):**

   ```powershell
   # Copy DATABASE_URL จาก .env.local ไป .env
   Get-Content .env.local | Select-String "DATABASE_URL" | Out-File -Append .env
   ```

3. **ทดสอบ:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

### วิธีที่ 2: ใช้ dotenv-cli (ถ้าต้องการใช้ .env.local)

1. **ติดตั้ง dotenv-cli:**

   ```bash
   npm install -D dotenv-cli
   ```

2. **แก้ไข package.json:**

   ```json
   {
     "scripts": {
       "db:generate": "dotenv -e .env.local -- prisma generate",
       "db:push": "dotenv -e .env.local -- prisma db push",
       "db:migrate": "dotenv -e .env.local -- prisma migrate dev"
     }
   }
   ```

3. **ใช้คำสั่งใหม่:**

   ```bash
   npm run db:generate
   npm run db:push
   ```

---

## 📝 หมายเหตุ

- **Next.js** จะอ่าน `.env.local` ได้อัตโนมัติ (สำหรับ `npm run dev`)
- **Prisma CLI** ต้องใช้ `.env` (สำหรับ `npx prisma ...`)
- ไฟล์ `.env` และ `.env.local` อยู่ใน `.gitignore` แล้ว (จะไม่ถูก commit)

---

## ✅ Checklist

- [ ] สร้างไฟล์ `.env` และเพิ่ม `DATABASE_URL`
- [ ] รัน `npx prisma generate`
- [ ] รัน `npx prisma db push`
- [ ] ทดสอบด้วย `npm run dev`

---

## 🧪 ทดสอบ

```bash
# ทดสอบ Prisma CLI
npx prisma generate
npx prisma db push

# ทดสอบ Next.js
npm run dev
```

