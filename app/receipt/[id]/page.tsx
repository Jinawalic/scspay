import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/src/lib/prisma";
import { getCurrentStudent } from "@/src/lib/student-auth";
import { formatPaymentDateTime } from "@/src/lib/payment-flow";

// ---------- Auto-print wrapper ----------
function AutoPrint({ print }: { print: string | null }) {
  if (print !== "1") {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `setTimeout(() => window.print(), 500);`,
      }}
    />
  );
}

// ---------- Main page ----------
export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const student = await getCurrentStudent();

  if (!student) {
    redirect("/");
  }

  const payment = await prisma.paymentTransaction.findFirst({
    where: {
      userId: student.id,
      OR: [{ receipt: id }, { reference: id }],
    },
    include: {
      feeItem: true,
      user: {
        include: {
          faculty: true,
          department: true,
        },
      },
    },
  });

  if (!payment) {
    return (
      <main className="min-h-screen bg-[#F0F2F5] flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white px-6 py-8 text-center shadow-sm border border-slate-200 max-w-md w-full">
          <p className="text-lg font-bold text-[#1E2E42]">Receipt not found</p>
          <p className="mt-2 text-sm text-slate-500">We could not find a payment record for this reference.</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-full bg-[#135A3D] px-5 py-2.5 text-sm font-bold text-white"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const rows = [
    { label: "TRANSACTION ID", value: payment.receipt },
    { label: "STUDENT NAME", value: student.fullName.toUpperCase() },
    { label: "MATRIC NUMBER", value: student.matricNumber ?? "-" },
    { label: "FACULTY", value: student.faculty?.name ?? "-" },
    { label: "DEPARTMENT", value: student.department?.name ?? "-" },
    { label: "PAYMENT TYPE", value: payment.feeItem?.name ?? payment.type },
    { label: "DATE & TIME", value: formatPaymentDateTime(payment.paidAt) },
    {
      label: "PAYMENT STATUS",
      value: payment.status === "Successful" ? "PAID" : payment.status.toUpperCase(),
      green: true,
    },
  ];

  return (
    <>
      <style>{`
        #receipt-screen-wrapper {
          min-height: 100vh;
          background: #F0F2F5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }
        #receipt-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          #no-print { display: none !important; }
          #receipt-screen-wrapper {
            min-height: 297mm !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
          }
          #receipt-card {
            width: 148mm !important;
            max-width: 148mm !important;
            border-radius: 8px !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <Suspense fallback={null}>
        <AutoPrint print={query.print ?? null} />
      </Suspense>

      <div id="receipt-screen-wrapper">
        <div id="no-print" style={{ width: "100%", maxWidth: 400, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/dashboard"
            style={{ fontSize: 13, fontWeight: 600, color: "#135A3D", background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}
          >
            ← Back
          </Link>
          <Link
            href={`/receipt/${id}?print=1`}
            style={{ borderRadius: 999, background: "#135A3D", color: "white", padding: "8px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", textDecoration: "none" }}
          >
            Download PDF
          </Link>
        </div>

        <div id="receipt-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 4px 0" }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#1E2E42", flexShrink: 0 }} />
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2.5px solid #135A3D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#135A3D" }} />
              </div>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#1E2E42", letterSpacing: "-0.3px" }}>
                My <span style={{ color: "#135A3D" }}>Pay</span>
              </span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Transaction Receipt
            </span>
          </div>

          <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }} aria-hidden>
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: `${(i % 6) * 18 + 6}%`,
                  left: `${Math.floor(i / 6) * 22 + (i % 2) * 10 - 4}%`,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(148,163,184,0.18)",
                  transform: "rotate(-30deg)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                MyPay
              </span>
            ))}
          </div>

          <div style={{ position: "relative", zIndex: 1, padding: "8px 24px 16px" }}>
            <p style={{ fontSize: 34, fontWeight: 900, color: "#135A3D", textAlign: "center", margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
              ₦{payment.amount.toLocaleString()}.00
            </p>

            <p style={{ fontSize: 15, fontWeight: 700, color: "#1E2E42", textAlign: "center", margin: "0 0 4px" }}>
              {payment.status === "Successful" ? "Successful" : payment.status}
            </p>

            <div style={{ borderTop: "1.5px dashed #CBD5E1", margin: "16px 0" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {rows.map(({ label, value, green }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: green ? "#135A3D" : "#1E2E42", textAlign: "right", wordBreak: "break-all" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1.5px dashed #CBD5E1", margin: "16px 0" }} />

            <p style={{ marginTop: 20, fontSize: 9, lineHeight: 1.6, color: "#94A3B8", textAlign: "center" }}>
              This is an official receipt generated by SCS PAY. Please keep it for your records.
              For disputes, contact your department&apos;s financial office with this transaction ID.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 4px 8px" }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#1E2E42", flexShrink: 0 }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
