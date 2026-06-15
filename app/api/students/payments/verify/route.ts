import { type NextRequest, NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";
import { createStudentProfilePayload, getCurrentStudent } from "@/src/lib/student-auth";
import { formatPaymentDate, formatPaymentDateTime } from "@/src/lib/payment-flow";

export async function GET(request: NextRequest) {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const reference = request.nextUrl.searchParams.get("reference");
    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    const payment = await prisma.paymentTransaction.findFirst({
      where: {
        userId: student.id,
        OR: [{ reference }, { receipt: reference }],
      },
      include: {
        feeItem: true,
        user: {
          include: {
            faculty: true,
            department: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment transaction not found" },
        { status: 404 }
      );
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.message ?? "Unable to verify payment" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const verified = data?.data;

    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: verified?.status === "success" ? "Successful" : payment.status,
        paidAt: verified?.paid_at ? new Date(verified.paid_at) : payment.paidAt,
        metadata: {
          ...(payment.metadata as Record<string, unknown> | null),
          paystack: verified ?? null,
        },
      },
      include: {
        feeItem: true,
        user: {
          include: {
            faculty: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      student: createStudentProfilePayload(updatedTransaction.user),
      transaction: {
        id: updatedTransaction.id,
        receipt: updatedTransaction.receipt,
        reference: updatedTransaction.reference,
        type: updatedTransaction.feeItem?.name ?? updatedTransaction.type,
        amount: updatedTransaction.amount,
        date: formatPaymentDate(updatedTransaction.paidAt),
        dateTime: formatPaymentDateTime(updatedTransaction.paidAt),
        status: updatedTransaction.status,
        session: updatedTransaction.session,
        description: updatedTransaction.description ?? updatedTransaction.feeItem?.description ?? "",
        feeItem: updatedTransaction.feeItem
          ? {
              id: updatedTransaction.feeItem.id,
              name: updatedTransaction.feeItem.name,
              amount: updatedTransaction.feeItem.amount,
              description: updatedTransaction.feeItem.description,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[students/payments:verify]", error);
    return NextResponse.json(
      { error: "Unable to verify payment" },
      { status: 500 }
    );
  }
}
