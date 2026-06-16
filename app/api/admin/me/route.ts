import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/src/lib/admin-auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[api/admin/me:get]", error);
    return NextResponse.json(
      { error: "Unable to fetch admin data" },
      { status: 500 }
    );
  }
}
