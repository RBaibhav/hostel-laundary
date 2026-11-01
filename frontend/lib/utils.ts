export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function formatTime(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "N/A";
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

export function calculateRemainingTime(
  startTimeString: string,
  estimatedEndTimeString: string
): {
  totalSeconds: number;
  remainingMinutes: number;
  remainingSeconds: number;
  formatted: string;
  isExpired: boolean;
  progressPercent: number;
} {
  const now = Date.now();
  const start = new Date(startTimeString).getTime();
  const end = new Date(estimatedEndTimeString).getTime();

  const totalDurationMs = Math.max(end - start, 1000);
  const remainingMs = end - now;

  if (remainingMs <= 0) {
    return {
      totalSeconds: 0,
      remainingMinutes: 0,
      remainingSeconds: 0,
      formatted: "Ready to collect",
      isExpired: true,
      progressPercent: 100
    };
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  const remainingMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  const elapsedMs = Math.max(now - start, 0);
  const progressPercent = Math.min(Math.round((elapsedMs / totalDurationMs) * 100), 99);

  const formatted =
    remainingMinutes > 0
      ? `${remainingMinutes}m ${remainingSeconds}s remaining`
      : `${remainingSeconds}s remaining`;

  return {
    totalSeconds,
    remainingMinutes,
    remainingSeconds,
    formatted,
    isExpired: false,
    progressPercent
  };
}

