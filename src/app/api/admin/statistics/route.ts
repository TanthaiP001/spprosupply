import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId || !(await verifyAdmin(userId))) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total products
    const totalProducts = await prisma.product.count();

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get total sales (sum of all completed orders)
    const completedOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["completed", "shipped", "processing", "confirmed"],
        },
      },
      select: {
        total: true,
      },
    });

    const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    // Get sales data for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ordersLast7Days = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
        status: {
          in: ["completed", "shipped", "processing", "confirmed"],
        },
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group sales by date
    const salesByDate: Record<string, number> = {};
    ordersLast7Days.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      salesByDate[date] = (salesByDate[date] || 0) + order.total;
    });

    // Get product count by category
    const productsByCategory = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    // Mock visitor data (in production, you would track this in database)
    const today = new Date();
    const visitorData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
      });
      // Mock data: random visitors between 100-500
      visitorData.push({
        date: dateStr,
        visitors: Math.floor(Math.random() * 400) + 100,
      });
    }

    return NextResponse.json(
      {
        statistics: {
          totalProducts,
          totalOrders,
          totalSales,
          ordersByStatus,
          salesByDate: Object.entries(salesByDate).map(([date, sales]) => ({
            date,
            sales,
          })),
          productsByCategory: productsByCategory.map((cat) => ({
            name: cat.name,
            count: cat._count.products,
          })),
          visitorData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get statistics error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ" },
      { status: 500 }
    );
  }
}

