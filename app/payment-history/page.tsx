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
  Check,
  Search,
  SlidersHorizontal,
  Eye,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { recentTransactions } from "@/src/data/mock";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import type { Transaction } from "@/src/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

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
  const [searchQuery, setSearchQuery] = useState("");

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
      if (methodFilter === "Paystack" && !tx.receipt.startsWith("T")) {
        return false;
      }
    }

    // 3. Desktop Search Box Input Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchQuery = 
        tx.type.toLowerCase().includes(query) || 
        (tx.description && tx.description.toLowerCase().includes(query)) ||
        tx.receipt.toLowerCase().includes(query);
      if (!matchQuery) return false;
    }

    // 4. Date filter
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
          bgClass: "bg-[#EAF5F0]",
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
    <main className="min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* ========================================== */}
          {/* DESKTOP ONLY: UPPER HEADER & STAT CARDS    */}
          {/* ========================================== */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">All Payments</h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">View all payment records.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="px-4 py-2 text-sm font-semibold">
                Edit view
              </Button>
              <Button className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800">
                Export data
              </Button>
            </div>
          </div>

          {/* ========================================== */}
          {/* DATA MANAGEMENT FRAMEWORK GRID CONTAINER */}
          {/* ========================================== */}
          <Card className="w-full max-w-lg md:max-w-full min-h-screen sm:min-h-0 sm:rounded-xl sm:border md:border md:border-slate-200 p-4 sm:p-6 md:p-6 pb-24 lg:pb-6 flex flex-col justify-start mx-auto">

            {/* Top Toolbar Level with Header Actions & Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              
              {/* Header: Back navigation & Title */}
              {/* FIXED ON MOBILE: Reset justify positioning to default left alignment */}
              <div className="flex items-center gap-1 justify-start">
                <Link
                  href="/dashboard"
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-50 transition active:scale-95 text-[#1E2E42] md:hidden -ml-2"
                >
                  <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
                </Link>
                <h1 className="text-xl font-bold text-[#1E2E42] tracking-tight md:text-sm md:text-slate-700">
                  <span className="md:hidden">Payment History</span>
                  <span className="hidden md:inline">All Payments</span>
                </h1>
              </div>

              {/* Filters Actions Bar */}
              <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
                
                {/* Desktop Embedded Layout Search Bar */}
                <div className="hidden md:relative md:block w-64">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input 
                    type="text" 
                    placeholder="Search transaction..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-300 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 justify-center w-full md:w-auto">
                  {/* Date Filter */}
                  <div className="relative" ref={dateRef}>
                    <button
                      onClick={() => {
                        setIsDateOpen(!isDateOpen);
                        setIsServiceOpen(false);
                        setIsMethodOpen(false);
                      }}
                      className={`flex items-center gap-1.5 rounded-full md:rounded-xl px-4 py-2 text-xs font-bold transition duration-200 cursor-pointer ${dateFilter !== "All"
                        ? "bg-[#135A3D] text-white"
                        : "bg-[#F3F4F6] md:bg-white md:border md:border-slate-200 text-[#1E2E42] hover:bg-[#E5E7EB]"
                        }`}
                    >
                      <span>{dateFilter === "All" ? "Date" : dateFilter}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDateOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isDateOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 mt-2 z-50 w-50 rounded-2xl bg-white border border-slate-100 p-1.5 flex flex-col gap-0.5">
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
                      className={`flex items-center gap-1.5 rounded-full md:rounded-xl px-4 py-2 text-xs font-bold transition duration-200 cursor-pointer ${serviceFilter !== "All"
                        ? "bg-[#135A3D] text-white"
                        : "bg-[#F3F4F6] md:bg-white md:border md:border-slate-200 text-[#1E2E42] hover:bg-[#E5E7EB]"
                        }`}
                    >
                      <span>{serviceFilter === "All" ? "Services" : serviceFilter}</span>
                      <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isServiceOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isServiceOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 mt-2 z-50 w-56 rounded-2xl bg-white border border-slate-100 p-1.5 flex flex-col gap-0.5">
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

              </div>
            </div>

            {/* ========================================== */}
            {/* DESKTOP VIEW DATA TABLE GRID               */}
            {/* ========================================== */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3.5 px-4">S/N</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Amount</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60 text-sm font-medium text-slate-700">
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((tx) => {
                      return (
                        <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                          <td className="py-4 px-4">{tx.id.slice(0, 6).toUpperCase()}</td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <span className="font-bold text-slate-900 block leading-tight">{tx.type}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 text-xs font-semibold text-slate-500">
                            {tx.date}
                          </td>

                          <td className="py-4">
                            <Badge
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                                tx.status === "Successful"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : tx.status === "Pending"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              <span className={`h-1 w-1 rounded-full ${
                                tx.status === "Successful" ? "bg-emerald-500" : tx.status === "Pending" ? "bg-amber-500" : "bg-rose-500"
                              }`} />
                              {tx.status === "Successful" ? "Completed" : tx.status}
                            </Badge>
                          </td>

                          <td className="py-4 text-center font-extrabold text-rose-400">
                            ₦{tx.amount.toLocaleString()}
                          </td>

                          <td className="py-4 text-center">
                            <button 
                              onClick={() => handleTransactionClick(tx.receipt)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 transition"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12">
                        <EmptyState
                          title="No transactions found"
                          description="No transactions match the selected filters."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Grid Pagination Footer Layout Summary */}
              {sortedTransactions.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 px-2">
                  <span className="text-xs font-semibold text-slate-400">Showing 1-{sortedTransactions.length} of {sortedTransactions.length} items</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <button className="px-2 py-1 rounded-lg hover:bg-slate-50 transition cursor-not-allowed text-slate-300">Prev</button>
                    <button className="h-7 w-7 bg-[#135A3D] text-white rounded-lg flex items-center justify-center">1</button>
                    <button className="px-2 py-1 rounded-lg hover:bg-slate-50 transition">Next</button>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================== */}
            {/* MOBILE VIEW LIST LAYOUT                    */}
            {/* ========================================== */}
            <div className="md:hidden flex-1 flex flex-col gap-4">
              {sortedTransactions.length > 0 ? (
                <div className="flex flex-col">
                  {sortedTransactions.map((tx, idx, arr) => {
                    const theme = getCategoryTheme(tx.type);
                    const IconComponent = theme.icon;
                    const card = getCardBrand(tx.receipt);

                    return (
                      <div
                        key={tx.id}
                        onClick={() => handleTransactionClick(tx.receipt)}
                        className={`flex items-center justify-between py-4 cursor-pointer hover:bg-slate-50/70 px-2 rounded-2xl -mx-2 transition active:scale-[0.99] ${
                          idx !== arr.length - 1 ? "border-b border-slate-100/70" : ""
                        }`}
                      >
                        {/* Left Section: Icon and Details */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {/* Round Dynamic Icon Component */}
                          <div className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center ${theme.bgClass}`}>
                            <IconComponent className={`h-5 w-5 ${theme.iconClass}`} />
                          </div>

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
                          </div>
                        </div>

                        {/* Right Section: Amount */}
                        <div className="text-right shrink-0 pl-4">
                          <span className="text-sm font-extrabold text-rose-400">
                            ₦{tx.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="No transactions found"
                  description="No transactions match the selected filters."
                />
              )}
            </div>

          </Card>
          {/* end card container */}

        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}
