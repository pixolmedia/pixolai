export type ModelType = "IMAGE" | "VIDEO";
export type ExecutionMode = "local" | "api" | "solai" | "hybrid";
export type ProviderStatus = "online" | "degraded" | "offline";
export type JobStatus = "PENDING" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";

export interface GenerationParameters {
  aspectRatio: "1:1" | "4:5" | "16:9" | "9:16";
  quality: "standard" | "high" | "ultra";
  mediaType?: ModelType;
  executionMode?: ExecutionMode;
  localRuntime?: "ollama" | "comfyui" | "automatic1111" | "custom";
  localEndpoint?: string;
  apiEndpoint?: string;
  negativePrompt?: string;
  frameCount?: number;
  durationSeconds?: number;
  seed?: number;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  version: string;
  creator: string;
  logoUrl?: string;
  license: string;
  category: string;
  basePrice: number;
  rating: number;
  usageCount: number;
  capabilities: string[];
  previews: string[];
  providerAvailability: string[];
}

export interface Provider {
  id: string;
  name: string;
  status: ProviderStatus;
  reputation: number;
  uptime: number;
  latency: number;
  gpu: string;
  location: string;
  models: string[];
  successRate: number;
  priceMultiplier: number;
  history: Array<{ day: string; completed: number; failed: number; averageLatency: number }>;
}

export interface JobEstimate {
  modelId: string;
  providerId: string;
  estimatedCost: number;
  currency: "PIXOL";
  estimatedTime: number;
  score: number;
}

export interface Job {
  id: string;
  userId: string;
  modelId: string;
  providerId: string;
  prompt: string;
  parameters: GenerationParameters;
  estimatedCost: number;
  actualCost?: number;
  currency: "PIXOL";
  status: JobStatus;
  progress: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  resultUrl?: string;
  error?: string;
}

export interface GalleryItem extends Job {
  model?: Model;
  provider?: Provider;
}

export interface Wallet {
  address: string;
  chain: "solana";
  balance: number;
  connected: boolean;
}

export interface DashboardStats {
  totalGenerations: number;
  pixolSpent: number;
  favoriteModel: string;
  favoriteProvider: string;
  successRate: number;
  recentCreations: Job[];
}
