import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      databaseUrlLength: process.env.DATABASE_URL?.length || 0,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) || "N/A",
    };

    // Test Prisma Client
    try {
      await prisma.$connect();
      debugInfo.prismaConnection = "Connected";
      
      // Test simple query
      const userCount = await prisma.user.count();
      debugInfo.userCount = userCount;
      
      await prisma.$disconnect();
    } catch (prismaError: any) {
      debugInfo.prismaConnection = "Failed";
      debugInfo.prismaError = {
        message: prismaError?.message,
        code: prismaError?.code,
        name: prismaError?.name,
      };
    }

    // Test hashPassword
    try {
      const { hashPassword } = await import("@/lib/auth");
      const testHash = await hashPassword("test");
      debugInfo.hashPassword = "Working";
      debugInfo.testHashLength = testHash.length;
    } catch (hashError: any) {
      debugInfo.hashPassword = "Failed";
      debugInfo.hashError = hashError?.message;
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}

