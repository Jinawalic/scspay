"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Home,
  Shirt,
  CreditCard,
  Tag,
  Check
} from "lucide-react";
import { recentTransactions } from "@/src/data/mock";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import type { Transaction } from "@/src/types";

// Helper to parse dates like "05 JUN 2026" or "10/06/2026, 19:48:41"
const parseDate = (dateStr: string): Date => {
  try {
    if (dateStr.includes("/")) {
      const parts = dateStr.split(",")[0].split("/");
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    const parts = dateStr.split(" ");
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const months: { [key: string]: number } = {
        JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
        JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
      };
      const month = months[parts[1].toUpperCase()] ?? 0;
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
  } catch (e) {
    console.error(e);
  }
  return new Date(dateStr);
};

// Helper to format date string to group headers: e.g. "Sunday, 12 Feb 2024" or "Today"
const getGroupHeader = (dateStr: string): string => {
  const date = parseDate(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  // Set system "Today" to match June 10, 2026
  const today = new Date(2026, 5, 10);
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function PaymentHistoryPage() {
  const [dateFilter, setDateFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isMethodOpen, setIsMethodOpen] = useState(false);

  const dateRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const methodRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setIsDateOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
      if (methodRef.current && !methodRef.current.contains(event.target as Node)) {
        setIsMethodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTransactionClick = (receipt: string) => {
    window.open(`/receipt/${receipt}?print=1`, "_blank", "noopener,noreferrer");
  };

  // Filter logic
  const filteredTransactions = recentTransactions.filter((tx) => {
    // 1. Service/Type filter
    if (serviceFilter !== "All" && tx.type !== serviceFilter) {
      return false;
    }

    // 2. Method filter (mock representation)
    if (methodFilter !== "All") {
      // For mock simplicity, assume all transactions are Paystack/Card
      if (methodFilter === "Paystack" && !tx.receipt.startsWith("T")) {
        return false;
      }
    }

    // 3. Date filter
    if (dateFilter !== "All") {
      const txDate = parseDate(tx.date);
      const today = new Date(2026, 5, 10); // June 10, 2026

      if (dateFilter === "Today") {
        const isToday = txDate.getDate() === today.getDate() &&
          txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear();
        if (!isToday) return false;
      } else if (dateFilter === "This Month") {
        const isThisMonth = txDate.getMonth() === today.getMonth() &&
          txDate.getFullYear() === today.getFullYear();
        if (!isThisMonth) return false;
      } else if (dateFilter === "Last 30 Days") {
        const diffTime = Math.abs(today.getTime() - txDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 30) return false;
      }
    }

    return true;
  });

  // Sort chronologically (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  // Group transactions by formatted date string
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  sortedTransactions.forEach((tx) => {
    const key = getGroupHeader(tx.date);
    if (!groupedTransactions[key]) {
      groupedTransactions[key] = [];
    }
    groupedTransactions[key].push(tx);
  });

  // Map category to styles/icons
  const getCategoryTheme = (type: string) => {
    switch (type) {
      case "School Fees":
        return {
          icon: GraduationCap,
          bgClass: "bg-[#EAF5F0]", // Soft light green matching brand green
          iconClass: "text-[#135A3D]",
        };
      case "Course Registration":
        return {
          icon: BookOpen,
          bgClass: "bg-blue-50",
          iconClass: "text-blue-600",
        };
      case "Hostel Fees":
        return {
          icon: Home,
          bgClass: "bg-violet-50",
          iconClass: "text-violet-600",
        };
      case "T-Shirt / ID Card":
        return {
          icon: Shirt,
          bgClass: "bg-amber-50",
          iconClass: "text-amber-600",
        };
      default:
        return {
          icon: CreditCard,
          bgClass: "bg-slate-100",
          iconClass: "text-slate-600",
        };
    }
  };

  // Generate realistic card info consistent per transaction ID
  const getCardBrand = (receipt: string) => {
    const lastDigit = parseInt(receipt.slice(-1)) || 0;
    if (lastDigit % 2 === 0) {
      return {
        logo: <span className="text-red-500 font-extrabold font-sans text-[10px]">mc</span>,
        name: "Mastercard",
        suffix: `***${receipt.slice(-3)}`
      };
    } else {
      return {
        logo: <span className="text-blue-600 font-extrabold italic font-serif text-[10px]">VISA</span>,
        name: "VISA",
        suffix: `***${receipt.slice(-3)}`
      };
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F6F8]">
      <DesktopSidebar />

      <div className="lg:ml-72">
        <div className="px-0 sm:px-6 lg:px-10 py-0 sm:py-8 flex justify-center">

          {/* Card container matching mobile screen on desktop, full-screen on mobile */}
          <div className="w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 sm:shadow-[0_24px_70px_rgba(0,0,0,0.03)] p-6 sm:p-10 pb-24 lg:pb-8 flex flex-col justify-start">

            {/* Header: Back navigation & Title */}
            <div className="flex items-center gap-3.5 mb-8">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 transition active:scale-95 text-[#1E2E42]"
              >
                <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
              </Link>
              <h1 className="text-xl font-bold text-[#1E2E42] tracking-tight">
                Payment History
              </h1>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 mb-8">
              {/* Date Filter */}
              <div className="relative" ref={dateRef}>
                <button
                  onClick={() => {
                    setIsDateOpen(!isDateOpen);
                    setIsServiceOpen(false);
                    setIsMethodOpen(false);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition duration-200 cursor-pointer ${dateFilter !== "All"
                    ? "bg-[#135A3D] text-white"
                    : "bg-[#F3F4F6] text-[#1E2E42] hover:bg-[#E5E7EB]"
                    }`}
                >
                  <span>{dateFilter === "All" ? "Date" : dateFilter}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDateOpen ? "rotate-180" : ""}`} />
                </button>

                {isDateOpen && (
                  <div className="absolute left-0 mt-2 z-50 w-50 rounded-2xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5">
                    {["All", "Today", "This Month", "Last 30 Days"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setDateFilter(opt);
                          setIsDateOpen(false);
                        }}
                        className="flex items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs font-bold text-[#1E2E42] hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span>{opt}</span>
                        {dateFilter === opt && <Check className="h-3.5 w-3.5 text-[#135A3D] stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Services Filter */}
              <div className="relative" ref={serviceRef}>
                <button
                  onClick={() => {
                    setIsServiceOpen(!isServiceOpen);
                    setIsDateOpen(false);
                    setIsMethodOpen(false);
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition duration-200 cursor-pointer ${serviceFilter !== "All"
                    ? "bg-[#135A3D] text-white"
                    : "bg-[#F3F4F6] text-[#1E2E42] hover:bg-[#E5E7EB]"
                    }`}
                >
                  <span>{serviceFilter === "All" ? "Services" : serviceFilter}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isServiceOpen ? "rotate-180" : ""}`} />
                </button>

                {isServiceOpen && (
                  <div className="absolute left-0 mt-2 z-50 w-56 rounded-2xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5">
                    {["All", "School Fees", "Course Registration", "Hostel Fees", "T-Shirt / ID Card"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setServiceFilter(opt);
                          setIsServiceOpen(false);
                        }}
                        className="flex items-center justify-between rounded-xl px-3.5 py-2 text-left text-xs font-bold text-[#1E2E42] hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span className="truncate">{opt}</span>
                        {serviceFilter === opt && <Check className="h-3.5 w-3.5 text-[#135A3D] stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grouped Transaction Lists */}
            <div className="flex-1 flex flex-col gap-6">
              {Object.keys(groupedTransactions).length > 0 ? (
                Object.keys(groupedTransactions).map((dateHeader) => (
                  <div key={dateHeader} className="space-y-4">
                    {/* Date Header Title */}
                    <h3 className="text-sm font-bold text-[#1E2E42] tracking-tight">
                      {dateHeader}
                    </h3>

                    {/* Transactions under this Date */}
                    <div className="flex flex-col">
                      {groupedTransactions[dateHeader].map((tx, idx, arr) => {
                        const theme = getCategoryTheme(tx.type);
                        const IconComponent = theme.icon;
                        const card = getCardBrand(tx.receipt);

                        return (
                          <div
                            key={tx.id}
                            onClick={() => handleTransactionClick(tx.receipt)}
                            className={`flex items-center justify-between py-4 cursor-pointer hover:bg-slate-50/70 px-2 rounded-2xl -mx-2 transition active:scale-[0.99] ${idx !== arr.length - 1 ? "border-b border-slate-100/70" : ""
                              }`}
                          >
                            {/* Left Section: Icon and Details */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">

                              {/* Circle Icon Container */}
                              <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center ${theme.bgClass}`}>
                                <IconComponent className={`h-5 w-5 ${theme.iconClass}`} />
                              </div>

                              {/* Text info */}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-[#1E2E42] truncate leading-normal">
                                  {tx.type}
                                </p>

                                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-semibold text-slate-400">
                                  <Tag className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[150px] sm:max-w-none">
                                    {tx.description || `ID: ${tx.receipt}`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="flex items-center gap-1">
                                    {card.logo}
                                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                                      {card.suffix}
                                    </span>
                                  </div>
                                  {tx.status !== "Successful" && (
                                    <>
                                      <span className="text-slate-300 text-[10px] font-bold">•</span>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${tx.status === "Pending" ? "text-amber-600" : "text-red-500"
                                        }`}>
                                        {tx.status}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Section: Amount */}
                            <div className="text-right shrink-0 pl-4">
                              <span className="text-sm font-extrabold text-[#1E2E42]">
                                ₦{tx.amount.toLocaleString()}
                              </span>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-12 px-6 text-center text-slate-400 font-semibold text-sm">
                  No transactions found matching the selected filters.
                </div>
              )}
            </div>

          </div>
          {/* end card container */}

        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
