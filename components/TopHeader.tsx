"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { href: "/today", label: "Today's Workout", icon: "🏠" },
  { href: "/schedule", label: "Schedule", icon: "📅" },
  { href: "/program", label: "Program Overview", icon: "📈" },
];

export default function TopHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const getPageTitle = () => {
    switch (pathname) {
      case "/today":
      case "/":
        return "Health Tracker";
      case "/schedule":
        return "Schedule";
      case "/program":
        return "Program";
      default:
        return "Health Tracker";
    }
  };

  return (
    <>
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#E5E5EA] dark:border-[#38383A]">
        <div className="flex items-center justify-between px-4 pt-[max(12px,env(safe-area-inset-top))] pb-3">
          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -ml-2 rounded-xl hover:bg-[#F2F2F7] dark:hover:bg-[#1C1C1E] transition-colors touch-target"
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-[#1C1C1E] dark:bg-white rounded-full transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#1C1C1E] dark:bg-white rounded-full transition-all duration-300 ${
                  isOpen ? "opacity-0 scale-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-[#1C1C1E] dark:bg-white rounded-full transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </div>
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-[#1C1C1E] dark:text-white">
            {getPageTitle()}
          </h1>

          {/* Placeholder for symmetry */}
          <div className="w-9" />
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-[#1C1C1E] z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-[max(60px,calc(env(safe-area-inset-top)+48px))] px-4 pb-8 h-full flex flex-col">
          {/* Menu Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF2D55] to-[#FF6482] flex items-center justify-center shadow-lg">
                <span className="text-2xl">💪</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1C1C1E] dark:text-white">
                  Health Tracker
                </h2>
                <p className="text-xs text-[#8E8E93]">Your wellness companion</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl p-3 mb-4">
              <p className="text-xs text-[#8E8E93] mb-1">Signed in as</p>
              <p className="text-sm font-medium text-[#1C1C1E] dark:text-white truncate">
                {user.email}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-[#E5E5EA] dark:bg-[#38383A] mb-4" />

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === "/today" && pathname === "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#FF2D55]/10 text-[#FF2D55]"
                      : "text-[#1C1C1E] dark:text-white hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E]"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 mt-4"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Sign Out</span>
          </button>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-[#E5E5EA] dark:border-[#38383A]">
            <div className="text-center">
              <p className="text-xs text-[#8E8E93]">
                Track your wellness journey
              </p>
              <p className="text-[10px] text-[#C7C7CC] mt-1">
                Data synced to cloud
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
