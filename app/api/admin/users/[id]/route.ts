import { NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";

const userEditSchema = z.object({
  department: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = userEditSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid user data",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (result.data.department) {
      const department = await prisma.department.findFirst({
        where: { name: result.data.department },
      });

      if (department) {
        updateData.departmentId = department.id;
      }
    }

    if (result.data.password) {
      const bcrypt = require("bcrypt");
      updateData.passwordHash = await bcrypt.hash(result.data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        department: true,
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        matricNumber: updatedUser.matricNumber,
        department: updatedUser.department?.name || "",
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("[admin/users/[id]:patch]", error);
    return NextResponse.json(
      { error: "Unable to update user" },
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
