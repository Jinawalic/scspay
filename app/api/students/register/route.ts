import { type NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import {
  createStudentProfilePayload,
  hashPassword,
  setStudentSessionCookie,
} from "@/src/lib/student-auth";

const registerSchema = z
  .object({
    email: z.string().email("Enter a valid email"),
    fullName: z.string().min(3, "Enter your full name"),
    matricNumber: z.string().min(5, "Enter your matric number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid registration details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, fullName, matricNumber, password } = result.data;

    const existingStudent = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { matricNumber }],
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          error:
            existingStudent.email === email
              ? "An account with this email already exists"
              : "An account with this matric number already exists",
        },
        { status: 409 }
      );
    }

    const student = await prisma.user.create({
      data: {
        kind: "STUDENT",
        role: "Student",
        fullName,
        email,
        matricNumber,
        passwordHash: hashPassword(password),
        completed: false,
      },
      include: {
        faculty: true,
        department: true,
      },
    });

    const response = NextResponse.json(
      {
        student: createStudentProfilePayload(student),
        redirectTo: "/dashboard",
      },
      { status: 201 }
    );

    setStudentSessionCookie(response, student.id);
    return response;
  } catch (error) {
    console.error("[students/register]", error);

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email or matric number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create your account right now" },
      { status: 500 }
    );
  }
}
