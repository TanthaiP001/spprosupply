# 🔧 แก้ไข Prisma Build Error บน Vercel

## ❌ ปัญหา

Error message:
```
Failed to fetch sha256 checksum at https://binaries.prisma.sh/...
500 Internal Server Error
```

**สาเหตุ**: Prisma ไม่สามารถ download query engine binary ได้ระหว่าง build บน Vercel

---

## ✅ วิธีแก้ไข

### วิธีที่ 1: เพิ่ม Environment Variable (แนะนำ)

เพิ่ม environment variable ใน Vercel เพื่อข้าม checksum verification:

1. ไปที่ **Vercel Dashboard** → Project → **Settings** → **Environment Variables**

2. Click **Add New**

3. ตั้งค่า:
   - **Key**: `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING`
   - **Value**: `1`
   - **Environments**: ☑ Production, ☑ Preview, ☑ Development

4. Click **Save**

5. **Redeploy** project

---

### วิธีที่ 2: ใช้ Binary Targets (Alternative)

แก้ไข `prisma/schema.prisma` เพื่อระบุ binary targets:

```prisma
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

---

### วิธีที่ 3: Pre-build Prisma Client

เพิ่ม script ใน `package.json` เพื่อ pre-build Prisma client:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## 🎯 แนะนำ: ใช้วิธีที่ 1

**เพิ่ม Environment Variable:**
- `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`

วิธีนี้:
- ✅ ง่ายที่สุด
- ✅ ไม่ต้องแก้ไข code
- ✅ ทำงานได้ทันที

---

## 📝 Checklist

- [ ] เพิ่ม `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1` ใน Vercel
- [ ] เลือกทั้ง 3 environments
- [ ] Redeploy project
- [ ] ตรวจสอบว่า build สำเร็จ

---

**Last Updated**: 2025

