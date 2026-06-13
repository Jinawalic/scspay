"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Confetti pieces config
const confettiPieces = [
  { color: "#FF5733", top: "8%", left: "10%", rotate: 30, width: 10, height: 4 },
  { color: "#FFC300", top: "5%", left: "28%", rotate: -15, width: 8, height: 3 },
  { color: "#28B463", top: "12%", left: "48%", rotate: 45, width: 12, height: 4 },
  { color: "#1F78D1", top: "6%", left: "65%", rotate: -30, width: 9, height: 3 },
  { color: "#FF33A8", top: "14%", left: "80%", rotate: 20, width: 11, height: 4 },
  { color: "#FF5733", top: "22%", left: "5%", rotate: -45, width: 7, height: 3 },
  { color: "#FFC300", top: "28%", left: "88%", rotate: 10, width: 10, height: 4 },
  { color: "#28B463", top: "18%", left: "72%", rotate: 55, width: 6, height: 3 },
  { color: "#FF33A8", top: "30%", left: "18%", rotate: -20, width: 8, height: 3 },
  { color: "#1F78D1", top: "20%", left: "55%", rotate: 35, width: 5, height: 5 },
  { color: "#FF5733", top: "32%", left: "92%", rotate: -60, width: 9, height: 3 },
  { color: "#FFC300", top: "8%", left: "38%", rotate: 25, width: 7, height: 4 },
  { color: "#28B463", top: "26%", left: "42%", rotate: -10, width: 10, height: 3 },
  { color: "#FF33A8", top: "10%", left: "82%", rotate: 50, width: 6, height: 4 },
  { color: "#1F78D1", top: "34%", left: "30%", rotate: -40, width: 8, height: 3 },
];

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center p-0 sm:p-6 md:p-10">
      <div className="pointer-events-none hidden md:block fixed inset-0 z-0 bg-slate-950/45 backdrop-blur-[2px]" />
      <Card className="relative z-10 w-full max-w-lg bg-white min-h-screen sm:min-h-0 sm:rounded-[2.5rem] border-none sm:border sm:border-slate-100 md:max-w-[600px] md:max-h-[calc(100vh-5rem)] md:overflow-y-auto md:rounded-[2.75rem] md:border md:border-slate-100/80 flex flex-col justify-between overflow-hidden">

        {/* Top section: confetti + animation */}
        <div className="relative flex flex-col items-center pt-14 pb-6 px-6">

          {/* Confetti pieces */}
          {confettiPieces.map((piece, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: piece.top,
                left: piece.left,
                width: piece.width,
                height: piece.height,
                backgroundColor: piece.color,
                borderRadius: 2,
                transform: `rotate(${piece.rotate}deg)`,
              }}
            />
          ))}

          {/* Layered glow circles + check icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex items-center justify-center"
            style={{ marginTop: 16, marginBottom: 8 }}
          >
            {/* Outermost ring */}
            <div
              className="absolute rounded-full"
              style={{
                width: 130,
                height: 130,
                background: "rgba(249, 115, 22, 0.06)",
              }}
            />
            {/* Middle ring */}
            <div
              className="absolute rounded-full"
              style={{
                width: 100,
                height: 100,
                background: "rgba(249, 115, 22, 0.1)",
              }}
            />
            {/* Inner filled circle with check */}
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 68,
                height: 68,
                background: "#135A3D",
                zIndex: 1,
              }}
            >
              <Check className="text-white" style={{ width: 32, height: 32, strokeWidth: 3 }} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
            className="mt-7 text-center"
          >
            <h1 className="text-2xl font-bold text-[#1E2E42] tracking-tight">
              Payment Successful
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-slate-400">
              Successfully Paid ₦1,500
            </p>
          </motion.div>
        </div>

        {/* Payment details section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          className="flex-1 px-6 pb-6"
        >
          {/* Section label */}
          <p className="text-sm font-bold text-[#1E2E42] mb-4">
            Payment methods
          </p>

          {/* Details card */}
          <div className="rounded-xl border border-slate-200 overflow-hidden hover:bg-white">
            {[
              { label: "Transaction ID", value: "SCSPAY-2026-0045", valueClass: "text-[#1E2E42]" },
              { label: "Date", value: "10 Jun 2026", valueClass: "text-[#1E2E42]" },
              { label: "Type of Transaction", value: "NACOS Dues", valueClass: "text-[#1E2E42]" },
              { label: "Amount", value: "₦1,500", valueClass: "text-[#1E2E42]" },
              { label: "Status", value: "Success", valueClass: "text-[#135A3D] font-bold" },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-4 text-sm ${i < arr.length - 1 ? "border-b border-slate-100" : ""
                  }`}
              >
                <span className="font-medium text-slate-400">{row.label}</span>
                <span className={`font-semibold ${row.valueClass}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Back Home button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4, ease: "easeOut" }}
          className="px-6 pb-10 pt-2"
        >
          <Button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full bg-[#135A3D] py-4 text-center text-sm font-bold text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            Back Home
          </Button>
        </motion.div>

      </Card>
    </main>
  );
}
