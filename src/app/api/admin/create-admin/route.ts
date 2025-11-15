import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// This endpoint should only be accessible with a secret token
// Set ADMIN_CREATE_SECRET in your environment variables
export async function POST(request: NextRequest) {
  try {
    // Check for secret token
    const authHeader = request.headers.get("authorization");
    const secretToken = process.env.ADMIN_CREATE_SECRET;
    
    if (!secretToken) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (authHeader !== `Bearer ${secretToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
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
      // Update to admin if exists
      const hashedPassword = await hashPassword(password);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          role: "admin",
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
          role: true,
        },
      });

      return NextResponse.json(
        { message: "Admin user updated successfully", user: updatedUser },
        { status: 200 }
      );
    }

    // Create new admin user
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: "admin",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: "Admin user created successfully", user: admin },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { 
        error: "เกิดข้อผิดพลาดในการสร้าง admin user",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

