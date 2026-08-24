import type { DashboardStats, GalleryItem, GenerationParameters, Job, JobEstimate, Model, Provider, Wallet } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const STATIC_MODE = import.meta.env.VITE_STATIC_MODE === "true";
const DIRECT_MODE = STATIC_MODE || !API_URL;
const JOBS_STORAGE_KEY = "pixolai-browser-jobs";

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
    parameters: { aspectRatio: "16:9", quality: "standard", mediaType: "IMAGE", executionMode: "local", localRuntime: "custom" },
    estimatedCost: 0.065,
    actualCost: 0.065,
    currency: "PIXOL",
    status: "COMPLETED",
    progress: 100,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    completedAt: new Date(Date.now() - 3_590_000).toISOString(),
    resultUrl: makeSvgDataUrl("A futuristic decentralized AI media studio with transparent glass panels and neon compute routes", "IMAGE"),
    resultMimeType: "image/svg+xml"
  }
];

let browserJobs: Job[] = loadJobs();

function staticEstimate(payload: JobPayload): JobEstimate & { payment: { amount: number } } {
  const model = staticModels.find((item) => item.id === payload.modelId) ?? staticModels[0];
  const providerId = payload.parameters.executionMode === "api" ? "provider_delta" : "provider_local";
  const provider = staticProviders.find((item) => item.id === providerId) ?? staticProviders.find((item) => item.models.includes(model.id));
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

async function staticRequest<T>(path: string, init?: RequestInit): Promise<T> {
  if (path === "/api/runtime-config") {
    return {
      solaiNetworkApiUrl: "https://api.solai.network",
      solaiNetworkConfigured: false,
      localInferenceRuntime: "custom",
      localInferenceUrl: "http://localhost:11434",
      compatibleInferenceApiUrl: "https://api.openai.com/v1",
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
    const createdAt = new Date().toISOString();
    const job: Job = {
      id: `job_static_${Date.now()}`,
      userId: "user_demo",
      modelId: payload.modelId,
      providerId: estimate.providerId,
      prompt: payload.prompt,
      parameters: payload.parameters,
      estimatedCost: estimate.estimatedCost,
      currency: "PIXOL",
      status: "PROCESSING",
      progress: 35,
      createdAt,
      startedAt: createdAt
    };
    browserJobs.unshift(job);
    saveJobs();

    const completedJob = await runBrowserGeneration(job);
    browserJobs = browserJobs.map((item) => item.id === completedJob.id ? completedJob : item);
    saveJobs();
    return { job: completedJob, payment: { id: "pay_static", amount: estimate.estimatedCost, status: completedJob.status === "COMPLETED" ? "VERIFIED" : "FAILED" } } as T;
  }

  if (path === "/api/jobs") return browserJobs as T;
  if (path.startsWith("/api/jobs/")) return browserJobs.find((item) => item.id === path.split("/")[3]) as T;
  if (path === "/api/wallet") return { address: "0x1234fA8E91c0B2dE3aA4578f90bC5678", chain: "solana", balance: 666, connected: true } as T;
  if (path === "/api/wallet/balance") return { balance: 666, currency: "PIXOL" } as T;
  if (path === "/api/gallery") return browserJobs.filter((job) => job.status === "COMPLETED").map((job) => ({ ...job, model: staticModels.find((model) => model.id === job.modelId), provider: staticProviders.find((provider) => provider.id === job.providerId) })) as T;
  if (path === "/api/dashboard") {
    const completed = browserJobs.filter((job) => job.status === "COMPLETED");
    return {
      totalGenerations: completed.length,
      pixolSpent: completed.reduce((sum, job) => sum + (job.actualCost ?? 0), 0),
      favoriteModel: completed[0]?.modelId ?? "local-ollama-image",
      favoriteProvider: completed[0]?.providerId ?? "provider_local",
      successRate: browserJobs.length ? Math.round((completed.length / browserJobs.length) * 100) : 100,
      recentCreations: completed.slice(0, 6)
    } as T;
  }

  throw new Error(`Static route is not implemented: ${path}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (DIRECT_MODE) {
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

async function runBrowserGeneration(job: Job): Promise<Job> {
  try {
    const media = await generateInBrowser(job);
    return {
      ...job,
      status: "COMPLETED",
      progress: 100,
      actualCost: job.estimatedCost,
      completedAt: new Date().toISOString(),
      resultUrl: media.url,
      resultMimeType: media.mimeType
    };
  } catch (error) {
    return {
      ...job,
      status: "FAILED",
      progress: 100,
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Generation failed"
    };
  }
}

async function generateInBrowser(job: Job): Promise<{ url: string; mimeType: string }> {
  if (job.parameters.executionMode === "api") {
    return generateWithApi(job);
  }

  if (job.parameters.localRuntime === "automatic1111") {
    return generateWithAutomatic1111(job);
  }

  if (job.parameters.localRuntime === "ollama") {
    return generateWithOllama(job);
  }

  if (job.parameters.localRuntime === "comfyui") {
    throw new Error("ComfyUI direct browser mode needs a custom result bridge. Use Local Custom endpoint for ComfyUI workflows.");
  }

  if (job.parameters.localRuntime === "custom" && job.parameters.localEndpoint) {
    return generateWithCustomRuntime(job);
  }

  return {
    url: makeSvgDataUrl(job.prompt, job.parameters.mediaType ?? "IMAGE"),
    mimeType: "image/svg+xml"
  };
}

async function generateWithApi(job: Job): Promise<{ url: string; mimeType: string }> {
  const endpoint = normalizeUrl(job.parameters.apiEndpoint);
  if (!endpoint) {
    throw new Error("Configure an API endpoint in Settings.");
  }
  if (!job.parameters.apiKey) {
    throw new Error("Paste your API key in Settings before using API mode.");
  }

  const isVideo = job.parameters.mediaType === "VIDEO";
  const response = await fetch(`${endpoint}${isVideo ? "/videos/generations" : "/images/generations"}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${job.parameters.apiKey}`
    },
    body: JSON.stringify(isVideo ? videoApiBody(job) : imageApiBody(job))
  });

  if (!response.ok) {
    throw new Error(`API generation failed with ${response.status}: ${(await response.text()).slice(0, 220)}`);
  }

  return mediaFromPayload(await response.json(), isVideo);
}

async function generateWithAutomatic1111(job: Job): Promise<{ url: string; mimeType: string }> {
  const endpoint = normalizeUrl(job.parameters.localEndpoint);
  if (!endpoint) {
    throw new Error("Configure your Automatic1111 endpoint in Settings.");
  }
  const size = sizeForAspect(job.parameters.aspectRatio);
  const response = await fetch(`${endpoint}/sdapi/v1/txt2img`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: job.prompt,
      negative_prompt: job.parameters.negativePrompt,
      width: size.width,
      height: size.height,
      steps: job.parameters.quality === "ultra" ? 40 : job.parameters.quality === "high" ? 28 : 18,
      seed: job.parameters.seed ?? -1
    })
  });

  if (!response.ok) {
    throw new Error(`Automatic1111 failed with ${response.status}. Enable CORS on your local runtime if the browser blocks the request.`);
  }

  const payload = await response.json() as { images?: string[] };
  const image = payload.images?.[0];
  if (!image) {
    throw new Error("Automatic1111 did not return an image.");
  }
  return { url: asDataUrl(image, "image/png"), mimeType: "image/png" };
}

async function generateWithOllama(job: Job): Promise<{ url: string; mimeType: string }> {
  const endpoint = normalizeUrl(job.parameters.localEndpoint);
  if (!endpoint) {
    throw new Error("Configure your Ollama endpoint in Settings.");
  }

  const response = await fetch(`${endpoint}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.1",
      stream: false,
      prompt: `Create a concise visual production plan for this prompt. Return colors, composition and subject only.\nPrompt: ${job.prompt}`
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama failed with ${response.status}. Set OLLAMA_ORIGINS=* for browser access if CORS blocks localhost.`);
  }

  const payload = await response.json() as { response?: string };
  return { url: makeSvgDataUrl(`${job.prompt}\n${payload.response ?? ""}`, job.parameters.mediaType ?? "IMAGE"), mimeType: "image/svg+xml" };
}

async function generateWithCustomRuntime(job: Job): Promise<{ url: string; mimeType: string }> {
  const endpoint = normalizeUrl(job.parameters.localEndpoint);
  const response = await fetch(`${endpoint}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: job.modelId,
      prompt: job.prompt,
      mediaType: job.parameters.mediaType ?? "IMAGE",
      parameters: job.parameters
    })
  });

  if (!response.ok) {
    throw new Error(`Custom runtime failed with ${response.status}. Enable CORS on your local runtime if needed.`);
  }

  return mediaFromPayload(await response.json(), job.parameters.mediaType === "VIDEO");
}

