"use client";

import React, { useState } from "react";
import { PlusCircle, SlidersHorizontal, Wallet, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { ModalShell } from "@/components/admin/ModalShell";
import { ToastNotification } from "@/components/admin/ToastNotification";
import { EditPaymentModal } from "@/components/admin/EditPaymentModal";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

// Import your reusable atomic components
import { Button } from "@/components/admin/Button";
import { IconButton } from "@/components/admin/IconButton";
import { SearchInput } from "@/components/admin/SearchInput";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Context Reference Track States for Modal Target Assignments
  const [selectedPayment, setSelectedPayment] = useState<CreatedPaymentItem | null>(null);

  // Modal Configuration Form Local State Fields
  const [formData, setFormData] = useState({ title: "", amount: "", session: "2026/2027" });

  const filteredRecords = paymentRecords.filter((rec) =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form Submission Execution Logic Pipeline (Creation Mode)
  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

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
    
    setToastMsg(`"${formData.title}" has been successfully configured and activated.`);
    setIsToastOpen(true);
    
    setFormData({ title: "", amount: "", session: "2026/2027" });
  };

  // Execution Pipeline for Handling Updates from the Edit Modal
  const handleUpdatePayment = (updatedPayment: CreatedPaymentItem) => {
    setPaymentRecords((prevRecords) =>
      prevRecords.map((item) => (item.id === updatedPayment.id ? updatedPayment : item))
    );
    setIsEditModalOpen(false);
    setSelectedPayment(null);

    setToastMsg(`Configuration for "${updatedPayment.title}" has been updated successfully.`);
    setIsToastOpen(true);
  };

  // Execution Pipeline for Handling Confirmed Removals
  const handleDeletePayment = () => {
    if (!selectedPayment) return;

    setPaymentRecords((prevRecords) =>
      prevRecords.filter((item) => item.id !== selectedPayment.id)
    );
    setIsDeleteModalOpen(false);

    setToastMsg(`"${selectedPayment.title}" has been permanently removed.`);
    setIsToastOpen(true);
    setSelectedPayment(null);
  };

  // Helper functions to initialize row overlay actions
  const triggerEditFlow = (payment: CreatedPaymentItem) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  const triggerDeleteFlow = (payment: CreatedPaymentItem) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
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

          <div className="flex items-center gap-3">
            {/* Reusable primary button for core workspace actions */}
            <Button 
              icon={PlusCircle} 
              variant="default" 
              onClick={() => setIsModalOpen(true)}
            >
              Create New Payment
            </Button>
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
            {/* Swapped with the reusable custom search framework */}
            <SearchInput 
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
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
                          {/* Reusable variant matching operational themes perfectly */}
                          <IconButton
                            icon={Edit2}
                            variant="default"
                            title="Edit Configuration"
                            onClick={() => triggerEditFlow(item)}
                          />
                          <IconButton
                            icon={Trash2}
                            variant="rose"
                            title="Delete Configuration"
                            onClick={() => triggerDeleteFlow(item)}
                          />
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

          <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/30 select-none flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div>
              Showing <span className="text-slate-700">{filteredRecords.length}</span> items total
            </div>
            <div className="text-slate-400/80">
              System Active Base Currency: <span className="text-slate-600 font-bold">NGN (₦)</span>
            </div>
          </div>
        </div>

        {/* --- Global Standalone Toast Notification --- */}
        <ToastNotification 
          message={toastMsg} 
          isOpen={isToastOpen} 
          onClose={() => setIsToastOpen(false)} 
          type="success"
        />

        {/* --- Decoupled Modal Shell Mount for Fee Additions --- */}
        <ModalShell 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Configure Fee Target" 
          icon={Wallet}
        >
          <form onSubmit={handleCreatePayment} className="space-y-4">
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Academic Session
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 2026/2027"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
              />
            </div>

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

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Once initialized, this billing request will immediately go live on all target student dashboard terminals.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {/* Atomic cancel option layout button */}
              <Button 
                variant="white" 
                type="button" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              {/* Atomic structural form publish trigger */}
              <Button 
                variant="default" 
                type="submit"
              >
                Publish Payment
              </Button>
            </div>
          </form>
        </ModalShell>

        {/* --- Decoupled Modular Edit Modal Context Wireframe --- */}
        <EditPaymentModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onUpdate={handleUpdatePayment}
        />

        {/* --- Reusable Global Standalone Deletion Warning Overlay --- */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPayment(null);
          }}
          onConfirm={handleDeletePayment}
          itemName={selectedPayment?.title || ""}
        />

      </div>
    </AdminLayoutContainer>
  );
}