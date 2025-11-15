import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Handle payment slip upload
    let paymentSlipUrl: string | null = null;
    if (paymentSlipFile) {
      const bytes = await paymentSlipFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save to public/uploads/orders/
      const timestamp = Date.now();
      const fileExtension = paymentSlipFile.name.split('.').pop();
      const fileName = `${timestamp}-${orderNumber}.${fileExtension}`;
      
      // In production, you should use cloud storage
      // For now, we'll save to local file system
      const fs = await import('fs');
      const path = await import('path');
      
      // Create directory if it doesn't exist
      const dir = path.join(process.cwd(), 'public/uploads/orders');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const filePath = path.join(process.cwd(), 'public/uploads/orders', fileName);
      fs.writeFileSync(filePath, buffer);
      paymentSlipUrl = `/uploads/orders/${fileName}`;
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
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสั่งซื้อ" },
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

