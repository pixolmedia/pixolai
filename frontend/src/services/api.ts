import type { DashboardStats, GalleryItem, GenerationParameters, Job, JobEstimate, Model, Provider, Wallet } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const STATIC_MODE = import.meta.env.VITE_STATIC_MODE === "true";

const staticModels: Model[] = [
  {
    id: "local-ollama-image",
    name: "Stable Diffusion Local",
    description: "Local Stable Diffusion-compatible image workflow for ComfyUI, Automatic1111, Ollama adapters or custom workers.",
    type: "IMAGE",
    version: "local",
    creator: "Local Runtime",
    logoUrl: "https://www.google.com/s2/favicons?domain=comfy.org&sz=128",
    license: "Local execution",
    category: "Local",
    basePrice: 0,
    rating: 4.2,
    usageCount: 0,
    capabilities: ["Text-to-image", "Local endpoint", "Configurable runtime"],
    previews: ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_local"]
  },
  {
    id: "flux-1",
    name: "FLUX.1",
    description: "Black Forest Labs image generation model family known for strong prompt following and photorealistic output.",
    type: "IMAGE",
    version: "1.0",
    creator: "Black Forest Labs",
    logoUrl: "https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128",
    license: "Creator-distributed provider execution",
    category: "Photoreal",
    basePrice: 0.045,
    rating: 4.9,
    usageCount: 18420,
    capabilities: ["Text-to-image", "Editorial", "Product", "Cinematic"],
    previews: ["https://images.unsplash.com/photo-1635776062360-af423602aff3?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_alpha", "provider_delta"]
  },
  {
    id: "sdxl",
    name: "Stable Diffusion XL",
    description: "Stability AI image generation model for broad creative styles, image-to-image workflows, and local pipelines.",
    type: "IMAGE",
    version: "1.0",
    creator: "Stability AI",
    logoUrl: "https://www.google.com/s2/favicons?domain=stability.ai&sz=128",
    license: "Open model execution",
    category: "General",
    basePrice: 0.025,
    rating: 4.7,
    usageCount: 32110,
    capabilities: ["Text-to-image", "Image-to-image", "Concept art"],
    previews: ["https://images.unsplash.com/photo-1620121684840-edffcfc4b878?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_alpha", "provider_local", "provider_delta"]
  },
  {
    id: "pixol-product",
    name: "DALL·E 3",
    description: "OpenAI image generation model for high-quality prompt-driven illustration, design and commercial imagery.",
    type: "IMAGE",
    version: "3",
    creator: "OpenAI",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
    license: "API provider execution",
    category: "Commercial image",
    basePrice: 0.08,
    rating: 4.86,
    usageCount: 28400,
    capabilities: ["Text-to-image", "Illustration", "Product"],
    previews: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_delta"]
  },
  {
    id: "anime-arc",
    name: "Midjourney v6",
    description: "Midjourney image model profile for cinematic stylization, concept art, character work and editorial visuals.",
    type: "IMAGE",
    version: "6",
    creator: "Midjourney",
    logoUrl: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
    license: "External provider execution",
    category: "Stylized image",
    basePrice: 0.06,
    rating: 4.82,
    usageCount: 49100,
    capabilities: ["Characters", "Concept art", "Illustration"],
    previews: ["https://images.unsplash.com/photo-1618331833071-ce81bd50d300?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_delta"]
  },
  {
    id: "motionforge-v",
    name: "Sora",
    description: "OpenAI video generation model profile for text-to-video and rich motion synthesis workflows.",
    type: "VIDEO",
    version: "0.2",
    creator: "OpenAI",
    logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/openai.svg",
    license: "API provider execution",
    category: "Video",
    basePrice: 0.62,
    rating: 4.72,
    usageCount: 5810,
    capabilities: ["Text-to-video", "Image-to-video"],
    previews: ["https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_delta"]
  },
  {
    id: "local-video",
    name: "Runway Gen-3 Alpha",
    description: "Runway video generation model profile for text-to-video, image-to-video and cinematic motion workflows.",
    type: "VIDEO",
    version: "3",
    creator: "Runway",
    logoUrl: "https://www.google.com/s2/favicons?domain=runwayml.com&sz=128",
    license: "API provider execution",
    category: "Video",
    basePrice: 0.42,
    rating: 4.58,
    usageCount: 7400,
    capabilities: ["Text-to-video", "Image-to-video", "Video editing"],
    previews: ["https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80"],
    providerAvailability: ["provider_delta", "provider_local"]
  }
];

