"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MachineTable } from "@/components/admin/MachineTable";
import { MachineForm } from "@/components/admin/MachineForm";
import { WashingMachine } from "@/types/machine";
import { api } from "@/lib/api";
import { Plus, ShieldCheck, RefreshCw } from "lucide-react";

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState<WashingMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [machineToEdit, setMachineToEdit] = useState<WashingMachine | null>(null);

  const fetchMachines = useCallback(async (showFullLoader = false) => {
    try {
      if (showFullLoader) setIsLoading(true);
      else setIsRefreshing(true);

      const data = await api.machines.getAll();
      setMachines(data);
    } catch (e) {
      console.error("Failed to fetch machines for admin:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMachines(true);
  }, [fetchMachines]);

  const handleOpenAdd = () => {
    setMachineToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (machine: WashingMachine) => {
    setMachineToEdit(machine);
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout
      title="Hostel Washing Machines Management"
      subtitle="Configure, monitor, and maintain laundry units across hostel floors."
      requireAdmin={true}
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Warden Control Panel
              </div>
              <div className="text-[11px] text-slate-500">
                {machines.length} total units configured
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchMachines(false)}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Washer</span>
            </button>
          </div>
        </div>

        {/* Machine Table */}
        <MachineTable
          machines={machines}
          isLoading={isLoading}
          onEditMachine={handleOpenEdit}
          onRefresh={() => fetchMachines(false)}
        />
      </div>

      {/* Add / Edit Machine Modal Form */}
      <MachineForm
        machineToEdit={machineToEdit}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchMachines(false)}
      />
    </DashboardLayout>
  );
}

