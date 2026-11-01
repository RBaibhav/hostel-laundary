"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  requireAdmin?: boolean;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  requireAdmin = false
}: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requireAdmin && !isAdmin) {
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Connecting to LaundryMate...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

