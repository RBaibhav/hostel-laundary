"use client";

import { WashingMachine } from "@/types/machine";
import { MachineCard } from "./MachineCard";
import { Waves, Sparkles } from "lucide-react";

interface MachineGridProps {
  machines: WashingMachine[];
  isLoading: boolean;
  onSelectToStart?: (machine: WashingMachine) => void;
  hasActiveSession?: boolean;
  emptyMessage?: string;
}

export function MachineGrid({
  machines,
  isLoading,
  onSelectToStart,
  hasActiveSession = false,
  emptyMessage = "No laundry machines found."
}: MachineGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="animate-pulse rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-3 w-32 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 h-16 rounded-xl bg-slate-100" />
            <div className="mt-5 h-9 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-3">
          <Waves className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No washers found</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard
          key={machine._id}
          machine={machine}
          onSelectToStart={onSelectToStart}
          hasActiveSession={hasActiveSession}
        />
      ))}
    </div>
  );
}

