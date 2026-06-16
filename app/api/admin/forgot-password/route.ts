import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/student-auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, newPassword } = result.data;

    // Check if the admin exists in the database
    const admin = await prisma.adminAccount.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "No admin account found with this email address" },
        { status: 404 }
      );
    }

    // Hash and update the admin's password
    const passwordHash = hashPassword(newPassword);

    await prisma.adminAccount.update({
      where: { id: admin.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in.",
    });
  } catch (error) {
    console.error("[admin/forgot-password:post]", error);
    return NextResponse.json(
      { error: "Unable to process password reset at this time" },
      { status: 500 }
    );
  }
}
