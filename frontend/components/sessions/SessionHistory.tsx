"use client";

import { LaundrySession } from "@/types/session";
import { formatDateTime, formatTime } from "@/lib/utils";
import { Clock, History, Waves } from "lucide-react";

interface SessionHistoryProps {
  sessions: LaundrySession[];
  isLoading: boolean;
}

export function SessionHistory({ sessions, isLoading }: SessionHistoryProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <History className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">No session history yet</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Whenever you start and complete a laundry cycle, your logs and durations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 pl-6 pr-3">Machine</th>
              <th className="px-3 py-3.5">Location</th>
              <th className="px-3 py-3.5">Started</th>
              <th className="px-3 py-3.5">Completed</th>
              <th className="px-3 py-3.5">Duration</th>
              <th className="py-3.5 pl-3 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((s) => {
              const start = new Date(s.startTime).getTime();
              const end = s.endTime ? new Date(s.endTime).getTime() : new Date(s.estimatedEndTime).getTime();
              const durationMinutes = Math.max(Math.round((end - start) / 60000), 1);

              return (
                <tr key={s._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pl-6 pr-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">
                        <Waves className="h-3.5 w-3.5" />
                      </div>
                      <span>{s.machine?.machineNumber || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">
                    {s.machine?.location || "—"}
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">
                    {formatDateTime(s.startTime)}
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">
                    {s.endTime ? formatDateTime(s.endTime) : "In Progress"}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-slate-700">
                    {durationMinutes} mins
                  </td>
                  <td className="py-3.5 pl-3 pr-6 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        s.status === "ACTIVE"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {s.status === "ACTIVE" ? (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>Active</span>
                        </>
                      ) : (
                        <span>Completed</span>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

