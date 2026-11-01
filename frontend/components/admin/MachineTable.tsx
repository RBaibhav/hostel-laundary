"use client";

import { useState } from "react";
import { WashingMachine } from "@/types/machine";
import { MachineStatusBadge } from "@/components/machines/MachineStatusBadge";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { formatTime } from "@/lib/utils";
import { Edit2, Trash2, Waves, AlertTriangle, X } from "lucide-react";

interface MachineTableProps {
  machines: WashingMachine[];
  isLoading: boolean;
  onEditMachine: (machine: WashingMachine) => void;
  onRefresh: () => void;
}

export function MachineTable({
  machines,
  isLoading,
  onEditMachine,
  onRefresh
}: MachineTableProps) {
  const [machineToDelete, setMachineToDelete] = useState<WashingMachine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!machineToDelete) return;
    try {
      setIsDeleting(true);
      await api.machines.delete(machineToDelete._id);
      toast.success(`Machine ${machineToDelete.machineNumber} removed successfully`);
      onRefresh();
      setMachineToDelete(null);
    } catch (err: unknown) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to delete machine");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Machine #</th>
                <th className="px-3 py-3.5">Hostel Location</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Current Occupancy</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {machines.map((m) => (
                <tr key={m._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pl-6 pr-3 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                        <Waves className="h-4 w-4" />
                      </div>
                      <span>{m.machineNumber}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600 font-medium">
                    {m.location}
                  </td>
                  <td className="px-3 py-3.5">
                    <MachineStatusBadge status={m.status} />
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">
                    {m.status === "IN_USE" ? (
                      <div className="text-[11px]">
                        <span className="font-semibold text-slate-800">
                          {m.currentUser?.roomNumber ? `Room ${m.currentUser.roomNumber}` : "Occupied"}
                        </span>
                        {m.estimatedEndTime && (
                          <span className="block text-slate-400">
                            Until {formatTime(m.estimatedEndTime)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3.5 pl-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditMachine(m)}
                        title="Edit machine details"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setMachineToDelete(m)}
                        disabled={m.status === "IN_USE"}
                        title={
                          m.status === "IN_USE"
                            ? "Cannot delete a machine while a session is running"
                            : "Delete machine"
                        }
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {machineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMachineToDelete(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <button
                onClick={() => setMachineToDelete(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-900">
              Delete Washer {machineToDelete.machineNumber}?
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              This unit will be permanently removed from the hostel directory. Make sure it has been physically decommissioned.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setMachineToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

