import type { GenerationParameters } from "./types.js";

const allowedLocalRuntimes = new Set(["ollama", "comfyui", "automatic1111", "custom"]);
const localInferenceRuntime = allowedLocalRuntimes.has(process.env.LOCAL_INFERENCE_RUNTIME ?? "")
  ? (process.env.LOCAL_INFERENCE_RUNTIME as GenerationParameters["localRuntime"])
  : "ollama";

export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  publicApiUrl: process.env.PUBLIC_API_URL ?? `http://localhost:${process.env.API_PORT ?? 4000}`,
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  solaiNetworkApiUrl: process.env.SOLAI_NETWORK_API_URL ?? process.env.INFERENCE_PROTOCOL_API_URL ?? "https://api.solai.network",
  solaiNetworkApiKey: process.env.SOLAI_NETWORK_API_KEY ?? process.env.INFERENCE_PROTOCOL_API_KEY,
  localInferenceRuntime,
  localInferenceUrl: process.env.LOCAL_INFERENCE_URL ?? process.env.OLLAMA_URL ?? "http://localhost:11434",
  compatibleInferenceApiUrl: process.env.COMPATIBLE_INFERENCE_API_URL ?? process.env.OPENAI_COMPATIBLE_API_URL ?? "http://localhost:8000/v1",
  compatibleInferenceApiKey: process.env.COMPATIBLE_INFERENCE_API_KEY ?? process.env.OPENAI_COMPATIBLE_API_KEY,
  compatibleImageModel: process.env.COMPATIBLE_IMAGE_MODEL,
  compatibleVideoModel: process.env.COMPATIBLE_VIDEO_MODEL,
  comfyUiUrl: process.env.COMFYUI_URL ?? "http://localhost:8188",
  comfyUiWorkflow: process.env.COMFYUI_WORKFLOW_JSON,
  automatic1111Url: process.env.AUTOMATIC1111_URL ?? "http://localhost:7860",
  ollamaModel: process.env.OLLAMA_MODEL,
  mediaStorageDir: process.env.MEDIA_STORAGE_DIR ?? "generated-media"
};
