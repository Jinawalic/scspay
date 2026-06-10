"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { paymentCategories } from "@/src/data/mock";
import { PaymentSummary } from "@/components/payment/payment-summary";

export default function ReviewPaymentPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
        <div className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] p-6 sm:p-10 flex flex-col justify-center items-center">
          <p className="text-sm text-slate-500 font-semibold">Loading payment details...</p>
        </div>
      </main>
    }>
      <ReviewPaymentContent />
    </Suspense>
  );
}

function ReviewPaymentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isProcessing, setIsProcessing] = useState(false);

  // Find the selected category from the mock data, or default to NACOS Dues to match the design mockup exactly
  const category = paymentCategories.find((c) => c.id === id);

  const paymentDetails = category
    ? {
      title: category.name,
      selectedItem: `${category.name} - 100L`,
      amount: category.amount,
    }
    : {
      title: "NACOS Dues",
      selectedItem: "NACOS Dues - 100L",
      amount: 1500,
    };

  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Use a real student email in production; this uses the mock profile email
          email: "student@scspay.ng",
          amount: paymentDetails.amount,
          metadata: {
            payment_type: paymentDetails.title,
            selected_item: paymentDetails.selectedItem,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authorizationUrl) {
        throw new Error(data.error ?? "Failed to initialize payment");
      }

      // Redirect browser to Paystack hosted checkout
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
      <div className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] p-6 sm:p-10 flex flex-col justify-between">

        <div className="space-y-3">
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link
              href={id ? `/make-payment?id=${id}` : "/make-payment"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-[#1E2E42] shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            </Link>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#135A3D]" />
              <span className="h-2 w-7 rounded-full bg-[#135A3D]" />
              <span className="h-2 w-2 rounded-full border border-slate-300 bg-white" />
            </div>

            {/* Close Button */}
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-[#1E2E42] shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Title & Description */}
          <div className="text-left mt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#135A3D]">
              Step 2 of 3
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#1E2E42] tracking-tight">
              Confirm and pay
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
              Check the summary, then pay securely to download your receipt.
            </p>
          </div>

          {/* Payment Summary Component */}
          <PaymentSummary
            title={paymentDetails.title}
            selectedItem={paymentDetails.selectedItem}
            total={paymentDetails.amount}
            method="Paystack"
          />

          {/* Payment Method Card */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-100/80 bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Payment Method
              </p>
              <p className="text-sm font-bold text-[#1E2E42] mt-1">
                Paystack
              </p>
            </div>
            <span className="rounded-full bg-[#EAF2EE] px-3 py-1.5 text-[10px] font-bold text-[#135A3D]">
              Secure
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 text-center">
            {error}
          </p>
        )}

        {/* Pay Now Button */}
        <div className="mt-2 pt-3">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full rounded-2xl bg-[#135A3D] py-4 text-center text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0E4E35] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isProcessing && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {isProcessing ? "Redirecting to Paystack..." : "Pay Now"}
          </button>
        </div>

      </div>
    </main>
  );
}
