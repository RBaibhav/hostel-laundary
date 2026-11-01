"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Waves,
  Clock,
  ShieldCheck,
  LogOut,
  Sparkles,
  User as UserIcon,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard"
    },
    {
      name: "Laundry Machines",
      href: "/machines",
      icon: Waves,
      active: pathname === "/machines"
    },
    {
      name: "My Sessions",
      href: "/sessions",
      icon: Clock,
      active: pathname === "/sessions"
    }
  ];

  if (isAdmin) {
    navigation.push({
      name: "Admin Control",
      href: "/admin/machines",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin")
    });
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/80 bg-white">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 font-semibold text-slate-900 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <Waves className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              Laundry<span className="text-indigo-600">Mate</span>
            </span>
            <span className="block text-[10px] font-medium tracking-wide uppercase text-slate-400">
              Hostel Tracker
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-4">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Navigation
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                item.active
                  ? "bg-indigo-50/90 text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  item.active
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              <span className="flex-1">{item.name}</span>
              {item.active && (
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Hostel Live Badge */}
      <div className="mx-3.5 mb-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-900">
            Hostel Live System
          </span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
          Machine states poll automatically every 12s so you avoid laundry room lines.
        </p>
      </div>

      {/* User Footer */}
      <div className="border-t border-slate-100 p-3.5">
        <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-900">
                {user?.name || "Resident"}
              </div>
              <div className="truncate text-[11px] text-slate-500">
                Room {user?.roomNumber || "—"} {user?.role === "ADMIN" && "• Admin"}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

