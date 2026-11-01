"use client";

import { useAuth } from "@/lib/auth";
import { Menu, LogOut, Shield, User as UserIcon } from "lucide-react";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export function Header({ onOpenMobileMenu, title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          {title ? (
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="text-xs font-medium text-slate-500">
                {currentDate}
              </div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Resident"} 👋
              </h2>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Pill */}
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-700 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Live Availability</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {user?.name}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <span>Room {user?.roomNumber}</span>
                {user?.role === "ADMIN" && (
                  <span className="inline-flex items-center rounded-sm bg-indigo-50 px-1 py-0.2 text-[10px] font-medium text-indigo-700">
                    <Shield className="mr-0.5 h-2.5 w-2.5" /> Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-rose-600"
            title="Log Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

