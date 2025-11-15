# แก้ไข Error: Invalid port number in database URL

## 🔴 ปัญหา

Error: `P1013: The provided database string is invalid. invalid port number in database URL`

เกิดจาก **DATABASE_URL** ที่ตั้งค่าใน Vercel ไม่ถูกต้อง

---

## ✅ วิธีแก้ไข

### 1. ตรวจสอบ Format ของ DATABASE_URL

**Format ที่ถูกต้อง:**
```
postgresql://username:password@host:port/database?sslmode=require
```

**ตัวอย่าง:**
```
postgresql://postgres:mypassword@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

---

### 2. ปัญหาที่พบบ่อย

#### ❌ ผิด: มีอักขระพิเศษใน password
```
postgresql://user:pass@word@host:5432/db
```
**แก้ไข:** Escape อักขระพิเศษหรือใช้ URL encoding
```
postgresql://user:pass%40word@host:5432/db
```

#### ❌ ผิด: Port ไม่ถูกต้อง
```
postgresql://user:pass@host:5432abc/db
```
**แก้ไข:** Port ต้องเป็นตัวเลขเท่านั้น
```
postgresql://user:pass@host:5432/db
```

#### ❌ ผิด: มีช่องว่าง
```
postgresql://user:pass@host: 5432/db
```
**แก้ไข:** ลบช่องว่าง
```
postgresql://user:pass@host:5432/db
```

---

### 3. วิธีแก้ไขใน Vercel

1. ไปที่ **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**

2. หา `DATABASE_URL` และคลิก **Edit**

3. ตรวจสอบ Connection String:
   - ต้องไม่มีช่องว่าง
   - Port ต้องเป็นตัวเลข (ปกติคือ 5432)
   - Password ถ้ามีอักขระพิเศษต้อง URL encode

4. **URL Encode Password** (ถ้าจำเป็น):
   
   ถ้า password มีอักขระพิเศษ เช่น `@`, `#`, `%`, `&` ต้อง encode:
   
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`
   - `/` → `%2F`
   - `:` → `%3A`
   - `?` → `%3F`
   - `=` → `%3D`
   - ` ` (space) → `%20`

5. **ตัวอย่าง:**
   
   ถ้า password คือ `my@pass#123`:
   ```
   postgresql://user:my%40pass%23123@host:5432/db?sslmode=require
   ```

6. คลิก **Save**

7. **Redeploy** project

---

### 4. วิธีตรวจสอบ Connection String

#### ใช้ Online URL Encoder:
- ไปที่ [urlencoder.org](https://www.urlencoder.org/)
- Paste password ของคุณ
- Copy encoded value
- ใส่ใน connection string

#### ใช้ Node.js:
```bash
node -e "console.log(encodeURIComponent('your-password'))"
```

---

### 5. ตัวอย่าง Connection Strings ตาม Provider

#### Vercel Postgres:
```
postgresql://default:password@host.vercel-storage.com:5432/verceldb?sslmode=require
```

#### Supabase:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

**⚠️ หมายเหตุ:** ถ้าใช้ Supabase connection string จาก dashboard, บางครั้งจะมี `[YOUR-PASSWORD]` ที่ต้องแทนที่ด้วย password จริง

#### Neon:
```
postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech:5432/dbname?sslmode=require
```

---

### 6. ทดสอบ Connection String

สร้างไฟล์ `test-connection.js`:

```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

test();
```

รัน:
```bash
node test-connection.js
```

---

## 🔍 Checklist

- [ ] Connection string ไม่มีช่องว่าง
- [ ] Port เป็นตัวเลข (5432)
- [ ] Password ที่มีอักขระพิเศษถูก URL encode แล้ว
- [ ] Format ถูกต้อง: `postgresql://user:pass@host:port/db?sslmode=require`
- [ ] ตรวจสอบ connection string จาก provider อีกครั้ง
- [ ] Save และ Redeploy

---

## 🆘 ยังแก้ไม่ได้?

1. **Copy connection string ใหม่** จาก database provider
2. **ตรวจสอบว่าใช้ connection string ที่ถูกต้อง** (บาง provider มีหลายแบบ)
3. **ลองใช้ connection pooling string** (ถ้า provider รองรับ)
4. **ตรวจสอบว่า database server ทำงานอยู่**

