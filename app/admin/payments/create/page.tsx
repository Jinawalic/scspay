"use client";

import React, { useState } from "react";
import { PlusCircle, SlidersHorizontal, Search, Wallet, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { ModalShell } from "@/components/admin/ModalShell";
import { ToastNotification } from "@/components/admin/ToastNotification";

// Type definitions for payment configurations created by the admin
interface CreatedPaymentItem {
  id: string;
  title: string;
  amount: string;
  session: string;
  action: string;
}

const MOCK_CREATED_PAYMENTS: CreatedPaymentItem[] = [
  { id: "1", title: "Course Registration Fee", amount: "₦20,000", session: "2026/2027", action: "" },
  { id: "2", title: "Hostel Accommodation Fee", amount: "₦125,000", session: "2026/2027", action: "" },
  { id: "3", title: "Departmental T-Shirt & ID Card", amount: "₦7,500", session: "2026/2027", action: "" },
  { id: "4", title: "NACOS Annual Dues", amount: "₦2,000", session: "2025/2026", action: "" },
];

export default function CreatePaymentPage() {
  const [paymentRecords, setPaymentRecords] = useState<CreatedPaymentItem[]>(MOCK_CREATED_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");

  // Reusable Overlay UI Interaction States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Modal Configuration Form Local State Fields
  const [formData, setFormData] = useState({ title: "", amount: "", session: "2026/2027" });

  const filteredRecords = paymentRecords.filter((rec) =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form Submission Execution Logic Pipeline
  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    // Convert string number input flatly to standard localized Nigeria Currency visual notation
    const formattedAmount = `₦${parseFloat(formData.amount.replace(/,/g, "")).toLocaleString()}`;
    
    const newRecord: CreatedPaymentItem = {
      id: String(paymentRecords.length + 1),
      title: formData.title,
      amount: formattedAmount,
      session: formData.session,
      action: ""
    };

    setPaymentRecords([newRecord, ...paymentRecords]);
    setIsModalOpen(false);
    
    // Broadcast message dispatch parameters down into the Toast wrapper engine
    setToastMsg(`"${formData.title}" has been successfully configured and activated.`);
    setIsToastOpen(true);
    
    // Purge entry form values memory clean
    setFormData({ title: "", amount: "", session: "2026/2027" });
  };

  return (
    <AdminLayoutContainer activeSegment="Create Payment">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        
        {/* --- Top Dashboard Context Header Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 select-none">
          <div className="space-y-1">
            <h1 className="text-[15px] font-bold text-slate-900 md:text-xl">
              Payment Configurations
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Manage fee items, set custom payment demands, or initialize a new student payment billing target.
            </p>
          </div>

          {/* Action Trigger Button to spark form modal or navigation */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition active:scale-95 shrink-0"
            >
              <PlusCircle className="h-4 w-4 stroke-[2.5]" />
              <span>Create New Payment</span>
            </button>
          </div>
        </div>

        {/* --- List Section Utilities Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Previously Created Payments
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white transition-colors"
              />
            </div>

            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shrink-0"
            >
              <span>Most Recent</span>
              <SlidersHorizontal className="h-3 w-3 text-slate-400 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* --- Data Matrix Table Canvas Framework --- */}
        <div className="w-full overflow-hidden border border-slate-200/80 rounded-xl bg-white flex-1 flex flex-col justify-between">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  <th className="py-3.5 px-5">S/N</th>
                  <th className="py-3.5 px-5">Title</th>
                  <th className="py-3.5 px-5">Session</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px] font-semibold text-slate-700">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="py-4 px-5 font-bold text-slate-900 tracking-wide">
                        {item.id}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-800 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-500">
                        {item.session}
                      </td>
                      <td className="py-4 px-5 font-extrabold text-emerald-800 text-[13px]">
                        {item.amount}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title="Edit Configuration"
                            className="p-1 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 hover:border-emerald-100 transition active:scale-95"
                          >
                            <Edit2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            title="Delete Configuration"
                            className="p-1 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition active:scale-95"
                          >
                            <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 font-medium text-slate-400">
                      No matching payment configurations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Informational Footer Segment */}
          <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/30 select-none flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div>
              Showing <span className="text-slate-700">{filteredRecords.length}</span> items total
            </div>
            <div className="text-slate-400/80">
              System Active Base Currency: <span className="text-slate-600 font-bold">NGN (₦)</span>
            </div>
          </div>
        </div>

        {/* --- Global Standalone Toast Form Connection Notification --- */}
        <ToastNotification 
          message={toastMsg} 
          isOpen={isToastOpen} 
          onClose={() => setIsToastOpen(false)} 
          type="success"
        />

        {/* --- Decoupled Modular Modal Shell Mount --- */}
        <ModalShell 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Configure Fee Target" 
          icon={Wallet}
        >
          <form onSubmit={handleCreatePayment} className="space-y-4">
            
            {/* Title Entry Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Payment Title / Purpose
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 2026/2027 Second Semester Tuition"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
              />
            </div>

            {/* Target Academic Cycle Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Academic Session
              </label>
              <select
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-300 focus:bg-white transition"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2025/2026">2027/2028</option>
                <option value="2025/2026">2028/2029</option>
                <option value="2025/2026">2029/2030</option>
                <option value="2025/2026">2030/2031</option>
                <option value="2025/2026">2031/2032</option>
                <option value="2025/2026">2032/2033</option>
                <option value="2025/2026">2033/2034</option>
                <option value="2025/2026">2034/2035</option>
              </select>
            </div>

            {/* Amount Fee Entry Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Amount Required (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₦</span>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Warning Framework Callout */}
            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Once initialized, this billing request will immediately go live on all target student dashboard terminals.
              </p>
            </div>

            {/* Modal Controls Actions Line */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-md transition"
              >
                Publish Payment
              </button>
            </div>
          </form>
        </ModalShell>

      </div>
    </AdminLayoutContainer>
  );
}