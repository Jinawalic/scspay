"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { recentTransactions } from "@/src/data/mock";
import { TransactionCard } from "./TransactionCard";
import { AnimatePresence } from "framer-motion";

export function RecentTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState(recentTransactions);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    return (
      transaction.type.toLowerCase().includes(query) ||
      (transaction.description && transaction.description.toLowerCase().includes(query)) ||
      transaction.receipt.toLowerCase().includes(query)
    );
  });

  const handleDelete = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDownload = (receipt: string) => {
    window.open(`/receipt/${receipt}?print=1`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {/* Centered Section Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E2E42]">
          Recent Transactions
        </h2>
      </div>

      {/* Search History Input */}
      <div className="relative">
        <Receipt className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border-none bg-slate-200/50 py-3.5 pl-12 pr-4 text-sm font-semibold text-[#1E2E42] outline-none placeholder:text-slate-400 focus:bg-slate-200/70 focus:ring-1 focus:ring-slate-300 transition-all"
        />
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-4">
        {filteredTransactions.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onDelete={() => handleDelete(transaction.id)}
                onDownload={() => handleDownload(transaction.receipt)}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400">
            No transactions found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
