import { MachineStatus } from "@/types/machine";
import { cn } from "@/lib/utils";

interface MachineStatusBadgeProps {
  status: MachineStatus;
  className?: string;
}

export function MachineStatusBadge({ status, className }: MachineStatusBadgeProps) {
  const configs: Record<
    MachineStatus,
    { label: string; dot: string; container: string }
  > = {
    AVAILABLE: {
      label: "Available",
      dot: "bg-emerald-500",
      container: "bg-emerald-50 text-emerald-700 border-emerald-200/80"
    },
    IN_USE: {
      label: "In Use",
      dot: "bg-amber-500 animate-pulse",
      container: "bg-amber-50 text-amber-700 border-amber-200/80"
    },
    OUT_OF_ORDER: {
      label: "Out of Order",
      dot: "bg-rose-500",
      container: "bg-rose-50 text-rose-700 border-rose-200/80"
    }
  };

  const config = configs[status] || configs.AVAILABLE;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        config.container,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

