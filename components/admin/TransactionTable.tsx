"use client";

import React, { useState } from "react";
import { Eye, SlidersHorizontal, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

// Import your newly created atomic reusable components here
import { SearchInput } from "@/components/admin/SearchInput";
import { IconButton } from "@/components/admin/IconButton";

export interface TransactionItem {
  id: string;
  customer: string;
  date: string;
  product: string;
  amount: string;
  status: "Completed" | "Pending";
}

interface TransactionTableProps {
  transactions: TransactionItem[];
  onDelete: (id: string) => void;
  onView?: (id: string) => void;
}

export function TransactionTable({ transactions, onDelete, onView }: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reusable Overlay Interaction Tracking States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  // 1. Filter data based on search input (matching Transaction ID or Student/Customer name)
  const filteredTransactions = transactions.filter((tx) =>
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Calculate Pagination metrics
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Execution Flow Triggers for Destructive Pipeline
  const triggerDeleteFlow = (tx: TransactionItem) => {
    setSelectedTx(tx);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Fallback safe-check to handle asynchronous state transitions smoothly
    if (!selectedTx) return;
    
    // Bubble up item drop manipulation to the parent state container
    onDelete(selectedTx.id);
    
    // Close overlay state wrappers and clean up tracking parameters
    setIsDeleteModalOpen(false);
    setSelectedTx(null);

    // Safeguard page indexing boundaries if removing last element on active leaf
    if (paginatedTransactions.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Content Filter Utilities Header Line Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Payment History
          </h2>
        </div>

        {/* Search Input and Filter Group Alignment Box */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Integrated Atomic Search Input Component */}
          <SearchInput
            placeholder="Search transaction..."
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1); // Reset to first page on search typing
            }}
          />

          {/* Action Sort Action Selection Trigger Box */}
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shrink-0"
          >
            <span>Most Recent</span>
            <SlidersHorizontal className="h-3 w-3 text-slate-400 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* The Unified Structuring Data Matrix Core Framework */}
      <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3.5 px-5 w-16">S/N</th>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-[14px] font-semibold text-slate-700">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx, index) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                    {/* Calculated Dynamic Serial Number Column */}
                    <td className="py-4 px-5 font-bold text-slate-900 tracking-wide">
                      {startIndex + index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {tx.customer}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-400">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {tx.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold leading-normal ${
                          tx.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100/60"
                            : "bg-amber-50 text-amber-700 border border-amber-100/60"
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full ${
                            tx.status === "Completed" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 font-medium text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Clean Balanced Pagination Footer Component */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3.5 bg-white select-none">
          <div className="text-[13px] font-semibold text-slate-400">
            Showing <span className="text-slate-700">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="text-slate-700">
              {Math.min(startIndex + itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="text-slate-700">{totalItems}</span> entries
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-7 px-2.5 rounded-lg text-xs font-bold transition ${
                  page === currentPage
                    ? "bg-slate-400 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)} // Fixed logic index error here (from prev - 1)
              className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Global Standalone Deletion Warning Overlay Mounting Target --- */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTx(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedTx ? `Tx ID: ${selectedTx.id} (${selectedTx.customer})` : ""}
      />
    </div>
  );
}