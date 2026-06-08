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
};

export type StudentProfile = {
  fullName: string;
  email: string;
  matricNumber: string;
  faculty: string;
  department: string;
  level: string;
  phone: string;
  completed: boolean;
};
