import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { kind: "STUDENT" },
      include: {
        faculty: true,
        department: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      users: students.map((student) => ({
        id: student.id,
        fullName: student.fullName,
        matricNumber: student.matricNumber ?? "",
        faculty: student.faculty?.name ?? "",
        department: student.department?.name ?? "",
        phone: student.phone ?? "",
        level: student.level ?? "",
        email: student.email ?? "",
        completed: student.completed,
        createdAt: student.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[admin/users:get]", error);
    return NextResponse.json(
      { error: "Unable to load users" },
      { status: 500 }
    );
  }
}
