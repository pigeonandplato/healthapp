"use client";

import { ReactNode } from "react";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <TopHeader />
      
      {/* Main content with padding for fixed header and nav */}
      <main className="pt-[calc(60px+env(safe-area-inset-top))] pb-[calc(70px+env(safe-area-inset-bottom))]">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}

