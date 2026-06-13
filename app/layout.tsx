"use client";

import React, { useState, useEffect } from "react";
import "./globals.css";
import { Preloader } from "@/components/dashboard/Preloader"; // Adjust this path based on where you saved Preloader.tsx

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSiteLoading, setIsSiteLoading] = useState(true);

  useEffect(() => {
    // If the browser document has already loaded all resources
    if (document.readyState === "complete") {
      const timer = setTimeout(() => setIsSiteLoading(false), 1500);
      return () => clearTimeout(timer);
    }

    // Otherwise, wait safely for the page layout assets and fonts to load completely
    const handleWebsiteLoaded = () => {
      setTimeout(() => setIsSiteLoading(false), 1500); // 1.5s visual buffer for smooth presentation
    };

    window.addEventListener("load", handleWebsiteLoaded);
    return () => window.removeEventListener("load", handleWebsiteLoaded);
  }, []);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#F8FAFC] text-slate-900 font-sans">
        {isSiteLoading ? (
          <Preloader />
        ) : (
          <div className="animate-in fade-in duration-500">
            {children}
          </div>
        )}
      </body>
    </html>
  );
}