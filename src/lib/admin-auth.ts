import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";

export const ADMIN_SESSION_COOKIE = "scspay_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function setAdminSessionCookie(response: NextResponse, adminId: string) {
  response.cookies.set(ADMIN_SESSION_COOKIE, adminId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  return prisma.adminAccount.findUnique({
    where: {
      id: sessionId,
    },
  });
}
