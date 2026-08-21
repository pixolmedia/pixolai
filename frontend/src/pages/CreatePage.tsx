import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api, type JobPayload } from "../services/api";
import type { GenerationParameters, Job } from "../types";
import { formatPixol } from "../utils/format";
import { useModels, useProviders } from "../hooks/usePixolData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { JobStatus } from "../components/ui/JobStatus";
import { Badge } from "../components/ui/Badge";
import { Rating } from "../components/ui/Rating";

export function CreatePage() {
  const queryClient = useQueryClient();
  const { data: models = [] } = useModels();
  const { data: providers = [] } = useProviders();
  const imageModels = models.filter((model) => model.type === "IMAGE");
  const [modelId, setModelId] = useState("flux-1");
  const [providerMode, setProviderMode] = useState<"auto" | "manual">("auto");
  const [providerId, setProviderId] = useState("");
  const [prompt, setPrompt] = useState("A premium fintech AI workspace for decentralized media generation, neon green accents, cinematic lighting");
  const [parameters, setParameters] = useState<GenerationParameters>({ aspectRatio: "1:1", quality: "standard" });
  const [activeJobId, setActiveJobId] = useState<string>();

  const compatibleProviders = useMemo(() => providers.filter((provider) => provider.models.includes(modelId)), [providers, modelId]);

  useEffect(() => {
    if (providerMode === "manual" && !providerId && compatibleProviders[0]) {
      setProviderId(compatibleProviders[0].id);
    }
  }, [compatibleProviders, providerId, providerMode]);

  const payload: JobPayload = {
    modelId,
    providerId: providerMode === "manual" ? providerId : undefined,
    prompt,
    parameters
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
    refetchInterval: (query) => (query.state.data?.status === "COMPLETED" ? false : 1000)
  });

  const selectedEstimateProvider = providers.find((provider) => provider.id === estimate.data?.providerId);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section>
        <div className="mb-6">
          <p className="text-sm font-black uppercase text-pixol">Create</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white lg:text-6xl">Generate AI media through executable offers.</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-400">Choose a model, choose an inference provider or let PIXOL auto-select the best offer, write a prompt, pay in PIXOL, and generate.</p>
        </div>

        <Card className="p-5 lg:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-300">Model</span>
              <select className="h-12 w-full rounded-lg border border-white/10 bg-[#0b1513] px-3 font-bold text-white" value={modelId} onChange={(event) => setModelId(event.target.value)}>
                {imageModels.map((model) => <option key={model.id} value={model.id}>{model.name}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-300">Provider</span>
              <select className="h-12 w-full rounded-lg border border-white/10 bg-[#0b1513] px-3 font-bold text-white" value={providerMode === "auto" ? "auto" : providerId} onChange={(event) => {
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

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-black text-slate-300">Prompt</span>
            <textarea className="min-h-36 w-full resize-y rounded-lg border border-white/10 bg-[#0b1513] p-4 text-white outline-none focus:border-pixol/70" value={prompt} maxLength={1200} onChange={(event) => setPrompt(event.target.value)} />
          </label>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-300">Aspect ratio</span>
              <select className="h-12 w-full rounded-lg border border-white/10 bg-[#0b1513] px-3 font-bold text-white" value={parameters.aspectRatio} onChange={(event) => setParameters((current) => ({ ...current, aspectRatio: event.target.value as GenerationParameters["aspectRatio"] }))}>
                <option value="1:1">1:1 Square</option>
                <option value="4:5">4:5 Portrait</option>
                <option value="16:9">16:9 Wide</option>
                <option value="9:16">9:16 Vertical</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-black text-slate-300">Quality</span>
              <select className="h-12 w-full rounded-lg border border-white/10 bg-[#0b1513] px-3 font-bold text-white" value={parameters.quality} onChange={(event) => setParameters((current) => ({ ...current, quality: event.target.value as GenerationParameters["quality"] }))}>
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="ultra">Ultra</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 md:flex-row md:items-center md:justify-between">
            <div>
              {estimate.isLoading ? <p className="font-bold text-slate-400">Estimating offer...</p> : estimate.data ? <PriceDisplay value={estimate.data.estimatedCost} /> : <p className="font-bold text-coral">{estimate.error?.message ?? "Estimate unavailable"}</p>}
              {estimate.data ? <p className="mt-2 text-sm text-slate-400">Estimated time ~{estimate.data.estimatedTime}s · {selectedEstimateProvider?.name}</p> : null}
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
              <div className="flex items-center justify-between"><span className="text-slate-400">Provider</span><span className="font-black">{selectedEstimateProvider.name}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">GPU</span><span className="font-black">{selectedEstimateProvider.gpu}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Reputation</span><Rating value={selectedEstimateProvider.reputation} /></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Score</span><Badge tone="success">{Math.round(estimate.data.score * 100)}%</Badge></div>
              <div className="flex items-center justify-between"><span className="text-slate-400">Cost</span><span className="font-black text-pixol">{formatPixol(estimate.data.estimatedCost)}</span></div>
            </div>
          ) : <p className="mt-4 text-sm text-slate-400">Select a model and prompt to quote an executable offer.</p>}
        </Card>

        <ProgressPanel job={activeJob.data} />
      </aside>
    </div>
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
          {job.resultUrl ? <img className="mt-4 aspect-[4/3] rounded-lg object-cover" src={job.resultUrl} alt={job.prompt} /> : <p className="mt-4 text-sm text-slate-400">Generating media in mock inference protocol mode...</p>}
        </div>
      ) : <p className="mt-4 text-sm text-slate-400">Your active generation will appear here after confirmation.</p>}
    </Card>
  );
}
