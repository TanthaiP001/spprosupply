import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId || !(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const banners = await prisma.banner.findMany({
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ banners }, { status: 200 });
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

// CREATE banner
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId || !(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, image, link, buttonText, isActive, order } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        image,
        link: link || "#",
        buttonText: buttonText || "ดูเพิ่มเติม",
        isActive: isActive !== undefined ? isActive : true,
        order: order !== undefined ? parseInt(order) : 0,
      },
    });

    return NextResponse.json(
      { message: "สร้าง Banner สำเร็จ", banner },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้าง Banner" },
      { status: 500 }
    );
  }
}

