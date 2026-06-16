import { NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";

const departmentEditSchema = z.object({
  code: z.string().min(2, "Code is required"),
  title: z.string().min(2, "Title is required"),
  faculty: z.string().min(2, "Faculty is required"),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = departmentEditSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid department data",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const department = await prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    const { code, title, faculty } = result.data;

    // Check for conflicting code
    const conflictingCode = await prisma.department.findFirst({
      where: {
        code: code.toUpperCase(),
        NOT: { id },
      },
    });

    if (conflictingCode) {
      return NextResponse.json(
        { error: "A department with this code already exists" },
        { status: 409 }
      );
    }

    // Check for conflicting name
    const conflictingName = await prisma.department.findFirst({
      where: {
        name: title,
        NOT: { id },
      },
    });

    if (conflictingName) {
      return NextResponse.json(
        { error: "A department with this name already exists" },
        { status: 409 }
      );
    }

    const updatedDepartment = await prisma.department.update({
      where: { id },
      data: {
        code: code.toUpperCase(),
        name: title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
      },
      include: {
        faculty: true,
      },
    });

    return NextResponse.json({
      department: {
        id: updatedDepartment.id,
        code: updatedDepartment.code,
        title: updatedDepartment.name,
        faculty: updatedDepartment.faculty?.name || faculty,
      },
    });
  } catch (error) {
    console.error("[api/admin/departments/[id]:patch]", error);
    return NextResponse.json(
      { error: "Unable to update department" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/admin/departments/[id]:delete]", error);
    return NextResponse.json(
      { error: "Unable to delete department" },
      { status: 500 }
    );
  }
}
