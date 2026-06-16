"use client";

import React, { useEffect, useRef, useState } from "react";
import { Download, ChevronDown, X, ChevronLeft, ChevronRight, SlidersHorizontal, Eye, Trash } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { ToastNotification, type ToastType } from "@/components/admin/ToastNotification";
import { Button } from "@/components/admin/Button";
import { SearchInput } from "@/components/admin/SearchInput";

type TransactionRow = {
  id: string;
  receipt: string;
  reference: string | null;
  student: string;
  matricNumber: string;
  faculty: string;
  department: string;
  date: string;
  dateTime: string;
  amount: number;
  amountLabel: string;
  type: string;
  session: string;
  status: string;
};

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // CSV Export Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Load transactions from API
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/transactions", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load transactions");
        if (isMounted) setTransactions(data.transactions ?? []);
      } catch (err) {
        if (isMounted) setLoadError(err instanceof Error ? err.message : "Unable to load transactions");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => { isMounted = false; };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Unique departments from transactions
  const departments = Array.from(
    new Set(transactions.map((tx) => tx.department).filter(Boolean))
  ).sort();

  // Filtered + searched transactions - only successful payments
  const filtered = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tx.student.toLowerCase().includes(q) ||
      tx.id.toLowerCase().includes(q) ||
      tx.matricNumber.toLowerCase().includes(q) ||
      tx.type.toLowerCase().includes(q);
    const isSuccess = tx.status === "Successful" || tx.status === "Success";
    return matchesSearch && isSuccess;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Delete transaction logic
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
      triggerToast("Transaction deleted successfully.", "success");
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : "Unable to delete transaction", "error");
    }
  };

  // View receipt logic
  const handleViewReceipt = (receipt: string) => {
    window.location.href = `/receipt/${receipt}`;
  };

  // CSV download logic
  const handleDownloadCSV = () => {
    const rows = selectedDept
      ? transactions.filter((tx) => tx.department === selectedDept)
      : transactions;

    if (rows.length === 0) {
      triggerToast("No records found for the selected department.", "error");
      return;
    }

    const headers = ["S/N", "Receipt ID", "Student Name", "Matric Number", "Faculty", "Department", "Payment Type", "Amount", "Session", "Date & Time", "Status"];
    const csvRows = [
      headers.join(","),
      ...rows.map((tx, i) =>
        [
          i + 1,
          tx.receipt,
          `"${tx.student}"`,
          tx.matricNumber,
          `"${tx.faculty}"`,
          `"${tx.department}"`,
          `"${tx.type}"`,
          tx.amount,
          tx.session,
          `"${tx.dateTime}"`,
          tx.status,
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = selectedDept
      ? `payments_${selectedDept.replace(/\s+/g, "_").toLowerCase()}.csv`
      : "all_payments.csv";
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    setIsDropdownOpen(false);
    setSelectedDept(null);
    triggerToast(`CSV exported successfully${selectedDept ? ` for ${selectedDept}` : ""}.`, "success");
  };

  return (
    <AdminLayoutContainer activeSegment="View Payments">
      <div className="space-y-6 flex-1 flex flex-col justify-start">

        {/* Top Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 select-none">
          <div className="space-y-1">
            <h1 className="text-base font-bold text-slate-900 md:text-xl">
              All Student Payments
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Showing all successful payment records.
            </p>
          </div>

          {/* Export CSV with Department Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              icon={Download}
              variant="white"
              onClick={() => {
                setIsDropdownOpen((prev) => !prev);
                setSelectedDept(null);
              }}
            >
              Export CSV
              <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
                {/* Dropdown Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-700">Select Department</p>
                  <button
                    onClick={() => { setIsDropdownOpen(false); setSelectedDept(null); }}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Department list */}
                <div className="max-h-52 overflow-y-auto py-1.5">
                  {departments.length === 0 ? (
                    <p className="px-4 py-3 text-xs text-slate-400">No departments found.</p>
                  ) : (
                    departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDept((prev) => (prev === dept ? null : dept))}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition flex items-center justify-between gap-3 ${
                          selectedDept === dept
                            ? "bg-emerald-50 text-emerald-800"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{dept}</span>
                        {selectedDept === dept && (
                          <span className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Download button — shown once a dept is selected */}
                {selectedDept && (
                  <div className="border-t border-slate-100 p-3">
                    <p className="text-[11px] text-slate-400 font-medium mb-2 truncate">
                      Selected: <span className="font-bold text-slate-700">{selectedDept}</span>
                    </p>
                    <button
                      onClick={handleDownloadCSV}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition active:scale-95"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download CSV
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="pt-2 flex-1 space-y-4">
          {/* Search + Sort Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-slate-900">Payment History</h2>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchInput
                placeholder="Search student, receipt ID..."
                value={searchQuery}
                onChange={(v) => { setSearchQuery(v); setCurrentPage(1); }}
              />
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shrink-0"
              >
                <span>Most Recent</span>
                <SlidersHorizontal className="h-3 w-3 text-slate-400 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {loadError && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
              {loadError}
            </p>
          )}

          {/* Data Table */}
          <div className="w-full overflow-hidden border border-slate-200 rounded-xl bg-white">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                    <th className="py-3.5 px-5 w-14">S/N</th>
                    <th className="py-3.5 px-4">Receipt ID</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Matric No.</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Payment Type</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-center w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 text-[13px] font-medium text-slate-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="text-center py-10 text-slate-400 font-semibold text-sm">
                        Loading payment records...
                      </td>
                    </tr>
                  ) : paginated.length > 0 ? (
                    paginated.map((tx, index) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-400">{startIndex + index + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono text-[12px] truncate max-w-[140px]">{tx.receipt}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 truncate max-w-[160px]">{tx.student}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[12px]">{tx.matricNumber || "—"}</td>
                        <td className="py-3.5 px-4 text-slate-600 truncate max-w-[160px]">{tx.department || "—"}</td>
                        <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">{tx.type}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{tx.amountLabel}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/60">
                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                            Success
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-10 text-slate-400 font-semibold text-sm">
                        No successful payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3.5 bg-white select-none">
              <div className="text-[13px] font-semibold text-slate-400">
                Showing <span className="text-slate-700">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
                <span className="text-slate-700">{Math.min(startIndex + itemsPerPage, totalItems)}</span>{" "}
                of <span className="text-slate-700">{totalItems}</span> entries
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
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
                        ? "bg-slate-800 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastNotification
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayoutContainer>
  );
}