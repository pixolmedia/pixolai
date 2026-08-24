import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "../config.js";
import type { GenerationParameters, Job, JobEstimate, JobRequest, JobResult, Model, ModelType, Provider } from "../types.js";
import { models, providers } from "./mockData.js";
import { scoreProvider } from "./providerScoring.js";
import type { InferenceProtocolProvider } from "./InferenceProtocolProvider.js";

interface GeneratedMedia {
  url: string;
  mimeType: string;
}

interface RemoteMediaPayload {
  url?: string;
  image_url?: string;
  video_url?: string;
  b64_json?: string;
  data?: Array<{ url?: string; b64_json?: string }>;
  output?: Array<{ url?: string; b64_json?: string }>;
}

const aspectSizes: Record<GenerationParameters["aspectRatio"], { width: number; height: number; openAiSize: string }> = {
  "1:1": { width: 1024, height: 1024, openAiSize: "1024x1024" },
  "4:5": { width: 1024, height: 1280, openAiSize: "1024x1024" },
  "16:9": { width: 1280, height: 720, openAiSize: "1792x1024" },
  "9:16": { width: 720, height: 1280, openAiSize: "1024x1792" }
};

export class UniversalInferenceProvider implements InferenceProtocolProvider {
  private readonly jobs = new Map<string, Job>();

  async getProviders(): Promise<Provider[]> {
    return providers.filter((provider) => provider.id !== "provider_alpha" && provider.id !== "provider_beta" && provider.id !== "provider_gamma");
  }

  async getModels(): Promise<Model[]> {
    return models.map((model) => ({
      ...model,
      providerAvailability: [...new Set([...model.providerAvailability.filter((id) => id === "provider_local" || id === "provider_delta"), "provider_local"])]
    }));
  }

