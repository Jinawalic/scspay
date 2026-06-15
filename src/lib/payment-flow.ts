import "server-only";

import crypto from "node:crypto";

export function generatePaymentReference() {
  return `SCSPAY-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

export function formatPaymentDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export function formatPaymentDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getCurrentAcademicSession(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  return `${year - 1}/${year}`;
}
