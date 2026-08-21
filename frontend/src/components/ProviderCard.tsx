import type { Provider } from "../types";
import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { Rating } from "./ui/Rating";

export function ProviderCard({ provider }: { provider: Provider }) {
  const tone = provider.status === "online" ? "success" : provider.status === "degraded" ? "warning" : "danger";
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black">{provider.name}</h3>
          <p className="text-sm text-slate-400">{provider.location} · {provider.gpu}</p>
        </div>
        <Badge tone={tone}>{provider.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/[0.05] p-3"><p className="text-slate-500">Reputation</p><Rating value={provider.reputation} /></div>
        <div className="rounded-lg bg-white/[0.05] p-3"><p className="text-slate-500">Uptime</p><p className="font-black">{provider.uptime}%</p></div>
        <div className="rounded-lg bg-white/[0.05] p-3"><p className="text-slate-500">Latency</p><p className="font-black">{provider.latency}ms</p></div>
        <div className="rounded-lg bg-white/[0.05] p-3"><p className="text-slate-500">Success</p><p className="font-black">{provider.successRate}%</p></div>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase text-slate-500">Available models</p>
        <div className="flex flex-wrap gap-2">
          {provider.models.map((model) => <Badge key={model}>{model}</Badge>)}
        </div>
      </div>
    </Card>
  );
}