  async getProvider(providerId: string): Promise<Provider> {
    const provider = (await this.getProviders()).find((item) => item.id === providerId);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  async getModel(modelId: string): Promise<Model> {
    const model = (await this.getModels()).find((item) => item.id === modelId);
    if (!model) {
      throw new Error("Model not found");
    }
    return model;
  }

  async estimateJob(request: JobRequest): Promise<JobEstimate> {
    const model = await this.getModel(request.modelId);
    const providerId = this.resolveProviderId(request);
    const provider = await this.getProvider(providerId);
    const qualityMultiplier = request.parameters.quality === "ultra" ? 2.1 : request.parameters.quality === "high" ? 1.45 : 1;
    const ratioMultiplier = ["16:9", "9:16"].includes(request.parameters.aspectRatio) ? 1.12 : 1;
    const videoMultiplier = this.mediaType(model, request.parameters) === "VIDEO" ? 6.5 : 1;
    const executionMultiplier = request.parameters.executionMode === "local" ? 0 : request.parameters.executionMode === "api" ? 0.45 : 0.65;
    const estimatedCost = Number((model.basePrice * provider.priceMultiplier * qualityMultiplier * ratioMultiplier * videoMultiplier * executionMultiplier).toFixed(3));
    const estimatedTime = Math.round((this.mediaType(model, request.parameters) === "VIDEO" ? 36 : 12) * qualityMultiplier);

    return {
      modelId: model.id,
      providerId,
      estimatedCost,
      currency: "PIXOL",
      estimatedTime,
      score: provider.id === "provider_local" ? 0.98 : scoreProvider(provider, model, estimatedCost)
    };
  }

  async createJob(request: JobRequest): Promise<Job> {
    const estimate = await this.estimateJob(request);
    const now = new Date().toISOString();
    const job: Job = {
      id: `job_${randomUUID()}`,
      userId: request.userId,
      modelId: request.modelId,
      providerId: estimate.providerId,
      prompt: request.prompt,
      parameters: request.parameters,
      estimatedCost: estimate.estimatedCost,
      currency: "PIXOL",
      status: "QUEUED",
      progress: 2,
      createdAt: now
    };

    this.jobs.set(job.id, job);
    void this.runJob(job.id);
    return job;
  }

  async getJob(jobId: string): Promise<Job> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  getAllJobs(): Job[] {
    return [...this.jobs.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job.status === "COMPLETED") {
      throw new Error("Completed jobs cannot be cancelled");
    }
    this.jobs.set(jobId, { ...job, status: "CANCELLED" });
  }

  async getJobResult(jobId: string): Promise<JobResult> {
    const job = await this.getJob(jobId);
    if (job.status !== "COMPLETED" || !job.resultUrl) {
      throw new Error("Job result is not ready");
    }

    const size = aspectSizes[job.parameters.aspectRatio];
    return {
      jobId,
      url: job.resultUrl,
      width: size.width,
      height: size.height,
      mimeType: job.resultMimeType ?? "image/svg+xml",
      prompt: job.prompt
    };
  }

  private async runJob(jobId: string): Promise<void> {
    const current = this.jobs.get(jobId);
    if (!current) {
      return;
    }

    this.updateJob(jobId, { status: "PROCESSING", progress: 12, startedAt: new Date().toISOString() });

    try {
      const generated = await this.generate(current);
      this.updateJob(jobId, {
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date().toISOString(),
        actualCost: current.estimatedCost,
        resultUrl: generated.url,
        resultMimeType: generated.mimeType
      });
    } catch (error) {
      this.updateJob(jobId, {
        status: "FAILED",
        progress: 100,
        completedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Generation failed"
      });
    }
  }

  private async generate(job: Job): Promise<GeneratedMedia> {
    const mode = job.parameters.executionMode ?? "local";
    this.updateJob(job.id, { progress: 28 });

    if (mode === "api") {
      return this.generateWithApi(job);
    }

    if (mode === "local" || mode === "hybrid") {
      return this.generateWithLocalRuntime(job);
    }

    throw new Error("SOLAI provider is disabled for this release");
  }

  private async generateWithApi(job: Job): Promise<GeneratedMedia> {
    const endpoint = normalizeBaseUrl(job.parameters.apiEndpoint || config.compatibleInferenceApiUrl);
    const apiKey = job.parameters.apiKey || config.compatibleInferenceApiKey;
    if (!endpoint) {
      throw new Error("API endpoint is not configured");
    }

    const mediaType = await this.mediaTypeFromJob(job);
    const path = mediaType === "VIDEO" ? "/videos/generations" : "/images/generations";
    const body = mediaType === "VIDEO" ? this.videoApiBody(job) : this.imageApiBody(job);
    const payload = await postJson<RemoteMediaPayload>(`${endpoint}${path}`, body, apiKey);
    this.updateJob(job.id, { progress: 76 });
    return this.persistRemotePayload(job, payload, mediaType);
  }

  private async generateWithLocalRuntime(job: Job): Promise<GeneratedMedia> {
    const runtime = job.parameters.localRuntime || config.localInferenceRuntime;
    const endpoint = normalizeBaseUrl(job.parameters.localEndpoint || this.defaultLocalEndpoint(runtime));
    const mediaType = await this.mediaTypeFromJob(job);

    if (runtime === "automatic1111") {
      return this.generateWithAutomatic1111(job, endpoint, mediaType);
    }

    if (runtime === "custom") {
      return this.generateWithCustomRuntime(job, endpoint, mediaType);
    }

    if (runtime === "comfyui") {
      return this.generateWithComfyUi(job, endpoint, mediaType);
    }

    return this.generateWithOllama(job, endpoint, mediaType);
  }

  private async generateWithAutomatic1111(job: Job, endpoint: string, mediaType: ModelType): Promise<GeneratedMedia> {
    if (mediaType === "VIDEO") {
      throw new Error("Automatic1111 runtime supports image jobs only. Use API or custom runtime for video.");
    }

    const size = aspectSizes[job.parameters.aspectRatio];
    const payload = await postJson<{ images?: string[] }>(`${endpoint}/sdapi/v1/txt2img`, {
      prompt: job.prompt,
      negative_prompt: job.parameters.negativePrompt,
      width: size.width,
      height: size.height,
      steps: job.parameters.quality === "ultra" ? 40 : job.parameters.quality === "high" ? 28 : 18,
      seed: job.parameters.seed ?? -1
    });
    const image = payload.images?.[0];
    if (!image) {
      throw new Error("Automatic1111 did not return an image");
    }
    this.updateJob(job.id, { progress: 80 });
    return this.writeBase64Artifact(job.id, image, "png", "image/png");
  }

  private async generateWithCustomRuntime(job: Job, endpoint: string, mediaType: ModelType): Promise<GeneratedMedia> {
    const payload = await postJson<RemoteMediaPayload>(`${endpoint}/generate`, {
      model: job.modelId,
      prompt: job.prompt,
      negativePrompt: job.parameters.negativePrompt,
      mediaType,
      parameters: job.parameters
    });
    this.updateJob(job.id, { progress: 76 });
    return this.persistRemotePayload(job, payload, mediaType);
  }

  private async generateWithComfyUi(job: Job, endpoint: string, mediaType: ModelType): Promise<GeneratedMedia> {
    if (mediaType === "VIDEO") {
      throw new Error("ComfyUI video requires a custom workflow service. Use Local Custom runtime for video.");
    }

    const workflow = config.comfyUiWorkflow ? JSON.parse(config.comfyUiWorkflow) : undefined;
    if (!workflow) {
      throw new Error("COMFYUI_WORKFLOW_JSON is required for ComfyUI execution");
    }

    const response = await postJson<{ prompt_id?: string }>(`${endpoint}/prompt`, {
      prompt: workflow,
      client_id: `pixolai-${job.id}`
    });
    if (!response.prompt_id) {
      throw new Error("ComfyUI did not accept the workflow");
    }

    return this.generateWithOllama(job, config.localInferenceUrl, mediaType, `ComfyUI queued prompt ${response.prompt_id}`);
  }

  private async generateWithOllama(job: Job, endpoint: string, mediaType: ModelType, note?: string): Promise<GeneratedMedia> {
    const model = config.ollamaModel || (mediaType === "VIDEO" ? "llama3.1" : "llama3.1");
    const response = await fetch(`${endpoint}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        prompt: `Create a concise visual production plan for this ${mediaType.toLowerCase()} prompt. Return vivid nouns, colors and composition only.\nPrompt: ${job.prompt}`
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with ${response.status}`);
    }

    const payload = (await response.json()) as { response?: string };
    const plan = [note, payload.response].filter(Boolean).join("\n");
    this.updateJob(job.id, { progress: 78 });
    return mediaType === "VIDEO" ? this.writeAnimatedSvgArtifact(job, plan) : this.writeSvgArtifact(job, plan);
  }

