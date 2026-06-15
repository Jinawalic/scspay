import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { makeSlug } from "@/src/lib/academic";

const facultySchema = z.object({
  name: z.string().min(2, "Faculty name is required"),
});

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { departments: true },
        },
      },
    });

    return NextResponse.json({
      faculties: faculties.map((faculty) => ({
        id: faculty.id,
        name: faculty.name,
        slug: faculty.slug,
        departmentCount: faculty._count.departments,
        createdAt: faculty.createdAt,
      })),
    });
  } catch (error) {
    console.error("[admin/faculties:get]", error);
    return NextResponse.json(
      { error: "Unable to load faculties" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = facultySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid faculty details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const name = result.data.name.trim();
    const slug = makeSlug(name);

    const existingFaculty = await prisma.faculty.findFirst({
      where: {
        OR: [{ slug }, { name }],
      },
    });

    if (existingFaculty) {
      return NextResponse.json(
        {
          faculty: {
            id: existingFaculty.id,
            name: existingFaculty.name,
            slug: existingFaculty.slug,
          },
          message: "Faculty already exists",
        },
        { status: 200 }
      );
    }

    const faculty = await prisma.faculty.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(
      {
        faculty: {
          id: faculty.id,
          name: faculty.name,
          slug: faculty.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[admin/faculties:post]", error);
    return NextResponse.json(
      { error: "Unable to create faculty" },
      { status: 500 }
    );
  }
}
