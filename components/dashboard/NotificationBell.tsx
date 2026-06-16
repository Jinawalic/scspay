"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, BellRing, Check, Info, Receipt, X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: "welcome" | "payment";
}

interface NotificationBellProps {
  studentId: string;
  createdAt: string;
  successfulPayments: {
    id: string;
    amount: number;
    feeName: string;
    date: string;
    receipt: string;
  }[];
}

export function NotificationBell({
  studentId,
  createdAt,
  successfulPayments,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pre-compile notifications
  const notifications: NotificationItem[] = [];

  // Account creation notification
  if (createdAt) {
    notifications.push({
      id: `welcome-${studentId}`,
      title: "Welcome to SCS Pay",
      message: "Your account has been successfully created. You can now make all your school payments easily.",
      date: new Date(createdAt),
      type: "welcome",
    });
  }

  // Payment notifications
  successfulPayments.forEach((payment) => {
    notifications.push({
      id: `payment-${payment.id}`,
      title: "Payment Successful",
      message: `Payment of ₦${payment.amount.toLocaleString()} for ${payment.feeName} was successful. (Receipt: ${payment.receipt})`,
      date: new Date(payment.date),
      type: "payment",
    });
  });

  // Sort newest first
  notifications.sort((a, b) => b.date.getTime() - a.date.getTime());

  const localStorageKey = `scspay_read_notifications_${studentId}`;

  // Hydrate read IDs on mount
  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(localStorageKey);
    if (stored) {
      try {
        setReadIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse read notification IDs", e);
      }
    }
  }, [localStorageKey]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute unread count
  const unreadNotifications = notifications.filter(
    (n) => !readIds.includes(n.id)
  );
  const unreadCount = unreadNotifications.length;

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    // When opening the dropdown, mark all as read/opened
    if (nextOpen && unreadCount > 0) {
      const allIds = notifications.map((n) => n.id);
      setReadIds(allIds);
      localStorage.setItem(localStorageKey, JSON.stringify(allIds));
    }
  };

  const formatNotificationTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isMounted) {
    return (
      <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm text-slate-500">
        <Bell className="h-5 w-5 text-slate-600" />
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={handleToggle}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-all duration-200 active:scale-95 ${
          isOpen
            ? "border-emerald-200 bg-emerald-50 text-[#135A3D]"
            : "border-slate-100 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800"
        }`}
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 animate-wiggle text-emerald-700" />
        ) : (
          <Bell className="h-5 w-5" />
        )}

        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 z-50 w-80 sm:w-96 rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-md shadow-2xl p-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-8 w-8 text-slate-300 stroke-[1.5] mb-2" />
                <p className="text-xs font-semibold text-slate-400">No notifications yet</p>
                <p className="text-[10px] text-slate-400/80 mt-0.5">We'll let you know when things happen.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isUnreadBeforeOpen = !readIds.includes(notification.id);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 rounded-xl p-3 border transition-all duration-200 ${
                      notification.type === "welcome"
                        ? "bg-blue-50/40 border-blue-100/50 hover:bg-blue-50/80"
                        : "bg-emerald-50/40 border-emerald-100/50 hover:bg-emerald-50/80"
                    }`}
                  >
                    {/* Icon Column */}
                    <div className="mt-0.5 shrink-0">
                      {notification.type === "welcome" ? (
                        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600">
                          <Info className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-600">
                          <Receipt className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Text Column */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {notification.title}
                        </p>
                        <span className="text-[9px] font-semibold text-slate-400 shrink-0">
                          {formatNotificationTime(notification.date)}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
