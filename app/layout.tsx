import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCSPAY | Secure Student Payment Portal",
  description: "SCSPAY student payment portal with dashboard, receipts, and payment workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#F8FAFC] text-slate-900 font-sans">{children}</body>
    </html>
  );
}
