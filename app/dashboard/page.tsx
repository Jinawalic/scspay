import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PaymentStatus } from "@/components/dashboard/PaymentStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { DesktopSidebar } from "@/components/dashboard/DesktopSidebar";
import { getCurrentStudent } from "@/src/lib/student-auth";
import prisma from "@/src/lib/prisma";

export default async function DashboardPage() {
  const student = await getCurrentStudent();

  if (!student) {
    redirect("/");
  }

  const pendingCount = await prisma.paymentTransaction.count({
    where: {
      userId: student.id,
      status: "Pending",
    },
  });

  return (
    <main className="min-h-screen bg-[#F4F6F8]">
      <DesktopSidebar />
      <div className="lg:ml-60">
        <div className="px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-2 pb-4 lg:pb-2">
            <DashboardHeader studentName={student.fullName} />
            <PaymentStatus hasPending={pendingCount > 0} />
            <QuickActions />
            <RecentTransactions />
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </main>
  );
}