  private async persistRemotePayload(job: Job, payload: RemoteMediaPayload, mediaType: ModelType): Promise<GeneratedMedia> {
    const item = payload.data?.[0] ?? payload.output?.[0] ?? payload;
    const url = item.url ?? payload.url ?? payload.image_url ?? payload.video_url;
    if (url) {
      return { url, mimeType: mediaType === "VIDEO" ? "video/mp4" : "image/png" };
    }

    const b64 = item.b64_json ?? payload.b64_json;
    if (b64) {
      const extension = mediaType === "VIDEO" ? "mp4" : "png";
      return this.writeBase64Artifact(job.id, b64, extension, mediaType === "VIDEO" ? "video/mp4" : "image/png");
    }

    throw new Error("Inference API response did not include a media URL or base64 payload");
  }

  private async writeSvgArtifact(job: Job, plan: string): Promise<GeneratedMedia> {
    const size = aspectSizes[job.parameters.aspectRatio];
    const svg = renderSvg(job.prompt, plan, size.width, size.height, false);
    const fileName = `${job.id}.svg`;
    await writeArtifact(fileName, svg);
    return { url: `${config.publicApiUrl}/media/${fileName}`, mimeType: "image/svg+xml" };
  }

  private async writeAnimatedSvgArtifact(job: Job, plan: string): Promise<GeneratedMedia> {
    const size = aspectSizes[job.parameters.aspectRatio];
    const svg = renderSvg(job.prompt, plan, size.width, size.height, true);
    const fileName = `${job.id}-motion.svg`;
    await writeArtifact(fileName, svg);
    return { url: `${config.publicApiUrl}/media/${fileName}`, mimeType: "image/svg+xml" };
  }

  private async writeBase64Artifact(jobId: string, b64: string, extension: string, mimeType: string): Promise<GeneratedMedia> {
    const fileName = `${jobId}.${extension}`;
    await writeArtifact(fileName, Buffer.from(stripDataUrl(b64), "base64"));
    return { url: `${config.publicApiUrl}/media/${fileName}`, mimeType };
  }

  private async mediaTypeFromJob(job: Job): Promise<ModelType> {
    return this.mediaType(await this.getModel(job.modelId), job.parameters);
  }

  private mediaType(model: Model, parameters: GenerationParameters): ModelType {
    return parameters.mediaType ?? model.type;
  }

  private resolveProviderId(request: JobRequest): string {
    if (request.parameters.executionMode === "local") {
      return "provider_local";
    }
    if (request.parameters.executionMode === "api") {
      return "provider_delta";
    }
    if (request.parameters.executionMode === "solai") {
      throw new Error("SOLAI provider is disabled for this release");
    }
    return request.providerId || "provider_local";
  }

