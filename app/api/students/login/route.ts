import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import {
  createStudentProfilePayload,
  setStudentSessionCookie,
  verifyPassword,
} from "@/src/lib/student-auth";

const loginSchema = z.object({
  matricNumber: z.string().min(5, "Enter your matric number"),
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

    const { matricNumber, password } = result.data;

    const student = await prisma.user.findFirst({
      where: {
        kind: "STUDENT",
        matricNumber,
      },
      include: {
        faculty: true,
        department: true,
      },
    });

    if (!student?.passwordHash || !verifyPassword(password, student.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid matric number or password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      student: createStudentProfilePayload(student),
      redirectTo: student.completed ? "/dashboard" : "/complete-profile",
    });

    setStudentSessionCookie(response, student.id);
    return response;
  } catch (error) {
    console.error("[students/login]", error);
    return NextResponse.json(
      { error: "Unable to sign you in right now" },
      { status: 500 }
    );
  }
}
