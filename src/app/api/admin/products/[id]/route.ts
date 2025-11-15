import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

// UPDATE product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id");
    
    if (!userId || !(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, price, image, categoryId, rating, reviews, tag, isHighlight, description } = body;

    // Get current product to check if name changed
    const currentProduct = await prisma.product.findUnique({
      where: { id },
    });

    const updateData: any = {
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(image && { image }),
      ...(categoryId && { categoryId }),
      ...(rating !== undefined && { rating: parseFloat(rating) }),
      ...(reviews !== undefined && { reviews: parseInt(reviews) }),
      ...(tag !== undefined && { tag }),
      ...(isHighlight !== undefined && { isHighlight }),
      ...(description !== undefined && { description }),
    };

    // If name changed, generate new slug
    if (name && name !== currentProduct?.name) {
      function generateSlug(name: string): string {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
      }

      let slug = generateSlug(name);
      
      // Check if slug already exists (excluding current product)
      let existingProduct = await prisma.product.findUnique({
        where: { slug },
      });

      // If slug exists for another product, add a number suffix
      let counter = 1;
      let finalSlug = slug;
      while (existingProduct && existingProduct.id !== id) {
        finalSlug = `${slug}-${counter}`;
        existingProduct = await prisma.product.findUnique({
          where: { slug: finalSlug },
        });
        counter++;
      }

      updateData.name = name;
      updateData.slug = finalSlug;
    } else if (name) {
      updateData.name = name;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return NextResponse.json(
      { message: "อัปเดตสินค้าสำเร็จ", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตสินค้า" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id");
    
    if (!userId || !(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "ลบสินค้าสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบสินค้า" },
      { status: 500 }
    );
  }
}