  private defaultLocalEndpoint(runtime: GenerationParameters["localRuntime"]): string {
    if (runtime === "comfyui") {
      return config.comfyUiUrl;
    }
    if (runtime === "automatic1111") {
      return config.automatic1111Url;
    }
    return config.localInferenceUrl;
  }

  private imageApiBody(job: Job): Record<string, unknown> {
    const size = aspectSizes[job.parameters.aspectRatio];
    return {
      model: config.compatibleImageModel || job.modelId,
      prompt: withNegativePrompt(job.prompt, job.parameters.negativePrompt),
      size: size.openAiSize,
      n: 1,
      response_format: "b64_json",
      quality: job.parameters.quality === "standard" ? "standard" : "hd"
    };
  }

  private videoApiBody(job: Job): Record<string, unknown> {
    const size = aspectSizes[job.parameters.aspectRatio];
    return {
      model: config.compatibleVideoModel || job.modelId,
      prompt: withNegativePrompt(job.prompt, job.parameters.negativePrompt),
      seconds: job.parameters.durationSeconds ?? 4,
      duration: job.parameters.durationSeconds ?? 4,
      frames: job.parameters.frameCount ?? 48,
      size: `${size.width}x${size.height}`
    };
  }

  private updateJob(jobId: string, update: Partial<Job>): void {
    const current = this.jobs.get(jobId);
    if (!current || current.status === "CANCELLED") {
      return;
    }
    this.jobs.set(jobId, { ...current, ...update });
  }
}

async function postJson<T>(url: string, body: unknown, apiKey?: string): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Inference request failed with ${response.status}: ${message.slice(0, 300)}`);
  }

  return response.json() as Promise<T>;
}

async function writeArtifact(fileName: string, content: string | Buffer): Promise<void> {
  await mkdir(config.mediaStorageDir, { recursive: true });
  await writeFile(join(config.mediaStorageDir, fileName), content);
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

function stripDataUrl(value: string): string {
  return value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
}

function withNegativePrompt(prompt: string, negativePrompt?: string): string {
  return negativePrompt ? `${prompt}\nAvoid: ${negativePrompt}` : prompt;
}

function renderSvg(prompt: string, plan: string, width: number, height: number, animated: boolean): string {
  const seed = hash(`${prompt}${plan}`);
  const colors = palette(seed);
  const title = escapeXml(prompt.slice(0, 120));
  const planText = escapeXml(plan.replace(/\s+/g, " ").slice(0, 220));
  const animation = animated
    ? `<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 ${width / 2} ${height / 2}" to="360 ${width / 2} ${height / 2}" dur="9s" repeatCount="indefinite" />`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${colors[0]}"/>
      <stop offset="0.52" stop-color="${colors[1]}"/>
      <stop offset="1" stop-color="${colors[2]}"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g opacity="0.45" filter="url(#soft)">
    <circle cx="${width * 0.24}" cy="${height * 0.26}" r="${Math.min(width, height) * 0.2}" fill="${colors[3]}">${animation}</circle>
    <circle cx="${width * 0.76}" cy="${height * 0.58}" r="${Math.min(width, height) * 0.26}" fill="${colors[4]}"/>
  </g>
  <g transform="translate(${width * 0.08} ${height * 0.12})">
    <rect width="${width * 0.84}" height="${height * 0.76}" rx="28" fill="rgba(8,16,30,0.34)" stroke="rgba(255,255,255,0.42)"/>
    <text x="42" y="78" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="${Math.max(30, width * 0.044)}" font-weight="800">PIXOLAI ${animated ? "Motion" : "Image"}</text>
    <foreignObject x="42" y="120" width="${width * 0.72}" height="${height * 0.42}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter,Arial,sans-serif;color:white;font-size:${Math.max(18, width * 0.024)}px;font-weight:700;line-height:1.28">${title}</div>
    </foreignObject>
    <foreignObject x="42" y="${height * 0.58}" width="${width * 0.72}" height="${height * 0.18}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter,Arial,sans-serif;color:rgba(255,255,255,.78);font-size:${Math.max(13, width * 0.015)}px;font-weight:600;line-height:1.35">${planText}</div>
    </foreignObject>
  </g>
</svg>`;
}

function hash(input: string): number {
  return [...input].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 2166136261);
}

function palette(seed: number): string[] {
  const hues = [seed % 360, (seed + 74) % 360, (seed + 153) % 360, (seed + 218) % 360, (seed + 291) % 360];
  return hues.map((hue, index) => `hsl(${hue} ${index < 3 ? 68 : 82}% ${index < 3 ? 34 + index * 7 : 58}%)`);
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] ?? char);
}
