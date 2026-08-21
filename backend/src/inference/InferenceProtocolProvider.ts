import type { Job, JobEstimate, JobRequest, JobResult, Model, Provider } from "../types.js";

export interface InferenceProtocolProvider {
  getProviders(): Promise<Provider[]>;
  getModels(): Promise<Model[]>;
  getProvider(providerId: string): Promise<Provider>;
  getModel(modelId: string): Promise<Model>;
  estimateJob(request: JobRequest): Promise<JobEstimate>;
  createJob(request: JobRequest): Promise<Job>;
  getJob(jobId: string): Promise<Job>;
  cancelJob(jobId: string): Promise<void>;
  getJobResult(jobId: string): Promise<JobResult>;
}
