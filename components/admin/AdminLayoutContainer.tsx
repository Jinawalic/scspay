"use client";

import React from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";

interface AdminLayoutContainerProps {
  children: React.ReactNode;
  activeSegment: string;
}

export function AdminLayoutContainer({ children, activeSegment }: AdminLayoutContainerProps) {
  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans antialiased flex">
      {/* 1. Left Fixed Structural Sidebar Navigation Panel */}
      <Sidebar activeSegment={activeSegment} />

      {/* 2. Main Fluid Viewport Area Canvas */}
      <div className="flex-1 md:ml-63 min-w-0 flex flex-col min-h-screen">
        
        {/* Sticky Header Wrapper: Locked to the top, blends with page background */}
        <div className="sticky top-0 z-40 bg-[#F1F5F9] px-6 py-4 border-b border-slate-200/40">
          <DashboardHeader />
        </div>

        {/* Scrollable Workspace Wrapper */}
        <div className="p-4 sm:p-3 lg:p-3 flex-1 flex flex-col">
          {/* 3. The Grand Single White Application Workspace Container Card */}
          <div className="w-full bg-white rounded-sm border border-slate-200 p-4 sm:p-6 lg:p-10 flex-1 flex flex-col justify-start">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}