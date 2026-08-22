import type { Model } from "../types";
import { formatPixol } from "../utils/format";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Rating } from "./ui/Rating";

export function ModelCard({ model }: { model: Model }) {
  const initials = model.name
    .split(/\s|\.|-/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-900">
        <img className="h-full w-full object-cover" src={model.previews[0]} alt={`${model.name} preview`} />
        <div className="absolute left-4 top-4 grid h-14 w-14 place-items-center overflow-hidden rounded-lg border border-white/60 bg-white/80 text-lg font-black text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.24)] backdrop-blur-xl">
          <span>{initials}</span>
          {model.logoUrl ? (
            <img className="absolute h-10 w-10 object-contain" src={model.logoUrl} alt={`${model.creator} logo`} onError={(event) => { event.currentTarget.style.display = "none"; }} />
          ) : null}
        </div>
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{model.name}</h3>
            <p className="text-sm font-semibold text-slate-600">{model.creator} · v{model.version}</p>
          </div>
          <Badge tone={model.type === "IMAGE" ? "success" : "warning"}>{model.type}</Badge>
        </div>
        <p className="min-h-12 text-sm font-semibold text-slate-300">{model.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {model.capabilities.slice(0, 3).map((capability) => (
            <Badge key={capability}>{capability}</Badge>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <Rating value={model.rating} />
          <span className="font-black text-pixol">From {formatPixol(model.basePrice)}</span>
        </div>
      </div>
    </Card>
  );
}
