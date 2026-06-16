import { UserCircle } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

interface DashboardHeaderProps {
  studentName?: string;
  studentId: string;
  studentAvatar?: string | null;
  createdAt: string;
  successfulPayments: {
    id: string;
    amount: number;
    feeName: string;
    date: string;
    receipt: string;
  }[];
}

export function DashboardHeader({
  studentName = "Student",
  studentId,
  studentAvatar,
  createdAt,
  successfulPayments,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      {/* User Avatar and Greeting */}
      <div className="flex items-center gap-4">
        {studentAvatar ? (
          <img
            src={studentAvatar}
            alt={studentName}
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
        ) : (
          <UserCircle className="h-8 w-8 text-[#135A3D]" />
        )}
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Hi, {studentName}
          </h1>
        </div>
      </div>

      {/* Dynamic Notification Bell Component */}
      <NotificationBell
        studentId={studentId}
        createdAt={createdAt}
        successfulPayments={successfulPayments}
      />
    </div>
  );
}

