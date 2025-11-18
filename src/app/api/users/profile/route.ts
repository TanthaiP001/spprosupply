import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyMiddleware } from "@/lib/middleware";
import { rateLimiters } from "@/lib/rateLimit";

// GET user profile
export async function GET(request: NextRequest) {
  try {
    // Authentication and rate limiting
    const { user, error } = await applyMiddleware(request, {
      requireAuth: true,
      rateLimit: rateLimiters.api,
    });

    if (error) {
      return error;
    }

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 401 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
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
        updatedAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

// UPDATE user profile
export async function PUT(request: NextRequest) {
  try {
    // Authentication, CSRF protection, and rate limiting
    const { user, error } = await applyMiddleware(request, {
      requireAuth: true,
      requireCSRF: true,
      rateLimit: rateLimiters.api,
    });

    if (error) {
      return error;
    }

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, address, district, province, postalCode } = body;

    const userData = await prisma.user.update({
      where: { id: user.userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(address !== undefined && { address }),
        ...(district !== undefined && { district }),
        ...(province !== undefined && { province }),
        ...(postalCode !== undefined && { postalCode }),
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
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "อัปเดตข้อมูลสำเร็จ", user: userData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}

