"use client";

import { useState } from "react";
import { LaundrySession } from "@/types/session";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { AlertTriangle, X, Check } from "lucide-react";

interface EndSessionDialogProps {
  session: LaundrySession | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EndSessionDialog({
  session,
  isOpen,
  onClose,
  onSuccess
}: EndSessionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleEndSession = async () => {
    try {
      setIsSubmitting(true);
      await api.sessions.end(session._id);
      toast.success("Laundry session completed successfully!", {
        description: `Machine ${session.machine.machineNumber} is now marked Available.`
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to end laundry session");
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

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-start justify-between pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2">
          <h3 className="text-base font-bold text-slate-900">
            End Laundry Cycle?
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            Are you sure you want to complete your session on{" "}
            <span className="font-semibold text-slate-700">
              {session.machine.machineNumber}
            </span>
            ? This will immediately free up the washer for other hostel residents.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Keep Running
          </button>
          <button
            type="button"
            onClick={handleEndSession}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 disabled:opacity-50 transition-all"
          >
            <Check className="h-3.5 w-3.5" />
            {isSubmitting ? "Finishing..." : "Yes, End Cycle"}
          </button>
        </div>
      </div>
    </div>
  );
}

