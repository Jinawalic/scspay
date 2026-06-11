"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { faculties } from "@/src/data/mock";
import { motion } from "framer-motion";

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (faculty: string, department: string) => void;
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

  const selectedFacultyData = faculties.find((f) => f.id === selectedFaculty);
  const availableDepartments = selectedFacultyData?.departments || [];

  const handleFacultySelect = (facultyId: string) => {
    setSelectedFaculty(facultyId);
    setSelectedDepartment("");
    setIsFacultyOpen(false);
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    setIsDepartmentOpen(false);
  };

  const handleSubmit = () => {
    if (selectedFaculty && selectedDepartment) {
      onComplete(
        selectedFacultyData?.name || "",
        selectedDepartment
      );
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm p-0 sm:p-4"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full sm:max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2rem] shadow-2xl p-6 pb-10 sm:p-8 max-h-[92vh] overflow-y-auto"
      >
        {/* Drag Handle Indicator */}
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1E2E42]">
            Complete Registration
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-8">
          Please select your faculty and department to complete your registration.
        </p>

        {/* Faculty Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1E2E42] mb-2">
            Faculty
          </label>
          <div className="relative">
            <button
              onClick={() => setIsFacultyOpen(!isFacultyOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-slate-300 transition-colors"
            >
              <span className="text-sm font-medium text-[#1E2E42]">
                {selectedFacultyData?.name || "Select Faculty"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-400 transition-transform ${
                  isFacultyOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFacultyOpen && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                {faculties.map((faculty) => (
                  <button
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

        {/* Department Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-[#1E2E42] mb-2">
            Department
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
              disabled={!selectedFaculty}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                !selectedFaculty
                  ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-sm font-medium">
                {selectedDepartment || "Select Department"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDepartmentOpen ? "rotate-180" : ""
                } ${!selectedFaculty ? "text-slate-300" : "text-slate-400"}`}
              />
            </button>

            {isDepartmentOpen && selectedFaculty && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
                {availableDepartments.map((department) => (
                  <button
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
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFaculty || !selectedDepartment}
          className="w-full rounded-full bg-[#135A3D] py-4 text-sm font-bold text-white shadow-md shadow-emerald-950/10 hover:bg-[#0E5C46] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Complete Registration
        </button>
      </motion.div>
    </motion.div>
  );
}
