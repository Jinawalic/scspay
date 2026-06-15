import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { createStudentProfilePayload, getCurrentStudent } from "@/src/lib/student-auth";
import { formatPaymentDate, formatPaymentDateTime, getCurrentAcademicSession } from "@/src/lib/payment-flow";

const initializeSchema = z.object({
  feeItemId: z.string().min(1, "Select a payment item"),
});

export async function GET() {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const transactions = await prisma.paymentTransaction.findMany({
      where: { userId: student.id },
      include: {
        feeItem: true,
        user: {
          include: {
            faculty: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      student: createStudentProfilePayload(student),
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        receipt: transaction.receipt,
        reference: transaction.reference,
        type: transaction.feeItem?.name ?? transaction.type,
        amount: transaction.amount,
        date: formatPaymentDate(transaction.paidAt),
        dateTime: formatPaymentDateTime(transaction.paidAt),
        status: transaction.status,
        session: transaction.session,
        description: transaction.description ?? transaction.feeItem?.description ?? "",
        feeItemId: transaction.feeItemId,
      })),
    });
  } catch (error) {
    console.error("[students/payments:get]", error);
    return NextResponse.json(
      { error: "Unable to load payment records" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const result = initializeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid payment details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const feeItem = await prisma.feeItem.findUnique({
      where: { id: result.data.feeItemId },
    });

    if (!feeItem) {
      return NextResponse.json(
        { error: "Payment item not found" },
        { status: 404 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    const reference = `SCSPAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const amountInKobo = Math.round(feeItem.amount * 100);
    const session = getCurrentAcademicSession();
    const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const callbackUrl = `${origin}/payment-success?reference=${encodeURIComponent(reference)}`;

    await prisma.paymentTransaction.create({
      data: {
        receipt: reference,
        reference,
        userId: student.id,
        feeItemId: feeItem.id,
        type: feeItem.name,
        amount: feeItem.amount,
        status: "Pending",
        session,
        description: feeItem.description ?? feeItem.name,
        metadata: {
          studentId: student.id,
          studentName: student.fullName,
          matricNumber: student.matricNumber,
          faculty: student.faculty?.name ?? null,
          department: student.department?.name ?? null,
          feeItemId: feeItem.id,
          feeItemName: feeItem.name,
        },
      },
    });

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: student.email,
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          studentId: student.id,
          feeItemId: feeItem.id,
          payment_type: feeItem.name,
          selected_item: feeItem.name,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      await prisma.paymentTransaction.deleteMany({
        where: { reference },
      });
      return NextResponse.json(
        { error: err?.message ?? "Paystack initialization failed" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference,
      transaction: {
        receipt: reference,
        amount: feeItem.amount,
        type: feeItem.name,
      },
    });
  } catch (error) {
    console.error("[students/payments:post]", error);
    return NextResponse.json(
      { error: "Unable to initialize payment" },
      { status: 500 }
    );
  }
}
