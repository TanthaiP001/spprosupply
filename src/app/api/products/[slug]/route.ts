import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET product by slug or ID (public API)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try to find by slug first, if not found, try by ID
    // CUID format: starts with 'c' followed by 25 alphanumeric characters
    const isCuid = /^c[a-z0-9]{25}$/.test(slug);
    
    let product = null;
    
    if (isCuid) {
      // If it looks like an ID (CUID), search by ID
      product = await prisma.product.findUnique({
        where: { id: slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    } else {
      // Otherwise, search by slug
      product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    }

    // If not found by slug, try by ID as fallback
    if (!product && !isCuid) {
      product = await prisma.product.findUnique({
        where: { id: slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    }

    if (!product) {
      return NextResponse.json(
        { error: "ไม่พบสินค้า" },
        { status: 404 }
      );
    }

    // Get related products (same category, limit 4)
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: {
          not: product.id,
        },
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
      take: 4,
    });

    return NextResponse.json(
      { product, relatedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get product by slug error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

