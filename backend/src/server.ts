import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { join } from "node:path";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { z } from "zod";
import { ZodError } from "zod";
import { registerApiRoutes } from "./api/routes.js";
import { authPlugin } from "./auth/authPlugin.js";
import { config } from "./config.js";
import { UniversalInferenceProvider } from "./inference/UniversalInferenceProvider.js";
import { PaymentService } from "./payments/PaymentService.js";
import { MockWalletProvider } from "./wallet/MockWalletProvider.js";

const app = Fastify({
  logger: true
});

await app.register(helmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" }
});
await app.register(cors, {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const localDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):\d+$/.test(origin);
    callback(null, origin === config.frontendUrl || localDevOrigin);
  },
  credentials: true
});
await app.register(rateLimit, {
  max: 160,
  timeWindow: "1 minute"
});
await app.register(jwt, {
  secret: config.jwtSecret
});
await app.register(authPlugin);

const walletProvider = new MockWalletProvider();
const paymentService = new PaymentService(walletProvider);
const inferenceProvider = new UniversalInferenceProvider();

app.setErrorHandler((error: Error, _request, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: "ValidationError",
      issues: error.issues
    });
    return;
  }

  const statusCode = error.message.includes("not found") ? 404 : 400;
  reply.status(statusCode).send({
    error: error.name,
    message: error.message
  });
});

app.get("/media/:fileName", async (request, reply) => {
  const params = z.object({ fileName: z.string().regex(/^[a-zA-Z0-9_.-]+$/) }).parse(request.params);
  const filePath = join(config.mediaStorageDir, params.fileName);
  await access(filePath);
  reply.type(mediaTypeForFile(params.fileName));
  return reply.send(createReadStream(filePath));
});

await registerApiRoutes(app, { inferenceProvider, walletProvider, paymentService });

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}

function mediaTypeForFile(fileName: string): string {
  if (fileName.endsWith(".svg")) return "image/svg+xml";
  if (fileName.endsWith(".png")) return "image/png";
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "image/jpeg";
  if (fileName.endsWith(".webp")) return "image/webp";
  if (fileName.endsWith(".webm")) return "video/webm";
  if (fileName.endsWith(".mp4")) return "video/mp4";
  return "application/octet-stream";
}
