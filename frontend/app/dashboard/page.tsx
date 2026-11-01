"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ActiveSessionCard } from "@/components/sessions/ActiveSessionCard";
import { MachineGrid } from "@/components/machines/MachineGrid";
import { StartSessionModal } from "@/components/machines/StartSessionModal";
import { EndSessionDialog } from "@/components/sessions/EndSessionDialog";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MachineSummary, WashingMachine } from "@/types/machine";
import { LaundrySession } from "@/types/session";
import { api } from "@/lib/api";
import { ArrowRight, Waves } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [summary, setSummary] = useState<MachineSummary | null>(null);
  const [activeSession, setActiveSession] = useState<LaundrySession | null>(null);
  const [availableMachines, setAvailableMachines] = useState<WashingMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedMachineToStart, setSelectedMachineToStart] = useState<WashingMachine | null>(null);
  const [sessionToEnd, setSessionToEnd] = useState<LaundrySession | null>(null);

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setIsLoading(true);

      const [summaryData, activeSessionData, availableData] = await Promise.all([
        api.machines.getSummary().catch(() => null),
        api.sessions.getMyActive().catch(() => null),
        api.machines.getAll("AVAILABLE").catch(() => [])
      ]);

      if (summaryData) setSummary(summaryData);
      setActiveSession(activeSessionData);
      setAvailableMachines(availableData);
    } catch (e) {
      console.error("Dashboard polling error:", e);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);

    // Poll every 12 seconds
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 12000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Statistics Cards */}
        <section aria-label="Machine statistics">
          <StatsCards summary={summary} isLoading={isLoading} />
        </section>

        {/* Active Session Card */}
        <section aria-label="Your active laundry cycle">
          <ActiveSessionCard
            session={activeSession}
            isLoading={isLoading}
            onEndSessionClick={(session) => setSessionToEnd(session)}
          />
        </section>

        {/* Available Machines Preview Section */}
        <section aria-label="Available washers">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Available Washers Right Now
              </h2>
              <p className="text-xs text-slate-500">
                Ready for you to start your laundry immediately
              </p>
            </div>
            <Link
              href="/machines"
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
            >
              <span>View all machines</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <MachineGrid
            machines={availableMachines.slice(0, 6)}
            isLoading={isLoading}
            hasActiveSession={!!activeSession}
            onSelectToStart={(machine) => setSelectedMachineToStart(machine)}
            emptyMessage="All washing machines are currently in use or being serviced. Check back in a few minutes!"
          />
        </section>

        {/* Etiquette and Tips */}
        <section aria-label="Laundry guidelines">
          <RecentActivity />
        </section>
      </div>

      {/* Start Session Modal */}
      <StartSessionModal
        machine={selectedMachineToStart}
        isOpen={!!selectedMachineToStart}
        hasActiveSession={!!activeSession}
        onClose={() => setSelectedMachineToStart(null)}
        onSuccess={() => fetchDashboardData(false)}
      />

      {/* End Session Confirmation Dialog */}
      <EndSessionDialog
        session={sessionToEnd}
        isOpen={!!sessionToEnd}
        onClose={() => setSessionToEnd(null)}
        onSuccess={() => fetchDashboardData(false)}
      />
    </DashboardLayout>
  );
}
