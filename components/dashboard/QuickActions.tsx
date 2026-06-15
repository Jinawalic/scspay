"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Shirt, History, AlertCircle } from "lucide-react";
import { RegistrationModal } from "./RegistrationModal";

export function QuickActions() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadStudentStatus = async () => {
      try {
        const response = await fetch("/api/students/me", {
          cache: "no-store",
        });

        if (response.status === 401) {
          if (isMounted) {
            setIsProfileComplete(false);
          }
          return;
        }

        const payload = await response.json().catch(() => ({}));

        if (isMounted && response.ok) {
          setIsProfileComplete(Boolean(payload?.student?.completed));
        }
      } catch {
        if (isMounted) {
          setIsProfileComplete(false);
        }
      }
    };

    void loadStudentStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRegistrationComplete = () => {
    setIsProfileComplete(true);
    router.push("/make-payment");
  };

  const handleMakePaymentClick = async () => {
    if (isProfileComplete === true) {
      router.push("/make-payment");
      return;
    }

    if (isProfileComplete === false) {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch("/api/students/me", {
        cache: "no-store",
      });

      if (response.status === 401) {
        router.push("/");
        return;
      }

      const payload = await response.json().catch(() => ({}));
      const completed = Boolean(payload?.student?.completed);

      setIsProfileComplete(completed);

      if (completed) {
        router.push("/make-payment");
      } else {
        setIsModalOpen(true);
      }
    } catch {
      setIsModalOpen(true);
    }
  };

  const actions = [
    {
      label: "Make Payment",
      icon: ShieldCheck,
      href: "/make-payment",
      bgClass: "bg-[#EAF5F0]",
      iconClass: "text-[#135A3D]",
      isModal: true,
    },
    {
      label: "Support",
      icon: AlertCircle,
      href: "mailto:support@scspay.edu",
      bgClass: "bg-[#EFF7F5]",
      iconClass: "text-[#0F5A47]",
      isModal: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#1E2E42] md:text-xl">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          if (action.isModal) {
            return (
              <button
                key={index}
                onClick={handleMakePaymentClick}
                className="group flex flex-col items-center justify-center rounded-xl border border-slate-100/80 bg-white p-6 border-slate-200 transition-all duration-200 hover:scale-[1.02] hover:hover:bg-white active:scale-[0.98]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${action.bgClass}`}
                >
                  <Icon className={`h-7 w-7 ${action.iconClass}`} />
                </div>
                <span className="text-center text-sm font-semibold text-[#1E2E42] transition-colors group-hover:text-slate-900 md:text-base">
                  {action.label}
                </span>
              </button>
            );
          }
          return (
            <Link
              key={index}
              href={action.href}
              className="group flex flex-col items-center justify-center rounded-xl border border-slate-100/80 bg-white p-6 border-slate-200 transition-all duration-200 hover:scale-[1.02] hover:hover:bg-white active:scale-[0.98]"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${action.bgClass}`}
              >
                <Icon className={`h-7 w-7 ${action.iconClass}`} />
              </div>
              <span className="text-center text-sm font-semibold text-[#1E2E42] transition-colors group-hover:text-slate-900 md:text-base">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleRegistrationComplete}
      />
    </div>
  );
}
