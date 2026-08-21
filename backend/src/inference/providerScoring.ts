import type { Model, Provider } from "../types.js";

export function scoreProvider(provider: Provider, model: Model, estimatedCost: number): number {
  if (provider.status === "offline" || !provider.models.includes(model.id)) {
    return -1;
  }

  const reputationWeight = provider.reputation / 5;
  const availabilityWeight = provider.uptime / 100;
  const successWeight = provider.successRate / 100;
  const latencyWeight = Math.max(0, 1 - provider.latency / 2000);
  const priceWeight = Math.max(0, 1 - estimatedCost / 0.3);
  const degradedPenalty = provider.status === "degraded" ? 0.12 : 0;

  return Number(
    (
      reputationWeight * 0.3 +
      availabilityWeight * 0.22 +
      successWeight * 0.22 +
      latencyWeight * 0.14 +
      priceWeight * 0.12 -
      degradedPenalty
    ).toFixed(4)
  );
}
