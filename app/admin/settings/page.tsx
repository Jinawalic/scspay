"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Save } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { ToastNotification, ToastType } from "@/components/admin/ToastNotification";

export default function AdminSettingsPage() {
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: ToastType }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const triggerToast = (message: string, type: ToastType = "success") => {
    setToast({ isOpen: true, message, type });
  };

  // Load current admin data
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to load admin data");
        if (isMounted && data.admin) {
          setFullName(data.admin.fullName || "");
        }
      } catch (err) {
        if (isMounted) setLoadError(err instanceof Error ? err.message : "Unable to load admin data");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();
    return () => { isMounted = false; };
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password fields if password change is attempted
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        triggerToast("Current password is required to change password", "error");
        return;
      }
      if (newPassword !== confirmPassword) {
        triggerToast("New passwords do not match", "error");
        return;
      }
      if (newPassword.length < 6) {
        triggerToast("New password must be at least 6 characters", "error");
        return;
      }
    }

    setIsSaving(true);

    try {
      const updateData: any = {};
      if (fullName) updateData.fullName = fullName;
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unable to update settings");
      }

      // Clear password fields after successful update
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      triggerToast("Settings updated successfully", "success");
    } catch (err) {
      triggerToast(err instanceof Error ? err.message : "Unable to update settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayoutContainer activeSegment="Settings">
      <div className="space-y-6 flex-1 flex flex-col justify-start">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
          <h1 className="text-[15px] font-bold text-slate-900">Account Settings</h1>
        </div>

        {isLoading ? (
          <div className="w-full py-12 text-center text-slate-400 font-semibold text-sm border border-slate-200 rounded-xl bg-white shadow-sm">
            Loading settings...
          </div>
        ) : loadError ? (
          <div className="w-full py-12 text-center text-rose-500 font-semibold text-sm border border-slate-200 rounded-xl bg-white shadow-sm">
            {loadError}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            
            {/* Profile Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <User className="h-4 w-4 text-slate-600" />
                <h2 className="text-sm font-bold text-slate-900">Profile Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Lock className="h-4 w-4 text-slate-600" />
                <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        )}
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
