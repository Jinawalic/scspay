"use client";

import { SuccessAnimation } from "@/components/payment/success-animation";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-8 rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-[0_35px_120px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col items-center gap-6 text-center">
            <SuccessAnimation />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Payment Success</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Payment completed successfully</h1>
              <p className="mt-3 text-sm leading-7 text-slate-500">Your transaction has been processed and your receipt is ready for download.</p>
            </div>
          </div>
          <div className="rounded-[2rem] bg-slate-50 p-8 text-slate-700">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Amount Paid</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">₦221,200</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Transaction Reference</p>
                <p className="mt-2 text-base font-medium text-slate-900">TRX-2026-8110</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Receipt Number</p>
                <p className="mt-2 text-base font-medium text-slate-900">SCSPAY-2026-0045</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Status</p>
                <p className="mt-2 text-base font-medium text-emerald-700">Successful</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Button className="w-full">Download Receipt</Button>
            <Button variant="secondary" className="w-full">Print Receipt</Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard"}>Return to Dashboard</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
