"use client";

import Link from "next/link";
import { FileText, Home, LogOutIcon, Receipt, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/payment-history", label: "History", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed z-40 hidden w-64 h-full bg-slate-900 p-6 lg:block">
      {/* Logo/Brand */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">SCSPay</h1>
        <p className="mt-1 text-sm text-slate-400">Payment System</p>
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
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info at Bottom */}
      <div className="absolute bottom-18 left-6 right-6">
        <button className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white">
          <LogOutIcon className="h-5 w-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
