import { Card } from "@/components/ui/card";
import { User2, Mail, Hash, Layers, Phone } from "lucide-react";

export function ProfileCard({ profile }: { profile: { fullName: string; email: string; matricNumber: string; faculty: string; department: string; level: string; phone: string } }) {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Profile Information</h2>
          <p className="mt-2 text-sm text-slate-500">Update your student profile and contact details.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Full Name</p>
          <p className="text-sm font-medium text-slate-900">{profile.fullName}</p>
        </div>
        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
          <p className="text-sm font-medium text-slate-900">{profile.email}</p>
        </div>
        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Matric Number</p>
          <p className="text-sm font-medium text-slate-900">{profile.matricNumber}</p>
        </div>
        <div className="space-y-2 rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone Number</p>
          <p className="text-sm font-medium text-slate-900">{profile.phone}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
          <Layers className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Faculty</p>
            <p className="text-sm font-medium text-slate-900">{profile.faculty}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
          <Hash className="h-5 w-5 text-slate-600" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Department</p>
            <p className="text-sm font-medium text-slate-900">{profile.department}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
          <User2 className="h-5 w-5 text-slate-600" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Level</p>
            <p className="text-sm font-medium text-slate-900">{profile.level}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
          <Phone className="h-5 w-5 text-slate-600" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Contact</p>
            <p className="text-sm font-medium text-slate-900">{profile.phone}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
