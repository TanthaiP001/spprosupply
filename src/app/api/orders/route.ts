import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

// CREATE order (public API)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get form fields
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const district = formData.get("district") as string;
    const province = formData.get("province") as string;
    const postalCode = formData.get("postalCode") as string;
    const note = formData.get("note") as string | null;
    const subtotal = parseFloat(formData.get("subtotal") as string);
    const shippingFee = parseFloat(formData.get("shippingFee") as string);
    const total = parseFloat(formData.get("total") as string);
    const itemsJson = formData.get("items") as string;
    const userId = formData.get("userId") as string | null;
    const paymentSlipFile = formData.get("paymentSlip") as File | null;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !address || !district || !province || !postalCode) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    if (!itemsJson) {
      return NextResponse.json(
        { error: "ไม่มีสินค้าในตะกร้า" },
        { status: 400 }
      );
    }

    const items = JSON.parse(itemsJson);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Handle payment slip upload to Vercel Blob Storage
    let paymentSlipUrl: string | null = null;
    if (paymentSlipFile) {
      // Validate file type
      if (!paymentSlipFile.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (paymentSlipFile.size > maxSize) {
        return NextResponse.json(
          { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = paymentSlipFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `orders/${timestamp}-${orderNumber}-${originalName}`;

      // Upload to Vercel Blob Storage
      const blob = await put(filename, paymentSlipFile, {
        access: "public",
        contentType: paymentSlipFile.type,
      });

      paymentSlipUrl = blob.url;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        firstName,
        lastName,
        phone,
        email,
        address,
        district,
        province,
        postalCode,
        note: note || null,
        subtotal,
        shippingFee,
        total,
        paymentSlip: paymentSlipUrl,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      { 
        message: "สั่งซื้อสำเร็จ",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create order error:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code,
    });
    return NextResponse.json(
      { 
        error: "เกิดข้อผิดพลาดในการสั่งซื้อ",
        details: process.env.NODE_ENV === "development" ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET orders (admin only)
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify admin (you should implement verifyAdmin function)
    const { verifyAdmin } = await import("@/lib/auth");
    if (!(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the entire end date
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

