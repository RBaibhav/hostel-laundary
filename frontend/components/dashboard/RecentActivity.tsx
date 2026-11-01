"use client";

import { Sparkles, Info, Bell, CheckCircle } from "lucide-react";

export function RecentActivity() {
  const guidelines = [
    {
      title: "Remove clothes promptly",
      desc: "Please collect laundry within 10 minutes of cycle completion so fellow residents can use the machine.",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      title: "Peak hours notice",
      desc: "Heaviest usage occurs between 6:00 PM and 10:00 PM on weekdays. Early mornings have the highest machine availability.",
      icon: Bell,
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Machine maintenance",
      desc: "If a washer exhibits vibration issues or leaks, notify the warden so it can be set to Out of Order for maintenance.",
      icon: Info,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
          Hostel Laundry Etiquette & Tips
        </h3>
      </div>
      <div className="space-y-3.5">
        {guidelines.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition-colors hover:bg-slate-50"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

