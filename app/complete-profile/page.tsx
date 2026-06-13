"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { studentProfile } from "@/src/data/mock";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm({ defaultValues: studentProfile });

  const onSubmit = () => {
    router.push("/make-payment");
  };

  return (
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
        <Card className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.25)] sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Complete Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Complete your academic profile</h1>
              <p className="mt-2 text-sm text-slate-500">Finish the remaining student details to unlock payments and receipts.</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
              80% Complete
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Faculty</label>
                <Select {...register("faculty")}>
                  <option>Science and Technology</option>
                  <option>Business</option>
                  <option>Arts</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <Select {...register("department")}>
                  <option>Computer Science</option>
                  <option>Accounting</option>
                  <option>Mass Communication</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Level</label>
                <Select {...register("level")}>
                  <option>100</option>
                  <option>200</option>
                  <option>300</option>
                  <option>400</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                <Input placeholder="+234 803 123 4567" {...register("phone")} />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="w-full">Save and Continue</Button>
              <Button type="button" variant="secondary" className="w-full" onClick={() => router.push("/dashboard")}>Later</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
