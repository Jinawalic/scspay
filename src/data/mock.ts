import type { PaymentCategory, Transaction, StudentProfile } from "@/src/types";

export const faculties = [
  {
    id: "natural-and-applied-sciences",
    name: "Natural And Applied Sciences",
    departments: [
      "Computer Science",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Microbiology",
    ],
  },
  {
    id: "social-and-management-sciences",
    name: "Social And Management Sciences",
    departments: [
      "Economics",
      "Accounting",
      "Business Administration",
      "Political Science",
      "Sociology",
      "Psychology",
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    departments: [
      "Civil Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Chemical Engineering",
      "Computer Engineering",
    ],
  },
  {
    id: "environmental-sciences",
    name: "Environmental Sciences",
    departments: [
      "Architecture",
      "Urban And Regional Planning",
      "Estate Management",
      "Surveying And Geoinformatics",
    ],
  },
  {
    id: "law",
    name: "Law",
    departments: [
      "Common Law",
      "Islamic Law",
      "International Law",
    ],
  },
  {
    id: "arts",
    name: "Arts",
    departments: [
      "English Language",
      "History And International Studies",
      "Philosophy",
      "Religious Studies",
      "Theatre Arts",
    ],
  },
];

export const paymentCategories: PaymentCategory[] = [
  {
    id: "course-fees",
    name: "Course Reg. Fees",
    description: "Semester tuition and academic charges.",
    amount: 220000,
    color: "from-emerald-600 to-green-400",
  }
];

export const recentTransactions: Transaction[] = [
  {
    id: "1",
    receipt: "T268989712047363",
    type: "Course Registration",
    amount: 2000,
    date: "05 JUN 2026",
    status: "Successful",
    session: "2025/2026",
    description: "NACOS Dues - 200...",
  },
  {
    id: "2",
    receipt: "T268989712047920",
    type: "T-Shirt / ID Card",
    amount: 7500,
    date: "03 JUN 2026",
    status: "Successful",
    session: "2025/2026",
    description: "T-shirt/ID card (Siz...",
  },
  {
    id: "3",
    receipt: "T268989712047329",
    type: "Hostel Fees",
    amount: 125000,
    date: "11 APR 2026",
    status: "Pending",
    session: "2025/2026",
    description: "Hostel accommodation...",
  },
  {
    id: "4",
    receipt: "T268989712047047",
    type: "School Fees",
    amount: 220000,
    date: "02 JUN 2026",
    status: "Successful",
    session: "2025/2026",
    description: "Semester tuition fees...",
  },
];

export const studentProfile: StudentProfile = {
  role: "student",
  fullName: "Jinawa Titus",
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
