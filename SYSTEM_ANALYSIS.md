# 📊 System Analysis Document
## SP Pro Supply - E-Commerce Platform

**Version:** 1.0  
**Date:** 2025  
**Document Type:** System Analysis & Architecture Documentation

---

## 📑 สารบัญ

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture Analysis](#3-architecture-analysis)
4. [Database Design](#4-database-design)
5. [Business Logic & Data Flow](#5-business-logic--data-flow)
6. [Security Analysis](#6-security-analysis)
7. [Performance Analysis](#7-performance-analysis)
8. [Technology Stack](#8-technology-stack)
9. [API Documentation](#9-api-documentation)
10. [Component Structure](#10-component-structure)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Recommendations & Future Improvements](#12-recommendations--future-improvements)

---

## 1. Executive Summary

### 1.1 Project Overview
**SP Pro Supply** เป็นระบบ E-Commerce Platform ที่พัฒนาด้วย Next.js 16 สำหรับการขายสินค้าออนไลน์ โดยมีฟีเจอร์หลักดังนี้:

- 🛍️ **Product Management**: จัดการสินค้า, หมวดหมู่, และ Banner
- 🛒 **Shopping Cart**: ระบบตะกร้าสินค้าแบบ Client-side
- 📦 **Order Management**: จัดการคำสั่งซื้อและสถานะออเดอร์
- 👤 **User Management**: ระบบสมาชิกและ Admin Panel
- 💳 **Payment Processing**: ระบบชำระเงินผ่านการอัปโหลดสลิป
- 📊 **Analytics & Statistics**: Dashboard สำหรับ Admin

### 1.2 Key Metrics
- **Technology**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: PostgreSQL (Production), SQLite (Development)
- **Deployment**: Vercel Platform
- **Storage**: Vercel Blob Storage
- **Caching**: SWR (Client-side), HTTP Cache Headers (Server-side)

---

## 2. System Overview

### 2.1 System Purpose
ระบบ E-Commerce สำหรับการขายสินค้าออนไลน์ โดยรองรับทั้งผู้ใช้ทั่วไปและผู้ดูแลระบบ (Admin)

### 2.2 User Roles

#### 2.2.1 Guest User
- ดูสินค้าและหมวดหมู่
- เพิ่มสินค้าลงตะกร้า
- สั่งซื้อสินค้า (ไม่ต้องสมัครสมาชิก)

#### 2.2.2 Registered User
- ฟีเจอร์ทั้งหมดของ Guest User
- จัดการโปรไฟล์
- ดูประวัติการสั่งซื้อ
- ติดตามสถานะออเดอร์

#### 2.2.3 Admin User
- ฟีเจอร์ทั้งหมดของ Registered User
- จัดการสินค้า (CRUD)
- จัดการหมวดหมู่ (CRUD)
- จัดการ Banner (CRUD)
- จัดการออเดอร์ (อัปเดตสถานะ)
- จัดการผู้ใช้
- ดูสถิติและรายงาน

### 2.3 Core Features

#### 2.3.1 Frontend Features
- ✅ Responsive Design (Mobile-first)
- ✅ Product Catalog with Categories
- ✅ Product Search & Filtering
- ✅ Shopping Cart (LocalStorage)
- ✅ User Authentication
- ✅ Order Tracking
- ✅ Admin Dashboard

#### 2.3.2 Backend Features
- ✅ RESTful API
- ✅ Authentication & Authorization
- ✅ File Upload (Vercel Blob)
- ✅ Database Management (Prisma ORM)
- ✅ Caching Strategy
- ✅ Error Handling

---

## 3. Architecture Analysis

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Browser    │  │   Mobile     │  │   Tablet     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    Next.js Application Layer                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Router (Next.js 16)                 │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │   Pages      │  │  Components  │                │  │
│  │  │  (Client)    │  │  (React 19)  │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │  API Routes  │  │  Contexts    │                │  │
│  │  │  (Server)    │  │  (State Mgmt)│                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Layer                               │  │
│  │  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │   Prisma     │  │     SWR      │                │  │
│  │  │     ORM      │  │   (Caching)  │                │  │
│  │  └──────────────┘  └──────────────┘                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                    Infrastructure Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │ Vercel Blob  │  │    Vercel    │     │
│  │  Database    │  │   Storage    │  │   Platform   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Architecture Pattern

#### 3.2.1 Frontend Architecture
- **Pattern**: Component-Based Architecture
- **State Management**: React Context API
  - `AuthContext`: จัดการ authentication state
  - `CartContext`: จัดการ shopping cart state
- **Data Fetching**: SWR (Stale-While-Revalidate)
- **Styling**: Tailwind CSS 4

#### 3.2.2 Backend Architecture
- **Pattern**: RESTful API with Next.js API Routes
- **ORM**: Prisma (Type-safe database client)
- **Authentication**: Custom JWT-less authentication (Session-based with localStorage)
- **File Storage**: Vercel Blob Storage

### 3.3 Data Flow

#### 3.3.1 Product Listing Flow
```
User Request → Next.js Page Component
    ↓
SWR Hook (useProducts/useHighlightProducts)
    ↓
API Route (/api/products)
    ↓
Prisma Query → PostgreSQL
    ↓
Response with Cache Headers
    ↓
SWR Cache → Component Render
```

#### 3.3.2 Order Creation Flow
```
User Submit Order → Cart Page
    ↓
FormData with Payment Slip
    ↓
API Route (/api/orders) POST
    ↓
Validate & Upload Payment Slip (Vercel Blob)
    ↓
Create Order (Prisma)
    ↓
Create Order Items (Prisma)
    ↓
Return Order Number
    ↓
Clear Cart & Redirect
```

### 3.4 Caching Strategy

#### 3.4.1 Server-Side Caching
- **HTTP Cache Headers**: 
  - Products: `s-maxage=60, stale-while-revalidate=300`
  - Categories: `s-maxage=300, stale-while-revalidate=600`
  - Banners: `s-maxage=120, stale-while-revalidate=600`

#### 3.4.2 Client-Side Caching
- **SWR Configuration**:
  - `revalidateOnFocus: false`
  - `revalidateOnReconnect: true`
  - `dedupingInterval: 60000` (1 minute)

---

## 4. Database Design

### 4.1 Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐
│   User      │         │  Category   │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ email (UQ)  │         │ name        │
│ password    │         │ slug (UQ)   │
│ firstName   │         │ createdAt   │
│ lastName    │         │ updatedAt   │
│ phone       │         └──────┬──────┘
│ address     │                │
│ district    │                │ 1:N
│ province    │                │
│ postalCode  │                │
│ role        │                │
│ createdAt   │         ┌──────▼──────┐
│ updatedAt   │         │   Product   │
└──────┬──────┘         ├─────────────┤
       │                │ id (PK)     │
       │                │ name        │
       │ 0:N            │ slug (UQ)   │
       │                │ price       │
       │                │ image       │
       │                │ categoryId  │
┌──────▼──────┐         │ rating      │
│   Order     │         │ reviews     │
├─────────────┤         │ tag         │
│ id (PK)     │         │ isHighlight │
│ orderNumber │         │ description │
│ userId (FK) │         │ createdAt   │
│ firstName   │         │ updatedAt   │
│ lastName    │         └─────────────┘
│ phone       │
│ email       │
│ address     │
│ district    │
│ province    │
│ postalCode  │
│ note        │
│ subtotal    │
│ shippingFee │
│ total       │
│ paymentSlip │
│ status      │
│ createdAt   │
│ updatedAt   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│   OrderItem     │
├─────────────────┤
│ id (PK)         │
│ orderId (FK)    │
│ productId       │
│ productName     │
│ productImage    │
│ price           │
│ quantity        │
│ createdAt       │
└─────────────────┘

┌─────────────┐
│   Banner    │
├─────────────┤
│ id (PK)     │
│ title       │
│ description │
│ image       │
│ link        │
│ buttonText  │
│ isActive    │
│ order       │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

### 4.2 Database Schema Details

#### 4.2.1 User Table
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    district TEXT,
    province TEXT,
    postalCode TEXT,
    role TEXT DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP
);
```

**Indexes:**
- `email` (UNIQUE)

**Relationships:**
- One-to-Many with `Order` (userId)

#### 4.2.2 Category Table
```sql
CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP
);
```

**Indexes:**
- `slug` (UNIQUE)

**Relationships:**
- One-to-Many with `Product` (categoryId)

#### 4.2.3 Product Table
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    price DOUBLE PRECISION NOT NULL,
    image TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    rating DOUBLE PRECISION DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    tag TEXT,
    isHighlight BOOLEAN DEFAULT false,
    description TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
);
```

**Indexes:**
- `slug` (UNIQUE)
- `categoryId` (Foreign Key)

**Relationships:**
- Many-to-One with `Category` (categoryId)

#### 4.2.4 Order Table
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    orderNumber TEXT UNIQUE NOT NULL,
    userId TEXT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    province TEXT NOT NULL,
    postalCode TEXT NOT NULL,
    note TEXT,
    subtotal DOUBLE PRECISION NOT NULL,
    shippingFee DOUBLE PRECISION DEFAULT 0,
    total DOUBLE PRECISION NOT NULL,
    paymentSlip TEXT,
    status TEXT DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP
);
```

**Indexes:**
- `orderNumber` (UNIQUE)
- `userId` (Foreign Key, nullable)

**Status Values:**
- `pending`: รอการชำระเงิน
- `confirmed`: ยืนยันการชำระเงินแล้ว
- `processing`: กำลังจัดเตรียมสินค้า
- `shipped`: ส่งสินค้าแล้ว
- `completed`: สมบูรณ์
- `cancelled`: ยกเลิก

#### 4.2.5 OrderItem Table
```sql
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    productId TEXT NOT NULL,
    productName TEXT NOT NULL,
    productImage TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
);
```

**Relationships:**
- Many-to-One with `Order` (orderId)

**Note:** OrderItem เก็บข้อมูลสินค้าแบบ snapshot เพื่อป้องกันการเปลี่ยนแปลงราคาหรือชื่อสินค้าในอนาคต

#### 4.2.6 Banner Table
```sql
CREATE TABLE banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    link TEXT NOT NULL,
    buttonText TEXT DEFAULT 'ดูเพิ่มเติม',
    isActive BOOLEAN DEFAULT true,
    order INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP
);
```

### 4.3 Database Constraints

#### 4.3.1 Foreign Key Constraints
- `products.categoryId` → `categories.id` (CASCADE DELETE)
- `order_items.orderId` → `orders.id` (CASCADE DELETE)

#### 4.3.2 Unique Constraints
- `users.email`
- `categories.slug`
- `products.slug`
- `orders.orderNumber`

---

## 5. Business Logic & Data Flow

### 5.1 Authentication Flow

#### 5.1.1 User Registration
```
1. User fills registration form
2. Client validates input
3. POST /api/users/register
4. Server validates email uniqueness
5. Hash password (bcrypt)
6. Create user in database
7. Return user data (without password)
8. Auto-login user
9. Store user in localStorage
10. Redirect to profile page
```

#### 5.1.2 User Login
```
1. User enters email/password
2. POST /api/users/login
3. Server finds user by email
4. Verify password (bcrypt.compare)
5. Return user data (without password)
6. Store user in localStorage
7. Redirect based on role:
   - Admin → /admin
   - User → /profile
```

#### 5.1.3 Admin Authorization
```
1. Client sends request with x-user-id header
2. Server calls verifyAdmin(userId)
3. Query database for user role
4. Return true if role === 'admin'
5. Allow/Deny access to admin routes
```

### 5.2 Shopping Cart Flow

#### 5.2.1 Add to Cart
```
1. User clicks "Add to Cart"
2. CartContext.addToCart(productId, quantity)
3. Check if product exists in cart
4. If exists: Update quantity
5. If not: Add new item
6. Save to localStorage
7. Update UI (cart badge)
```

#### 5.2.2 Cart Persistence
- Cart data stored in `localStorage`
- Persists across page refreshes
- Cleared after successful order

### 5.3 Order Processing Flow

#### 5.3.1 Order Creation
```
1. User reviews cart
2. Fills shipping information
3. Uploads payment slip (optional)
4. Submit order form
5. POST /api/orders (FormData)
6. Validate required fields
7. Upload payment slip to Vercel Blob (if provided)
8. Generate unique order number
9. Create order record
10. Create order items (snapshot)
11. Return order number
12. Clear cart
13. Redirect to order tracking
```

#### 5.3.2 Order Status Management
```
Admin updates order status:
1. Admin selects order
2. Changes status dropdown
3. PUT /api/orders/[id]
4. Verify admin authorization
5. Validate status value
6. Update order status
7. Return updated order
8. Refresh order list
```

**Status Transitions:**
- `pending` → `confirmed` → `processing` → `shipped` → `completed`
- Any status → `cancelled`

### 5.4 Product Management Flow

#### 5.4.1 Product Creation (Admin)
```
1. Admin fills product form
2. Upload product image
3. POST /api/admin/products
4. Verify admin authorization
5. Upload image to Vercel Blob
6. Create product record
7. Return created product
8. Redirect to product list
```

#### 5.4.2 Product Listing
```
1. User visits product page
2. SWR hook fetches products
3. Check SWR cache first
4. If cache miss: Fetch from API
5. API checks HTTP cache
6. If cache miss: Query database
7. Return with cache headers
8. Update SWR cache
9. Render product grid
```

### 5.5 File Upload Flow

#### 5.5.1 Image Upload
```
1. User selects image file
2. Client validates file type/size
3. Convert to FormData
4. POST to API route
5. Server validates file
6. Generate unique filename
7. Upload to Vercel Blob Storage
8. Return public URL
9. Store URL in database
```

**File Validation:**
- Allowed types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Max size: 5MB

---

## 6. Security Analysis

### 6.1 Authentication Security

#### 6.1.1 Password Security
- ✅ **Hashing**: bcrypt with salt rounds (10)
- ✅ **No Plain Text**: Passwords never stored in plain text
- ✅ **No Password in Response**: Passwords excluded from API responses

#### 6.1.2 Session Management
- ⚠️ **Client-Side Storage**: User data stored in localStorage
- ⚠️ **No JWT**: No token-based authentication
- ⚠️ **No Server-Side Session**: Stateless authentication

**Security Concerns:**
- localStorage vulnerable to XSS attacks
- No automatic session expiration
- No refresh token mechanism

**Recommendations:**
- Implement JWT with httpOnly cookies
- Add session expiration
- Implement refresh token rotation

### 6.2 Authorization Security

#### 6.2.1 Admin Authorization
- ✅ **Server-Side Verification**: All admin routes verify on server
- ✅ **Role-Based Access**: Uses database role check
- ⚠️ **Header-Based Auth**: Uses `x-user-id` header (can be spoofed)

**Security Concerns:**
- Client can modify `x-user-id` header
- No token signature verification

**Recommendations:**
- Implement JWT with signature verification
- Use httpOnly cookies instead of headers
- Add rate limiting for admin routes

### 6.3 API Security

#### 6.3.1 Input Validation
- ✅ **Server-Side Validation**: All inputs validated on server
- ✅ **Type Checking**: TypeScript type safety
- ✅ **SQL Injection Protection**: Prisma ORM prevents SQL injection

#### 6.3.2 File Upload Security
- ✅ **File Type Validation**: Only images allowed
- ✅ **File Size Limit**: 5MB maximum
- ✅ **Filename Sanitization**: Special characters removed
- ✅ **Storage Isolation**: Files stored in Vercel Blob (separate from app)

### 6.4 Data Security

#### 6.4.1 Sensitive Data
- ✅ **Password Hashing**: Passwords hashed with bcrypt
- ✅ **No Sensitive Data in Logs**: Passwords excluded from logs
- ⚠️ **User Data in localStorage**: Personal data stored client-side

#### 6.4.2 Database Security
- ✅ **Parameterized Queries**: Prisma uses parameterized queries
- ✅ **Connection Pooling**: Prisma manages connections
- ⚠️ **No Encryption at Rest**: Database not encrypted (depends on provider)

### 6.5 Security Recommendations

#### High Priority
1. **Implement JWT Authentication**
   - Replace localStorage with httpOnly cookies
   - Add token expiration and refresh mechanism

2. **Add Rate Limiting**
   - Prevent brute force attacks
   - Limit API requests per IP

3. **Implement CSRF Protection**
   - Add CSRF tokens for state-changing operations

#### Medium Priority
4. **Add Input Sanitization**
   - Sanitize user inputs to prevent XSS
   - Validate file uploads more strictly

5. **Implement Audit Logging**
   - Log admin actions
   - Track sensitive operations

6. **Add HTTPS Enforcement**
   - Ensure all connections use HTTPS
   - Implement HSTS headers

---

## 7. Performance Analysis

### 7.1 Caching Strategy

#### 7.1.1 Server-Side Caching
| Resource | Cache Duration | Stale-While-Revalidate |
|----------|---------------|------------------------|
| Products | 60s | 300s |
| Categories | 300s | 600s |
| Banners | 120s | 600s |
| Recommendations | 60s | 300s |

**Benefits:**
- Reduces database queries
- Faster response times
- Better scalability

#### 7.1.2 Client-Side Caching (SWR)
- **Deduplication**: Prevents duplicate requests
- **Background Revalidation**: Updates cache in background
- **Optimistic Updates**: Instant UI updates

### 7.2 Database Performance

#### 7.2.1 Indexes
- ✅ `users.email` (UNIQUE)
- ✅ `categories.slug` (UNIQUE)
- ✅ `products.slug` (UNIQUE)
- ✅ `orders.orderNumber` (UNIQUE)

#### 7.2.2 Query Optimization
- ✅ **Selective Fields**: Only fetch required fields
- ✅ **Relationships**: Efficient joins with Prisma
- ⚠️ **N+1 Problem**: Potential in some queries

**Recommendations:**
- Add indexes for frequently queried fields
- Use Prisma's `include` efficiently
- Consider pagination for large datasets

### 7.3 Frontend Performance

#### 7.3.1 Code Splitting
- ✅ **Next.js Automatic**: Automatic code splitting
- ✅ **Dynamic Imports**: Lazy loading for heavy components

#### 7.3.2 Image Optimization
- ✅ **Next.js Image**: Automatic image optimization
- ✅ **Lazy Loading**: Images load on demand

#### 7.3.3 Bundle Size
- ✅ **Tree Shaking**: Unused code removed
- ✅ **Minification**: Production builds minified

### 7.4 Performance Metrics

#### Expected Performance
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **API Response Time**: < 200ms (cached), < 500ms (uncached)

### 7.5 Performance Recommendations

1. **Implement Database Connection Pooling**
   - Optimize Prisma connection pool
   - Monitor connection usage

2. **Add CDN for Static Assets**
   - Use Vercel's CDN
   - Cache static files aggressively

3. **Implement Pagination**
   - Paginate product listings
   - Limit items per page

4. **Optimize Images**
   - Use WebP format
   - Implement responsive images
   - Lazy load below-fold images

---

## 8. Technology Stack

### 8.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.3 | React Framework |
| React | 19.2.0 | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 4.x | Styling |
| SWR | 2.3.6 | Data Fetching & Caching |
| Lucide React | 0.553.0 | Icons |

### 8.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.0.3 | Serverless Functions |
| Prisma | 5.22.0 | ORM |
| bcryptjs | 2.4.3 | Password Hashing |
| @vercel/blob | 0.25.0 | File Storage |

### 8.3 Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Production Database |
| SQLite | Development Database |

### 8.4 Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel Platform | Hosting & Deployment |
| Vercel Blob Storage | File Storage |
| Vercel Analytics | Analytics |

### 8.5 Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code Linting |
| TypeScript | Type Checking |
| Prisma Studio | Database GUI |

---

## 9. API Documentation

### 9.1 Public APIs

#### 9.1.1 Products

**GET /api/products**
- **Description**: Get all products or filter by category
- **Query Parameters**:
  - `categoryId` (optional): Filter by category ID
- **Response**: `{ products: Product[] }`
- **Cache**: 60s

**GET /api/products/highlight**
- **Description**: Get highlight products
- **Response**: `{ products: Product[] }`
- **Cache**: 60s

**GET /api/products/recommendations**
- **Description**: Get recommended products
- **Response**: `{ products: Product[] }`
- **Cache**: 60s

**GET /api/products/[slug]**
- **Description**: Get single product by slug
- **Response**: `{ product: Product }`

#### 9.1.2 Categories

**GET /api/categories**
- **Description**: Get all categories
- **Response**: `{ categories: Category[] }`
- **Cache**: 300s

#### 9.1.3 Banners

**GET /api/banners**
- **Description**: Get active banners
- **Response**: `{ banners: Banner[] }`
- **Cache**: 120s

#### 9.1.4 Orders

**POST /api/orders**
- **Description**: Create new order
- **Body**: FormData
  - `firstName`, `lastName`, `phone`, `email`
  - `address`, `district`, `province`, `postalCode`
  - `note` (optional)
  - `subtotal`, `shippingFee`, `total`
  - `items` (JSON string)
  - `userId` (optional)
  - `paymentSlip` (File, optional)
- **Response**: `{ order: Order, orderNumber: string }`

**GET /api/orders/track?orderNumber=xxx**
- **Description**: Track order by order number
- **Response**: `{ order: Order }`

### 9.2 User APIs

#### 9.2.1 Authentication

**POST /api/users/register**
- **Description**: Register new user
- **Body**: `{ email, password, firstName, lastName, phone }`
- **Response**: `{ user: User }`

**POST /api/users/login**
- **Description**: Login user
- **Body**: `{ email, password }`
- **Response**: `{ user: User }`

**GET /api/users/profile**
- **Description**: Get user profile
- **Headers**: `x-user-id`
- **Response**: `{ user: User }`

**PUT /api/users/profile**
- **Description**: Update user profile
- **Headers**: `x-user-id`
- **Body**: `Partial<User>`
- **Response**: `{ user: User }`

### 9.3 Admin APIs

**All Admin APIs require:**
- Header: `x-user-id`
- User must have `role: "admin"`

#### 9.3.1 Products (Admin)

**GET /api/admin/products**
- **Description**: Get all products (admin view)

**POST /api/admin/products**
- **Description**: Create product
- **Body**: FormData with product data and image

**PUT /api/admin/products/[id]**
- **Description**: Update product
- **Body**: FormData with product data

**DELETE /api/admin/products/[id]**
- **Description**: Delete product

#### 9.3.2 Categories (Admin)

**GET /api/admin/categories**
- **Description**: Get all categories

**POST /api/admin/categories**
- **Description**: Create category
- **Body**: `{ name, slug }`

**PUT /api/admin/categories/[id]**
- **Description**: Update category
- **Body**: `{ name, slug }`

**DELETE /api/admin/categories/[id]**
- **Description**: Delete category

#### 9.3.3 Banners (Admin)

**GET /api/admin/banners**
- **Description**: Get all banners

**POST /api/admin/banners**
- **Description**: Create banner
- **Body**: FormData with banner data and image

**PUT /api/admin/banners/[id]**
- **Description**: Update banner
- **Body**: FormData with banner data

**DELETE /api/admin/banners/[id]**
- **Description**: Delete banner

#### 9.3.4 Orders (Admin)

**GET /api/admin/orders**
- **Description**: Get all orders

**PUT /api/admin/orders/[id]**
- **Description**: Update order status
- **Body**: `{ status: string }`

**GET /api/admin/orders/[id]**
- **Description**: Get single order details

#### 9.3.5 Statistics

**GET /api/admin/statistics**
- **Description**: Get dashboard statistics
- **Response**: `{ statistics: Statistics }`

---

## 10. Component Structure

### 10.1 Page Components

```
src/app/
├── page.tsx                    # Homepage
├── products/
│   ├── page.tsx               # Product listing
│   └── [slug]/
│       └── page.tsx           # Product detail
├── cart/
│   └── page.tsx               # Shopping cart
├── payment/
│   └── page.tsx               # Checkout
├── orders/
│   └── track/
│       └── page.tsx           # Order tracking
├── login/
│   └── page.tsx               # Login
├── register/
│   └── page.tsx               # Registration
├── profile/
│   └── page.tsx               # User profile
└── admin/
    ├── page.tsx               # Admin dashboard
    ├── products/
    │   └── page.tsx           # Product management
    ├── categories/
    │   └── page.tsx           # Category management
    ├── banners/
    │   └── page.tsx           # Banner management
    ├── orders/
    │   └── page.tsx           # Order management
    └── users/
        └── page.tsx           # User management
```

### 10.2 Reusable Components

```
src/components/
├── Header.tsx                 # Site header
├── Footer.tsx                 # Site footer
├── Banner.tsx                 # Main banner
├── BannerHighlight.tsx        # Highlight banner
├── Sidebar.tsx                # Category sidebar
├── CategorySidebar.tsx        # Category filter
├── ProductGrid.tsx            # Product grid display
├── Recommendations.tsx        # Product recommendations
├── Pagination.tsx             # Pagination controls
├── RightNavbar.tsx            # Right navigation
├── MemberLogin.tsx            # Member login widget
├── Newsletter.tsx             # Newsletter signup
├── WebsiteStats.tsx           # Statistics display
└── VisitorCount.tsx           # Visitor counter
```

### 10.3 Context Providers

```
src/contexts/
├── AuthContext.tsx            # Authentication state
└── CartContext.tsx            # Shopping cart state
```

### 10.4 Custom Hooks

```
src/hooks/
├── useProducts.ts             # Product data fetching
├── useCategories.ts           # Category data fetching
└── useBanners.ts              # Banner data fetching
```

### 10.5 Utility Libraries

```
src/lib/
├── prisma.ts                  # Prisma client instance
└── auth.ts                    # Authentication utilities
```

---

## 11. Deployment & Infrastructure

### 11.1 Deployment Platform

**Vercel Platform**
- Serverless functions
- Automatic scaling
- Global CDN
- Zero-downtime deployments

### 11.2 Environment Variables

**Required Variables:**
```env
DATABASE_URL=postgresql://...
BLOB_READ_WRITE_TOKEN=...
ADMIN_CREATE_SECRET=...
```

### 11.3 Database Setup

**Production:**
- PostgreSQL (Vercel Postgres, Supabase, or external)
- Connection pooling enabled
- Automated backups

**Development:**
- SQLite (local file)
- Prisma migrations

### 11.4 File Storage

**Vercel Blob Storage**
- Public access for images
- Automatic CDN distribution
- 1GB free tier

### 11.5 Build Process

```bash
# Development
npm run dev

# Production Build
npm run build

# Start Production Server
npm start

# Database Migrations
npm run db:migrate
```

### 11.6 Monitoring & Analytics

- **Vercel Analytics**: Built-in analytics
- **Error Tracking**: Vercel error logs
- **Performance Monitoring**: Vercel speed insights

---

## 12. Recommendations & Future Improvements

### 12.1 Security Improvements

#### High Priority
1. **Implement JWT Authentication**
   - Replace localStorage with httpOnly cookies
   - Add token expiration (15 minutes)
   - Implement refresh tokens (7 days)

2. **Add Rate Limiting**
   - Implement rate limiting middleware
   - Limit login attempts (5 per 15 minutes)
   - Limit API requests per IP

3. **CSRF Protection**
   - Add CSRF tokens for state-changing operations
   - Implement SameSite cookies

#### Medium Priority
4. **Input Sanitization**
   - Sanitize all user inputs
   - Implement XSS protection
   - Validate file uploads strictly

5. **Audit Logging**
   - Log all admin actions
   - Track sensitive operations
   - Monitor failed login attempts

### 12.2 Performance Improvements

1. **Database Optimization**
   - Add indexes for frequently queried fields
   - Implement database connection pooling
   - Add query result caching (Redis)

2. **Frontend Optimization**
   - Implement pagination for product listings
   - Add infinite scroll for better UX
   - Optimize bundle size (code splitting)

3. **Image Optimization**
   - Convert all images to WebP
   - Implement responsive images
   - Add lazy loading for below-fold images

### 12.3 Feature Enhancements

1. **Search Functionality**
   - Implement full-text search
   - Add search filters
   - Search suggestions/autocomplete

2. **Payment Integration**
   - Integrate payment gateways (Stripe, PayPal)
   - Support multiple payment methods
   - Automatic payment verification

3. **Email Notifications**
   - Order confirmation emails
   - Status update notifications
   - Password reset emails

4. **Inventory Management**
   - Stock tracking
   - Low stock alerts
   - Out-of-stock handling

5. **Reviews & Ratings**
   - Product reviews system
   - Rating aggregation
   - Review moderation

6. **Wishlist**
   - Save favorite products
   - Share wishlist
   - Price drop alerts

### 12.4 Code Quality Improvements

1. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright)

2. **Documentation**
   - API documentation (Swagger/OpenAPI)
   - Component documentation (Storybook)
   - Code comments

3. **Error Handling**
   - Centralized error handling
   - User-friendly error messages
   - Error logging service

### 12.5 Scalability Improvements

1. **Caching Layer**
   - Implement Redis for caching
   - Cache frequently accessed data
   - Cache invalidation strategy

2. **Database Scaling**
   - Read replicas for read-heavy operations
   - Database sharding (if needed)
   - Connection pooling optimization

3. **CDN Configuration**
   - Aggressive caching for static assets
   - Edge caching for API responses
   - Image CDN optimization

---

## Appendix A: Glossary

- **SWR**: Stale-While-Revalidate - Data fetching library
- **ORM**: Object-Relational Mapping - Database abstraction layer
- **JWT**: JSON Web Token - Authentication token standard
- **CSRF**: Cross-Site Request Forgery - Security attack
- **XSS**: Cross-Site Scripting - Security vulnerability
- **CDN**: Content Delivery Network - Distributed network for content delivery
- **SSR**: Server-Side Rendering - Rendering on server
- **SSG**: Static Site Generation - Pre-rendering at build time

## Appendix B: References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [SWR Documentation](https://swr.vercel.app/)
- [Vercel Documentation](https://vercel.com/docs)

---

**Document Version:** 1.0  
**Last Updated:** 2025  
**Author:** System Analysis Team  
**Status:** Final

