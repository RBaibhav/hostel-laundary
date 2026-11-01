"use client";

import { MachineSummary } from "@/types/machine";
import { Waves, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
  summary: MachineSummary | null;
  isLoading: boolean;
}

export function StatsCards({ summary, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Washers",
      value: summary?.total ?? 0,
      icon: Waves,
      iconColor: "text-slate-600",
      bgColor: "bg-slate-100",
      subtext: "Stationed in hostel blocks"
    },
    {
      title: "Available Now",
      value: summary?.available ?? 0,
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      border: "border-emerald-200/80",
      subtext: "Free for immediate use"
    },
    {
      title: "Currently In Use",
      value: summary?.inUse ?? 0,
      icon: Clock,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      subtext: "Cycles in progress"
    },
    {
      title: "Out of Order",
      value: summary?.outOfOrder ?? 0,
      icon: AlertTriangle,
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
      subtext: "Awaiting maintenance"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-8 w-12 rounded bg-slate-200" />
            <div className="mt-2 h-3 w-28 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md ${
              card.border || "border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl ${card.bgColor} ${card.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {card.value}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

