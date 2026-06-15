"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, CreditCard, AlarmClock, ChevronDown } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { MetricCard } from "@/components/admin/MetricCard";
import { TransactionTable, type TransactionItem } from "@/components/admin/TransactionTable";
import { ToastNotification, ToastType } from "@/components/admin/ToastNotification";

// Reusable atomic workflow component layers
import { Button } from "@/components/admin/Button";

const INITIAL_TRANSACTIONS: TransactionItem[] = [
  { id: "#TRX-2389", customer: "Alex Johnson", date: "Jan 12, 2023", product: "Tshirt", amount: "$45.00", status: "Completed" },
  { id: "#TRX-2388", customer: "Sarah Miller", date: "Feb 22, 2023", product: "Covid restrictions", amount: "$99.00", status: "Completed" },
  { id: "#TRX-2387", customer: "David Chen", date: "Feb 18, 2024", product: "Feb 18, 2024", amount: "$22.99", status: "Pending" },
  { id: "#TRX-2386", customer: "Emma Wilson", date: "May 17, 2024", product: "May 17, 2024", amount: "$35.00", status: "Completed" },
  { id: "#TRX-2385", customer: "Paula Mora", date: "June 25, 2024", product: "June 25, 2024", amount: "$89.00", status: "Pending" },
];

const AVAILABLE_SESSIONS = ["2024/2025", "2025/2026", "2026/2027"];

export default function AdminDashboardPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSession, setCurrentSession] = useState("2026/2027");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reusable System Toast state structure
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Close dropdown cleanly when clicking completely outside the menu container boundary
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSessionChange = (session: string) => {
    setCurrentSession(session);
    setIsDropdownOpen(false);
    triggerToast(`Academic dashboard view switched to session tracking profile: ${session}`, "success");
  };

  // Performance Metric Tracker Card Dataset Slices
  const metricsData = [
    { 
      title: "All Students", 
      value: "1,234", 
      icon: User, 
      subtitle: "Platform registered students", 
      subtitleColor: "text-blue-500",
      isNegative: false 
    },
    { 
      title: "Payments Counts", 
      value: "453", 
      icon: CreditCard, 
      subtitle: "Successful transactions processed", 
      subtitleColor: "text-emerald-500",
      isNegative: false 
    },
    { 
      title: "Current Session", 
      value: currentSession, 
      icon: AlarmClock, 
      subtitle: "Active academic calendar year", 
      subtitleColor: "text-amber-500",
      isNegative: false 
    },
  ];

  // Client-side transactional parsing
  const filteredTransactions = transactions.filter(tx => {
    return (
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    triggerToast(`Transaction ${id} has been dropped successfully.`, "success");
  };

  return (
    <AdminLayoutContainer activeSegment="Dashboard">
      <div className="space-y-4 flex-1 flex flex-col justify-start">
        
        {/* Top Header Row Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
          <h1 className="text-[15px] font-bold text-slate-900">Dashboard Overview</h1>
          
          {/* Integrated Session Menu Dropdown Stack Container */}
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="default" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-white"
            >
              <span>Set Session</span>
              <ChevronDown className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200/80 rounded-xl py-1.5 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Select Active Session
                </div>
                {AVAILABLE_SESSIONS.map((session) => (
                  <button
                    key={session}
                    type="button"
                    onClick={() => handleSessionChange(session)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold transition-colors ${
                      session === currentSession 
                        ? "bg-slate-50 text-emerald-800 font-bold" 
                        : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                    }`}
                  >
                    {session}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Metric Tracker Dynamic Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsData.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              subtitle={metric.subtitle}
              subtitleColor={metric.subtitleColor}
              isNegative={metric.isNegative}
            />
          ))}
        </div>

        {/* Payment History Data Header with Integrated Filter Options */}
        <div className="pt-4 flex flex-col space-y-3">
          {/* Main Operational Table View Block Section */}
          <div className="pt-1 flex-1">
            <TransactionTable 
              transactions={filteredTransactions} 
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>

      {/* Render the clean structured global toast framework securely */}
      <ToastNotification 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayoutContainer>
  );
}