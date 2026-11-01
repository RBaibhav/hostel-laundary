"use client";

import { useEffect, useState } from "react";
import { LaundrySession } from "@/types/session";
import { calculateRemainingTime, formatTime } from "@/lib/utils";
import { Waves, Clock, CheckCircle2, Play, Sparkles } from "lucide-react";
import Link from "next/link";

interface ActiveSessionCardProps {
  session: LaundrySession | null;
  isLoading: boolean;
  onEndSessionClick: (session: LaundrySession) => void;
}

export function ActiveSessionCard({
  session,
  isLoading,
  onEndSessionClick
}: ActiveSessionCardProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-4 w-28 rounded bg-slate-100" />
          </div>
          <div className="h-8 w-24 rounded-full bg-slate-100" />
        </div>
        <div className="mt-6 h-3 rounded-full bg-slate-100" />
        <div className="mt-6 flex justify-between">
          <div className="h-4 w-24 rounded bg-slate-100" />
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Waves className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Active Session
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                No active laundry session
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All washers are waiting for your clothes. Pick a free machine whenever you're ready.
              </p>
            </div>
          </div>
          <Link
            href="/machines"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-[0.98] shrink-0"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Find an Available Washer</span>
          </Link>
        </div>
      </div>
    );
  }

  const { remainingMinutes, remainingSeconds, isExpired, progressPercent } =
    calculateRemainingTime(session.startTime, session.estimatedEndTime);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-50/70 via-white to-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-100/60">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <Waves className="h-6 w-6 animate-spin [animation-duration:8s]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Live Laundry Cycle
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                In Progress
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
              Washer {session.machine.machineNumber}
            </h3>
            <p className="text-xs text-slate-500">{session.machine.location}</p>
          </div>
        </div>

        {/* Big Countdown Display */}
        <div className="flex flex-col sm:items-end">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Time Remaining
          </div>
          {isExpired ? (
            <div className="flex items-center gap-1.5 text-base font-bold text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Ready for pick up!</span>
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-950 font-mono">
              {String(remainingMinutes).padStart(2, "0")}:
              {String(remainingSeconds).padStart(2, "0")}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5 space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>Cycle Progress</span>
          <span className="font-semibold text-indigo-700">{progressPercent}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-1000 ease-linear shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Cycle Stats & End Button */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Started: <strong className="text-slate-800">{formatTime(session.startTime)}</strong></span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-indigo-500" />
            <span>Ends around: <strong className="text-indigo-800">{formatTime(session.estimatedEndTime)}</strong></span>
          </div>
        </div>

        <button
          onClick={() => onEndSessionClick(session)}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors shadow-xs"
        >
          <span>End Cycle Early</span>
        </button>
      </div>
    </div>
  );
}

