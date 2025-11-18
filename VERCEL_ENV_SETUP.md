# 🚀 Vercel Environment Variables Setup Guide

## 📋 ขั้นตอนการตั้งค่า Environment Variables บน Vercel

### Step 1: เข้า Vercel Dashboard

1. ไปที่ [vercel.com](https://vercel.com) และ login
2. เลือก Project ของคุณ
3. ไปที่ **Settings** → **Environment Variables**

---

### Step 2: Generate Secrets (ถ้ายังไม่มี)

รันคำสั่งนี้ใน local เพื่อ generate secrets:

```bash
node scripts/generate-secrets.js
```

จะได้ output แบบนี้:
```
JWT_SECRET=bcd36a236a45e30519c33a25fae3052457dc6346e3b70ee2bcd8d4223b1ff8ca...
JWT_REFRESH_SECRET=51948570cbeb92fa085b06ff3d01592c753e9b8ee25557354c744b61c594be9e...
CSRF_SECRET=124a0a89f594ff0a4b55d3d128c83a655df68a282d63f66c75d528412c8e7bad...
```

---

### Step 3: เพิ่ม Environment Variables ใน Vercel

ในหน้า **Environment Variables** ให้เพิ่ม variables ต่อไปนี้:

#### 1. JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: (ค่าที่ generate จาก script)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### 2. JWT_REFRESH_SECRET
- **Key**: `JWT_REFRESH_SECRET`
- **Value**: (ค่าที่ generate จาก script)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### 3. CSRF_SECRET
- **Key**: `CSRF_SECRET`
- **Value**: (ค่าที่ generate จาก script)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### 4. NEXT_PUBLIC_SITE_URL
- **Key**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://your-project.vercel.app` (หรือ custom domain ถ้ามี)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

#### 5. DATABASE_URL (ถ้ายังไม่มี)
- **Key**: `DATABASE_URL`
- **Value**: (PostgreSQL connection string)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development

---

## 🖼️ ตัวอย่างการตั้งค่าใน Vercel Dashboard

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Key: JWT_SECRET                                         │
│ Value: [bcd36a236a45e30519c33a25fae3052457dc6346...]   │
│ ☑ Production  ☑ Preview  ☑ Development                 │
│ [Save]                                                   │
│                                                          │
│ Key: JWT_REFRESH_SECRET                                 │
│ Value: [51948570cbeb92fa085b06ff3d01592c753e9b8ee...]  │
│ ☑ Production  ☑ Preview  ☑ Development                 │
│ [Save]                                                   │
│                                                          │
│ Key: CSRF_SECRET                                        │
│ Value: [124a0a89f594ff0a4b55d3d128c83a655df68a28...]   │
│ ☑ Production  ☑ Preview  ☑ Development                 │
│ [Save]                                                   │
│                                                          │
│ Key: NEXT_PUBLIC_SITE_URL                               │
│ Value: https://your-project.vercel.app                  │
│ ☑ Production  ☑ Preview  ☑ Development                 │
│ [Save]                                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Checklist สำหรับ Vercel

- [ ] Generate secrets ด้วย `node scripts/generate-secrets.js`
- [ ] ไปที่ Vercel Dashboard → Settings → Environment Variables
- [ ] เพิ่ม `JWT_SECRET` (เลือกทุก environment)
- [ ] เพิ่ม `JWT_REFRESH_SECRET` (เลือกทุก environment)
- [ ] เพิ่ม `CSRF_SECRET` (เลือกทุก environment)
- [ ] เพิ่ม `NEXT_PUBLIC_SITE_URL` (ใส่ Vercel URL หรือ custom domain)
- [ ] ตรวจสอบ `DATABASE_URL` (ถ้ายังไม่มีให้เพิ่ม)
- [ ] Click "Save" สำหรับแต่ละ variable
- [ ] Redeploy project (Settings → Deployments → Redeploy)

---

## 🔍 วิธีหา Vercel URL

### Option 1: ดูจาก Vercel Dashboard
1. ไปที่ Project → **Deployments**
2. ดู URL ที่แสดง (เช่น `https://your-project.vercel.app`)

### Option 2: ดูจาก Domain Settings
1. ไปที่ **Settings** → **Domains**
2. ดู Production Domain

### Option 3: ใช้ Custom Domain
ถ้ามี custom domain:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## ⚙️ การตั้งค่า Environment ต่างๆ

### Production
- ใช้สำหรับ production deployment
- URL: `https://your-project.vercel.app` หรือ custom domain

### Preview
- ใช้สำหรับ preview deployments (pull requests)
- URL: `https://your-project-git-branch.vercel.app`

### Development
- ใช้สำหรับ local development (ถ้าใช้ Vercel CLI)
- URL: `http://localhost:3000`

**แนะนำ**: เลือกทั้ง 3 environments เพื่อให้ทำงานได้ทุกที่

---

## 🔄 หลังจากตั้งค่าแล้ว

### 1. Redeploy Project

หลังจากเพิ่ม environment variables แล้ว ต้อง redeploy:

**วิธีที่ 1: จาก Dashboard**
1. ไปที่ **Deployments**
2. Click **⋯** (three dots) บน deployment ล่าสุด
3. เลือก **Redeploy**

**วิธีที่ 2: จาก Git**
```bash
# Push commit ใหม่ (Vercel จะ auto-deploy)
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 2. ตรวจสอบว่า Variables ถูกตั้งค่า

ใน Vercel Dashboard → Settings → Environment Variables
- ตรวจสอบว่ามี variables ทั้งหมด
- ตรวจสอบว่าเลือก environments ถูกต้อง

### 3. Test ใน Production

```bash
# Test login endpoint
curl -X POST https://your-project.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🛠️ Vercel CLI (Optional)

ถ้าใช้ Vercel CLI สามารถตั้งค่า environment variables จาก command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add JWT_SECRET production
vercel env add JWT_REFRESH_SECRET production
vercel env add CSRF_SECRET production
vercel env add NEXT_PUBLIC_SITE_URL production

# Pull environment variables to local .env
vercel env pull .env.local
```

---

## ⚠️ ข้อควรระวัง

### 1. Secrets ต้องแตกต่างกัน
- อย่าใช้ secret เดียวกันสำหรับ JWT_SECRET และ JWT_REFRESH_SECRET
- ใช้ค่าที่ generate จาก script (แต่ละครั้งจะได้ค่าต่างกัน)

### 2. NEXT_PUBLIC_SITE_URL
- ต้องใส่ `https://` (ไม่ใช่ `http://`)
- ต้องไม่มี trailing slash (`/`)
- ตัวอย่างที่ถูกต้อง: `https://your-project.vercel.app`
- ตัวอย่างที่ผิด: `https://your-project.vercel.app/`

### 3. Environment Selection
- เลือกทั้ง Production, Preview, และ Development
- เพื่อให้ทำงานได้ทุก environment

### 4. Redeploy หลังตั้งค่า
- ต้อง redeploy หลังจากเพิ่ม environment variables
- Variables ใหม่จะไม่ทำงานกับ deployments เก่า

---

## 🔐 Security Best Practices

1. **อย่าแชร์ secrets**
   - อย่าแชร์ secrets ผ่าน email, chat, หรือ public channels
   - ใช้ Vercel's environment variables เท่านั้น

2. **หมุนเวียน secrets**
   - เปลี่ยน secrets ทุก 3-6 เดือน
   - หรือเมื่อมี security incident

3. **ใช้ secrets ที่แตกต่างกัน**
   - Production, Preview, Development ควรใช้ secrets ต่างกัน
   - แต่สำหรับเริ่มต้น ใช้ค่าเดียวกันก็ได้

---

## 📚 Related Documentation

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**Last Updated**: 2025

