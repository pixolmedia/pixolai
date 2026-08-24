import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MonitorCog, PlugZap, Sparkles, Video } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { api, type JobPayload } from "../services/api";
import type { ExecutionMode, GenerationParameters, Job, ModelType } from "../types";
import { formatPixol } from "../utils/format";
import { useModels, useProviders } from "../hooks/usePixolData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { JobStatus } from "../components/ui/JobStatus";
import { Badge } from "../components/ui/Badge";
import { Rating } from "../components/ui/Rating";
import { useInferenceSettingsStore } from "../stores/inferenceSettingsStore";

export function CreatePage() {
  const queryClient = useQueryClient();
  const { data: models = [] } = useModels();
  const { data: providers = [] } = useProviders();
  const { data: runtimeConfig } = useQuery({ queryKey: ["runtime-config"], queryFn: api.runtimeConfig });
  const inferenceSettings = useInferenceSettingsStore();
  const [mediaType, setMediaType] = useState<ModelType>("IMAGE");
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("local");
  const availableModels = models.filter((model) => model.type === mediaType);
  const [modelId, setModelId] = useState("flux-1");
  const [providerMode, setProviderMode] = useState<"auto" | "manual">("auto");
  const [providerId, setProviderId] = useState("");
  const [prompt, setPrompt] = useState("A premium fintech AI workspace for decentralized media generation, neon green accents, cinematic lighting");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [parameters, setParameters] = useState<GenerationParameters>({ aspectRatio: "1:1", quality: "standard", mediaType: "IMAGE", executionMode: "local" });
  const [activeJobId, setActiveJobId] = useState<string>();

  const compatibleProviders = useMemo(() => providers.filter((provider) => provider.models.includes(modelId)), [providers, modelId]);

  useEffect(() => {
    if (runtimeConfig) {
      inferenceSettings.initializeFromRuntime(runtimeConfig);
    }
  }, [inferenceSettings, runtimeConfig]);

  useEffect(() => {
    const nextModel = availableModels.find((model) => {
      if (executionMode === "local") {
        return model.providerAvailability.includes("provider_local");
      }
      if (executionMode === "api") {
        return model.providerAvailability.includes("provider_delta");
      }
      return model.providerAvailability.includes("provider_local");
    }) ?? availableModels[0];

    const currentModel = availableModels.find((model) => model.id === modelId);
    const currentRouteMismatch =
      (executionMode === "local" && !currentModel?.providerAvailability.includes("provider_local")) ||
      (executionMode === "api" && !currentModel?.providerAvailability.includes("provider_delta"));

    if (nextModel && (!currentModel || currentRouteMismatch)) {
      setModelId(nextModel.id);
    }
  }, [availableModels, executionMode, modelId]);

  useEffect(() => {
    if (executionMode === "local") {
      setProviderMode("manual");
      setProviderId("provider_local");
      return;
    }

    if (executionMode === "api") {
      setProviderMode("manual");
      setProviderId("provider_delta");
      return;
    }

    if (providerId === "provider_local") {
      setProviderMode("auto");
      setProviderId("");
      return;
    }

    if (providerMode === "manual" && (!providerId || !compatibleProviders.some((provider) => provider.id === providerId)) && compatibleProviders[0]) {
      setProviderId(compatibleProviders[0].id);
    }
  }, [compatibleProviders, executionMode, providerId, providerMode]);

  const payload: JobPayload = {
    modelId,
    providerId: providerMode === "manual" ? providerId : undefined,
    prompt,
    parameters: {
      ...parameters,
      mediaType,
      executionMode,
      localRuntime: executionMode === "local" ? inferenceSettings.localRuntime : undefined,
      localEndpoint: executionMode === "local" ? inferenceSettings.localEndpoint : undefined,
      apiEndpoint: executionMode === "api" ? inferenceSettings.apiEndpoint : undefined,
      apiKey: executionMode === "api" ? inferenceSettings.apiKey || undefined : undefined,
      negativePrompt: negativePrompt.trim() || undefined,
      durationSeconds: mediaType === "VIDEO" ? parameters.durationSeconds ?? 4 : undefined,
      frameCount: mediaType === "VIDEO" ? parameters.frameCount ?? 48 : undefined
    }
  };

  const estimate = useQuery({
    queryKey: ["estimate", payload],
    queryFn: () => api.estimateJob(payload),
    enabled: prompt.trim().length >= 3 && Boolean(modelId) && (providerMode === "auto" || Boolean(providerId))
  });

  const createJob = useMutation({
    mutationFn: () => api.createJob(payload),
    onSuccess: ({ job }) => {
      setActiveJobId(job.id);
      void queryClient.invalidateQueries({ queryKey: ["wallet"] });
      void queryClient.invalidateQueries({ queryKey: ["jobs"] });
    }
  });

  const activeJob = useQuery({
    queryKey: ["job", activeJobId],
    queryFn: () => api.job(activeJobId ?? ""),
    enabled: Boolean(activeJobId),
    refetchInterval: (query) => (["COMPLETED", "FAILED", "CANCELLED"].includes(query.state.data?.status ?? "") ? false : 1000)
  });

  const selectedEstimateProvider = providers.find((provider) => provider.id === estimate.data?.providerId);

  return (
    <div className="glass-window rounded-[30px] p-4 lg:p-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-sky-700">PIXOLAI</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950 lg:text-4xl">Compute Provider</h1>
          </div>
          <p className="max-w-2xl text-sm font-semibold text-slate-600 md:text-right">Use your own API key or your local machine runtime to create images and videos through PIXOLAI.</p>
        </div>

        <Card className="p-5 lg:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Inference task</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">Select media type, local/API route, model and endpoint.</p>
            </div>
            <Badge tone={executionMode === "local" ? "success" : "default"}>{executionMode.toUpperCase()}</Badge>
          </div>

          <div className="mb-6 grid gap-4 xl:grid-cols-[220px_1fr]">
            <div>
              <span className="mb-2 block text-sm font-black text-slate-700">Media</span>
              <div className="grid grid-cols-2 gap-3">
                <ModeButton active={mediaType === "IMAGE"} icon={<Sparkles size={18} />} label="Image" onClick={() => {
                  setMediaType("IMAGE");
                  setParameters((current) => ({ ...current, mediaType: "IMAGE" }));
                }} />
                <ModeButton active={mediaType === "VIDEO"} icon={<Video size={18} />} label="Video" onClick={() => {
                  setMediaType("VIDEO");
                  setParameters((current) => ({ ...current, mediaType: "VIDEO", aspectRatio: current.aspectRatio === "1:1" ? "16:9" : current.aspectRatio, durationSeconds: current.durationSeconds ?? 4, frameCount: current.frameCount ?? 48 }));
                }} />
              </div>
            </div>

            <div>
              <span className="mb-2 block text-sm font-black text-slate-700">Action</span>
              <div className="grid gap-3 md:grid-cols-2">
                <ModeButton active={executionMode === "local"} icon={<MonitorCog size={18} />} label="Local" onClick={() => {
                  setExecutionMode("local");
                  setParameters((current) => ({ ...current, executionMode: "local" }));
                }} />
                <ModeButton active={executionMode === "api"} icon={<PlugZap size={18} />} label="API" onClick={() => {
                  setExecutionMode("api");
                  setParameters((current) => ({ ...current, executionMode: "api" }));
                }} />
              </div>
            </div>
          </div>

          <div className="mb-5 h-px bg-white/35" />

          <div className="rounded-lg border border-white/35 bg-white/12 p-4 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">Provider selection</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">Choose the model and compute provider after selecting the action route.</p>
              </div>
              <Badge tone="default">RUNTIME</Badge>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Model</span>
              <select className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400" value={modelId} onChange={(event) => setModelId(event.target.value)}>
                {availableModels.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Provider</span>
              <select disabled={executionMode === "local" || executionMode === "api"} className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400 disabled:opacity-70" value={providerMode === "auto" ? "auto" : providerId} onChange={(event) => {
                if (event.target.value === "auto") {
                  setProviderMode("auto");
                  setProviderId("");
                } else {
                  setProviderMode("manual");
                  setProviderId(event.target.value);
                }
              }}>
                <option value="auto">Auto-select best provider</option>
                {compatibleProviders.map((provider) => <option key={provider.id} value={provider.id}>{provider.name} · {provider.gpu}</option>)}
              </select>
            </label>
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black text-slate-700">Prompt</span>
            <textarea className="glass-field min-h-36 w-full resize-y rounded-lg p-4 font-semibold outline-none focus:border-sky-400" value={prompt} maxLength={1200} onChange={(event) => setPrompt(event.target.value)} />
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black text-slate-700">Negative prompt</span>
            <textarea className="glass-field min-h-20 w-full resize-y rounded-lg p-4 font-semibold outline-none focus:border-sky-400" value={negativePrompt} maxLength={1000} onChange={(event) => setNegativePrompt(event.target.value)} placeholder="low quality, artifacts, distorted text" />
          </label>

          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Aspect ratio</span>
              <select className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400" value={parameters.aspectRatio} onChange={(event) => setParameters((current) => ({ ...current, aspectRatio: event.target.value as GenerationParameters["aspectRatio"] }))}>
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 Portrait</option>
                <option value="16:9">16:9 Wide</option>
                <option value="9:16">9:16 Vertical</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-700">Quality</span>
              <select className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400" value={parameters.quality} onChange={(event) => setParameters((current) => ({ ...current, quality: event.target.value as GenerationParameters["quality"] }))}>
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </label>
            {mediaType === "VIDEO" ? (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Duration</span>
                  <input type="number" min={1} max={30} className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400" value={parameters.durationSeconds ?? 4} onChange={(event) => setParameters((current) => ({ ...current, durationSeconds: Number(event.target.value) }))} />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-black text-slate-700">Frames</span>
                  <input type="number" min={1} max={240} className="glass-field h-12 w-full rounded-lg px-3 font-bold outline-none focus:border-sky-400" value={parameters.frameCount ?? 48} onChange={(event) => setParameters((current) => ({ ...current, frameCount: Number(event.target.value) }))} />
                </label>
              </>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-lg border border-white/45 bg-white/24 p-4 shadow-inner backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              {estimate.isLoading ? <p className="font-bold text-slate-400">Estimating offer...</p> : estimate.data ? <PriceDisplay value={estimate.data.estimatedCost} /> : <p className="font-bold text-coral">{estimate.error?.message ?? "Estimate unavailable"}</p>}
              {estimate.data ? <p className="mt-2 text-sm font-semibold text-slate-600">Estimated time ~{estimate.data.estimatedTime}s · {selectedEstimateProvider?.name} · {executionMode.toUpperCase()}</p> : null}
            </div>
            <Button disabled={!estimate.data || createJob.isPending} onClick={() => createJob.mutate()}>
              {createJob.isPending ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate
            </Button>
          </div>
        </Card>
      </section>

      <aside className="space-y-5">
        <Card className="p-5">
          <h2 className="text-xl font-black">Offer details</h2>
          {selectedEstimateProvider && estimate.data ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Provider</span><span className="font-black">{selectedEstimateProvider.name}</span></div>
              <div className="flex items-center justify-between"><span className="font-bold text-slate-700">GPU</span><span className="font-black">{selectedEstimateProvider.gpu}</span></div>
              <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Reputation</span><Rating value={selectedEstimateProvider.reputation} /></div>
              <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Score</span><Badge tone="success">{Math.round(estimate.data.score * 100)}%</Badge></div>
              <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Cost</span><span className="font-black text-pixol">{formatPixol(estimate.data.estimatedCost)}</span></div>
              <div className="flex items-center justify-between"><span className="font-bold text-slate-700">Mode</span><span className="font-black uppercase">{executionMode}</span></div>
            </div>
          ) : <p className="mt-4 text-sm font-semibold text-slate-600">Select a model and prompt to quote an executable offer.</p>}
        </Card>

        <ProgressPanel job={activeJob.data} />
      </aside>
      </div>
    </div>
  );
}

function ModeButton({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`flex h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-black transition ${
        active ? "border-cyan-300/90 bg-sky-500/62 text-white shadow-[0_12px_32px_rgba(59,130,246,0.28),inset_0_1px_0_rgba(255,255,255,0.36)] backdrop-blur-xl" : "border-white/42 bg-white/22 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.44)] backdrop-blur-xl hover:bg-white/36 hover:text-slate-950"
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function ProgressPanel({ job }: { job?: Job }) {
  return (
    <Card className="p-5">
      <h2 className="text-xl font-black">Job progress</h2>
      {job ? (
        <div className="mt-4">
          <div className="mb-4 flex items-center justify-between"><JobStatus status={job.status} /><span className="text-sm font-black">{job.progress}%</span></div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-pixol transition-all" style={{ width: `${job.progress}%` }} /></div>
          <p className="mt-4 text-sm text-slate-400">Model {job.modelId} · Provider {job.providerId}</p>
          {job.error ? <p className="mt-4 rounded-lg border border-red-300/50 bg-red-500/10 p-3 text-sm font-semibold text-red-700">{job.error}</p> : null}
          {job.resultUrl ? <MediaResult job={job} /> : <p className="mt-4 text-sm font-semibold text-slate-600">Generating media in {job.parameters.executionMode ?? "local"} execution mode...</p>}
        </div>
      ) : <p className="mt-4 text-sm font-semibold text-slate-600">Your active generation will appear here after confirmation.</p>}
    </Card>
  );
}

function MediaResult({ job }: { job: Job }) {
  const isVideo = job.parameters.mediaType === "VIDEO" && !job.resultMimeType?.includes("svg");

  if (isVideo) {
    return <video className="mt-4 aspect-video w-full rounded-lg object-cover" src={job.resultUrl} controls playsInline />;
  }

  return <img className="mt-4 aspect-[4/3] w-full rounded-lg object-cover" src={job.resultUrl} alt={job.prompt} />;
}
