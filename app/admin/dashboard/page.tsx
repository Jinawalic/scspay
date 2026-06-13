"use client";

import React from "react";
import { User, CreditCard, AlarmClock } from "lucide-react";
import { AdminLayoutContainer } from "@/components/admin/AdminLayoutContainer";
import { MetricCard } from "@/components/admin/MetricCard";
import { TransactionTable, type TransactionItem } from "@/components/admin/TransactionTable";

export default function AdminDashboardPage() {
  const metricsData = [
    { title: "All Students", value: "1,234", icon: User, isNegative: false },
    { title: "Payments Counts", value: "453", icon: CreditCard, isNegative: false },
    { title: "Current Session", value: "2026/2027", icon: AlarmClock, isNegative: false },
  ];

  const transactionData: TransactionItem[] = [
    { id: "#TRX-2389", customer: "Alex Johnson", date: "Jan 12, 2023", product: "Tshirt", amount: "$45.00", status: "Completed" },
    { id: "#TRX-2388", customer: "Sarah Miller", date: "Feb 22, 2023", product: "Covid restrictions", amount: "$99.00", status: "Completed" },
    { id: "#TRX-2387", customer: "David Chen", date: "Feb 18, 2024", product: "Feb 18, 2024", amount: "$22.99", status: "Pending" },
    { id: "#TRX-2386", customer: "Emma Wilson", date: "May 17, 2024", product: "May 17, 2024", amount: "$35.00", status: "Completed" },
    { id: "#TRX-2385", customer: "Paula Mora", date: "June 25, 2024", product: "June 25, 2024", amount: "$89.00", status: "Pending" },
  ];

  return (
    <AdminLayoutContainer activeSegment="Dashboard">
      {/* Unique Content Elements */}
      <div className="space-y-3 flex-1 flex flex-col justify-start">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Payment History
          </h2>
        </div>

        {/* Performance Metric Tracker Dynamic Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsData.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              changeText={""}
              isNegative={metric.isNegative}
            />
          ))}
        </div>

        {/* Main Operational Table View Block Section */}
        <div className="pt-4 flex-1">
          <TransactionTable transactions={transactionData} />
        </div>
      </div>
    </AdminLayoutContainer>
  );
}