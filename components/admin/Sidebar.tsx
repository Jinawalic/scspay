"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  PlusCircle, 
  Settings, 
  HelpCircle,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeSegment?: string;
}

export function Sidebar({ activeSegment }: SidebarProps) {
  const pathname = usePathname();

  const mainNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "User Management", icon: Users, path: "/admin/users" },
    { name: "View Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Configure Payment", icon: PlusCircle, path: "/admin/payments/create" },
  ];

  const utilityNav = [
    { name: "Settings", icon: Settings, path: "/admin/settings" },
    { name: "Help & Support", icon: HelpCircle, path: "/admin/support" },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#F8FAFC] flex flex-col justify-between p-6 select-none z-30 border-r border-slate-200/50">
      {/* Top Section: Brand Identity & Menu Links */}
      <div className="space-y-6">
        {/* Brand Logo Wrapper */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="flex flex-col gap-0.5 justify-center">
            <div className="flex items-center gap-1">
              <img src="/images/logo.png" alt="MyPay Logo" className="h-12 w-12 rounded-full object-contain" />
              <span className="text-[18px] font-bold text-emerald-800 tracking-tight font-sans pl-1">
                MyPay
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Routing Stack */}
        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            
            // Fallback strategy: Matches explicitly passed activeSegment prop OR checks if current URL path matches
            const isActive = activeSegment 
              ? item.name.toLowerCase() === activeSegment.toLowerCase() || (item.name === "Configure Payment" && activeSegment.toLowerCase() === "create payment")
              : pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-bold tracking-wide transition-all duration-200 group relative ${
                  isActive
                    ? "bg-emerald-800 text-white border border-emerald-900 shadow-md shadow-emerald-800/10"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon 
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive 
                        ? "text-white stroke-[2.5]" 
                        : "text-slate-400 group-hover:text-slate-600 stroke-[2]"
                    }`} 
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-emerald-200/90 stroke-[2.5]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Support & Utility Links */}
      <div className="space-y-1.5 pt-4 border-t border-slate-200/60">
        {utilityNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition duration-150 group border border-transparent ${
                isActive 
                  ? "bg-slate-100 text-slate-900" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 transition-colors stroke-[2] ${isActive ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}