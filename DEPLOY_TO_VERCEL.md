# คู่มือ Deploy ขึ้น Vercel เพื่อแก้ปัญหา Error 500

## 📋 Checklist ก่อน Deploy

- [x] เปลี่ยน Prisma schema เป็น PostgreSQL ✅
- [ ] สร้าง PostgreSQL Database
- [ ] ตั้งค่า DATABASE_URL ใน Vercel
- [ ] Commit และ Push code
- [ ] ตรวจสอบ Build และ Migration

---

## 🚀 ขั้นตอนการ Deploy

### ขั้นตอนที่ 1: สร้าง PostgreSQL Database

#### วิธีที่ 1: ใช้ Vercel Postgres (แนะนำ - ง่ายที่สุด)

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือก Project ของคุณ
3. ไปที่แท็บ **Storage**
4. คลิก **Create Database** → เลือก **Postgres**
5. เลือก Plan (Hobby = ฟรี)
6. เลือก Region (แนะนำ: Singapore - sin1)
7. คลิก **Create**
8. **Copy Connection String** (จะใช้ในขั้นตอนต่อไป)

#### วิธีที่ 2: ใช้ Supabase (ฟรี)

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง account และ project ใหม่
3. ไปที่ **Settings** → **Database**
4. Copy **Connection string** (URI format)
5. ใช้ connection string นี้ใน Vercel

#### วิธีที่ 3: ใช้ Neon (ฟรี)

1. ไปที่ [neon.tech](https://neon.tech)
2. สร้าง account และ project ใหม่
3. Copy **Connection string**
4. ใช้ connection string นี้ใน Vercel

---

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables ใน Vercel

1. ไปที่ Vercel Dashboard → **Project** → **Settings**
2. คลิก **Environment Variables**
3. เพิ่มตัวแปรต่อไปนี้:

#### ตัวแปรที่ต้องมี:

**DATABASE_URL**
- Key: `DATABASE_URL`
- Value: `postgresql://user:password@host:port/database?sslmode=require`
  (ใช้ connection string จากขั้นตอนที่ 1)
- Environment: เลือก **Production**, **Preview**, และ **Development**

**ADMIN_CREATE_SECRET** (Optional - สำหรับสร้าง admin)
- Key: `ADMIN_CREATE_SECRET`
- Value: สร้าง random token (เช่น `openssl rand -hex 32`)
- Environment: เลือก **Production** เท่านั้น

4. คลิก **Save**

---

### ขั้นตอนที่ 3: ตรวจสอบ Build Settings

1. ไปที่ **Settings** → **General** → **Build & Development Settings**

2. ตรวจสอบ **Build Command**:
   ```
   prisma generate && prisma migrate deploy && next build
   ```

3. ตรวจสอบ **Install Command**:
   ```
   npm install
   ```

4. ตรวจสอบ **Output Directory**:
   ```
   .next
   ```

---

### ขั้นตอนที่ 4: Commit และ Push Code

```bash
# ตรวจสอบว่า schema เป็น PostgreSQL แล้ว
git status

# Add files
git add .

# Commit
git commit -m "Change to PostgreSQL for Vercel deployment"

# Push to GitHub
git push origin main
```

---

### ขั้นตอนที่ 5: Deploy

#### วิธีที่ 1: Auto Deploy (ถ้าเชื่อมต่อ GitHub)

- Vercel จะ auto-deploy เมื่อ push code
- ไปที่ Vercel Dashboard → **Deployments** เพื่อดู status

#### วิธีที่ 2: Manual Deploy

```bash
# ติดตั้ง Vercel CLI (ถ้ายังไม่มี)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### ขั้นตอนที่ 6: ตรวจสอบ Deployment

1. ไปที่ Vercel Dashboard → **Deployments**
2. คลิก deployment ล่าสุด
3. ตรวจสอบ **Build Logs**:
   - ต้องเห็น `prisma generate` สำเร็จ
   - ต้องเห็น `prisma migrate deploy` สำเร็จ
   - ต้องเห็น `next build` สำเร็จ

4. ตรวจสอบ **Function Logs**:
   - ไปที่แท็บ **Functions**
   - ดู error logs (ถ้ามี)

---

### ขั้นตอนที่ 7: ทดสอบ

#### 1. ทดสอบ Database Connection

เปิดเบราว์เซอร์ไปที่:
```
https://your-domain.vercel.app/api/test-db
```

ควรเห็น:
```json
{
  "success": true,
  "message": "Database connected successfully",
  "stats": {
    "users": 0,
    "products": 0,
    "orders": 0
  }
}
```

#### 2. ทดสอบการสมัครสมาชิก

1. ไปที่ `https://your-domain.vercel.app/register`
2. กรอกข้อมูลและสมัครสมาชิก
3. ตรวจสอบว่าไม่มี error 500

#### 3. ทดสอบการ Login

1. ไปที่ `https://your-domain.vercel.app/login`
2. Login ด้วย account ที่สร้าง

---

## 🔍 Troubleshooting

### Error: "DATABASE_URL is not set"

**แก้ไข:**
- ตรวจสอบว่าเพิ่ม `DATABASE_URL` ใน Vercel Environment Variables แล้ว
- ตรวจสอบว่าเลือก Environment ทั้งหมด (Production, Preview, Development)
- **Redeploy** หลังจากเพิ่ม environment variables

### Error: "Can't reach database server" (P1001)

**แก้ไข:**
- ตรวจสอบ connection string ถูกต้อง
- ตรวจสอบว่า database server อนุญาต connection จาก Vercel
- ถ้าใช้ Supabase/Neon: ตรวจสอบว่า connection pooling ถูกต้อง

### Error: "Migration failed"

**แก้ไข:**
- ตรวจสอบว่า Build Command มี `prisma migrate deploy`
- ตรวจสอบว่า database ว่างเปล่าหรือมี migration history
- ลองใช้ `prisma db push` แทน (สำหรับ development)

### Error: "Prisma Client not generated"

**แก้ไข:**
- ตรวจสอบว่า Build Command มี `prisma generate`
- ตรวจสอบว่า `postinstall` script ใน `package.json` มี `prisma generate`

---

## 📝 Quick Reference

### Environment Variables ที่ต้องตั้งค่าใน Vercel:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
ADMIN_CREATE_SECRET=your-random-token (optional)
```

### Build Command:

```
prisma generate && prisma migrate deploy && next build
```

### Test Endpoints:

- Database: `https://your-domain.vercel.app/api/test-db`
- Register: `https://your-domain.vercel.app/register`
- Login: `https://your-domain.vercel.app/login`

---

## ✅ Post-Deployment Checklist

- [ ] Database connection สำเร็จ (`/api/test-db`)
- [ ] สมัครสมาชิกได้ (ไม่มี error 500)
- [ ] Login ได้
- [ ] สร้าง admin user สำเร็จ
- [ ] Admin panel ใช้งานได้
- [ ] สินค้าแสดงผลได้
- [ ] ตะกร้าสินค้าทำงานได้

---

## 🆘 ยังมีปัญหา?

1. ตรวจสอบ **Function Logs** ใน Vercel Dashboard
2. ทดสอบด้วย `/api/test-db` เพื่อดู error message
3. ตรวจสอบว่า DATABASE_URL ถูกต้อง
4. ตรวจสอบว่า Prisma migrations รันสำเร็จ

