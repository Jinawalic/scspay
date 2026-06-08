"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { recentTransactions } from "@/src/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function PaymentHistoryPage() {
  const [query, setQuery] = useState("");
  const [session, setSession] = useState("2025/2026");
  const [paymentType, setPaymentType] = useState("All");

  const filtered = useMemo(() => {
    return recentTransactions.filter((transaction) => {
      const matchesQuery = transaction.receipt.toLowerCase().includes(query.toLowerCase()) || transaction.type.toLowerCase().includes(query.toLowerCase());
      const matchesSession = session === "All" || transaction.session === session;
      const matchesType = paymentType === "All" || transaction.type === paymentType;
      return matchesQuery && matchesSession && matchesType;
    });
  }, [query, session, paymentType]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Payment History</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Your recent transactions</h1>
              <p className="mt-2 text-sm text-slate-500">Search and filter payments, then download receipts anytime.</p>
            </div>
            <Button variant="secondary">Export CSV</Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-[1.5fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search receipt or type" className="pl-11" />
            </div>
            <Select value={session} onChange={(event) => setSession(event.target.value)}>
              <option>All</option>
              <option>2025/2026</option>
              <option>2024/2025</option>
            </Select>
            <Select value={paymentType} onChange={(event) => setPaymentType(event.target.value)}>
              <option>All</option>
              <option>School Fees</option>
              <option>ICT Fees</option>
              <option>Hostel Fees</option>
              <option>Departmental Fees</option>
            </Select>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <TransactionTable transactions={filtered} />
          <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
            <p>Showing {filtered.length} of {recentTransactions.length} transactions</p>
            <div className="flex items-center gap-2">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
