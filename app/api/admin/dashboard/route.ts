import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import { formatPaymentDate } from "@/src/lib/payment-flow";

export async function GET() {
  try {
    // 1. Count all students
    const studentsCount = await prisma.user.count({
      where: { kind: "STUDENT" },
    });

    // 2. Count all successful transactions
    const paymentsCount = await prisma.paymentTransaction.count({
      where: { status: "Successful" },
    });

    // 3. Get the 10 most recent transactions
    const recentTx = await prisma.paymentTransaction.findMany({
      include: {
        feeItem: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const recentTransactions = recentTx.map((tx) => ({
      id: tx.receipt,
      customer: tx.user.fullName,
      date: formatPaymentDate(tx.paidAt || tx.createdAt),
      product: tx.feeItem?.name ?? tx.type,
      amount: `₦${tx.amount.toLocaleString("en-NG")}`,
      status: tx.status === "Successful" ? "Completed" : "Pending",
    }));

    return NextResponse.json({
      studentsCount,
      paymentsCount,
      recentTransactions,
    });
  } catch (error) {
    console.error("[admin/dashboard:get]", error);
    return NextResponse.json(
      { error: "Unable to load dashboard metrics" },
      { status: 500 }
    );
  }
}
