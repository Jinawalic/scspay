import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import prisma from "@/src/lib/prisma";

export const STUDENT_SESSION_COOKIE = "scspay_student_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type StudentProfilePayload = {
  id: string;
  kind: "STUDENT";
  role: string | null;
  fullName: string;
  email: string | null;
  matricNumber: string | null;
  faculty: string | null;
  department: string | null;
  level: string | null;
  phone: string | null;
  completed: boolean;
  avatar: string | null;
};

export type StudentWithRelations = Prisma.UserGetPayload<{
  include: {
    faculty: true;
    department: true;
  };
}>;

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(key, "hex");

  return expected.length === candidate.length && crypto.timingSafeEqual(expected, candidate);
}

export function createStudentProfilePayload(student: StudentWithRelations): StudentProfilePayload {
  return {
    id: student.id,
    kind: "STUDENT",
    role: student.role ?? "Student",
    fullName: student.fullName,
    email: student.email,
    matricNumber: student.matricNumber,
    faculty: student.faculty?.name ?? null,
    department: student.department?.name ?? null,
    level: student.level,
    phone: student.phone,
    completed: student.completed,
    avatar: student.avatar,
  };
}

export function setStudentSessionCookie(response: NextResponse, studentId: string) {
  response.cookies.set(STUDENT_SESSION_COOKIE, studentId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearStudentSessionCookie(response: NextResponse) {
  response.cookies.set(STUDENT_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentStudent() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(STUDENT_SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      id: sessionId,
      kind: "STUDENT",
    },
    select: {
      id: true,
      kind: true,
      role: true,
      fullName: true,
      email: true,
      matricNumber: true,
      passwordHash: true,
      phone: true,
      level: true,
      avatar: true,
      completed: true,
      facultyId: true,
      departmentId: true,
      faculty: true,
      department: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
