import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/users/[id]:delete]", error);
    return NextResponse.json(
      { error: "Unable to delete user" },
      { status: 500 }
    );
  }
}
