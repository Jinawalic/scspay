import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { setAdminSessionCookie } from "@/src/lib/admin-auth";
import { verifyPassword } from "@/src/lib/student-auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid login details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Check if the admin account exists in database
    const admin = await prisma.adminAccount.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      redirectTo: "/admin/dashboard",
    });

    // Set the secure session cookie
    setAdminSessionCookie(response, admin.id);

    return response;
  } catch (error) {
    console.error("[admin/login:post]", error);
    return NextResponse.json(
      { error: "Unable to sign you in right now" },
      { status: 500 }
    );
  }
}
