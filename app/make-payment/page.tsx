"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toPaymentCategory } from "@/src/lib/payment-items";
import type { PaymentCategory } from "@/src/types";

type PaymentApiRecord = {
  id: string;
  title: string;
  description?: string | null;
  amount: number;
};

export default function MakePaymentPage() {
  const [paymentCategories, setPaymentCategories] = useState<PaymentCategory[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPayments = async () => {
      try {
        const res = await fetch("/api/admin/payments", {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to load payment options");
        }

        const options = (data.payments ?? []).map((payment: PaymentApiRecord) =>
          toPaymentCategory({
            id: payment.id,
            name: payment.title,
            description: payment.description,
            amount: payment.amount,
          })
        );

        if (!isMounted) return;

        setPaymentCategories(options);
        setSelectedId((current) => current || options[0]?.id || "");
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unable to load payment options");
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

  // Map each category to its specific visual badge label
  const getBadgeDetails = (name: string) => {
    const normalized = name.toLowerCase();

    if (normalized.includes("school")) {
      return { label: "School Fees", bgClass: "bg-[#E2EFEB] text-[#135A3D]" };
    }
    if (normalized.includes("acceptance")) {
      return { label: "Acceptance", bgClass: "bg-[#EFF4FC] text-[#2E4E77]" };
    }
    if (normalized.includes("hostel")) {
      return { label: "Hostel Dues", bgClass: "bg-[#EDF5F3] text-[#0F5A47]" };
    }
    if (normalized.includes("ict")) {
      return { label: "ICT Fees", bgClass: "bg-[#EFF4FC] text-[#2E4E77]" };
    }
    if (normalized.includes("department")) {
      return { label: "Departmental", bgClass: "bg-[#EAF5F0] text-[#135A3D]" };
    }

    return { label: "Required", bgClass: "bg-slate-100 text-slate-600" };
  };

  const handleProceed = () => {
    if (!selectedId) return;
    window.location.href = `/review-payment?id=${selectedId}`;
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
      <div className="pointer-events-none hidden md:block fixed inset-0 z-0 bg-slate-950/45 backdrop-blur-[2px]" />
      {/* Centered Mobile-Style Payment Card on Desktop, full screen on Mobile */}
      <Card className="relative z-10 w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] md:max-w-[660px] md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:rounded-[2.75rem] md:border md:border-slate-100/80 md:shadow-[0_40px_120px_rgba(15,23,42,0.22)] p-6 sm:p-10 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Header Navigation */}
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              <span className="h-2 w-7 rounded-full bg-[#135A3D]" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
              <span className="h-2 w-2 rounded-full bg-slate-200" />
            </div>

            {/* Close Button */}
            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <X className="h-5 w-5" />
            </Link>
          </div>

          {/* Title and Descriptions */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#135A3D]">
              Step 1 of 3
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[#1E2E42] sm:text-3xl">
              Select items to pay
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 sm:text-base leading-relaxed">
              Choose the Dues and Merchandise you want to pay for.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 text-center">
              {error}
            </p>
          )}

          {/* Payment Items List */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm font-medium text-slate-400">
                Loading payment items...
              </div>
            ) : paymentCategories.length > 0 ? (
              paymentCategories.map((category) => {
                const isSelected = category.id === selectedId;
                const badge = getBadgeDetails(category.name);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedId(category.id)}
                    className={`group w-full rounded-2xl border text-left p-5 transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer hover:shadow-sm ${
                      isSelected
                        ? "border-[#135A3D] bg-[#F4FAF8] shadow-[0_4px_18px_rgba(19,90,61,0.04)]"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <p className="text-base font-bold text-[#1E2E42] sm:text-lg tracking-tight transition-colors">
                        {category.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-500">
                          ₦{category.amount.toLocaleString()}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                            isSelected ? "bg-[#E2EFEB] text-[#135A3D]" : badge.bgClass
                          }`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Checked Checkbox Circle */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#135A3D] text-white shadow-sm scale-100 transition-transform duration-200">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-7 w-7 rounded-full border-2 border-slate-200 bg-white transition-all duration-200 group-hover:border-slate-300" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm font-medium text-slate-500">
                No payment items have been configured yet.
              </div>
            )}
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-8 pt-4">
          <Button
            type="button"
            onClick={handleProceed}
            disabled={!selectedId || isLoading || paymentCategories.length === 0}
            className="w-full rounded-full bg-[#135A3D] py-4 text-center text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0E5C46] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Proceed to Review
          </Button>
        </div>
      </Card>
    </main>
  );
}
