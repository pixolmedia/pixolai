export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  solaiNetworkApiUrl: process.env.SOLAI_NETWORK_API_URL ?? process.env.INFERENCE_PROTOCOL_API_URL ?? "https://api.solai.network",
  solaiNetworkApiKey: process.env.SOLAI_NETWORK_API_KEY ?? process.env.INFERENCE_PROTOCOL_API_KEY,
  localInferenceRuntime: process.env.LOCAL_INFERENCE_RUNTIME ?? "ollama",
  localInferenceUrl: process.env.LOCAL_INFERENCE_URL ?? process.env.OLLAMA_URL ?? "http://localhost:11434",
  compatibleInferenceApiUrl: process.env.COMPATIBLE_INFERENCE_API_URL ?? process.env.OPENAI_COMPATIBLE_API_URL ?? "http://localhost:8000/v1",
  compatibleInferenceApiKey: process.env.COMPATIBLE_INFERENCE_API_KEY ?? process.env.OPENAI_COMPATIBLE_API_KEY,
  comfyUiUrl: process.env.COMFYUI_URL ?? "http://localhost:8188"
};
