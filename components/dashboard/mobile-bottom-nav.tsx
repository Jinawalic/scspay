import Link from "next/link";
import { CreditCard, FileText, Home, Receipt, UserCircle } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/make-payment", label: "Pay", icon: CreditCard },
  { href: "/payment-history", label: "History", icon: FileText },
  { href: "/receipt/SCSPAY-2026-0045", label: "Receipt", icon: Receipt },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileBottomNav() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-1 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-12px_40px_-22px_rgba(15,23,42,0.15)] sm:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 text-[10px] text-slate-600 hover:text-emerald-700">
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
