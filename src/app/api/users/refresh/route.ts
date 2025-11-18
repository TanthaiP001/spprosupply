import { NextRequest, NextResponse } from "next/server";
import { getRefreshTokenCookie, setAccessTokenCookie, clearAuthCookies } from "@/lib/cookies";
import { verifyRefreshToken, generateAccessToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = await getRefreshTokenCookie();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      // Invalid refresh token, clear cookies
      await clearAuthCookies();
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      await clearAuthCookies();
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set new access token in cookie
    await setAccessTokenCookie(newAccessToken);

    return NextResponse.json(
      { message: "Token refreshed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    await clearAuthCookies();
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการรีเฟรช token" },
      { status: 500 }
    );
  }
}

