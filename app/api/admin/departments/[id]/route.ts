import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
