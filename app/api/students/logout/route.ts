import { NextResponse } from "next/server";
import { clearStudentSessionCookie } from "@/src/lib/student-auth";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out",
    });

    clearStudentSessionCookie(response);
    return response;
  } catch (error) {
    console.error("[students/logout]", error);
    return NextResponse.json(
      { error: "Unable to log you out right now" },
      { status: 500 }
    );
  }
}
