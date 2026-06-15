import { type NextRequest, NextResponse } from "next/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

export async function GET() {
  try {
    const payments = await prisma.feeItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      payments: payments.map(mapPayment),
    });
  } catch (error) {
    console.error("[admin/payments:get]", error);
    return NextResponse.json(
      { error: "Unable to load payment configurations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const title = result.data.title.trim();
    const amount = Math.round(result.data.amount);
    const description = result.data.description?.trim() || null;
    const slug = makeSlug(title);

    const existingPayment = await prisma.feeItem.findFirst({
      where: {
        OR: [{ slug }, { name: title }],
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          payment: mapPayment(existingPayment),
          message: "Payment already exists",
        },
        { status: 200 }
      );
    }

    const payment = await prisma.feeItem.create({
      data: {
        name: title,
        slug,
        amount,
        description,
      },
    });

    return NextResponse.json(
      {
        payment: mapPayment(payment),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[admin/payments:post]", error);

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "A payment with this title already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create payment configuration" },
      { status: 500 }
    );
  }
}
