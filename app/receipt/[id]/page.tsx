"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { recentTransactions, studentProfile } from "@/src/data/mock";

// ---------- Auto-print wrapper ----------
function AutoPrint() {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("print") === "1") {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [searchParams]);
  return null;
}

// ---------- Main page ----------
export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tx =
    recentTransactions.find((t) => t.receipt === id) ?? recentTransactions[0];

  const rows = [
    { label: "TRANSACTION ID", value: tx.receipt },
    { label: "STUDENT NAME", value: studentProfile.fullName.toUpperCase() },
    { label: "MATRIC NUMBER", value: studentProfile.matricNumber },
    { label: "PAYMENT TYPE", value: tx.type },
    { label: "DATE & TIME", value: tx.date },
    {
      label: "PAYMENT STATUS",
      value: tx.status === "Successful" ? "PAID" : tx.status.toUpperCase(),
      green: true,
    },
  ];

  return (
    <>
      <style>{`
        /* ── Screen styles ── */
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

        /* ── Print / PDF styles ── */
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
        <AutoPrint />
      </Suspense>

      <div id="receipt-screen-wrapper">

        {/* Action buttons — hidden on print */}
        <div id="no-print" style={{ width: "100%", maxWidth: 400, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/dashboard"
            style={{ fontSize: 13, fontWeight: 600, color: "#135A3D", background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}
          >
            ← Back
          </Link>
          <button
            onClick={() => window.print()}
            style={{ borderRadius: 999, background: "#135A3D", color: "white", padding: "8px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            Download PDF
          </button>
        </div>

        {/* ── RECEIPT CARD ── */}
        <div id="receipt-card">

          {/* Punch-hole top border */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 4px 0" }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#1E2E42", flexShrink: 0 }} />
            ))}
          </div>

          {/* Header */}
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

          {/* Watermark layer */}
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

          {/* Body */}
          <div style={{ position: "relative", zIndex: 1, padding: "8px 24px 16px" }}>

            {/* Amount */}
            <p style={{ fontSize: 34, fontWeight: 900, color: "#135A3D", textAlign: "center", margin: "16px 0 4px", letterSpacing: "-0.5px" }}>
              ₦{tx.amount.toLocaleString()}.00
            </p>

            {/* Status */}
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1E2E42", textAlign: "center", margin: "0 0 4px" }}>
              {tx.status === "Successful" ? "Successful" : tx.status}
            </p>

            {/* Dashed divider */}
            <div style={{ borderTop: "1.5px dashed #CBD5E1", margin: "16px 0" }} />

            {/* Detail rows */}
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

            {/* Dashed divider */}
            <div style={{ borderTop: "1.5px dashed #CBD5E1", margin: "16px 0" }} />

            {/* Footer */}
            <p style={{ marginTop: 20, fontSize: 9, lineHeight: 1.6, color: "#94A3B8", textAlign: "center" }}>
              This is an official receipt generated by SCS PAY. Please keep it for your records.
              For disputes, contact your department&apos;s financial office with this transaction ID.
            </p>
          </div>

          {/* Punch-hole bottom border */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "0 4px 8px" }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: "#1E2E42", flexShrink: 0 }} />
            ))}
          </div>

        </div>
        {/* end receipt card */}

      </div>
    </>
  );
}
