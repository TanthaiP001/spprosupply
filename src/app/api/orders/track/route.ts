import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET order by order number (public API for tracking)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber) {
      return NextResponse.json(
        { error: "กรุณาระบุหมายเลขคำสั่งซื้อ" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "ไม่พบคำสั่งซื้อ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการค้นหา" },
      { status: 500 }
    );
  }
}

