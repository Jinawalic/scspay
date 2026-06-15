"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { StudentSessionProfile } from "@/src/types";

type ProfileFormValues = {
  faculty: string;
  department: string;
  level: string;
  phone: string;
};

const defaultValues: ProfileFormValues = {
  faculty: "",
  department: "",
  level: "",
  phone: "",
};

export default function CompleteProfilePage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues,
  });

  useEffect(() => {
    let isMounted = true;

    const loadStudent = async () => {
      try {
        const response = await fetch("/api/students/me");

        if (response.status === 401) {
          router.replace("/");
          return;
        }

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load your profile");
        }

        const student = payload.student as StudentSessionProfile | undefined;

        if (isMounted && student) {
          reset({
            faculty: student.faculty ?? "",
            department: student.department ?? "",
            level: student.level ?? "",
            phone: student.phone ?? "",
          });
        }
      } catch {
        if (isMounted) {
          setSubmitError("Unable to load your profile right now");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadStudent();

    return () => {
      isMounted = false;
    };
  }, [reset, router]);

  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitError("");

    try {
      const response = await fetch("/api/students/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save your profile right now");
      }

      router.replace("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save your profile right now";
      setSubmitError(message);
    }
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
              {isLoadingProfile ? "Loading..." : "80% Complete"}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Faculty</label>
                <Select {...register("faculty")} disabled={isLoadingProfile}>
                  <option value="">Select faculty</option>
                  <option>Natural And Applied Sciences</option>
                  <option>Social And Management Sciences</option>
                  <option>Engineering</option>
                  <option>Environmental Sciences</option>
                  <option>Law</option>
                  <option>Arts</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <Select {...register("department")} disabled={isLoadingProfile}>
                  <option value="">Select department</option>
                  <option>Computer Science</option>
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>Microbiology</option>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Level</label>
                <Select {...register("level")} disabled={isLoadingProfile}>
                  <option value="">Select level</option>
                  <option>100</option>
                  <option>200</option>
                  <option>300</option>
                  <option>400</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                <Input placeholder="+234 803 123 4567" {...register("phone")} disabled={isLoadingProfile} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="w-full" disabled={isLoadingProfile}>
                Save and Continue
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={() => router.push("/dashboard")}>
                Later
              </Button>
            </div>

            {submitError && <p className="text-sm font-semibold text-rose-600">{submitError}</p>}
          </form>
        </Card>
      </div>
    </main>
  );
}
