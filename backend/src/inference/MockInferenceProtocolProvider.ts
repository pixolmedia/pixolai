import type { Job, JobEstimate, JobRequest, JobResult, Model, Provider } from "../types.js";
import { initialJobs, models, providers } from "./mockData.js";
import { scoreProvider } from "./providerScoring.js";
import type { InferenceProtocolProvider } from "./InferenceProtocolProvider.js";

export class MockInferenceProtocolProvider implements InferenceProtocolProvider {
  private readonly jobs = new Map<string, Job>(initialJobs.map((job) => [job.id, job]));

  async getProviders(): Promise<Provider[]> {
    return providers;
  }

  async getModels(): Promise<Model[]> {
    return models;
  }

  async getProvider(providerId: string): Promise<Provider> {
    const provider = providers.find((item) => item.id === providerId);
    if (!provider) {
      throw new Error("Provider not found");
    }
    return provider;
  }

  async getModel(modelId: string): Promise<Model> {
    const model = models.find((item) => item.id === modelId);
    if (!model) {
      throw new Error("Model not found");
    }
    return model;
  }

  async estimateJob(request: JobRequest): Promise<JobEstimate> {
    const model = await this.getModel(request.modelId);
    const candidates = request.providerId
      ? [await this.getProvider(request.providerId)]
      : providers.filter((provider) => provider.models.includes(model.id));

    const estimates = candidates
      .filter((provider) => provider.status !== "offline" && provider.models.includes(model.id))
      .map((provider) => {
        const qualityMultiplier = request.parameters.quality === "ultra" ? 2.1 : request.parameters.quality === "high" ? 1.45 : 1;
        const ratioMultiplier = ["16:9", "9:16"].includes(request.parameters.aspectRatio) ? 1.12 : 1;
        const estimatedCost = Number((model.basePrice * provider.priceMultiplier * qualityMultiplier * ratioMultiplier).toFixed(3));
        const estimatedTime = Math.round(8 + provider.latency / 95 + qualityMultiplier * 5);
        const score = scoreProvider(provider, model, estimatedCost);
        return { modelId: model.id, providerId: provider.id, estimatedCost, currency: "PIXOL" as const, estimatedTime, score };
      })
      .sort((a, b) => b.score - a.score);

    const selected = estimates[0];
    if (!selected) {
      throw new Error("No compatible provider is available for this model");
    }

    return selected;
  }

  async createJob(request: JobRequest): Promise<Job> {
    const estimate = await this.estimateJob(request);
    const now = new Date().toISOString();
    const job: Job = {
      id: `job_${crypto.randomUUID()}`,
      userId: request.userId,
      modelId: request.modelId,
      providerId: estimate.providerId,
      prompt: request.prompt,
      parameters: request.parameters,
      estimatedCost: estimate.estimatedCost,
      currency: "PIXOL",
      status: "QUEUED",
      progress: 4,
      createdAt: now
    };

    this.jobs.set(job.id, job);
    this.simulateJob(job.id);
    return job;
  }

  async getJob(jobId: string): Promise<Job> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error("Job not found");
    }
    return job;
  }

  async cancelJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (job.status === "COMPLETED") {
      throw new Error("Completed jobs cannot be cancelled");
    }
    this.jobs.set(jobId, { ...job, status: "CANCELLED", progress: job.progress });
  }

  async getJobResult(jobId: string): Promise<JobResult> {
    const job = await this.getJob(jobId);
    if (job.status !== "COMPLETED" || !job.resultUrl) {
      throw new Error("Job result is not ready");
    }

    return {
      jobId,
      url: job.resultUrl,
      width: job.parameters.aspectRatio === "16:9" ? 1280 : 1024,
      height: job.parameters.aspectRatio === "9:16" ? 1280 : 1024,
      mimeType: "image/jpeg",
      prompt: job.prompt
    };
  }

  getAllJobs(): Job[] {
    return [...this.jobs.values()].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  private simulateJob(jobId: string): void {
    const checkpoints: Array<[number, Partial<Job>]> = [
      [700, { status: "PROCESSING", progress: 18, startedAt: new Date().toISOString() }],
      [1800, { progress: 42 }],
      [3200, { progress: 72 }],
      [4700, { progress: 91 }],
      [
        6200,
        {
          status: "COMPLETED",
          progress: 100,
          actualCost: undefined,
          completedAt: new Date(Date.now() + 6200).toISOString(),
          resultUrl: `https://picsum.photos/seed/${jobId}/1400/1000`
        }
      ]
    ];

    for (const [delay, update] of checkpoints) {
      setTimeout(() => {
        const current = this.jobs.get(jobId);
        if (!current || current.status === "CANCELLED") {
          return;
        }
        this.jobs.set(jobId, {
          ...current,
          ...update,
          actualCost: update.status === "COMPLETED" ? current.estimatedCost : current.actualCost
        });
      }, delay);
    }
  }
}
