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
    type: "NACOS Dues",
    amount: 2000,
    date: "05 JUN 2026",
    status: "Successful",
    session: "2025/2026",
    description: "NACOS Dues - 200...",
  },
  {
    id: "2",
    receipt: "SCSPAY-2026-0041",
    type: "T-Shirt / ID Card",
    amount: 7500,
    date: "03 JUN 2026",
    status: "Successful",
    session: "2025/2026",
    description: "T-shirt/ID card (Siz...",
  },
  {
    id: "3",
    receipt: "SCSPAY-2026-0039",
    type: "Hostel Fees",
    amount: 125000,
    date: "11 APR 2026",
    status: "Pending",
    session: "2025/2026",
    description: "Hostel accommodation...",
  },
  {
    id: "4",
    receipt: "SCSPAY-2026-0031",
    type: "School Fees",
    amount: 220000,
    date: "02 JUN 2026",
    status: "Successful",
    session: "2025/2026",
    description: "Semester tuition fees...",
  },
];

export const studentProfile: StudentProfile = {
  fullName: "Jinawatitus",
  email: "jinawatitus@gmail.com",
  matricNumber: "FT2002019",
  faculty: "Natural And Applied Sciences",
  department: "Computer Science",
  level: "200",
  phone: "07044470615",
  completed: false,
};

export const dashboardStats = {
  totalPayments: 13,
  totalReceipts: 12,
  lastPaymentDate: "Jun 02, 2026",
  outstanding: 75000,
};
