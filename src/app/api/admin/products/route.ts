import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

// GET all products
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId || !(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

// CREATE product
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
    const { name, price, image, categoryId, rating, reviews, tag, isHighlight, description } = body;

    if (!name || !price || !image || !categoryId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // Generate slug from name
    function generateSlug(name: string): string {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }

    let slug = generateSlug(name);
    
    // Check if slug already exists
    let existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    // If slug exists, add a number suffix
    let counter = 1;
    let finalSlug = slug;
    while (existingProduct) {
      finalSlug = `${slug}-${counter}`;
      existingProduct = await prisma.product.findUnique({
        where: { slug: finalSlug },
      });
      counter++;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        price: parseFloat(price),
        image,
        categoryId,
        rating: rating ? parseFloat(rating) : 0,
        reviews: reviews ? parseInt(reviews) : 0,
        tag: tag || null,
        isHighlight: isHighlight || false,
        description: description || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { message: "สร้างสินค้าสำเร็จ", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างสินค้า" },
      { status: 500 }
    );
  }
}

