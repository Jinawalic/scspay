"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  UserCircle,
  Hash,
  BookOpen,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";
import { studentProfile } from "@/src/data/mock";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any session/auth tokens here in production
    router.push("/");
  };

  const profileFields = [
    {
      label: "MATRICULATION NUMBER",
      value: studentProfile.matricNumber,
      icon: Hash,
    },
    {
      label: "DEPARTMENT",
      value: studentProfile.department,
      icon: BookOpen,
    },
    {
      label: "PHONE",
      value: `+234 ${studentProfile.phone}`,
      icon: Phone,
    },
    {
      label: "EMAIL",
      value: studentProfile.email,
      icon: Mail,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F6F8]">
      <DesktopSidebar />

      <div className="lg:ml-72">
        <div className="px-0 sm:px-6 lg:px-10 py-0 sm:py-8 flex justify-center">
          {/* Card container */}
          <div className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] p-6 sm:p-10 pb-28 lg:pb-8 flex flex-col justify-start">

            {/* Header: Title + Back Arrow */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-xl font-bold text-[#1E2E42] tracking-tight">
                  My Profile
                </h1>
                <p className="mt-1.5 text-xs font-semibold text-slate-400 leading-relaxed max-w-[240px]">
                  Manage your student profile, wallet access, and preferences.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white text-[#1E2E42] shadow-sm transition hover:bg-slate-50 active:scale-95 shrink-0 mt-0.5"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </Link>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] mb-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF5F0] shrink-0">
                <UserCircle className="h-9 w-9 text-[#135A3D]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1E2E42]">
                  {studentProfile.fullName}
                </h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  NACOS Member since 2026
                </p>
              </div>
            </div>

            {/* Detail Fields */}
            <div className="flex flex-col gap-1">
              {profileFields.map((field) => {
                const IconComponent = field.icon;
                return (
                  <div
                    key={field.label}
                    className="flex items-center gap-4 rounded-2xl px-4 py-4 hover:bg-slate-50/60 transition"
                  >
                    {/* Icon */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F0] shrink-0">
                      <IconComponent className="h-5 w-5 text-[#135A3D]" />
                    </div>

                    {/* Label & Value */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] font-bold text-[#135A3D] uppercase tracking-widest">
                        {field.label}
                      </p>
                      <p className="text-sm font-bold text-[#1E2E42] mt-0.5 truncate">
                        {field.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-red-100 bg-red-50/60 py-4 text-sm font-bold text-red-600 transition hover:bg-red-100/80 active:scale-[0.99] cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
