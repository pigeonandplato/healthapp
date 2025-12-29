"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import TopHeader from "./TopHeader";
import BottomNav from "./BottomNav";
import ProtectedRoute from "./ProtectedRoute";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Don't show navigation on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Initialize cache DB on mount
  useEffect(() => {
    import("@/lib/db").then(({ initDB }) => {
      initDB().catch(console.error);
    });
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-black">
        <TopHeader />
        
        {/* Main content with padding for fixed header and nav */}
        <main className="pt-[calc(60px+env(safe-area-inset-top))] pb-[calc(70px+env(safe-area-inset-bottom))]">
          {children}
        </main>
        
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
