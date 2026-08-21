import { z } from "zod";

export const parametersSchema = z.object({
  aspectRatio: z.enum(["1:1", "4:5", "16:9", "9:16"]).default("1:1"),
  quality: z.enum(["standard", "high", "ultra"]).default("standard"),
  seed: z.number().int().positive().optional()
});

export const estimateJobSchema = z.object({
  modelId: z.string().min(1),
  providerId: z.string().min(1).optional(),
  prompt: z.string().trim().min(3).max(1200),
  parameters: parametersSchema
});

export const createJobSchema = estimateJobSchema;
