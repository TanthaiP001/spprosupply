import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
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

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", user },
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
    
    // Return error with details in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? error?.message || "Unknown error"
      : "เกิดข้อผิดพลาดในการสมัครสมาชิก";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && {
          details: {
            code: error?.code,
            name: error?.name,
            meta: error?.meta,
          }
        })
      },
      { status: 500 }
    );
  }
}
