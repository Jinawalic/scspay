"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PaymentCard } from "@/components/payment/payment-card";
import { PaymentSummary } from "@/components/payment/payment-summary";
import { paymentCategories } from "@/src/data/mock";

export default function MakePaymentPage() {
  const [selectedId, setSelectedId] = useState(paymentCategories[0].id);
  const { register, handleSubmit } = useForm({ defaultValues: { session: "2025/2026", semester: "First", category: paymentCategories[0].name, amount: paymentCategories[0].amount } });

  const selectedCategory = useMemo(() => paymentCategories.find((item) => item.id === selectedId) ?? paymentCategories[0], [selectedId]);
  const total = selectedCategory.amount + 1200;

  const onSubmit = () => {
    window.location.href = "/payment-success";
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Make Payment</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Select a fee category</h1>
              <p className="mt-2 text-sm text-slate-500">Choose the charge that matches your current payment.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Fast, secure checkout</div>
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentCategories.map((category) => (
                <PaymentCard
                  key={category.id}
                  category={category}
                  selected={category.id === selectedId}
                  onSelect={() => setSelectedId(category.id)}
                />
              ))}
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Academic Session</label>
                  <Select {...register("session")}> 
                    <option>2025/2026</option>
                    <option>2024/2025</option>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Semester</label>
                  <Select {...register("semester")}>
                    <option>First</option>
                    <option>Second</option>
                  </Select>
                </div>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Payment Category</label>
                  <Input value={selectedCategory.name} readOnly />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Amount</label>
                  <Input value={`₦${selectedCategory.amount.toLocaleString()}`} readOnly />
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" onClick={() => window.location.href = "/complete-profile"}>Cancel</Button>
                <Button type="button" onClick={() => window.location.href = "/payment-success"}>Proceed to Payment</Button>
              </div>
            </div>
          </div>
          <PaymentSummary feeType={selectedCategory.name} amount={selectedCategory.amount} serviceCharge={1200} total={total} />
        </div>
      </div>
    </main>
  );
}
