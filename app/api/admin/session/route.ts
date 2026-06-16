import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session } = body;

    if (!session) {
      return NextResponse.json(
        { error: "Session is required" },
        { status: 400 }
      );
    }

    // Update or create session setting
    const sessionSetting = await prisma.sessionSetting.upsert({
      where: { key: "default" },
      update: { value: session },
      create: { key: "default", value: session },
    });

    return NextResponse.json({ session: sessionSetting.value });
  } catch (error) {
    console.error("[api/admin/session:post]", error);
    return NextResponse.json(
      { error: "Unable to save session" },
      { status: 500 }
    );
  }
}
