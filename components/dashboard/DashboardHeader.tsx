import { Bell, UserCircle } from "lucide-react";

export function DashboardHeader({ studentName = "Student" }: { studentName?: string }) {
  return (
    <div className="flex items-center justify-between">
      {/* User Avatar and Greeting */}
      <div className="flex items-center gap-4">
        <UserCircle className="h-8 w-8 text-[#135A3D]" />
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Hi, {studentName}
          </h1>
        </div>
      </div>

      {/* Notification Button */}
      <button className="relative flex h-11 w-11 items-center justify-center rounded-full">
        <Bell className="h-5 w-5 text-slate-600" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </div>
  );
}
