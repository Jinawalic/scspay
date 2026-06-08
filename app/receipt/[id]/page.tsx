import Link from "next/link";
import { ArrowLeft, Download, Printer, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recentTransactions, studentProfile } from "@/src/data/mock";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  const receipt = recentTransactions.find((item) => item.receipt === params.id) ?? recentTransactions[0];

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">Receipt Details</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">University-style receipt</h1>
          </div>
          <Link href="/payment-history" className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        <div className="rounded-[2.25rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">SCSPAY Receipt</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Receipt Number: {receipt.receipt}</h2>
            </div>
            <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{receipt.status}</div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-6 rounded-[2rem] bg-slate-50 p-6">
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Student information</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Full Name:</span> {studentProfile.fullName}</p>
                <p><span className="font-semibold text-slate-900">Matric Number:</span> {studentProfile.matricNumber}</p>
                <p><span className="font-semibold text-slate-900">Email:</span> {studentProfile.email}</p>
              </div>
            </div>
            <div className="space-y-6 rounded-[2rem] bg-slate-50 p-6">
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Payment information</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Fee Type:</span> {receipt.type}</p>
                <p><span className="font-semibold text-slate-900">Session:</span> {receipt.session}</p>
                <p><span className="font-semibold text-slate-900">Semester:</span> First</p>
                <p><span className="font-semibold text-slate-900">Amount:</span> ₦{receipt.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-200 p-6">
              <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Transaction information</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Reference #:</span> TRX-2026-8110</p>
                <p><span className="font-semibold text-slate-900">Date:</span> {receipt.date}</p>
                <p><span className="font-semibold text-slate-900">Status:</span> {receipt.status}</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-200 p-6 text-center">
              <div className="mx-auto mb-4 inline-flex h-32 w-32 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
                <QrCode className="h-16 w-16" />
              </div>
              <p className="text-sm text-slate-500">QR Code placeholder for receipt verification and quick downloads.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Button className="w-full">Download PDF</Button>
            <Button variant="secondary" className="w-full">Print Receipt</Button>
            <Link href="/dashboard" className="inline-flex h-full w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
