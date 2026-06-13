"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { TransactionTable, TransactionItem } from "@/components/admin/TransactionTable";

// Mock Data matching your TransactionItem interface
const MOCK_TRANSACTIONS: TransactionItem[] = [
  { id: "TX-9081", customer: "Amara Okafor", date: "Jun 12, 2026", product: "Tuition Fees", amount: "$1,200.00", status: "Completed" },
  { id: "TX-9082", customer: "Chidi Benson", date: "Jun 11, 2026", product: "Library Fine", amount: "$15.00", status: "Pending" },
  { id: "TX-9083", customer: "Elena Rostova", date: "Jun 10, 2026", product: "Lab Equipment", amount: "$250.00", status: "Completed" },
  { id: "TX-9084", customer: "Marcus Vance", date: "Jun 08, 2026", product: "Tuition Fees", amount: "$1,200.00", status: "Completed" },
  { id: "TX-9085", customer: "Tariq Mahmood", date: "Jun 07, 2026", product: "Student Housing", amount: "$850.00", status: "Pending" },
  { id: "TX-9086", customer: "Sophia Lin", date: "Jun 05, 2026", product: "Textbooks", amount: "$180.00", status: "Completed" },
];

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);

  return (
    <AdminLayoutContainer activeSegment="View Payments">
      {/* Everything here seamlessly renders inside the master white layout card container 
        provided by AdminLayoutContainer, alongside your persistent sidebar and header.
      */}
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

          {/* Action Buttons styled precisely like your "Most Recent" action box */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-sm shrink-0"
            >
              <Download className="h-3.5 w-3.5 text-slate-400 stroke-[2.5]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* --- Core Data Matrix Container (Table embeds flat cleanly inside layout card) --- */}
        <div className="pt-2 flex-1">
          <TransactionTable transactions={transactions} />
        </div>

      </div>
    </AdminLayoutContainer>
  );
}