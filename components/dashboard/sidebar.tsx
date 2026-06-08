import { CreditCard, FileText, LayoutDashboard, LogOut, Receipt, ShieldCheck } from "lucide-react";
import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Make Payment", href: "/make-payment", icon: CreditCard },
  { label: "Payment History", href: "/payment-history", icon: FileText },
  { label: "Receipts", href: "/receipt/SCSPAY-2026-0045", icon: Receipt },
  { label: "Profile", href: "/profile", icon: ShieldCheck },
];

export function Sidebar() {
  return (
    <nav className="hidden h-full w-72 flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm xl:flex">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Navigation</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto rounded-3xl bg-slate-50 p-4 text-sm text-slate-500">
        <p className="font-semibold text-slate-900">SCSPAY Secure</p>
        <p className="mt-2">Modern student payments in one portal.</p>
      </div>
      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </nav>
  );
}
