"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, SlidersHorizontal, Wallet, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { ModalShell } from "@/components/admin/ModalShell";
import { ToastNotification, type ToastType } from "@/components/admin/ToastNotification";
import { EditPaymentModal } from "@/components/admin/EditPaymentModal";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";

// Import your reusable atomic global UI library components
import { Button } from "@/components/admin/Button";
import { IconButton } from "@/components/admin/IconButton";
import { SearchInput } from "@/components/admin/SearchInput";
import { toAdminPaymentRow } from "@/src/lib/payment-items";

interface CreatedPaymentItem {
  id: string;
  title: string;
  amount: string;
  action: string;
}

type PaymentApiRecord = {
  id: string;
  title: string;
  amount: number;
};

export default function CreatePaymentPage() {
  const [paymentRecords, setPaymentRecords] = useState<CreatedPaymentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Reusable Overlay UI Interaction States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  // Context Reference Track States for Modal Target Assignments
  const [selectedPayment, setSelectedPayment] = useState<CreatedPaymentItem | null>(null);

  // Modal Configuration Form Local State Fields
  const [formData, setFormData] = useState({ title: "", amount: "" });

  const showToast = (message: string, type: ToastType = "success") => {
    setToastMsg(message);
    setToastType(type);
    setIsToastOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const loadPayments = async () => {
      try {
        const res = await fetch("/api/admin/payments", {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Unable to load payment configurations");
        }

        const records = (data.payments ?? []).map((payment: PaymentApiRecord) =>
          toAdminPaymentRow({
            id: payment.id,
            name: payment.title,
            amount: payment.amount,
          })
        );

        if (!isMounted) return;
        setPaymentRecords(records);
      } catch (error) {
        if (!isMounted) return;
        showToast(
          error instanceof Error ? error.message : "Unable to load payment configurations",
          "error"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRecords = paymentRecords.filter((rec) =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.amount.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form Submission Execution Logic Pipeline (Creation Mode)
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    const parsedNum = parseFloat(formData.amount.replace(/,/g, ""));
    if (isNaN(parsedNum)) return;

    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          amount: parsedNum,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.payment) {
        throw new Error(data.error ?? "Unable to create payment configuration");
      }

      const createdRecord = toAdminPaymentRow({
        id: data.payment.id,
        name: data.payment.title,
        amount: data.payment.amount,
      });

      setPaymentRecords((prevRecords) => [
        createdRecord,
        ...prevRecords.filter((record) => record.id !== createdRecord.id),
      ]);
      setIsModalOpen(false);
      setFormData({ title: "", amount: "" });
      showToast(`"${formData.title.trim()}" has been successfully configured and activated.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to create payment configuration",
        "error"
      );
    }
  };

  // Execution Pipeline for Handling Updates from the Edit Modal
  const handleUpdatePayment = async (updatedPayment: CreatedPaymentItem) => {
    const parsedNum = parseFloat(updatedPayment.amount.replace(/[^\d.]/g, ""));
    if (isNaN(parsedNum)) {
      showToast("Please enter a valid amount", "error");
      return;
    }

    try {
      const res = await fetch(`/api/admin/payments/${updatedPayment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedPayment.title.trim(),
          amount: parsedNum,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.payment) {
        throw new Error(data.error ?? "Unable to update payment configuration");
      }

      const nextRecord = toAdminPaymentRow({
        id: data.payment.id,
        name: data.payment.title,
        amount: data.payment.amount,
      });

      setPaymentRecords((prevRecords) =>
        prevRecords.map((item) => (item.id === nextRecord.id ? nextRecord : item))
      );
      setIsEditModalOpen(false);
      setSelectedPayment(null);
      showToast(`Configuration for "${nextRecord.title}" has been updated successfully.`, "success");
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to update payment configuration",
        "error"
      );
    }
  };

  // Execution Pipeline for Handling Confirmed Removals
  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    try {
      const res = await fetch(`/api/admin/payments/${selectedPayment.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to delete payment configuration");
      }

      setPaymentRecords((prevRecords) =>
        prevRecords.filter((item) => item.id !== selectedPayment.id)
      );
      setIsDeleteModalOpen(false);
      showToast(`"${selectedPayment.title}" has been permanently removed.`, "success");
      setSelectedPayment(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Unable to delete payment configuration",
        "error"
      );
    }
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
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px] font-semibold text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 font-medium text-slate-400">
                      Loading payment configurations...
                    </td>
                  </tr>
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="py-4 px-5 font-bold text-slate-900 tracking-wide">
                        {index + 1}
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-800 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-4 px-5 font-extrabold text-emerald-800 text-[13px]">
                        {item.amount}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
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
                    <td colSpan={4} className="text-center py-12 font-medium text-slate-400">
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
          type={toastType}
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
                placeholder="e.g., Second Semester Tuition"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
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
                  step="0.01"
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
              <Button
                variant="white"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
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
