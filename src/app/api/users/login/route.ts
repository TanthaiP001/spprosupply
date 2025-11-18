import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
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

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อผู้ใช้/อีเมลและรหัสผ่าน" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้/อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้/อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

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

    // Return user data (without password) and CSRF token
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      district: user.district,
      province: user.province,
      postalCode: user.postalCode,
      role: user.role,
    };

    const response = NextResponse.json(
      { 
        message: "เข้าสู่ระบบสำเร็จ", 
        user: userData,
        csrfToken, // Client needs this for subsequent requests
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
      { status: 500 }
    );
  }
}

