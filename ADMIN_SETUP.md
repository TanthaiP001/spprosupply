# วิธีสร้าง Admin User บน Vercel

มีหลายวิธีในการสร้าง admin user บน production (Vercel):

## วิธีที่ 1: ใช้ API Endpoint (แนะนำ)

### 1. ตั้งค่า Environment Variable ใน Vercel

ไปที่ Vercel Dashboard → Project → Settings → Environment Variables:

```
ADMIN_CREATE_SECRET=your-very-secure-random-token-here
```

**⚠️ สำคัญ:** ใช้ token ที่สุ่มและปลอดภัย เช่น:
```bash
# สร้าง random token
openssl rand -hex 32
```

### 2. สร้าง Admin User ผ่าน API

```bash
curl -X POST https://your-domain.vercel.app/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-very-secure-random-token-here" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "081-234-5678"
  }'
```

หรือใช้ Postman/Insomnia:
- Method: POST
- URL: `https://your-domain.vercel.app/api/admin/create-admin`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer your-very-secure-random-token-here`
- Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "your-secure-password",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "081-234-5678"
}
```

---

## วิธีที่ 2: ใช้ Script ผ่าน Vercel CLI

### 1. ติดตั้ง Vercel CLI

```bash
npm install -g vercel
```

### 2. Login และ Link Project

```bash
vercel login
vercel link
```

### 3. Pull Environment Variables

```bash
vercel env pull .env.production
```

### 4. ตั้งค่า Environment Variables สำหรับ Script

แก้ไข `.env.production` หรือ export ใน terminal:

```bash
export DATABASE_URL="your-production-database-url"
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="your-secure-password"
export ADMIN_FIRST_NAME="Admin"
export ADMIN_LAST_NAME="User"
export ADMIN_PHONE="081-234-5678"
```

### 5. รัน Script

```bash
npm run create-admin
```

---

## วิธีที่ 3: ใช้ Prisma Studio

### 1. ตั้งค่า DATABASE_URL

```bash
export DATABASE_URL="your-production-database-url"
```

### 2. เปิด Prisma Studio

```bash
npx prisma studio
```

### 3. สร้าง User ผ่าน UI

1. เปิด Prisma Studio (http://localhost:5555)
2. ไปที่ตาราง `User`
3. คลิก "Add record"
4. กรอกข้อมูล:
   - `email`: admin@example.com
   - `password`: (ต้อง hash ก่อน - ใช้ bcrypt)
   - `firstName`: Admin
   - `lastName`: User
   - `phone`: 081-234-5678
   - `role`: admin

**⚠️ หมายเหตุ:** ต้อง hash password ก่อน ใช้ script นี้:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash));"
```

---

## วิธีที่ 4: ใช้ Database Client โดยตรง

### 1. เชื่อมต่อกับ PostgreSQL Database

ใช้ pgAdmin, DBeaver, หรือ psql:

```bash
psql "your-production-database-url"
```

### 2. Hash Password

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash));"
```

### 3. Insert User

```sql
INSERT INTO users (id, email, password, "firstName", "lastName", phone, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@example.com',
  'hashed-password-from-step-2',
  'Admin',
  'User',
  '081-234-5678',
  'admin',
  NOW(),
  NOW()
);
```

---

## วิธีที่ 5: สมัครสมาชิกปกติแล้วเปลี่ยน Role

### 1. สมัครสมาชิกผ่านหน้าเว็บ

ไปที่ `/register` และสมัครสมาชิกด้วย email ที่ต้องการ

### 2. เปลี่ยน Role เป็น Admin

ใช้วิธีใดวิธีหนึ่งข้างต้นเพื่อ update role:

**ผ่าน API:**
```bash
# ต้องมี ADMIN_CREATE_SECRET
curl -X POST https://your-domain.vercel.app/api/admin/create-admin \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "same-password",
    "firstName": "User",
    "lastName": "Name",
    "phone": "081-234-5678"
  }'
```

**ผ่าน Database:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

---

## ✅ ตรวจสอบ Admin User

หลังจากสร้าง admin แล้ว ตรวจสอบด้วย:

```bash
npm run check-admin
```

หรือใช้ API:

```bash
curl https://your-domain.vercel.app/api/admin/create-admin \
  -H "Authorization: Bearer your-secret-token"
```

---

## 🔒 Security Best Practices

1. **ใช้ Strong Password:** อย่างน้อย 12 ตัวอักษร มีตัวอักษรใหญ่ เล็ก ตัวเลข และสัญลักษณ์
2. **เปลี่ยน ADMIN_CREATE_SECRET:** หลังจากสร้าง admin แล้ว ควรเปลี่ยนหรือลบ secret token
3. **จำกัด Access:** ใช้ secret token ที่ปลอดภัยและเก็บไว้เป็นความลับ
4. **ลบ Endpoint:** ถ้าไม่ต้องการใช้ API endpoint อีก สามารถลบไฟล์ `src/app/api/admin/create-admin/route.ts` ได้

---

## 📝 Checklist

- [ ] ตั้งค่า `ADMIN_CREATE_SECRET` ใน Vercel Environment Variables
- [ ] สร้าง admin user ผ่านวิธีที่เลือก
- [ ] ทดสอบ login ด้วย admin account
- [ ] ตรวจสอบว่าเข้าถึง `/admin` ได้
- [ ] เปลี่ยน password เป็นรหัสที่ปลอดภัย
- [ ] (Optional) ลบหรือ disable API endpoint หลังจากสร้าง admin แล้ว

---

## 🆘 Troubleshooting

### Error: "Unauthorized"
- ตรวจสอบว่า `ADMIN_CREATE_SECRET` ตั้งค่าใน Vercel แล้ว
- ตรวจสอบว่า Authorization header ถูกต้อง

### Error: "Database connection failed"
- ตรวจสอบ `DATABASE_URL` ใน Vercel Environment Variables
- ตรวจสอบว่า database server อนุญาต connection จาก Vercel

### Error: "User already exists"
- API จะ update user ที่มีอยู่ให้เป็น admin อัตโนมัติ
- หรือใช้ email อื่น

