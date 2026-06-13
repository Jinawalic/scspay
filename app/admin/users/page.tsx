"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  Trash2, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";

// Types matching the data columns
interface UserData {
  id: number;
  role: string;
  fullName: string;
  matricNumber: string;
  department: string;
  phone: string;
  dateCreated: string;
}

// Mock Data
const mockUsers: UserData[] = [
  { id: 1, role: "Super Admin", fullName: "John Doe", matricNumber: "MAT001", department: "Administration", phone: "0813-2222-8899", dateCreated: "27 Mar 2024 18:45" },

  { id: 2, role: "Engineering", fullName: "Abizar Alghifary", matricNumber: "MAT002", department: "Engineering", phone: "0813-4729-1056", dateCreated: "26 Mar 2024 14:22" },
  { id: 3, role: "Housekeeping", fullName: "Raffi Ahmad", matricNumber: "MAT003", department: "Housekeeping", phone: "0821-0394-7682", dateCreated: "25 Mar 2024 09:57" },
  { id: 4, role: "Receptionist", fullName: "Putri Amaliah", matricNumber: "MAT004", department: "Reception", phone: "0812-5583-9217", dateCreated: "24 Mar 2024 20:10" },
  { id: 5, role: "Purchasing", fullName: "Shepherd Edward", matricNumber: "MAT005", department: "Purchasing", phone: "0852-7741-3320", dateCreated: "23 Mar 2024 16:33" },
  { id: 6, role: "Accounting", fullName: "Ezel Sudarso", matricNumber: "MAT006", department: "Accounting", phone: "0813-6902-4815", dateCreated: "22 Mar 2024 11:48" },
  { id: 7, role: "Marketing", fullName: "Edward Newgate", matricNumber: "MAT007", department: "Marketing", phone: "0821-8173-0469", dateCreated: "21 Mar 2024 08:15" }
];

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Filtering & Searching Logic
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.matricNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch
  });

  // 2. Pagination Calculations
  const totalData = filteredUsers.length;
  const totalPages = Math.ceil(totalData / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Column headers with sort arrows
  const columns = [
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
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition active:scale-95">
            <Download className="h-4 w-4 text-slate-400 stroke-[2.5]" />
            Export data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl hover:bg-emerald-800 transition active:scale-95">
            <Plus className="h-4 w-4 text-white stroke-[2.5]" />
            Add New User
          </button>
        </div>
      </div>

      {/* 2. Clean Embedded White Panel Card Container */}
      <div className="w-full bg-white rounded-sm flex-1 flex flex-col space-y-3">
        
        {/* Toolbar: Dynamic Filters and Input Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between select-none">
          {/* Status Dropdown Filter */}
          <div className="relative w-full sm:w-48">
            <button className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 hover:bg-slate-100/70 transition">
              <span>{statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 stroke-[2.5]" />
            </button>
          </div>

          {/* Right Align Toolbar: Search and Table Contextual Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search Username, Name, Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none placeholder-slate-400 focus:border-slate-300 focus:bg-white transition-colors"
              />
            </div>
            {/* Contextual More Actions Dropdown */}
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-slate-700 transition active:scale-95">
              <MoreVertical className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 3. The Grand Data Matrix Frame component */}
        <div className="w-full overflow-hidden border border-slate-100 rounded-xl bg-white flex-1">
          <div className="w-full overflow-x-auto h-full">
            <table className="w-full text-left border-collapse h-full">
              {/* Dynamic Header Structure */}
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider select-none">
                  {columns.map((col, idx) => (
                    <th key={col.label} className={`py-4 px-4 ${idx === 0 ? "pl-6" : ""}`}>
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-600 transition group">
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
              
              {/* Conditional Table Body */}
              <tbody className="divide-y divide-slate-100/60 text-[14px] font-medium text-slate-700 h-full">
                {displayedUsers.length > 0 ? (
                  displayedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3.5 px-4 font-bold text-slate-900 truncate max-w-[150px]">{user.fullName}</td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">{user.matricNumber}</td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">{user.department}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono tracking-tight">{user.phone}</td>
                      <td className="py-3.5 px-4 text-center pr-6">
                        <div className="flex items-center gap-2 justify-center">
                          <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition active:scale-95">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-400 hover:text-[#135A3D] hover:border-emerald-200 hover:bg-emerald-50 transition active:scale-95">
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-100 bg-white text-rose-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition active:scale-95">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
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
            {/* Prev */}
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 transition disabled:opacity-40 disabled:hover:bg-white flex items-center gap-1.5 active:scale-95"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            
            {/* Page numbers */}
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

            {/* Next */}
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
    </AdminLayoutContainer>
  );
}