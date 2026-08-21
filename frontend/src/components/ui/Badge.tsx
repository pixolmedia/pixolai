import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "success" | "warning" | "danger" }) {
  const tones = {
    default: "bg-white/10 text-slate-200",
    success: "bg-pixol/15 text-pixol",
    warning: "bg-ember/15 text-ember",
    danger: "bg-coral/15 text-coral"
  };
  return <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black ${tones[tone]}`}>{children}</span>;
}
