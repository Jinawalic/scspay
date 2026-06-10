import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, amount, metadata } = await request.json();

    if (!email || !amount) {
      return Response.json(
        { error: "email and amount are required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return Response.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    // Amount must be in kobo (multiply by 100)
    const amountInKobo = Math.round(amount * 100);

    const callbackUrl = `${
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"
    }/payment-success`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        callback_url: callbackUrl,
        metadata: metadata ?? {},
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json(
        { error: err?.message ?? "Paystack initialization failed" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // data.data.authorization_url is the Paystack checkout URL
    return Response.json({ authorizationUrl: data.data.authorization_url });
  } catch (err) {
    console.error("[paystack/initialize]", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