function mediaFromPayload(payload: unknown, isVideo: boolean): { url: string; mimeType: string } {
  const data = payload as { url?: string; image_url?: string; video_url?: string; b64_json?: string; data?: Array<{ url?: string; b64_json?: string }>; output?: Array<{ url?: string; b64_json?: string }> };
  const item = data.data?.[0] ?? data.output?.[0] ?? data;
  const url = item.url ?? data.url ?? data.image_url ?? data.video_url;
  if (url) {
    return { url, mimeType: isVideo ? "video/mp4" : "image/png" };
  }

  const b64 = item.b64_json ?? data.b64_json;
  if (b64) {
    return { url: asDataUrl(b64, isVideo ? "video/mp4" : "image/png"), mimeType: isVideo ? "video/mp4" : "image/png" };
  }

  throw new Error("Generation response did not include a URL or base64 media payload.");
}

function imageApiBody(job: Job): Record<string, unknown> {
  return {
    model: job.modelId === "pixol-product" ? "gpt-image-1" : job.modelId,
    prompt: job.parameters.negativePrompt ? `${job.prompt}\nAvoid: ${job.parameters.negativePrompt}` : job.prompt,
    size: sizeForAspect(job.parameters.aspectRatio).openAiSize,
    n: 1
  };
}

function videoApiBody(job: Job): Record<string, unknown> {
  const size = sizeForAspect(job.parameters.aspectRatio);
  return {
    model: job.modelId,
    prompt: job.prompt,
    seconds: job.parameters.durationSeconds ?? 4,
    duration: job.parameters.durationSeconds ?? 4,
    frames: job.parameters.frameCount ?? 48,
    size: `${size.width}x${size.height}`
  };
}

