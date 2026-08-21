export const config = {
  port: Number(process.env.API_PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  inferenceProtocolApiUrl: process.env.INFERENCE_PROTOCOL_API_URL,
  inferenceProtocolApiKey: process.env.INFERENCE_PROTOCOL_API_KEY,
  comfyUiUrl: process.env.COMFYUI_URL
};