const staticProviders: Provider[] = [
  {
    id: "provider_local",
    name: "Local Runtime",
    status: "online",
    reputation: 4.2,
    uptime: 100,
    latency: 80,
    gpu: "Local GPU / CPU",
    location: "localhost",
    models: ["local-ollama-image", "local-video", "flux-1", "sdxl", "motionforge-v"],
    successRate: 100,
    priceMultiplier: 0,
    history: [{ day: "Now", completed: 0, failed: 0, averageLatency: 80 }]
  },
  {
    id: "provider_delta",
    name: "Provider Delta",
    status: "online",
    reputation: 4.88,
    uptime: 99,
    latency: 510,
    gpu: "H100",
    location: "SG",
    models: ["flux-1", "sdxl", "pixol-product", "anime-arc", "motionforge-v", "local-video"],
    successRate: 98.9,
    priceMultiplier: 1.28,
    history: [{ day: "Now", completed: 197, failed: 1, averageLatency: 510 }]
  },
  {
    id: "provider_alpha",
    name: "Provider Alpha",
    status: "online",
    reputation: 4.92,
    uptime: 99.3,
    latency: 420,
    gpu: "RTX 4090",
    location: "US",
    models: ["flux-1", "sdxl"],
    successRate: 99.1,
    priceMultiplier: 1.1,
    history: [{ day: "Now", completed: 166, failed: 1, averageLatency: 420 }]
  }
];

const staticJobs: Job[] = [
  {
    id: "job_static_1",
    userId: "user_demo",
    modelId: "flux-1",
    providerId: "provider_delta",
    prompt: "A futuristic decentralized AI media studio with transparent glass panels and neon compute routes",
    parameters: { aspectRatio: "16:9", quality: "standard", mediaType: "IMAGE", executionMode: "solai" },
    estimatedCost: 0.065,
    actualCost: 0.065,
    currency: "PIXOL",
    status: "COMPLETED",
    progress: 100,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    completedAt: new Date(Date.now() - 3_590_000).toISOString(),
    resultUrl: "https://picsum.photos/seed/pixol-static-1/1200/900"
  }
];

function staticEstimate(payload: JobPayload): JobEstimate & { payment: { amount: number } } {
  const model = staticModels.find((item) => item.id === payload.modelId) ?? staticModels[0];
  const provider = payload.providerId ? staticProviders.find((item) => item.id === payload.providerId) : staticProviders.find((item) => item.models.includes(model.id));
  const selectedProvider = provider ?? staticProviders[0];
  const executionMultiplier = payload.parameters.executionMode === "local" ? 0 : payload.parameters.executionMode === "api" ? 0.45 : 1;
  const videoMultiplier = model.type === "VIDEO" ? 6.5 : 1;
  const estimatedCost = Number((model.basePrice * selectedProvider.priceMultiplier * executionMultiplier * videoMultiplier).toFixed(3));
  return {
    modelId: model.id,
    providerId: selectedProvider.id,
    estimatedCost,
    currency: "PIXOL",
    estimatedTime: model.type === "VIDEO" ? 42 : 14,
    score: selectedProvider.id === "provider_local" ? 0.95 : 0.88,
    payment: { amount: estimatedCost }
  };
}

