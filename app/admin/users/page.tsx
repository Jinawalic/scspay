"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmationModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { ToastNotification, ToastType } from "@/components/admin/ToastNotification";

// Import your newly created atomic reusable components here
import { SearchInput } from "@/components/admin/SearchInput";
import { IconButton } from "@/components/admin/IconButton";
import { Button } from "@/components/admin/Button";

interface UserData {
  id: number;
  role: string;
  fullName: string;
  matricNumber: string;
  department: string;
  phone: string;
  dateCreated: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load users from API
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/students", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load users");
        if (isMounted) setUsers(data.students ?? []);
      } catch (err) {
        if (isMounted) setLoadError(err instanceof Error ? err.message : "Unable to load users");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => { isMounted = false; };
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserForDelete, setSelectedUserForDelete] = useState<UserData | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserData | null>(null);

  // Reusable System Toast state structure maps directly here
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const filteredUsers = users.filter(user => {
    return (
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalData = filteredUsers.length;
  const totalPages = Math.ceil(totalData / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const triggerDeleteFlow = (user: UserData) => {
    setSelectedUserForDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUserForDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUserForDelete.id));
    setIsDeleteModalOpen(false);
    setSelectedUserForDelete(null);
    triggerToast("User record has been permanently deleted.", "success");

    if (displayedUsers.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const triggerEditFlow = (user: UserData) => {
    setSelectedUserForEdit(user);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedUser: UserData) => {
    setUsers((prev) => prev.map((u) => u.id === updatedUser.id ? updatedUser : u));
    setIsEditModalOpen(false);
    setSelectedUserForEdit(null);
    triggerToast(`Successfully modified record settings for ${updatedUser.fullName}`, "success");
  };

  const columns = [
    { label: "S/N", icon: false },
    { label: "Full Name", icon: true },
    { label: "Matric Num.", icon: true },
    { label: "Department", icon: true },
    { label: "Phone Number", icon: true },
  ];

  return (
    <AdminLayoutContainer activeSegment="User Management">
      
      {/* 1. Page Title and Contextual Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 select-none">
        <h1 className="text-[15px] font-bold text-slate-900">User Management</h1>
      </div>

      {/* 2. Clean Embedded White Panel Card Container */}
      <div className="w-full bg-white rounded-sm flex-1 flex flex-col space-y-3">
        
        {/* Toolbar: Dynamic Filters and Input Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between select-none">

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Reusable Context-aware search framework container */}
            <SearchInput 
              placeholder="Search Username, Name, Email"
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
            />
            
            <div className="flex items-center gap-3 ml-80">
                {/* Using reusable global structured button elements here */}
                <Button icon={Download} variant="white">Export data</Button>
                <Button icon={Plus} variant="emerald">Add New User</Button>
            </div>
          </div>
        </div>

        {/* 3. The Grand Data Matrix Frame component */}
        <div className="w-full overflow-hidden border border-slate-100 rounded-xl bg-white flex-1">
          <div className="w-full overflow-x-auto h-full">
            <table className="w-full text-left border-collapse h-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  {columns.map((col, idx) => (
                    <th key={col.label} className={`py-4 px-4 ${idx === 0 ? "pl-6 w-16" : ""}`}>
                      <div className={`flex items-center gap-1.5 transition group ${col.icon ? "cursor-pointer hover:text-slate-600" : ""}`}>
                        {col.label}
                        {col.icon && (
                          <div className="flex flex-col -space-y-0.5 opacity-60 group-hover:opacity-100">
                            <ChevronUp className="h-2 w-2 stroke-[3]" />
                            <ChevronDown className="h-2 w-2 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="py-4 px-4 text-center w-28 pr-6">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100/60 text-[14px] font-medium text-slate-700 h-full">
                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 font-semibold text-sm">
                      Loading user records...
                    </td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-12 text-center text-rose-500 font-semibold text-sm">
                      {loadError}
                    </td>
                  </tr>
                ) : displayedUsers.length > 0 ? (
                  displayedUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-4 font-bold text-slate-400 pl-6">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 truncate max-w-[150px]">
                        {user.fullName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">
                        {user.matricNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">
                        {user.department}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono tracking-tight">
                        {user.phone}
                      </td>
                      <td className="py-3.5 px-4 text-center pr-6">
                        <div className="flex items-center gap-2 justify-center">
                          {/* Called the clean structured custom components directly for safety */}
                          <IconButton 
                            icon={Edit2} 
                            variant="emerald"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerEditFlow(user);
                            }}
                          />
                          <IconButton 
                            icon={Trash2} 
                            variant="rose"
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerDeleteFlow(user);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400 font-semibold text-sm">
                      No user records matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Balanced Grid Pagination Footer Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 pt-4 mt-2 px-2 select-none">
          <div className="text-xs font-semibold text-slate-400">
            Showing <span className="text-slate-700">{totalData === 0 ? 0 : startIndex + 1}</span> to{" "}
            <span className="text-slate-700">
              {Math.min(startIndex + itemsPerPage, totalData)}
            </span>{" "}
            of <span className="text-slate-700">{totalData}</span> entries
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1.5 active:scale-95"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  page === currentPage
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1.5 active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        onSave={handleSaveEdit}
        initialData={selectedUserForEdit}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUserForDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={selectedUserForDelete ? `${selectedUserForDelete.fullName} (${selectedUserForDelete.matricNumber})` : ""}
      />

      {/* Render the actual reusable component here safely */}
      <ToastNotification 
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </AdminLayoutContainer>
  );
}