"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MachineGrid } from "@/components/machines/MachineGrid";
import { StartSessionModal } from "@/components/machines/StartSessionModal";
import { WashingMachine, MachineFilter, MachineStatus } from "@/types/machine";
import { LaundrySession } from "@/types/session";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Waves, Filter } from "lucide-react";

export default function MachinesPage() {
  const [machines, setMachines] = useState<WashingMachine[]>([]);
  const [activeSession, setActiveSession] = useState<LaundrySession | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<MachineFilter>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMachineToStart, setSelectedMachineToStart] = useState<WashingMachine | null>(null);

  const fetchMachines = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);

      const statusParam = selectedFilter === "ALL" ? undefined : (selectedFilter as MachineStatus);

      const [machinesData, activeSessionData] = await Promise.all([
        api.machines.getAll(statusParam).catch(() => []),
        api.sessions.getMyActive().catch(() => null)
      ]);

      setMachines(machinesData);
      setActiveSession(activeSessionData);
    } catch (e) {
      console.error("Failed to fetch machines:", e);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchMachines(true);

    const interval = setInterval(() => {
      fetchMachines(false);
    }, 12000);

    return () => clearInterval(interval);
  }, [fetchMachines]);

  const filterTabs: Array<{ id: MachineFilter; label: string; count?: number }> = [
    { id: "ALL", label: "All Machines" },
    { id: "AVAILABLE", label: "Available" },
    { id: "IN_USE", label: "In Use" },
    { id: "OUT_OF_ORDER", label: "Out of Order" }
  ];

  return (
    <DashboardLayout
      title="Laundry Machines"
      subtitle="Find an available machine and start your laundry."
    >
      <div className="space-y-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all",
                  selectedFilter === tab.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Showing {machines.length} units</span>
          </div>
        </div>

        {/* Machine Cards Grid */}
        <MachineGrid
          machines={machines}
          isLoading={isLoading}
          hasActiveSession={!!activeSession}
          onSelectToStart={(machine) => setSelectedMachineToStart(machine)}
          emptyMessage={`No machines matching status "${selectedFilter.toLowerCase()}".`}
        />
      </div>

      {/* Start Session Modal */}
      <StartSessionModal
        machine={selectedMachineToStart}
        isOpen={!!selectedMachineToStart}
        hasActiveSession={!!activeSession}
        onClose={() => setSelectedMachineToStart(null)}
        onSuccess={() => fetchMachines(false)}
      />
    </DashboardLayout>
  );
}

