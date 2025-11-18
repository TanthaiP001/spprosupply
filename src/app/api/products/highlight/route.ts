import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET highlight products (public API)
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: {
        isHighlight: true,
      },
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
      take: 9, // Limit to 9 products
    });

    return NextResponse.json({ products }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Get highlight products error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

