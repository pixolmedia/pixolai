import type { Model } from "../types";
import { formatPixol } from "../utils/format";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Rating } from "./ui/Rating";

export function ModelCard({ model }: { model: Model }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/10] bg-slate-900">
        <img className="h-full w-full object-cover" src={model.previews[0]} alt={`${model.name} preview`} />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">{model.name}</h3>
            <p className="text-sm text-slate-400">{model.creator} · v{model.version}</p>
          </div>
          <Badge tone={model.type === "IMAGE" ? "success" : "warning"}>{model.type}</Badge>
        </div>
        <p className="min-h-12 text-sm text-slate-300">{model.description}</p>
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
