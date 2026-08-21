import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { ZodError } from "zod";
import { registerApiRoutes } from "./api/routes.js";
import { authPlugin } from "./auth/authPlugin.js";
import { config } from "./config.js";
import { MockInferenceProtocolProvider } from "./inference/MockInferenceProtocolProvider.js";
import { PaymentService } from "./payments/PaymentService.js";
import { MockWalletProvider } from "./wallet/MockWalletProvider.js";

const app = Fastify({
  logger: true
});

await app.register(helmet);
await app.register(cors, {
  origin: [config.frontendUrl, "http://localhost:5173"],
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
const inferenceProvider = new MockInferenceProtocolProvider();

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

await registerApiRoutes(app, { inferenceProvider, walletProvider, paymentService });

try {
  await app.listen({ port: config.port, host: "0.0.0.0" });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
