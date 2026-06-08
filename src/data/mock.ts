import type { PaymentCategory, Transaction, StudentProfile } from "@/src/types";

export const paymentCategories: PaymentCategory[] = [
  {
    id: "school-fees",
    name: "School Fees",
    description: "Semester tuition and academic charges.",
    amount: 220000,
    color: "from-emerald-600 to-green-400",
  },
  {
    id: "acceptance-fees",
    name: "Acceptance Fees",
    description: "One-time admission processing fee.",
    amount: 55000,
    color: "from-sky-600 to-cyan-400",
  },
  {
    id: "hostel-fees",
    name: "Hostel Fees",
    description: "Residential accommodation for the session.",
    amount: 125000,
    color: "from-violet-600 to-fuchsia-400",
  },
  {
    id: "ict-fees",
    name: "ICT Fees",
    description: "Campus internet and digital services.",
    amount: 32000,
    color: "from-orange-500 to-amber-400",
  },
  {
    id: "departmental-fees",
    name: "Departmental Fees",
    description: "Course-specific practical and lab charges.",
    amount: 42000,
    color: "from-slate-700 to-slate-500",
  },
];

export const recentTransactions: Transaction[] = [
  {
    id: "1",
    receipt: "SCSPAY-2026-0045",
    type: "School Fees",
    amount: 220000,
    date: "Jun 02, 2026",
    status: "Successful",
    session: "2025/2026",
  },
  {
    id: "2",
    receipt: "SCSPAY-2026-0041",
    type: "ICT Fees",
    amount: 32000,
    date: "May 19, 2026",
    status: "Successful",
    session: "2025/2026",
  },
  {
    id: "3",
    receipt: "SCSPAY-2026-0039",
    type: "Hostel Fees",
    amount: 125000,
    date: "Apr 11, 2026",
    status: "Pending",
    session: "2025/2026",
  },
  {
    id: "4",
    receipt: "SCSPAY-2026-0031",
    type: "Departmental Fees",
    amount: 42000,
    date: "Mar 27, 2026",
    status: "Successful",
    session: "2025/2026",
  },
];

export const studentProfile: StudentProfile = {
  fullName: "Ama Osei",
  email: "ama.osei@student.scspay.edu",
  matricNumber: "SCS/2023/079",
  faculty: "Science and Technology",
  department: "Computer Science",
  level: "200",
  phone: "+234 803 123 4567",
  completed: false,
};

export const dashboardStats = {
  totalPayments: 13,
  totalReceipts: 12,
  lastPaymentDate: "Jun 02, 2026",
  outstanding: 75000,
};
