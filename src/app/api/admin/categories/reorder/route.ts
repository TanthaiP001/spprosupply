import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

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
    const { orderedIds } = body as { orderedIds?: string[] };

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { sortOrder: index + 1 },
        })
      )
    );

    return NextResponse.json(
      { message: "อัปเดตลำดับหมวดหมู่สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reorder categories error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตลำดับหมวดหมู่" },
      { status: 500 }
    );
  }
}

