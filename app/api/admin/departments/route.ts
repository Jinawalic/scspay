import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { makeDepartmentCode, makeSlug } from "@/src/lib/academic";

const departmentSchema = z.object({
  title: z.string().min(2, "Department name is required"),
  code: z.string().min(2, "Department code is required"),
  faculty: z.string().min(2, "Faculty name is required"),
});

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        faculty: true,
      },
    });

    return NextResponse.json({
      departments: departments.map((department) => ({
        id: department.id,
        code: department.code,
        title: department.name,
        faculty: department.faculty.name,
        facultyId: department.facultyId,
        slug: department.slug,
        createdAt: department.createdAt,
      })),
    });
  } catch (error) {
    console.error("[admin/departments:get]", error);
    return NextResponse.json(
      { error: "Unable to load departments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = departmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid department details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const title = result.data.title.trim();
    const code = result.data.code.trim().toUpperCase();
    const facultyName = result.data.faculty.trim();
    const facultySlug = makeSlug(facultyName);
    const departmentSlug = makeSlug(`${facultyName}-${title}`);

    const faculty = await prisma.faculty.upsert({
      where: {
        slug: facultySlug,
      },
      update: {
        name: facultyName,
      },
      create: {
        name: facultyName,
        slug: facultySlug,
      },
    });

    const existingDepartment = await prisma.department.findFirst({
      where: {
        OR: [
          { code },
          {
            facultyId: faculty.id,
            name: title,
          },
          { slug: departmentSlug },
        ],
      },
      include: {
        faculty: true,
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        {
          department: {
            id: existingDepartment.id,
            code: existingDepartment.code,
            title: existingDepartment.name,
            faculty: existingDepartment.faculty.name,
            facultyId: existingDepartment.facultyId,
            slug: existingDepartment.slug,
          },
          message: "Department already exists",
        },
        { status: 200 }
      );
    }

    const department = await prisma.department.create({
      data: {
        code,
        slug: departmentSlug,
        name: title,
        facultyId: faculty.id,
      },
      include: {
        faculty: true,
      },
    });

    return NextResponse.json(
      {
        department: {
          id: department.id,
          code: department.code,
          title: department.name,
          faculty: department.faculty.name,
          facultyId: department.facultyId,
          slug: department.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[admin/departments:post]", error);
    return NextResponse.json(
      { error: "Unable to create department" },
      { status: 500 }
    );
  }
}
