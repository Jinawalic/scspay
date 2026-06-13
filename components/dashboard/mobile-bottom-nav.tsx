"use client";

import { useEffect, useState } from "react";
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
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    const checkModal = () => {
      const modalOpen = document.body.classList.contains("registration-modal-open");
      setShouldHide(modalOpen);
    };

    // Initial check
    checkModal();

    // Observe body class changes
    const observer = new MutationObserver(checkModal);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  if (shouldHide) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg lg:hidden">
      <div className="flex items-center justify-around gap-2 rounded-full bg-white/95 px-4 py-3 backdrop-blur-sm border border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-all ${
                isActive
                  ? "bg-[#135A3D] text-white scale-105"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
