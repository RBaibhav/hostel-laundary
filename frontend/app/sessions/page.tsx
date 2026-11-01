"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActiveSessionCard } from "@/components/sessions/ActiveSessionCard";
import { SessionHistory } from "@/components/sessions/SessionHistory";
import { EndSessionDialog } from "@/components/sessions/EndSessionDialog";
import { LaundrySession } from "@/types/session";
import { api } from "@/lib/api";

export default function SessionsPage() {
  const [activeSession, setActiveSession] = useState<LaundrySession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<LaundrySession[]>([]);
  const [isLoadingActive, setIsLoadingActive] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [sessionToEnd, setSessionToEnd] = useState<LaundrySession | null>(null);

  const fetchSessionData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsLoadingActive(true);
        setIsLoadingHistory(true);
      }

      const [activeData, historyData] = await Promise.all([
        api.sessions.getMyActive().catch(() => null),
        api.sessions.getMyHistory().catch(() => [])
      ]);

      setActiveSession(activeData);
      setSessionHistory(historyData);
    } catch (e) {
      console.error("Failed to fetch sessions data:", e);
    } finally {
      if (isInitial) {
        setIsLoadingActive(false);
        setIsLoadingHistory(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSessionData(true);

    const interval = setInterval(() => {
      fetchSessionData(false);
    }, 12000);

    return () => clearInterval(interval);
  }, [fetchSessionData]);

  return (
    <DashboardLayout
      title="My Laundry Sessions"
      subtitle="Track your current cycle progress and review your laundry history."
    >
      <div className="space-y-8">
        {/* Prominent Active Session Card */}
        <section aria-label="Current laundry cycle">
          <ActiveSessionCard
            session={activeSession}
            isLoading={isLoadingActive}
            onEndSessionClick={(session) => setSessionToEnd(session)}
          />
        </section>

        {/* Previous Sessions History */}
        <section aria-label="Session history">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              Session History
            </h2>
            <p className="text-xs text-slate-500">
              Past completed and active wash cycles logged for your room
            </p>
          </div>

          <SessionHistory
            sessions={sessionHistory}
            isLoading={isLoadingHistory}
          />
        </section>
      </div>

      {/* End Session Confirmation Dialog */}
      <EndSessionDialog
        session={sessionToEnd}
        isOpen={!!sessionToEnd}
        onClose={() => setSessionToEnd(null)}
        onSuccess={() => fetchSessionData(false)}
      />
    </DashboardLayout>
  );
}

