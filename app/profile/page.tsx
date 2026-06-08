"use client";

import { useForm } from "react-hook-form";
import { ProfileCard } from "@/components/profile/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { studentProfile } from "@/src/data/mock";

export default function ProfilePage() {
  const { register, handleSubmit } = useForm({ defaultValues: studentProfile });

  const onSubmit = () => {
    window.alert("Profile saved successfully.");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Your student profile</h1>
              <p className="mt-2 text-sm text-slate-500">Update your personal details and academic information.</p>
            </div>
            <Button variant="secondary">Change Password</Button>
          </div>
        </div>
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                  <Input {...register("fullName")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <Input type="email" {...register("email")} />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Matric Number</label>
                  <Input {...register("matricNumber")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
                  <Input {...register("phone")} />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Faculty</label>
                  <Input {...register("faculty")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                  <Input {...register("department")} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
          <ProfileCard profile={studentProfile} />
        </div>
      </div>
    </main>
  );
}
