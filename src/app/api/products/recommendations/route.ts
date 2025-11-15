import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET recommended products (public API)
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to 20 products
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Get recommendations error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

