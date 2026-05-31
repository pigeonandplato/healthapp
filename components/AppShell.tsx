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

  // Initialize cache DB on mount (hook must run unconditionally before any early return)
  useEffect(() => {
    import("@/lib/db").then(({ initDB }) => {
      initDB().catch(console.error);
    });
  }, []);

  // Schedule today's break reminders while the app is open.
  useEffect(() => {
    import("@/lib/reminders").then(({ loadReminders, scheduleTodayReminders }) => {
      scheduleTodayReminders(loadReminders());
    });
  }, []);

  // Hydrate the synced completion-sound preference into the local cache so it
  // carries across devices (triggerCompletion reads the cache synchronously).
  useEffect(() => {
    Promise.all([import("@/lib/db"), import("@/utils/haptics")]).then(
      ([{ getCompletionSoundSetting }, { setSoundEnabled }]) => {
        getCompletionSoundSetting().then((remote) => {
          if (remote !== undefined) setSoundEnabled(remote);
        });
      }
    );
  }, []);

  // Don't show navigation on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

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
