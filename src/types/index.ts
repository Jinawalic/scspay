export type PaymentCategory = {
  id: string;
  name: string;
  description: string;
  amount: number;
  color: string;
};

export type Transaction = {
  id: string;
  receipt: string;
  type: string;
  amount: number;
  date: string;
  status: "Successful" | "Pending" | "Failed";
  session: string;
  description?: string;
};

export type StudentProfile = {
  role: string;
  fullName: string;
  email: string;
  matricNumber: string;
  faculty: string;
  department: string;
  level: string;
  phone: string;
  completed: boolean;
};

export type StudentSessionProfile = {
  id: string;
  kind: "STUDENT";
  role: string;
  fullName: string;
  email: string | null;
  matricNumber: string | null;
  faculty: string | null;
  department: string | null;
  level: string | null;
  phone: string | null;
  completed: boolean;
};
