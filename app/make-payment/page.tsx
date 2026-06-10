"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, X, Check } from "lucide-react";
import { paymentCategories } from "@/src/data/mock";
export default function MakePaymentPage() {
  const [selectedId, setSelectedId] = useState(paymentCategories[0].id);

  // Map each category to its specific visual badge label
  const getBadgeDetails = (id: string) => {
    switch (id) {
      case "school-fees":
        return { label: "School Fees", bgClass: "bg-[#E2EFEB] text-[#135A3D]" };
      case "acceptance-fees":
        return { label: "Acceptance", bgClass: "bg-[#EFF4FC] text-[#2E4E77]" };
      case "hostel-fees":
        return { label: "Hostel Dues", bgClass: "bg-[#EDF5F3] text-[#0F5A47]" };
      case "ict-fees":
        return { label: "ICT Fees", bgClass: "bg-[#EFF4FC] text-[#2E4E77]" };
      case "departmental-fees":
        return { label: "Departmental", bgClass: "bg-[#EAF5F0] text-[#135A3D]" };
      default:
        return { label: "Required", bgClass: "bg-slate-100 text-slate-600" };
    }
  };

  const handleProceed = () => {
    window.location.href = `/review-payment?id=${selectedId}`;
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
      {/* Centered Mobile-Style Payment Card on Desktop, full screen on Mobile */}
      <div className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] p-6 sm:p-10 flex flex-col justify-between">

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

          {/* Payment Items List */}
          <div className="flex flex-col gap-4">
            {paymentCategories.map((category) => {
              const isSelected = category.id === selectedId;
              const badge = getBadgeDetails(category.id);

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedId(category.id)}
                  className={`group w-full rounded-2xl border text-left p-5 transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer hover:shadow-sm ${isSelected
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
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${isSelected ? "bg-[#E2EFEB] text-[#135A3D]" : badge.bgClass
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
            })}
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-8 pt-4">
          <button
            type="button"
            onClick={handleProceed}
            className="w-full rounded-full bg-[#135A3D] py-4 text-center text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0E5C46] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            Proceed to Review
          </button>
        </div>

      </div>
    </main>
  );
}
