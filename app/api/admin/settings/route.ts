import { NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { getCurrentAdmin } from "@/src/lib/admin-auth";

const adminSettingsSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  currentPassword: z.string().min(1, "Current password is required").optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
});

export async function PATCH(request: Request) {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = adminSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid data",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    // Update full name if provided
    if (result.data.fullName) {
      updateData.fullName = result.data.fullName;
    }

    // Update password if both current and new password are provided
    if (result.data.currentPassword && result.data.newPassword) {
      const bcrypt = require("bcrypt");
      const isCurrentPasswordValid = await bcrypt.compare(
        result.data.currentPassword,
        admin.passwordHash
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      updateData.passwordHash = await bcrypt.hash(result.data.newPassword, 10);
    }

    const updatedAdmin = await prisma.adminAccount.update({
      where: { id: admin.id },
      data: updateData,
    });

    return NextResponse.json({
      admin: {
        id: updatedAdmin.id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        fullName: updatedAdmin.fullName,
        role: updatedAdmin.role,
      },
    });
  } catch (error) {
    console.error("[api/admin/settings:patch]", error);
    return NextResponse.json(
      { error: "Unable to update settings" },
      { status: 500 }
    );
  }
}
