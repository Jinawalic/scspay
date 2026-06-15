"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { PaymentSummary } from "@/components/payment/payment-summary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { toPaymentCategory } from "@/src/lib/payment-items";
import type { PaymentCategory } from "@/src/types";

type PaymentApiRecord = {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
};

const FALLBACK_PAYMENT: PaymentCategory = {
  id: "default-payment",
  name: "SCS Dues",
  description: "Configured by admin",
  amount: 3000,
  color: "from-emerald-600 to-green-400",
};

export default function ReviewPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
          <div className="pointer-events-none hidden md:block fixed inset-0 z-0 bg-slate-950/45 backdrop-blur-[2px]" />
          <Card className="relative z-10 w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] md:max-w-[660px] md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:rounded-[2.75rem] md:border md:border-slate-100/80 md:shadow-[0_40px_120px_rgba(15,23,42,0.22)] p-6 sm:p-10 flex flex-col justify-center items-center gap-3">
            <LoadingSkeleton className="h-4 w-40 rounded-full" />
            <p className="text-sm text-slate-500 font-semibold">Loading payment details...</p>
          </Card>
        </main>
      }
    >
      <ReviewPaymentContent />
    </Suspense>
  );
}

function ReviewPaymentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPayments = async () => {
      try {
        const res = await fetch("/api/admin/payments", {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to load payment details");
        }

        const categories = (data.payments ?? []).map((payment: PaymentApiRecord) =>
          toPaymentCategory({
            id: payment.id,
            name: payment.title,
            description: payment.description,
            amount: payment.amount,
          })
        );

        if (!isMounted) return;
        setPaymentCategories(categories);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load payment details");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  const paymentDetails = useMemo(() => {
    if (!paymentCategories.length) {
      return FALLBACK_PAYMENT;
    }

    return paymentCategories.find((category) => category.id === id) ?? paymentCategories[0];
  }, [id, paymentCategories]);

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/students/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeItemId: paymentDetails.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.authorizationUrl) {
        if (res.status === 401) {
          window.location.href = "/";
          return;
        }
        throw new Error(data.error ?? "Failed to initialize payment");
      }

      window.location.href = data.authorizationUrl;
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Something went wrong");
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
        <div className="pointer-events-none hidden md:block fixed inset-0 z-0 bg-slate-950/45 backdrop-blur-[2px]" />
        <Card className="relative z-10 w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] md:max-w-[660px] md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:rounded-[2.75rem] md:border md:border-slate-100/80 md:shadow-[0_40px_120px_rgba(15,23,42,0.22)] p-6 sm:p-10 flex flex-col justify-center items-center gap-3">
          <LoadingSkeleton className="h-4 w-40 rounded-full" />
          <p className="text-sm text-slate-500 font-semibold">Loading payment details...</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
      <div className="pointer-events-none hidden md:block fixed inset-0 z-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <Card className="relative z-10 w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] md:max-w-[660px] md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:rounded-[2.75rem] md:border md:border-slate-100/80 md:shadow-[0_40px_120px_rgba(15,23,42,0.22)] p-6 sm:p-10 flex flex-col justify-start">
        <div className="space-y-3">
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href={id ? `/make-payment?id=${id}` : "/make-payment"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-[#1E2E42] shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
            </Link>

            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#135A3D]" />
              <span className="h-2 w-7 rounded-full bg-[#135A3D]" />
              <span className="h-2 w-2 rounded-full border border-slate-300 bg-white" />
            </div>

            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-[#1E2E42] shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>

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

          {loadError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 text-center">
              {loadError}
            </p>
          )}

          <PaymentSummary
            title={paymentDetails.name}
            selectedItem={paymentDetails.name}
            total={paymentDetails.amount}
            method="Paystack"
          />

          <div className="flex items-center justify-between rounded-2xl border border-slate-100/80 bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.01)] text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                Payment Method
              </p>
              <p className="text-sm font-bold text-[#1E2E42] mt-1">
                Paystack
              </p>
            </div>
            <Badge className="rounded-full bg-[#EAF2EE] px-3 py-1.5 text-[10px] font-bold text-[#135A3D]">
              Secure
            </Badge>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full bg-[#135A3D] py-4 text-center text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0E4E35] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isProcessing && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {isProcessing ? "Redirecting to Paystack..." : "Pay Now"}
          </Button>
        </div>
      </Card>
    </main>
  );
}
