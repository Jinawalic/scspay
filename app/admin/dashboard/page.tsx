"use client";

import React, { useState, useEffect } from "react";
import { User, CreditCard } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { MetricCard } from "@/components/admin/MetricCard";
import { TransactionTable, type TransactionItem } from "@/components/admin/TransactionTable";
import { ToastNotification, ToastType } from "@/components/admin/ToastNotification";

export default function AdminDashboardPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [paymentsCount, setPaymentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
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
  ];

  // Client-side transactional parsing
  const filteredTransactions = transactions.filter(tx => {
    return (
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteTransaction = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to delete transaction");
      }

      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      triggerToast(`Transaction ${id} has been dropped successfully.`, "success");
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : "Unable to delete transaction", "error");
    }
  };

  const handleViewTransaction = (id: string) => {
    window.location.href = `/receipt/${id}`;
  };

  return (
    <AdminLayoutContainer activeSegment="Dashboard">
      <div className="space-y-4 flex-1 flex flex-col justify-start">
        
        {/* Top Header Row Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
          <h1 className="text-[15px] font-bold text-slate-900">Dashboard Overview</h1>
        </div>

        {/* Performance Metric Tracker Dynamic Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onView={handleViewTransaction}
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