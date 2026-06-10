"use client";

import Link from "next/link";
import { FileText, Home, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/payment-history", label: "History", icon: FileText },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg lg:hidden">
      <div className="flex items-center justify-around gap-2 rounded-full bg-white/95 px-6 py-4 shadow-2xl backdrop-blur-sm border border-slate-200/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 transition-all ${isActive
                ? "text-blue-600 scale-110"
                : "text-slate-400 hover:text-slate-600"
                }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
