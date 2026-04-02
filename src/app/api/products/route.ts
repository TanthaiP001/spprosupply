import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeProductImages } from "@/lib/productImages";
import type { Prisma } from "@prisma/client";

// GET all products (public API)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const q = searchParams.get("q");

    const where: Prisma.ProductWhereInput = {};
    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (q && q.trim() !== "") {
      where.name = {
        contains: q.trim(),
        mode: "insensitive",
      };
    }

    const products = await prisma.product.findMany({
      where,
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
    });

    const normalizedProducts = products.map(normalizeProductImages);

    return NextResponse.json({ products: normalizedProducts }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

