import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "danger" }) {
  const tones = {
    default: "bg-slate-900/8 text-slate-700",
    success: "bg-emerald-400/18 text-emerald-700",
    warning: "bg-amber-400/18 text-amber-700",
    danger: "bg-coral/15 text-coral"
  };
  return <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black ${tones[tone]}`}>{children}</span>;
}
