import { NextRequest, NextResponse } from "next/server";
import { generateAndSetCSRFToken } from "@/lib/csrf";

/**
 * GET /api/csrf-token
 * Get CSRF token for client-side requests
 */
export async function GET(request: NextRequest) {
  try {
    const csrfToken = await generateAndSetCSRFToken();
    
    return NextResponse.json(
      { csrfToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้าง CSRF token" },
      { status: 500 }
    );
  }
}

