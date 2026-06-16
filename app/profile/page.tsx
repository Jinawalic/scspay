"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Camera,
  LogOut,
} from "lucide-react";

import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ToastNotification } from "@/components/admin/ToastNotification";
import type { StudentSessionProfile } from "@/src/types";

const emptyProfile: StudentSessionProfile = {
  id: "",
  kind: "STUDENT",
  role: "Student",
  fullName: "",
  email: null,
  matricNumber: null,
  faculty: null,
  department: null,
  level: null,
  phone: null,
  completed: false,
  avatar: null,
};

export default function ProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentSessionProfile>(emptyProfile);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Profile fields state
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [updatedAvatar, setUpdatedAvatar] = useState<string | null>(null);

  // Password Input States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility Toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ isOpen: true, message, type });
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/students/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      router.push("/");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("Image size must be less than 2MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarPreview(base64);
        setUpdatedAvatar(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    // Password change validation if password fields are filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        triggerToast("Please enter your current password to save credentials changes.", "error");
        return;
      }
      if (newPassword !== confirmPassword) {
        triggerToast("New password and confirm password do not match.", "error");
        return;
      }
      if (newPassword.length < 6) {
        triggerToast("New password must be at least 6 characters.", "error");
        return;
      }
    }

    try {
      const response = await fetch("/api/students/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput,
          phone: phoneInput,
          ...(updatedAvatar ? { avatar: updatedAvatar } : {}),
          ...(currentPassword && newPassword ? { currentPassword, newPassword } : {}),
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save your profile changes");
      }

      if (payload.student) {
        const s = payload.student as StudentSessionProfile;
        setStudent(s);
        setEmailInput(s.email || "");
        setPhoneInput(s.phone || "");
        setAvatarPreview(s.avatar || null);
        setUpdatedAvatar(null);
      }

      // Reset security fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditing(false);

      triggerToast("Profile updated successfully!", "success");
      router.refresh();
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : "Failed to update profile", "error");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadStudent = async () => {
      try {
        const response = await fetch("/api/students/me");

        if (response.status === 401) {
          router.replace("/");
          return;
        }

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load your profile");
        }

        if (isMounted && payload.student) {
          const s = payload.student as StudentSessionProfile;
          setStudent(s);
          setEmailInput(s.email || "");
          setPhoneInput(s.phone || "");
          setAvatarPreview(s.avatar || null);
        }
      } catch {
        if (isMounted) {
          setStudent(emptyProfile);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    void loadStudent();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <DesktopSidebar />

      <div className="lg:ml-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto space-y-6 pb-24 lg:pb-8">
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
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 px-3 items-center justify-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition text-xs font-bold md:hidden"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>

          <Card className="w-full rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-white transition">
            {/* Clickable Avatar Container for uploading */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
              title="Click to upload picture"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Avatar className="h-16 w-16 bg-[#EAF5F0] text-[#135A3D] overflow-hidden rounded-full flex items-center justify-center border border-slate-200">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={student.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 stroke-[1.5]" />
                )}
              </Avatar>
              <div className="absolute bottom-0 right-0 h-6 w-6 bg-[#135A3D] rounded-full border-2 border-white flex items-center justify-center text-white shadow hover:bg-[#0e442e] transition-colors">
                <Camera className="h-3 w-3" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {isLoadingProfile ? "Loading profile..." : student.fullName || "Student"}
              </h2>
              <Badge className="text-xs font-bold text-[#135A3D] uppercase tracking-wider bg-[#EAF5F0] inline-block px-2.5 py-0.5 rounded-md">
                {student.role || "Student"}
              </Badge>
            </div>
          </Card>

          <Card className="w-full rounded-xl border border-slate-200 p-6 space-y-4 hover:bg-white transition">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase tracking-wider">
                Personal Information
              </h3>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-[#135A3D] bg-[#EAF5F0] px-3 py-1.5 rounded-xl transition hover:bg-[#d5ebe0]"
              >
                {isEditing ? "Cancel Editing" : "Enable Editing"}
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Matriculation Number
                </span>
                <div className="text-sm font-bold text-slate-800 break-words">
                  {student.matricNumber || "Matric number not set"}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Department
                </span>
                <div className="text-sm font-bold text-slate-800 break-words">
                  {student.department || "Department not set"}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Registered Email Address
                </span>
                {isEditing ? (
                  <Input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:border-slate-300"
                  />
                ) : (
                  <div className="text-sm font-bold text-slate-800 break-words flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {student.email || "Email not set"}
                  </div>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Phone Number
                </span>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:bg-white focus:border-slate-300"
                  />
                ) : (
                  <div className="text-sm font-bold text-slate-800 break-words flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {student.phone || "Phone not set"}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="w-full rounded-xl border border-slate-200 p-6 space-y-4 hover:bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight uppercase tracking-wider">
                Security & Credentials
              </h3>
              <Button 
                onClick={handleSaveChanges}
                className="text-xs font-bold text-white bg-[#135A3D] hover:bg-[#0e442e] px-4 py-1.5 rounded-xl transition"
              >
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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

      <ToastNotification
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
}
