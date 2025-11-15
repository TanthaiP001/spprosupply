# Database Setup Guide

## การติดตั้งและตั้งค่า Database

### 1. ติดตั้ง Dependencies

```bash
npm install @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs
```

### 2. สร้างไฟล์ .env

สร้างไฟล์ `.env` ใน root directory และเพิ่ม:

```
DATABASE_URL="file:./dev.db"
```

### 3. Generate Prisma Client และสร้าง Database

```bash
# Generate Prisma Client
npm run db:generate

# สร้าง database และ table
npm run db:push
```

### 4. (Optional) เปิด Prisma Studio เพื่อดูข้อมูล

```bash
npm run db:studio
```

## Database Schema

### User Table

- `id` (String, Primary Key) - CUID
- `email` (String, Unique) - อีเมล
- `password` (String) - รหัสผ่าน (hashed)
- `firstName` (String) - ชื่อ
- `lastName` (String) - นามสกุล
- `phone` (String) - เบอร์โทรศัพท์
- `address` (String, Optional) - ที่อยู่
- `district` (String, Optional) - อำเภอ/เขต
- `province` (String, Optional) - จังหวัด
- `postalCode` (String, Optional) - รหัสไปรษณีย์
- `createdAt` (DateTime) - วันที่สร้าง
- `updatedAt` (DateTime) - วันที่อัปเดตล่าสุด

## API Endpoints

### POST /api/users/register
สมัครสมาชิกใหม่

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "081-234-5678"
}
```

**Response:**
```json
{
  "message": "สมัครสมาชิกสำเร็จ",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}
```

### POST /api/users/login
เข้าสู่ระบบ

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "เข้าสู่ระบบสำเร็จ",
  "user": {
    "id": "...",
    "email": "user@example.com",
    ...
  }
}
```

### GET /api/users/profile
ดึงข้อมูลโปรไฟล์

**Headers:**
```
x-user-id: <user_id>
```

### PUT /api/users/profile
อัปเดตข้อมูลโปรไฟล์

**Headers:**
```
x-user-id: <user_id>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "081-234-5678",
  "address": "123 Main St",
  "district": "บางรัก",
  "province": "กรุงเทพมหานคร",
  "postalCode": "10500"
}
```

## Migration

เมื่อต้องการเปลี่ยนแปลง schema:

```bash
# สร้าง migration
npm run db:migrate

# หรือ push schema โดยตรง (สำหรับ development)
npm run db:push
```

## หมายเหตุ

- Database ใช้ SQLite สำหรับ development
- รหัสผ่านถูก hash ด้วย bcryptjs
- สำหรับ production ควรเปลี่ยนเป็น PostgreSQL หรือ MySQL

