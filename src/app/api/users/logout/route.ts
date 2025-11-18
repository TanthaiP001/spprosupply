import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, clearCSRFTokenCookie } from "@/lib/cookies";

export async function POST(request: NextRequest) {
  try {
    // Clear all auth cookies
    await clearAuthCookies();
    await clearCSRFTokenCookie();

    return NextResponse.json(
      { message: "ออกจากระบบสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการออกจากระบบ" },
      { status: 500 }
    );
  }
}

