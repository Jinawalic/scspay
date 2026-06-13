"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Camera,
  LogOut
} from "lucide-react";
import { studentProfile } from "@/src/data/mock";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();

  // Password Input States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar />

      <div className="lg:ml-64">
        {/* Core Layout Structure Wrapper */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-2 pb-24 lg:pb-8">
          
          {/* Top Title/Navigation Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition md:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile-Only Logout Button (Replaced View Activity slot on mobile, hidden on desktop) */}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition text-xs font-bold md:hidden"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* PROFILE AVATAR BLOCK CARD                  */}
          {/* ========================================== */}
          <Card className="w-full rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-white transition">
            <div className="relative group cursor-pointer">
              <Avatar className="h-15 w-15 bg-[#EAF5F0] text-[#135A3D] overflow-hidden">
                <User className="h-10 w-10 stroke-[1.5]" />
              </Avatar>
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-[#135A3D] rounded-full border-2 border-white flex items-center justify-center text-white">
                <Camera className="h-3 w-3" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {studentProfile.fullName || "Natashia Khaleira"}
              </h2>
              <Badge className="text-xs font-bold text-[#135A3D] uppercase tracking-wider bg-[#EAF5F0] inline-block px-2.5 py-0.5 rounded-md">
                {studentProfile.role || "Student"}
              </Badge>
            </div>
          </Card>

          {/* ========================================== */}
          {/* PERSONAL INFORMATION CARD BLOCK            */}
          {/* ========================================== */}
          <Card className="w-full rounded-xl border border-slate-200 p-6 space-y-2 hover:bg-white transition">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase tracking-wider">
                Personal Information
              </h3>
              <Button variant="secondary" className="text-xs font-bold text-[#135A3D] bg-[#EAF5F0] px-3 py-1.5 rounded-xl transition">
                Enable Editing
              </Button>
            </div>

            {/* Responsive Balanced Grid Data Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Matriculation Number
                </span>
                <div className="text-sm font-bold text-slate-800 break-words">
                  {studentProfile.matricNumber || "NCS/2022/0048"}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Department
                </span>
                <div className="text-sm font-bold text-slate-800 break-words">
                  {studentProfile.department || "Computer Science"}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Registered Email Address
                </span>
                <div className="text-sm font-bold text-slate-800 break-words flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {studentProfile.email || "info@binary-fusion.com"}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Phone Number
                </span>
                <div className="text-sm font-bold text-slate-800 break-words flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {studentProfile.phone ? `+234 ${studentProfile.phone}` : "(+234) 812-554-5846"}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Current Session Role
                </span>
                <div className="text-sm font-bold text-slate-800 break-words flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  Student Member
                </div>
              </div>
            </div>
          </Card>

          {/* ========================================== */}
          {/* PASSWORD UPDATE INTERACTIVE SECTION        */}
          {/* ========================================== */}
          <Card className="w-full rounded-xl border border-slate-200 p-6 space-y-2 hover:bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase tracking-wider">
                Security & Credentials
              </h3>
              <Button className="text-xs font-bold text-white bg-[#135A3D] hover:bg-[#0e442e] px-4 py-1.5 rounded-xl transition">
                Save Changes
              </Button>
            </div>

            {/* Inputs responsive stack to full wide dynamic row layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              
              {/* Current Password Field */}
              <div className="space-y-1.5 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Current Password
                </label>
                <div className="relative w-full">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 outline-none placeholder:text-slate-300 focus:bg-white focus:border-slate-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  New Password
                </label>
                <div className="relative w-full">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 outline-none placeholder:text-slate-300 focus:bg-white focus:border-slate-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5 w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-10 outline-none placeholder:text-slate-300 focus:bg-white focus:border-slate-300 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

            </div>
          </Card>

        </div>
      </div>

      <MobileBottomNav />
    </main>
  );
}