import { formatPixol } from "../../utils/format";

export function PriceDisplay({ value, label = "Estimated cost" }: { value: number; label?: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-2xl font-black text-pixol">{formatPixol(value)}</p>
    </div>
  );
}
