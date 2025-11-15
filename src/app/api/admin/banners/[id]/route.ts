import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

// UPDATE banner
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
    const { title, description, image, link, buttonText, isActive, order } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (link !== undefined) updateData.link = link;
    if (buttonText !== undefined) updateData.buttonText = buttonText;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = parseInt(order);

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      { message: "อัปเดต Banner สำเร็จ", banner },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดต Banner" },
      { status: 500 }
    );
  }
}

// DELETE banner
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

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "ลบ Banner สำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบ Banner" },
      { status: 500 }
    );
  }
}

