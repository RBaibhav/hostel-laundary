import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
      <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
        Loading LaundryMate...
      </p>
    </div>
  );
}
