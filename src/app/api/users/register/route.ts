import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { generateTokenPair } from "@/lib/jwt";
import { setAccessTokenCookie, setRefreshTokenCookie } from "@/lib/cookies";
import { rateLimiters } from "@/lib/rateLimit";
import { csrfProtection, generateAndSetCSRFToken } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = await rateLimiters.auth(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // CSRF protection
    const csrfResponse = await csrfProtection(request);
    if (csrfResponse) {
      return csrfResponse;
    }
    // Check database connection
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is not set");
      return NextResponse.json(
        { error: "Server configuration error: Database not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, firstName, lastName, phone } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        district: true,
        province: true,
        postalCode: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set tokens in httpOnly cookies
    await setAccessTokenCookie(tokens.accessToken);
    await setRefreshTokenCookie(tokens.refreshToken);

    // Generate and set CSRF token
    const csrfToken = await generateAndSetCSRFToken();

    return NextResponse.json(
      { 
        message: "สมัครสมาชิกสำเร็จ", 
        user,
        csrfToken, // Client needs this for subsequent requests
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register error:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
      meta: error?.meta,
    });
    
    // Prisma errors
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 400 }
      );
    }
    
    if (error?.code === "P1001") {
      return NextResponse.json(
        { error: "ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้" },
        { status: 500 }
      );
    }

    if (error?.code === "P1013") {
      return NextResponse.json(
        { error: "Database connection string is invalid. Please check DATABASE_URL in Vercel environment variables." },
        { status: 500 }
      );
    }
    
    // Return error with details (always show in production for debugging)
    return NextResponse.json(
      { 
        error: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        details: {
          code: error?.code,
          name: error?.name,
          message: error?.message,
          ...(error?.meta && { meta: error.meta }),
        }
      },
      { status: 500 }
    );
  }
}
