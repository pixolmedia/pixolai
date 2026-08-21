import type { DashboardStats, GalleryItem, GenerationParameters, Job, JobEstimate, Model, Provider, Wallet } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
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

export const api = {
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
