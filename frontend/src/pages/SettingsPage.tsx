import { useQuery } from "@tanstack/react-query";
import { Cable, MonitorCog, Network, PlugZap } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { api } from "../services/api";
import { useInferenceSettingsStore } from "../stores/inferenceSettingsStore";
import type { GenerationParameters } from "../types";

export function SettingsPage() {
  const { data: runtimeConfig } = useQuery({ queryKey: ["runtime-config"], queryFn: api.runtimeConfig });
  const settings = useInferenceSettingsStore();

  useEffect(() => {
    if (runtimeConfig) {
      settings.initializeFromRuntime(runtimeConfig);
    }
  }, [runtimeConfig, settings]);

  return (
    <div className="glass-window rounded-[30px] p-4 lg:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-sky-700">PIXOLAI</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">Inference Settings</h1>
        </div>
        <p className="max-w-2xl text-sm font-semibold text-slate-600 md:text-right">Configure local inference, API-compatible gateways and SOLAI Network endpoints here. Create only chooses the active route.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5">
          <SectionHeader icon={<MonitorCog size={22} />} title="Local inference" subtitle="Used when Create is set to Local." />
          <div className="mt-5 grid gap-4 md:grid-cols-[220px_1fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Runtime</span>
              <select
                className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400"
                value={settings.localRuntime}
                onChange={(event) => settings.setLocalRuntime(event.target.value as GenerationParameters["localRuntime"])}
              >
                <option value="ollama">Ollama</option>
                <option value="comfyui">ComfyUI</option>
                <option value="automatic1111">Automatic1111</option>
                <option value="custom">Custom</option>
              </select>
            </label>
            <EndpointField label="Endpoint" value={settings.localEndpoint} onChange={settings.setLocalEndpoint} placeholder="http://localhost:11434" />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={<PlugZap size={22} />} title="API compatible" subtitle="Used when Create is set to API." />
          <div className="mt-5">
            <EndpointField label="Endpoint" value={settings.apiEndpoint} onChange={settings.setApiEndpoint} placeholder="http://localhost:8000/v1" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-600">Use this for OpenAI-compatible or custom image/video inference gateways.</p>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={<Network size={22} />} title="SOLAI Network" subtitle="Used when Create is set to SOLAI." />
          <div className="mt-5">
            <EndpointField label="Network API URL" value={settings.solaiEndpoint} onChange={settings.setSolaiEndpoint} placeholder="https://api.solai.network" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-600">SOLAI keys still come from SOLAI_NETWORK_API_KEY on the backend.</p>
        </Card>

        <Card className="p-5">
          <SectionHeader icon={<Cable size={22} />} title="Backend defaults" subtitle="Current values exposed by /api/runtime-config." />
          <div className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
            <ConfigLine label="Local" value={`${runtimeConfig?.localInferenceRuntime ?? "-"} · ${runtimeConfig?.localInferenceUrl ?? "-"}`} />
            <ConfigLine label="API" value={runtimeConfig?.compatibleInferenceApiUrl ?? "-"} />
            <ConfigLine label="SOLAI" value={runtimeConfig?.solaiNetworkApiUrl ?? "-"} />
            <ConfigLine label="ComfyUI" value={runtimeConfig?.comfyUiUrl ?? "-"} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/45 bg-sky-500/20 text-sky-700 backdrop-blur-xl">{icon}</div>
      <div>
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
}

function EndpointField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
      <input className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function ConfigLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-white/35 bg-white/20 p-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <span className="font-black text-slate-800">{label}</span>
      <span className="break-all text-slate-600">{value}</span>
    </div>
  );
}
