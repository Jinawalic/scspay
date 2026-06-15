"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, CreditCard, AlarmClock, CalendarRange } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { MetricCard } from "@/components/admin/MetricCard";
import { TransactionTable, type TransactionItem } from "@/components/admin/TransactionTable";
import { ToastNotification, ToastType } from "@/components/admin/ToastNotification";

// Reusable atomic workflow component layers
import { Button } from "@/components/admin/Button";

export default function AdminDashboardPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [paymentsCount, setPaymentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dashboard Session Managing States
  const [currentSession, setCurrentSession] = useState("2025/2026");
  const [sessionInputValue, setSessionInputValue] = useState("2025/2026");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);
  
  // Reusable System Toast state structure
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Load dashboard stats from API
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load dashboard data");
        if (isMounted) {
          setTransactions(data.recentTransactions ?? []);
          setStudentsCount(data.studentsCount ?? 0);
          setPaymentsCount(data.paymentsCount ?? 0);
          if (data.currentSession) {
            setCurrentSession(data.currentSession);
            setSessionInputValue(data.currentSession);
          }
        }
      } catch (err) {
        if (isMounted) setLoadError(err instanceof Error ? err.message : "Unable to load dashboard data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => { isMounted = false; };
  }, []);

  // Close the mini card context wrapper automatically if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenPopover = () => {
    setSessionInputValue(currentSession); // Seed current val when opened
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleCommitSessionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedSession = sessionInputValue.trim();
    
    if (!formattedSession) return;

    setCurrentSession(formattedSession);
    setIsPopoverOpen(false);
    triggerToast(`Academic dashboard view switched to session tracking profile: ${formattedSession}`, "success");
  };

  // Performance Metric Tracker Card Dataset Slices
  const metricsData = [
    { 
      title: "All Students", 
      value: isLoading ? "..." : studentsCount.toLocaleString(), 
      icon: User, 
      subtitle: "Platform registered students", 
      subtitleColor: "text-blue-500",
      isNegative: false 
    },
    { 
      title: "Payments Counts", 
      value: isLoading ? "..." : paymentsCount.toLocaleString(), 
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
          
          {/* Relative anchor wrapper container */}
          <div className="relative" ref={popoverRef}>
            <Button 
              variant="default" 
              type="button"
              onClick={handleOpenPopover}
              className="text-white"
            >
              Set Session
            </Button>

            {/* Small dynamic input card floating underneath button anchor */}
            {isPopoverOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <form onSubmit={handleCommitSessionUpdate} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CalendarRange className="h-3 w-3" />
                      Academic Session
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="e.g., 2026/2027"
                      value={sessionInputValue}
                      onChange={(e) => setSessionInputValue(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-300 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsPopoverOpen(false)}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-50 rounded-md transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-[11px] font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md shadow-sm transition"
                    >
                      Save
                    </button>
                  </div>
                </form>
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
          <div className="pt-1 flex-1">
            {isLoading ? (
              <div className="w-full py-12 text-center text-slate-400 font-semibold text-sm border border-slate-200 rounded-xl bg-white shadow-sm">
                Loading payment history...
              </div>
            ) : loadError ? (
              <div className="w-full py-12 text-center text-rose-500 font-semibold text-sm border border-slate-200 rounded-xl bg-white shadow-sm">
                {loadError}
              </div>
            ) : (
              <TransactionTable 
                transactions={filteredTransactions} 
                onDelete={handleDeleteTransaction}
              />
            )}
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