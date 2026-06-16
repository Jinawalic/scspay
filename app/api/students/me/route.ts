import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import {
  createStudentProfilePayload,
  getCurrentStudent,
  hashPassword,
  verifyPassword,
} from "@/src/lib/student-auth";
import { makeDepartmentCode, makeSlug } from "@/src/lib/academic";

const updateProfileSchema = z.object({
  faculty: z.string().optional(),
  department: z.string().optional(),
  level: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export async function GET() {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({ student: createStudentProfilePayload(student) });
  } catch (error) {
    console.error("[students/me:get]", error);
    return NextResponse.json(
      { error: "Unable to load your profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid profile details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      faculty,
      department,
      level,
      phone,
      email,
      avatar,
      currentPassword,
      newPassword,
    } = result.data;

    let newPasswordHash: string | undefined;

    // Password verification and change logic
    if (currentPassword && newPassword) {
      if (!student.passwordHash) {
        return NextResponse.json(
          { error: "Password not configured for this account" },
          { status: 400 }
        );
      }

      const isPasswordValid = verifyPassword(currentPassword, student.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Incorrect current password" },
          { status: 400 }
        );
      }

      newPasswordHash = hashPassword(newPassword);
    }

    let facultyId: string | undefined;
    let departmentId: string | undefined;

    if (faculty && department) {
      const facultySlug = makeSlug(faculty);
      const departmentSlug = makeSlug(`${facultySlug}-${department}`);

      const savedFaculty = await prisma.faculty.upsert({
        where: { slug: facultySlug },
        update: { name: faculty },
        create: {
          name: faculty,
          slug: facultySlug,
        },
      });

      const savedDepartment = await prisma.department.upsert({
        where: {
          facultyId_name: {
            facultyId: savedFaculty.id,
            name: department,
          },
        },
        update: {
          slug: departmentSlug,
          code: makeDepartmentCode(facultySlug, department),
        },
        create: {
          facultyId: savedFaculty.id,
          name: department,
          slug: departmentSlug,
          code: makeDepartmentCode(facultySlug, department),
        },
      });

      facultyId = savedFaculty.id;
      departmentId = savedDepartment.id;
    }

    const updatedStudent = await prisma.user.update({
      where: { id: student.id },
      data: {
        ...(facultyId ? { facultyId } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(level ? { level } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
        ...(newPasswordHash ? { passwordHash: newPasswordHash } : {}),
        completed: true,
      },
      include: {
        faculty: true,
        department: true,
      },
    });

    return NextResponse.json({
      student: createStudentProfilePayload(updatedStudent),
    });
  } catch (error) {
    console.error("[students/me:patch]", error);
    return NextResponse.json(
      { error: "Unable to update your profile" },
      { status: 500 }
    );
  }
}

