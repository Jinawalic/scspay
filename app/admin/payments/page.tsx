"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { TransactionTable, type TransactionItem } from "@/components/admin/TransactionTable";
import { ToastNotification, type ToastType } from "@/components/admin/ToastNotification";

// Import your reusable atomic global UI library components
import { Button } from "@/components/admin/Button";

// Mock Data matching your TransactionItem interface with local currency formatters
const MOCK_TRANSACTIONS: TransactionItem[] = [
  { id: "TX-9081", customer: "Amara Okafor", date: "Jun 12, 2026", product: "Tuition Fees", amount: "₦1,200.00", status: "Completed" },
  { id: "TX-9082", customer: "Chidi Benson", date: "Jun 11, 2026", product: "Library Fine", amount: "₦15.00", status: "Pending" },
  { id: "TX-9083", customer: "Elena Rostova", date: "Jun 10, 2026", product: "Lab Equipment", amount: "₦250.00", status: "Completed" },
  { id: "TX-9084", customer: "Marcus Vance", date: "Jun 08, 2026", product: "Tuition Fees", amount: "₦1,200.00", status: "Completed" },
  { id: "TX-9085", customer: "Tariq Mahmood", date: "Jun 07, 2026", product: "Student Housing", amount: "₦850.00", status: "Pending" },
  { id: "TX-9086", customer: "Sophia Lin", date: "Jun 05, 2026", product: "Textbooks", amount: "₦180.00", status: "Completed" },
];

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);

  // Setup the toast confirmation system state layer
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Filter out the selected transaction by its unique ID
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    triggerToast(`Transaction record (${id}) has been removed.`, "success");
  };

  return (
    <AdminLayoutContainer activeSegment="View Payments">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        
        {/* --- Top Page Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 select-none">
          <div className="space-y-1">
            <h1 className="text-base font-bold text-slate-900 md:text-xl">
              All Student Payments
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              View payment record and download registered students.
            </p>
          </div>

          {/* Action Buttons utilizing the Reusable Button component layout */}
          <div className="flex items-center gap-3">
            <Button icon={Download} variant="white">
              Export CSV
            </Button>
          </div>
        </div>

        {/* --- Core Data Matrix Container (Table embeds flat cleanly inside layout card) --- */}
        <div className="pt-2 flex-1">
          <TransactionTable 
            transactions={transactions} 
            onDelete={handleDeleteTransaction} // Passed down the state mutation pipeline
          />
        </div>

      </div>

      {/* Mounting point component framework for system notifications */}
      <ToastNotification 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayoutContainer>
  );
}