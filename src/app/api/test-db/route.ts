import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { 
          success: false, 
          error: "DATABASE_URL is not set",
          details: "Please set DATABASE_URL in Vercel Environment Variables"
        },
        { status: 500 }
      );
    }

    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      stats: {
        users: userCount,
        products: productCount,
        orders: orderCount,
      },
    });
  } catch (error: any) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        code: error?.code,
        details: process.env.NODE_ENV === "development" ? {
          stack: error?.stack,
          name: error?.name,
        } : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

