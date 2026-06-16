"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, SlidersHorizontal, ShieldCheck, AlertCircle, Edit2, Trash2 } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { ModalShell } from "@/components/admin/ModalShell";
import { ToastNotification } from "@/components/admin/ToastNotification";

// Modular Imported Layer Context Components
import { EditDepartmentModal } from "@/components/admin/EditDepartmentModal";
import { DeleteDepartmentModal } from "@/components/admin/DeleteDepartmentModal";

// Reusable atomic workflow component layers
import { Button } from "@/components/admin/Button";
import { IconButton } from "@/components/admin/IconButton";
import { SearchInput } from "@/components/admin/SearchInput";

interface CreatedDepartmentItem {
  id: string;
  code: string;
  title: string;
  faculty: string;
}

type DepartmentApiResponse = {
  departments: CreatedDepartmentItem[];
};

export default function CreateDepartmentPage() {
  const [departmentRecords, setDepartmentRecords] = useState<CreatedDepartmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);

  // Create Modal Interactivity States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", code: "", faculty: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Edit Modular Interactivity Pipeline States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<CreatedDepartmentItem | null>(null);

  // Delete Modular Interactivity Pipeline States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<CreatedDepartmentItem | null>(null);

  // Notification Toast Pipeline System 
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (message: string) => {
    setToastMsg(message);
    setIsToastOpen(true);
  };

  useEffect(() => {
    let isMounted = true;

    const loadDepartments = async () => {
      try {
        const response = await fetch("/api/admin/departments");
        const payload = (await response.json().catch(() => ({}))) as DepartmentApiResponse & { error?: string };

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load departments");
        }

        if (isMounted) {
          setDepartmentRecords(payload.departments ?? []);
        }
      } catch {
        if (isMounted) {
          triggerToast("Unable to load department records right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecords(false);
        }
      }
    };

    void loadDepartments();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRecords = departmentRecords.filter((rec) =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form Creation Core Handlers
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.code || !formData.faculty) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to create department");
      }

      const createdDepartment = payload.department as CreatedDepartmentItem | undefined;
      if (createdDepartment) {
        setDepartmentRecords((prev) => {
          const next = prev.filter((item) => item.id !== createdDepartment.id);
          return [createdDepartment, ...next];
        });
      }

      setIsModalOpen(false);
      triggerToast(payload?.message || `Department of "${formData.title}" has been successfully initialized.`);
      setFormData({ title: "", code: "", faculty: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create department";
      triggerToast(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Dedicated Pipeline Save Callback Function Engine 
  const handleSaveEdit = (updatedDept: CreatedDepartmentItem) => {
    setDepartmentRecords(prev => prev.map(item => item.id === updatedDept.id ? updatedDept : item));
    setIsEditOpen(false);
    setSelectedDept(null);
    triggerToast(`Changes to "${updatedDept.title}" saved successfully.`);
  };

  // Dedicated Pipeline Delete Callback Function Engine
  const handleConfirmDelete = async () => {
    if (!deptToDelete) return;

    try {
      const response = await fetch(`/api/admin/departments/${deptToDelete.id}`, {
        method: "DELETE",
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to delete department");
      }

      setDepartmentRecords(prev => prev.filter(item => item.id !== deptToDelete.id));
      setIsDeleteOpen(false);
      triggerToast(`Department profile record entry for "${deptToDelete.title}" was permanently removed.`);
      setDeptToDelete(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete department";
      triggerToast(message);
    }
  };

  return (
    <AdminLayoutContainer activeSegment="Departments">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        
        {/* --- Top Dashboard Context Header Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 select-none">
          <div className="space-y-1">
            <h1 className="text-[15px] font-bold text-slate-900 md:text-xl">
              Departmental Management
            </h1>
            <p className="text-xs font-semibold text-slate-400">
              Configure academic branches, assign registration tracking rules, and review faculty structural footprints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              icon={PlusCircle} 
              variant="default" 
              onClick={() => setIsModalOpen(true)}
            >
              Add Department
            </Button>
          </div>
        </div>

        {/* --- List Section Utilities Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">
              Configured Active Academic Faculties
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchInput 
              placeholder="Search departments, faculties or codes..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />

            <button
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shrink-0"
            >
              <span>Sort</span>
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
                  <th className="py-3.5 px-5">Code</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5">Faculty</th> {/* Added Faculty column */}
                  <th className="py-3.5 px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[14px] font-semibold text-slate-700">
                {isLoadingRecords ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 font-medium text-slate-400">
                      Loading departmental records...
                    </td>
                  </tr>
                ) : filteredRecords.length > 0 ? (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="py-4 px-5 font-bold text-slate-900 tracking-wide">
                        {index + 1}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 text-[11px] font-extrabold tracking-wider bg-slate-100 text-slate-800 rounded-lg uppercase">
                          {item.code}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-800 max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        {item.faculty} {/* Rendered Faculty item dynamically */}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <IconButton
                            icon={Edit2}
                            variant="default"
                            title="Edit Layout Structures"
                            onClick={() => { setSelectedDept(item); setIsEditOpen(true); }}
                          />
                          <IconButton
                            icon={Trash2}
                            variant="rose"
                            title="Decommission Department"
                            onClick={() => { setDeptToDelete(item); setIsDeleteOpen(true); }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 font-medium text-slate-400">
                      No matching departmental records located.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/30 select-none flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <div>
              Total Tracked Classes: <span className="text-slate-700">{filteredRecords.length}</span>
            </div>
            <div className="text-slate-400/80">
              Administrative Status: <span className="text-emerald-700 font-bold uppercase tracking-wider">Sync Active</span>
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

        {/* --- Primary Base Core Add Form Sheet --- */}
        <ModalShell 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Initialize New Department" 
          icon={ShieldCheck}
        >
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Dept Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., CMP"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-300 focus:bg-white transition uppercase"
                />
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Full Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Computer Science"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-300 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Replaced Session Configuration layout block with Faculty field configuration */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Faculty
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Faculty of Natural Sciences"
                value={formData.faculty}
                onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-300 focus:bg-white transition"
              />
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <AlertCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Adding this structural unit enables deployment of localized payment bills, dues allocations, and custom matriculation code processing schemas.
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
                disabled={isSaving}
              >
                {isSaving ? "Publishing..." : "Publish Department"}
              </Button>
            </div>
          </form>
        </ModalShell>

        {/* --- Reusable Isolated Imported Overlay Target Sub-Components --- */}
        <EditDepartmentModal 
          isOpen={isEditOpen} 
          onClose={() => { setIsEditOpen(false); setSelectedDept(null); }} 
          onSave={handleSaveEdit} 
          initialData={selectedDept} 
        />
        
        <DeleteDepartmentModal 
          isOpen={isDeleteOpen} 
          onClose={() => { setIsDeleteOpen(false); setDeptToDelete(null); }} 
          onConfirm={handleConfirmDelete} 
          targetDept={deptToDelete} 
        />

      </div>
    </AdminLayoutContainer>
  );
}
