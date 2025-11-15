import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "ไม่พบไฟล์" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
        { status: 400 }
      );
    }

    // Determine upload type from query parameter or default to products
    const uploadType = request.nextUrl.searchParams.get("type") || "products";
    const allowedTypes = ["products", "banners"];
    const finalType = allowedTypes.includes(uploadType) ? uploadType : "products";

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${finalType}/${timestamp}-${originalName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json(
      { 
        message: "อัปโหลดสำเร็จ",
        url: blob.url,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        error: "เกิดข้อผิดพลาดในการอัปโหลดไฟล์",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

