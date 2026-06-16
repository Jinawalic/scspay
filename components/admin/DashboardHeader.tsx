"use client";

import React, { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
}

interface AdminData {
  fullName: string;
  email: string;
  role: string;
}

export function DashboardHeader({
  title = "Admin Dashboard"
}: DashboardHeaderProps) {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAdmin = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load admin data");
        if (isMounted) setAdminData(data.admin ?? null);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadAdmin();
    return () => { isMounted = false; };
  }, []);

  const initials = adminData?.fullName
    ? adminData.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="mb-3 w-full bg-white rounded-sm p-2 flex items-center justify-between select-none bg-transparent">
      {/* Left Section: Clean Minimalist Breadcrumb / Context Identifier */}
      <div className="flex items-center gap-2.5">
        <LayoutGrid className="h-4.5 w-4.5 text-slate-700 stroke-[2]" />
        <h1 className="text-[15px] font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Section: Refined Profile Account Management Anchor Pill */}
      <div className="flex items-center gap-2">
        {/* Profile User Avatar Card Ring Wrapper */}
        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-100 shadow-sm">
          <div className="h-full w-full bg-slate-400 flex items-center justify-center text-xs text-white font-bold tracking-tighter">
            {initials}
          </div>
        </div>

        {/* Profile Metadata Text Strings Stack */}
        <div className="flex flex-col text-left leading-tight mr-5">
          <span className="text-[15px] font-bold text-slate-800 tracking-tight">
            {isLoading ? "Loading..." : adminData?.fullName || "Admin"}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wide">
            {isLoading ? "" : adminData?.role || "Administrator"}
          </span>
        </div>
      </div>
    </header>
  );
}