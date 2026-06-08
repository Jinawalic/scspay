"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shadow-lg"
    >
      <CheckCircle2 className="h-14 w-14" />
    </motion.div>
  );
}
