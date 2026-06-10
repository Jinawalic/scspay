"use client";

import Link from "next/link";
import { CreditCard, FileText, Home, Receipt, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

// ====================================
// Desktop Sidebar Component
// ====================================
// Professional left sidebar for desktop (>=1024px)
// Dark theme with rounded corners and hover animations
// Active route highlighted in blue
// Hidden on mobile and tablet

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/make-payment", label: "Pay", icon: CreditCard },
  { href: "/payment-history", label: "History", icon: FileText },
  { href: "/receipt/SCSPAY-2026-0045", label: "Receipt", icon: Receipt },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-4 top-4 bottom-4 z-40 hidden w-64 rounded-3xl bg-slate-900 p-6 shadow-2xl lg:block">
      {/* Logo/Brand */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">SCSPay</h1>
        <p className="mt-1 text-sm text-slate-400">Student Portal</p>
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
      <div className="absolute bottom-6 left-6 right-6">
        <div className="rounded-2xl bg-slate-800 p-4">
          <p className="text-sm font-medium text-white">Jinawatitus</p>
          <p className="mt-1 text-xs text-slate-400">FT2002019</p>
        </div>
      </div>
    </aside>
  );
}