function staticRequest<T>(path: string, init?: RequestInit): T {
  if (path === "/api/runtime-config") {
    return {
      solaiNetworkApiUrl: "https://api.solai.network",
      solaiNetworkConfigured: false,
      localInferenceRuntime: "ollama",
      localInferenceUrl: "http://localhost:11434",
      compatibleInferenceApiUrl: "http://localhost:8000/v1",
      compatibleInferenceApiConfigured: false,
      comfyUiUrl: "http://localhost:8188",
      automatic1111Url: "http://localhost:7860",
      modes: ["local", "api"],
      localRuntimes: ["ollama", "comfyui", "automatic1111", "custom"]
    } as T;
  }

  if (path === "/api/models") return staticModels as T;
  if (path.startsWith("/api/models/")) return staticModels.find((item) => item.id === path.split("/").pop()) as T;
  if (path === "/api/providers") return staticProviders as T;
  if (path.startsWith("/api/providers/")) return staticProviders.find((item) => item.id === path.split("/").pop()) as T;
  if (path === "/api/jobs/estimate") return staticEstimate(JSON.parse(String(init?.body))) as T;
  if (path === "/api/jobs" && init?.method === "POST") {
    const payload = JSON.parse(String(init.body)) as JobPayload;
    const estimate = staticEstimate(payload);
    const job: Job = {
      id: `job_static_${Date.now()}`,
      userId: "user_demo",
      modelId: payload.modelId,
      providerId: estimate.providerId,
      prompt: payload.prompt,
      parameters: payload.parameters,
      estimatedCost: estimate.estimatedCost,
      actualCost: estimate.estimatedCost,
      currency: "PIXOL",
      status: "COMPLETED",
      progress: 100,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      resultUrl: `https://picsum.photos/seed/pixol-${Date.now()}/1200/900`
    };
    staticJobs.unshift(job);
    return { job, payment: { id: "pay_static", amount: estimate.estimatedCost, status: "VERIFIED" } } as T;
  }

  if (path === "/api/jobs") return staticJobs as T;
  if (path.startsWith("/api/jobs/")) return staticJobs.find((item) => item.id === path.split("/")[3]) as T;
  if (path === "/api/wallet") return { address: "0x1234fA8E91c0B2dE3aA4578f90bC5678", chain: "solana", balance: 666, connected: true } as T;
  if (path === "/api/wallet/balance") return { balance: 666, currency: "PIXOL" } as T;
  if (path === "/api/gallery") return staticJobs.map((job) => ({ ...job, model: staticModels.find((model) => model.id === job.modelId), provider: staticProviders.find((provider) => provider.id === job.providerId) })) as T;
  if (path === "/api/dashboard") {
    return {
      totalGenerations: staticJobs.length,
      pixolSpent: staticJobs.reduce((sum, job) => sum + (job.actualCost ?? 0), 0),
      favoriteModel: "flux-1",
      favoriteProvider: "provider_delta",
      successRate: 100,
      recentCreations: staticJobs.slice(0, 6)
    } as T;
  }

  throw new Error(`Static route is not implemented: ${path}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (STATIC_MODE) {
    return staticRequest<T>(path, init);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(payload.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}

export interface JobPayload {
  modelId: string;
  providerId?: string;
  prompt: string;
  parameters: GenerationParameters;
}

export interface RuntimeConfig {
  solaiNetworkApiUrl: string;
  solaiNetworkConfigured: boolean;
  localInferenceRuntime: string;
  localInferenceUrl: string;
  compatibleInferenceApiUrl: string;
  compatibleInferenceApiConfigured: boolean;
  comfyUiUrl: string;
  automatic1111Url: string;
  modes: string[];
  localRuntimes: string[];
}

export const api = {
  runtimeConfig: () => request<RuntimeConfig>("/api/runtime-config"),
  models: () => request<Model[]>("/api/models"),
  model: (id: string) => request<Model>(`/api/models/${id}`),
  providers: () => request<Provider[]>("/api/providers"),
  provider: (id: string) => request<Provider>(`/api/providers/${id}`),
  estimateJob: (payload: JobPayload) =>
    request<JobEstimate & { payment: { amount: number } }>("/api/jobs/estimate", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  createJob: (payload: JobPayload) =>
    request<{ job: Job; payment: { id: string; amount: number; status: string } }>("/api/jobs", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  jobs: () => request<Job[]>("/api/jobs"),
  job: (id: string) => request<Job>(`/api/jobs/${id}`),
  cancelJob: (id: string) => request<{ ok: boolean }>(`/api/jobs/${id}/cancel`, { method: "POST" }),
  wallet: () => request<Wallet>("/api/wallet"),
  balance: () => request<{ balance: number; currency: "PIXOL" }>("/api/wallet/balance"),
  gallery: () => request<GalleryItem[]>("/api/gallery"),
  dashboard: () => request<DashboardStats>("/api/dashboard")
};
