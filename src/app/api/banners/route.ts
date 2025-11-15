import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET active banners (public API)
export async function GET(request: NextRequest) {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
      take: 1, // Get first active banner
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

