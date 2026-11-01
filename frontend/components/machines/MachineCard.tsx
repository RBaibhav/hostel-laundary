"use client";

import { WashingMachine } from "@/types/machine";
import { MachineStatusBadge } from "./MachineStatusBadge";
import { formatTime } from "@/lib/utils";
import { Waves, MapPin, Clock, User, Play, AlertCircle } from "lucide-react";

interface MachineCardProps {
  machine: WashingMachine;
  onSelectToStart?: (machine: WashingMachine) => void;
  hasActiveSession?: boolean;
}

export function MachineCard({
  machine,
  onSelectToStart,
  hasActiveSession = false
}: MachineCardProps) {
  const isAvailable = machine.status === "AVAILABLE";
  const isInUse = machine.status === "IN_USE";
  const isOutOfOrder = machine.status === "OUT_OF_ORDER";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold transition-colors ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                  : isInUse
                  ? "bg-amber-50 text-amber-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              <Waves className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight">
                {machine.machineNumber}
              </h3>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>{machine.location}</span>
              </div>
            </div>
          </div>
          <MachineStatusBadge status={machine.status} />
        </div>

        {/* Dynamic Context Panel */}
        <div className="mt-4 rounded-xl bg-slate-50/80 p-3 text-xs space-y-2 border border-slate-100">
          {isAvailable && (
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Ready for immediate cycle</span>
            </div>
          )}

          {isInUse && (
            <>
              {machine.estimatedEndTime && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-amber-500" /> Free around:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatTime(machine.estimatedEndTime)}
                  </span>
                </div>
              )}
              {machine.currentUser && (
                <div className="flex items-center justify-between text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Claimed by:
                  </span>
                  <span className="font-medium text-slate-700">
                    Room {machine.currentUser.roomNumber || "—"}
                  </span>
                </div>
              )}
            </>
          )}

          {isOutOfOrder && (
            <div className="flex items-center gap-1.5 text-rose-700 font-medium">
              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
              <span>Reported for technician repair</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        {isAvailable ? (
          <button
            onClick={() => onSelectToStart?.(machine)}
            disabled={hasActiveSession}
            title={
              hasActiveSession
                ? "You already have an active laundry session"
                : "Claim this washer"
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{hasActiveSession ? "Cycle in Progress" : "Start Laundry"}</span>
          </button>
        ) : isInUse ? (
          <div className="text-center py-2 text-xs font-medium text-amber-700 bg-amber-50/50 rounded-xl">
            Busy until cycle ends
          </div>
        ) : (
          <div className="text-center py-2 text-xs font-medium text-rose-700 bg-rose-50/50 rounded-xl">
            Currently unavailable
          </div>
        )}
      </div>
    </div>
  );
}

