import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import prisma from "@/src/lib/prisma";
import { makeSlug } from "@/src/lib/academic";
import { formatNaira } from "@/src/lib/payment-items";

const paymentSchema = z.object({
  title: z.string().min(2, "Payment title is required"),
  amount: z.coerce.number().positive("Payment amount is required"),
  description: z.string().trim().optional().or(z.literal("")),
});

function mapPayment(item: {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  slug: string;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    id: item.id,
    title: item.name,
    description: item.description ?? "",
    amount: item.amount,
    amountLabel: formatNaira(item.amount),
    slug: item.slug,
    isActive: item.isActive,
    createdAt: item.createdAt,
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params;
    const body = await request.json();
    const result = paymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid payment details",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const currentPayment = await prisma.feeItem.findUnique({
      where: { id: paymentId },
    });

    if (!currentPayment) {
      return NextResponse.json(
        { error: "Payment configuration not found" },
        { status: 404 }
      );
    }

    const title = result.data.title.trim();
    const amount = Math.round(result.data.amount);
    const description = result.data.description?.trim() || null;
    const slug = makeSlug(title);

    const conflictingPayment = await prisma.feeItem.findFirst({
      where: {
        OR: [{ slug }, { name: title }],
        NOT: { id: paymentId },
      },
    });

    if (conflictingPayment) {
      return NextResponse.json(
        { error: "A different payment with this title already exists" },
        { status: 409 }
      );
    }

    const payment = await prisma.feeItem.update({
      where: { id: paymentId },
      data: {
        name: title,
        slug,
        amount,
        description,
      },
    });

    return NextResponse.json({
      payment: mapPayment(payment),
    });
  } catch (error) {
    console.error("[admin/payments:patch]", error);
    return NextResponse.json(
      { error: "Unable to update payment configuration" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payment = await prisma.feeItem.findUnique({
      where: { id },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment configuration not found" },
        { status: 404 }
      );
    }

    await prisma.feeItem.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Payment configuration deleted",
    });
  } catch (error) {
    console.error("[admin/payments:delete]", error);
    return NextResponse.json(
      { error: "Unable to delete payment configuration" },
      { status: 500 }
    );
  }
}
