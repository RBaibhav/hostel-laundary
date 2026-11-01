"use client";

import { useState, useId } from "react";
import { WashingMachine } from "@/types/machine";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";
import { X, Clock, Play, AlertCircle, Waves } from "lucide-react";

interface StartSessionModalProps {
  machine: WashingMachine | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hasActiveSession?: boolean;
}

export function StartSessionModal({
  machine,
  isOpen,
  onClose,
  onSuccess,
  hasActiveSession = false
}: StartSessionModalProps) {
  const [duration, setDuration] = useState<number>(45);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const durationInputId = useId();

  if (!isOpen || !machine) return null;

  const quickDurations = [30, 45, 60, 90];

  const estimatedEndTime = new Date(Date.now() + duration * 60 * 1000).toISOString();

  const handleStartSession = async () => {
    if (hasActiveSession) {
      toast.error("You already have an active laundry session. Please complete it first.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.sessions.start({
        machineId: machine._id,
        duration
      });

      toast.success(`Session started on ${machine.machineNumber}!`, {
        description: `Your laundry cycle is set for ${duration} minutes.`
      });

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to start laundry session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Start Laundry Session
              </h3>
              <p className="text-xs text-slate-500">
                {machine.machineNumber} • {machine.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {hasActiveSession && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              You already have an active session running. You must finish your current laundry cycle before claiming another washer.
            </span>
          </div>
        )}

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Quick Select Pills */}
          <div>
            <label
              htmlFor={durationInputId}
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
            >
              Cycle Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickDurations.map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    duration === mins
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm font-bold">{mins}</span>
                  <span className="text-[10px] text-slate-400 font-normal">mins</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Slider / Input */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span>Fine-tune duration</span>
              <span className="font-semibold text-indigo-600">{duration} minutes</span>
            </div>
            <input
              id={durationInputId}
              type="range"
              min={5}
              max={180}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>5m (Quick rinse)</span>
              <span>90m (Heavy wash)</span>
              <span>180m (Max)</span>
            </div>
          </div>

          {/* Time Calculation Info Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Start time:
              </span>
              <span className="font-medium text-slate-800">
                {formatTime(new Date().toISOString())} (Now)
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-indigo-500" /> Estimated finish:
              </span>
              <span className="font-semibold text-indigo-700">
                {formatTime(estimatedEndTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartSession}
            disabled={isSubmitting || hasActiveSession}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            {isSubmitting ? "Starting..." : "Start Laundry"}
          </button>
        </div>
      </div>
    </div>
  );
}

