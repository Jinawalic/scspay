import { StatisticsCard } from "@/components/dashboard/statistics-card";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { TransactionTable } from "@/components/dashboard/transaction-table";
import { studentProfile, dashboardStats, recentTransactions } from "@/src/data/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6 lg:px-10 xl:pl-16">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <section className="space-y-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Welcome back</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-950">Hi, {studentProfile.fullName.split(" ")[0]}</h1>
                <p className="mt-2 text-sm text-slate-500">Your student payment portal is ready. Review activity or make a payment in seconds.</p>
              </div>
              <div className="inline-flex items-center gap-4 rounded-[2rem] bg-slate-50 px-5 py-4 text-slate-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">AO</div>
                <div>
                  <p className="text-sm font-medium">{studentProfile.fullName}</p>
                  <Badge variant="success">Profile {studentProfile.completed ? "Complete" : "Pending"}</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-4">
            <StatisticsCard title="Total Payments" value={`${dashboardStats.totalPayments}`} meta="Payments completed" />
            <StatisticsCard title="Total Receipts" value={`${dashboardStats.totalReceipts}`} meta="Receipts generated" />
            <StatisticsCard title="Last Payment" value={dashboardStats.lastPaymentDate} meta="Most recent transaction" />
            <StatisticsCard title="Outstanding" value={`₦${dashboardStats.outstanding.toLocaleString()}`} meta="Current balance due" />
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">Recent Transactions</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Latest activity</h2>
                </div>
                <Button variant="secondary">View all payments</Button>
              </div>
              <div className="mt-6">
                <TransactionTable transactions={recentTransactions} />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Quick actions</p>
                <div className="mt-6 grid gap-3">
                  <Button className="w-full">Make Payment</Button>
                  <Button variant="secondary" className="w-full">Payment History</Button>
                  <Button variant="secondary" className="w-full">My Receipts</Button>
                  <Button variant="secondary" className="w-full">Profile</Button>
                </div>
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Student snapshot</p>
                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">Faculty</p>
                    <p>{studentProfile.faculty}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">Department</p>
                    <p>{studentProfile.department}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">Level</p>
                    <p>{studentProfile.level}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <MobileBottomNav />
    </main>
  );
}
