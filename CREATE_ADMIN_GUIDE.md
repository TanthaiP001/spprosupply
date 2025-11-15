# 🚀 วิธีสร้าง Admin User บน Production (Vercel)

มีหลายวิธีในการสร้าง admin user บน production:

---

## วิธีที่ 1: ใช้หน้าเว็บ UI (ง่ายที่สุด) ⭐

### 1. ตั้งค่า `ADMIN_CREATE_SECRET` ใน Vercel

ไปที่ **Vercel Dashboard → Project → Settings → Environment Variables**

เพิ่ม:
```
ADMIN_CREATE_SECRET=your-very-secure-random-token-here
```

**สร้าง random token:**
```bash
# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# หรือใช้ online tool: https://randomkeygen.com/
```

### 2. Deploy ใหม่

หลังจากตั้งค่า environment variable แล้ว:
- Vercel จะ auto-deploy หรือ
- Push code ใหม่ไปยัง git

### 3. เปิดหน้าเว็บ

ไปที่: `https://your-domain.vercel.app/admin/create-admin`

กรอกข้อมูล:
- **Secret Token**: ค่าที่ตั้งไว้ใน `ADMIN_CREATE_SECRET`
- **Email**: admin@example.com
- **Password**: รหัสผ่านที่ปลอดภัย
- **First Name**: Admin
- **Last Name**: User
- **Phone**: 081-234-5678

คลิก "สร้าง Admin User"

---

## วิธีที่ 2: ใช้ API Endpoint (แนะนำสำหรับ Automation)

### 1. ตั้งค่า `ADMIN_CREATE_SECRET` ใน Vercel

เหมือนวิธีที่ 1

### 2. เรียก API

**ใช้ curl:**
```bash
curl -X POST https://your-domain.vercel.app/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-very-secure-random-token-here" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123!",
    "firstName": "Admin",
    "lastName": "User",
    "phone": "081-234-5678"
  }'
```

**ใช้ Postman/Insomnia:**
- Method: `POST`
- URL: `https://your-domain.vercel.app/api/admin/create-admin`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer your-very-secure-random-token-here`
- Body (JSON):
```json
{
  "email": "admin@example.com",
  "password": "YourSecurePassword123!",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "081-234-5678"
}
```

---

## วิธีที่ 3: ใช้ Script (สำหรับ Local Development)

### 1. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:
```env
DATABASE_URL="your-production-database-url"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="YourSecurePassword123!"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="User"
ADMIN_PHONE="081-234-5678"
```

### 2. รัน Script

```bash
npm run create-admin
```

**หรือใช้ tsx โดยตรง:**
```bash
npx tsx scripts/create-admin.ts
```

---

## วิธีที่ 4: ใช้ Vercel CLI

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

### 4. ตั้งค่า Environment Variables

แก้ไข `.env.production`:
```env
DATABASE_URL="your-production-database-url"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="YourSecurePassword123!"
ADMIN_FIRST_NAME="Admin"
ADMIN_LAST_NAME="User"
ADMIN_PHONE="081-234-5678"
```

### 5. รัน Script

```bash
npm run create-admin
```

---

## วิธีที่ 5: สมัครสมาชิกปกติแล้วเปลี่ยน Role

### 1. สมัครสมาชิกผ่านหน้าเว็บ

ไปที่ `/register` และสมัครสมาชิกด้วย email ที่ต้องการ

### 2. เปลี่ยน Role เป็น Admin

**ใช้ API:**
```bash
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

API จะ update user ที่มีอยู่ให้เป็น admin อัตโนมัติ

---

## ✅ ตรวจสอบ Admin User

หลังจากสร้าง admin แล้ว:

1. **Login ที่หน้าเว็บ:**
   - ไปที่ `/login`
   - ใช้ email และ password ที่สร้างไว้
   - ควรจะ redirect ไปที่ `/admin` อัตโนมัติ

2. **ตรวจสอบ Role:**
   - ไปที่ `/admin`
   - ถ้าเข้าถึงได้ แสดงว่าเป็น admin แล้ว

---

## 🔒 Security Best Practices

1. **ใช้ Strong Password:**
   - อย่างน้อย 12 ตัวอักษร
   - มีตัวอักษรใหญ่ เล็ก ตัวเลข และสัญลักษณ์
   - ตัวอย่าง: `Admin123!@#`

2. **เปลี่ยน ADMIN_CREATE_SECRET:**
   - หลังจากสร้าง admin แล้ว ควรเปลี่ยนหรือลบ secret token
   - หรือ disable API endpoint

3. **จำกัด Access:**
   - เก็บ secret token เป็นความลับ
   - อย่า commit secret token ลง git

4. **ลบ Endpoint (Optional):**
   - ถ้าไม่ต้องการใช้ API endpoint อีก
   - สามารถลบไฟล์ `src/app/api/admin/create-admin/route.ts` ได้
   - หรือลบหน้า `/admin/create-admin`

---

## 🆘 Troubleshooting

### Error: "Unauthorized"
- ตรวจสอบว่า `ADMIN_CREATE_SECRET` ตั้งค่าใน Vercel แล้ว
- ตรวจสอบว่า Authorization header ถูกต้อง
- ตรวจสอบว่า secret token ตรงกัน

### Error: "Database connection failed"
- ตรวจสอบ `DATABASE_URL` ใน Vercel Environment Variables
- ตรวจสอบว่า database server อนุญาต connection จาก Vercel

### Error: "User already exists"
- API จะ update user ที่มีอยู่ให้เป็น admin อัตโนมัติ
- หรือใช้ email อื่น

### Error: "Server configuration error"
- ตรวจสอบว่า `ADMIN_CREATE_SECRET` ตั้งค่าใน Vercel แล้ว
- Redeploy หลังจากตั้งค่า environment variable

---

## 📝 Checklist

- [ ] ตั้งค่า `ADMIN_CREATE_SECRET` ใน Vercel Environment Variables
- [ ] Deploy ใหม่ (ถ้าใช้วิธีที่ 1)
- [ ] สร้าง admin user ผ่านวิธีที่เลือก
- [ ] ทดสอบ login ด้วย admin account
- [ ] ตรวจสอบว่าเข้าถึง `/admin` ได้
- [ ] เปลี่ยน password เป็นรหัสที่ปลอดภัย
- [ ] (Optional) ลบหรือ disable API endpoint หลังจากสร้าง admin แล้ว

---

## 🎯 วิธีที่แนะนำ

**สำหรับ Production (Vercel):**
- ใช้ **วิธีที่ 1 (หน้าเว็บ UI)** - ง่ายและปลอดภัย
- หรือ **วิธีที่ 2 (API Endpoint)** - ดีสำหรับ automation

**สำหรับ Local Development:**
- ใช้ **วิธีที่ 3 (Script)** - เร็วและสะดวก

