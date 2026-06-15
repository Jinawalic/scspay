import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import {
  createStudentProfilePayload,
  getCurrentStudent,
} from "@/src/lib/student-auth";
import { makeDepartmentCode, makeSlug } from "@/src/lib/academic";

const updateProfileSchema = z.object({
  faculty: z.string().min(2, "Select your faculty"),
  department: z.string().min(2, "Select your department"),
  level: z.string().optional(),
  phone: z.string().optional(),
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

    const { faculty, department, level, phone } = result.data;
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

    const updatedStudent = await prisma.user.update({
      where: { id: student.id },
      data: {
        facultyId: savedFaculty.id,
        departmentId: savedDepartment.id,
        ...(level ? { level } : {}),
        ...(phone ? { phone } : {}),
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
