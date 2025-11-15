import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET visitor count (public API)
export async function GET(request: NextRequest) {
  try {
    // Simple visitor count calculation
    // This is a basic implementation - in production, you'd want to track actual page views
    
    // Get total unique users (registered)
    const totalUsers = await prisma.user.count();
    
    // Get total orders
    const totalOrders = await prisma.order.count();
    
    // Calculate approximate visitor count
    // Formula: (users * 3) + (orders * 5) + base number
    // This gives a reasonable approximation for display purposes
    const baseVisitors = 1000; // Base number for display
    const estimatedVisitors = baseVisitors + (totalUsers * 3) + (totalOrders * 5);
    
    return NextResponse.json(
      {
        visitors: estimatedVisitors,
        totalUsers,
        totalOrders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      {
        visitors: 1000, // Default fallback
        totalUsers: 0,
        totalOrders: 0,
      },
      { status: 200 } // Return default instead of error
    );
  }
}

// POST - Track page view (public API)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer } = body;
    
    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown";
    
    // For now, we'll just log it
    // In a production app, you'd want to store this in a database
    console.log("Page view:", { path, referrer, ip, userAgent });
    
    return NextResponse.json(
      { message: "Tracked" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Track page view error:", error);
    return NextResponse.json(
      { error: "Failed to track" },
      { status: 500 }
    );
  }
}

