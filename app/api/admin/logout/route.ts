import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/src/lib/admin-auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out",
    });

    clearAdminSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[admin/logout]", error);
    return NextResponse.json(
      { error: "Unable to log you out right now" },
      { status: 500 }
    );
  }
}
