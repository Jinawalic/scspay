import { NextResponse } from "next/server";

import prisma from "@/src/lib/prisma";
import { formatPaymentDate, formatPaymentDateTime } from "@/src/lib/payment-flow";

export async function GET() {
  try {
    const transactions = await prisma.paymentTransaction.findMany({
      where: { status: "Successful" },
      include: {
        feeItem: true,
        user: {
          include: {
            faculty: true,
            department: true,
          },
        },
      },
      orderBy: { paidAt: "desc" },
    });

    return NextResponse.json({
      transactions: transactions.map((tx) => ({
        id: tx.receipt,
        receipt: tx.receipt,
        reference: tx.reference,
        student: tx.user.fullName,
        matricNumber: tx.user.matricNumber ?? "",
        faculty: tx.user.faculty?.name ?? "",
        department: tx.user.department?.name ?? "",
        date: formatPaymentDate(tx.paidAt),
        dateTime: formatPaymentDateTime(tx.paidAt),
        amount: tx.amount,
        amountLabel: `₦${tx.amount.toLocaleString("en-NG")}`,
        type: tx.feeItem?.name ?? tx.type,
        session: tx.session,
        status: tx.status,
      })),
    });
  } catch (error) {
    console.error("[admin/transactions:get]", error);
    return NextResponse.json(
      { error: "Unable to load transactions" },
      { status: 500 }
    );
  }
}
