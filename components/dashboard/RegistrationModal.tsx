"use client";

import { useEffect, useState } from "react";
import { X, ChevronDown, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type DepartmentRecord = {
  id: string;
  title: string;
  faculty: string;
  facultyId: string;
};

type FacultyOption = {
  id: string;
  name: string;
  departments: string[];
};

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

export function RegistrationModal({
  isOpen,
  onClose,
  onComplete,
}: RegistrationModalProps) {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isFacultyOpen, setIsFacultyOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [faculties, setFaculties] = useState<FacultyOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("registration-modal-open");
    } else {
      document.body.classList.remove("registration-modal-open");
    }

    return () => {
      document.body.classList.remove("registration-modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    const loadAcademicOptions = async () => {
      setIsLoading(true);
      setLoadError("");
      setSaveError("");

      try {
        const response = await fetch("/api/admin/departments", {
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => ({}))) as {
          departments?: DepartmentRecord[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load faculties and departments");
        }

        const grouped = new Map<string, FacultyOption>();

        (payload.departments ?? []).forEach((department) => {
          const current = grouped.get(department.facultyId) ?? {
            id: department.facultyId,
            name: department.faculty,
            departments: [],
          };

          if (!current.departments.includes(department.title)) {
            current.departments.push(department.title);
          }

          grouped.set(department.facultyId, current);
        });

        const nextFaculties = Array.from(grouped.values())
          .map((faculty) => ({
            ...faculty,
            departments: faculty.departments.sort((a, b) => a.localeCompare(b)),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        if (!isMounted) return;

        setFaculties(nextFaculties);
        setSelectedFaculty((current) =>
          nextFaculties.some((faculty) => faculty.id === current)
            ? current
            : nextFaculties[0]?.id || ""
        );
        setSelectedDepartment("");
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load academic options");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAcademicOptions();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const selectedFacultyData = faculties.find((f) => f.id === selectedFaculty);
  const availableDepartments = selectedFacultyData?.departments || [];

  const handleFacultySelect = (facultyId: string) => {
    setSelectedFaculty(facultyId);
    setSelectedDepartment("");
    setIsFacultyOpen(false);
    setIsDepartmentOpen(false);
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setIsDepartmentOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedFacultyData || !selectedDepartment) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const response = await fetch("/api/students/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty: selectedFacultyData.name,
          department: selectedDepartment,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to save your selection");
      }

      onClose();
      onComplete();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unable to save your selection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm p-0 sm:p-4"
    >
      <div className="absolute inset-0 -z-10 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl p-6 pb-10 sm:p-8 max-h-[92vh] overflow-y-auto"
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1E2E42]">
            Complete Registration
          </h2>
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            disabled={isSaving}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Please select your faculty and department to complete your registration.
        </p>

        {loadError && (
          <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
            {loadError}
          </p>
        )}

        {saveError && (
          <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
            {saveError}
          </p>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1E2E42] mb-2">
            Faculty
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFacultyOpen(!isFacultyOpen)}
              disabled={isLoading || isSaving || faculties.length === 0}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-slate-300 transition-colors disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            >
              <span className="text-sm font-medium text-[#1E2E42]">
                {isLoading ? "Loading faculties..." : selectedFacultyData?.name || "Select Faculty"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  isFacultyOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFacultyOpen && faculties.length > 0 && !isLoading && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                {faculties.map((faculty) => (
                  <button
                    type="button"
                    key={faculty.id}
                    onClick={() => handleFacultySelect(faculty.id)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-[#1E2E42]">
                      {faculty.name}
                    </span>
                    {selectedFaculty === faculty.id && (
                      <Check className="h-4 w-4 text-[#135A3D]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-[#1E2E42] mb-2">
            Department
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
              disabled={!selectedFaculty || isLoading || isSaving}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                !selectedFaculty || isLoading || isSaving
                  ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-sm font-medium">
                {isLoading
                  ? "Loading departments..."
                  : selectedDepartment || "Select Department"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDepartmentOpen ? "rotate-180" : ""
                } ${!selectedFaculty || isLoading || isSaving ? "text-slate-300" : "text-slate-400"}`}
              />
            </button>

            {isDepartmentOpen && selectedFaculty && !isLoading && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                {availableDepartments.length > 0 ? (
                  availableDepartments.map((department) => (
                    <button
                      type="button"
                      key={department}
                      onClick={() => handleDepartmentSelect(department)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-[#1E2E42]">
                        {department}
                      </span>
                      {selectedDepartment === department && (
                        <Check className="h-4 w-4 text-[#135A3D]" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-400">
                    No departments found for this faculty.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFaculty || !selectedDepartment || isLoading || isSaving}
          className="w-full rounded-full bg-[#135A3D] py-4 text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0E5C46] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Complete Registration"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