function sizeForAspect(aspectRatio: GenerationParameters["aspectRatio"]): { width: number; height: number; openAiSize: string } {
  if (aspectRatio === "16:9") return { width: 1280, height: 720, openAiSize: "1792x1024" };
  if (aspectRatio === "9:16") return { width: 720, height: 1280, openAiSize: "1024x1792" };
  if (aspectRatio === "4:5") return { width: 1024, height: 1280, openAiSize: "1024x1024" };
  return { width: 1024, height: 1024, openAiSize: "1024x1024" };
}

function makeSvgDataUrl(prompt: string, mediaType: GenerationParameters["mediaType"]): string {
  const animated = mediaType === "VIDEO";
  const safePrompt = escapeHtml(prompt.slice(0, 420));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset=".52" stop-color="#334155"/><stop offset="1" stop-color="#22c55e"/></linearGradient></defs><rect width="1280" height="720" fill="url(#g)"/><circle cx="960" cy="180" r="160" fill="#fff" opacity=".16">${animated ? '<animate attributeName="cx" values="960;760;960" dur="5s" repeatCount="indefinite"/>' : ""}</circle><rect x="88" y="86" width="1104" height="548" rx="28" fill="rgba(8,16,30,.42)" stroke="rgba(255,255,255,.42)"/><text x="138" y="178" fill="#fff" font-family="Arial" font-size="56" font-weight="800">PIXOLAI ${animated ? "Video" : "Image"}</text><foreignObject x="138" y="235" width="940" height="290"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial;color:white;font-size:34px;font-weight:700;line-height:1.25">${safePrompt}</div></foreignObject></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function asDataUrl(value: string, mimeType: string): string {
  if (value.startsWith("data:")) return value;
  return `data:${mimeType};base64,${value.includes(",") ? value.slice(value.indexOf(",") + 1) : value}`;
}

function normalizeUrl(value?: string): string {
  return (value ?? "").trim().replace(/\/+$/, "");
}

function loadJobs(): Job[] {
  try {
    const stored = localStorage.getItem(JOBS_STORAGE_KEY);
    return stored ? JSON.parse(stored) as Job[] : staticJobs;
  } catch {
    return staticJobs;
  }
}

function saveJobs(): void {
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(browserJobs.slice(0, 100)));
}

function escapeHtml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&#39;", '"': "&quot;" })[char] ?? char);
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
