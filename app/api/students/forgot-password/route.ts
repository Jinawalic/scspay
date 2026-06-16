import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/student-auth";

const forgotPasswordSchema = z.object({
  matricNumber: z.string().min(1, "Matriculation number is required"),
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

    const { matricNumber, newPassword } = result.data;

    // Check if the student exists by matricNumber (case-insensitive or exact)
    const student = await prisma.user.findFirst({
      where: {
        matricNumber: {
          equals: matricNumber,
          mode: "insensitive",
        },
        kind: "STUDENT",
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "No student account found with this Matriculation Number" },
        { status: 404 }
      );
    }

    // Hash and update password
    const passwordHash = hashPassword(newPassword);

    await prisma.user.update({
      where: { id: student.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in.",
    });
  } catch (error) {
    console.error("[students/forgot-password:post]", error);
    return NextResponse.json(
      { error: "Unable to process password reset" },
      { status: 500 }
    );
  }
}
