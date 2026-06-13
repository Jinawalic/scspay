"use client";

import Link from "next/link";
import { FileText, Home, LogOutIcon, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/payment-history", label: "History", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed z-40 hidden w-64 h-full bg-white p-6 lg:block border-r border-slate-200">
      {/* Brand Logo Wrapper */}
      <div className="flex items-center gap-2.5 px-2 py-1 mb-6">
        <div className="flex flex-col gap-0.5 justify-center">
          <div className="flex items-center gap-1">
            <img src="/images/logo.png" alt="MyPay Logo" className="h-12 w-12 rounded-full object-contain" />
            <span className="text-[18px] font-bold text-emerald-800 tracking-tight font-sans pl-1">
              MyPay
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-emerald-800 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info / Actions at Bottom */}
      <div className="absolute bottom-8 left-6 right-6">
        <button 
          type="button"
          onClick={() => router.push("/")}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
        >
          <LogOutIcon className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}