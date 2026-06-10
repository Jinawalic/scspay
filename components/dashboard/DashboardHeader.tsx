import { Bell } from "lucide-react";
import { studentProfile } from "@/src/data/mock";

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      {/* User Avatar and Greeting */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-lg shadow-lg">
          {studentProfile.fullName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Welcome back</p>
          <h1 className="text-xl font-semibold text-slate-900">
            Hi, {studentProfile.fullName}
          </h1>
        </div>
      </div>

      {/* Notification Button */}
      <button className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
        <Bell className="h-5 w-5 text-slate-600" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </div>
  );
}
