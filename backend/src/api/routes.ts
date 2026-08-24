import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getUser } from "../auth/authPlugin.js";
import { config } from "../config.js";
import type { InferenceProtocolProvider } from "../inference/InferenceProtocolProvider.js";
import type { PaymentService } from "../payments/PaymentService.js";
import type { WalletProvider } from "../wallet/WalletProvider.js";
import { createJobSchema, estimateJobSchema } from "./schemas.js";

interface RouteDeps {
  inferenceProvider: InferenceProtocolProvider;
  walletProvider: WalletProvider;
  paymentService: PaymentService;
}

export async function registerApiRoutes(app: FastifyInstance, deps: RouteDeps): Promise<void> {
  app.get("/health", async () => ({ status: "ok" }));

  app.get("/api/runtime-config", async () => ({
    solaiNetworkApiUrl: config.solaiNetworkApiUrl,
    solaiNetworkConfigured: Boolean(config.solaiNetworkApiKey),
    localInferenceRuntime: config.localInferenceRuntime,
    localInferenceUrl: config.localInferenceUrl,
    compatibleInferenceApiUrl: config.compatibleInferenceApiUrl,
    compatibleInferenceApiConfigured: Boolean(config.compatibleInferenceApiKey),
    comfyUiUrl: config.comfyUiUrl,
    automatic1111Url: config.automatic1111Url,
    modes: ["local", "api", "hybrid"],
    localRuntimes: ["ollama", "comfyui", "automatic1111", "custom"]
  }));

  app.post("/api/auth/connect", async () => ({
    token: "mock-development-token",
    user: { id: "user_demo", wallet: "0x1234fA8E91c0B2dE3aA4578f90bC5678" }
  }));

  app.get("/api/models", async () => deps.inferenceProvider.getModels());

  app.get("/api/models/:id", async (request) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    return deps.inferenceProvider.getModel(params.id);
  });

  app.get("/api/providers", async () => deps.inferenceProvider.getProviders());

  app.get("/api/providers/:id", async (request) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    return deps.inferenceProvider.getProvider(params.id);
  });

  app.post("/api/jobs/estimate", async (request) => {
    const user = getUser(request);
    const body = estimateJobSchema.parse(request.body);
    const estimate = await deps.inferenceProvider.estimateJob({ ...body, userId: user.id });
    const payment = await deps.paymentService.estimatePayment(estimate);
    return { ...estimate, payment };
  });

  app.post("/api/jobs", async (request) => {
    const user = getUser(request);
    const body = createJobSchema.parse(request.body);
    const estimate = await deps.inferenceProvider.estimateJob({ ...body, userId: user.id });
    const job = await deps.inferenceProvider.createJob({ ...body, providerId: estimate.providerId, userId: user.id });
    const payment = await deps.paymentService.createPayment(job.id, estimate.estimatedCost);
    return { job, payment };
  });

  app.get("/api/jobs", async () => deps.inferenceProvider.getAllJobs());

  app.get("/api/jobs/:id", async (request) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    return deps.inferenceProvider.getJob(params.id);
  });

  app.get("/api/jobs/:id/result", async (request) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    return deps.inferenceProvider.getJobResult(params.id);
  });

  app.post("/api/jobs/:id/cancel", async (request) => {
    const params = z.object({ id: z.string() }).parse(request.params);
    await deps.inferenceProvider.cancelJob(params.id);
    return { ok: true };
  });

  app.get("/api/wallet", async () => deps.walletProvider.getWallet());

  app.get("/api/wallet/balance", async () => deps.walletProvider.getBalance());

  app.get("/api/gallery", async () => {
    const jobs = deps.inferenceProvider.getAllJobs().filter((job) => job.status === "COMPLETED" && job.resultUrl);
    const [models, providers] = await Promise.all([deps.inferenceProvider.getModels(), deps.inferenceProvider.getProviders()]);
    return jobs.map((job) => ({
      ...job,
      model: models.find((model) => model.id === job.modelId),
      provider: providers.find((provider) => provider.id === job.providerId)
    }));
  });

  app.get("/api/dashboard", async () => {
    const jobs = deps.inferenceProvider.getAllJobs();
    const completed = jobs.filter((job) => job.status === "COMPLETED");
    const spent = completed.reduce((sum, job) => sum + (job.actualCost ?? job.estimatedCost), 0);
    const successRate = jobs.length ? Math.round((completed.length / jobs.length) * 100) : 0;
    const modelCounts = countBy(completed.map((job) => job.modelId));
    const providerCounts = countBy(completed.map((job) => job.providerId));
    return {
      totalGenerations: completed.length,
      pixolSpent: Number(spent.toFixed(3)),
      favoriteModel: topKey(modelCounts) ?? "flux-1",
      favoriteProvider: topKey(providerCounts) ?? "provider_alpha",
      successRate,
      recentCreations: completed.slice(0, 6)
    };
  });
}

function countBy(items: string[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
}

function topKey(counts: Record<string, number>): string | undefined {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}
