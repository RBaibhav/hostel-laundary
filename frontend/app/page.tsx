"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  Waves,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  Shield,
  Sparkles,
  Zap
} from "lucide-react";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Waves className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Laundry<span className="text-indigo-600">Mate</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/90 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Smart Hostel Laundry Tracking System</span>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.1]">
            Your hostel laundry,{" "}
            <span className="bg-linear-to-r from-indigo-600 via-indigo-700 to-blue-600 bg-clip-text text-transparent">
              without the waiting.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
            Eliminate endless trips down the hallway with laundry baskets. Check live washer availability across your hostel, claim free machines, and track cycle countdowns in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={isAuthenticated ? "/dashboard" : "/register"}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/80 hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              <span>{isAuthenticated ? "Launch Dashboard" : "Create Resident Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
            >
              Sign In to Your Room
            </Link>
          </div>

          {/* Washer Preview Cards Mockup */}
          <div className="mt-16 mx-auto max-w-4xl rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 shadow-xl backdrop-blur-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 text-left">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live Campus Preview
                </div>
                <div className="text-sm font-bold text-slate-800">
                  Block A & B Laundry Stations
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {/* Machine 1 Available */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">WM-01</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Available
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Block A • Ground Floor</p>
                <div className="mt-4 text-xs font-semibold text-emerald-700">
                  ✓ Ready for immediate cycle
                </div>
              </div>

              {/* Machine 2 In Use */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">WM-02</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    In Use
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Block A • Ground Floor</p>
                <div className="mt-4 flex items-center justify-between text-xs text-amber-800 font-semibold">
                  <span>14m remaining</span>
                  <span className="text-[10px] text-slate-400 font-normal">Room 204</span>
                </div>
              </div>

              {/* Machine 3 In Use */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">WM-03</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    In Use
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Block B • 1st Floor</p>
                <div className="mt-4 flex items-center justify-between text-xs text-amber-800 font-semibold">
                  <span>32m remaining</span>
                  <span className="text-[10px] text-slate-400 font-normal">Room 110</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-slate-200/80 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Built specifically for hostel living
            </h2>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              LaundryMate solves campus laundry friction with atomic reservation guarantees and cycle timers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Live Washer Status</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                See exactly which machines are Available, In Use, or Out of Order before leaving your room.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">One-Tap Claim</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Atomically claim a free washer for 5 to 180 minutes. Concurrency safeguards prevent race conditions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-4">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Real-Time Countdowns</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Watch your cycle time down second-by-second. Pick up clothes the moment they are done.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hostel Admin Controls</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Wardens and floor monitors can deploy new machines, edit locations, and flag maintenance issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Waves className="h-4 w-4 text-indigo-600" />
            <span>LaundryMate</span>
          </div>
          <div>Hostel Laundry Machine Occupancy Tracker © {new Date().getFullYear()}</div>
        </div>
      </footer>
    </div>
  );
}
