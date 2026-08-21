import type { Job, Model, Provider } from "../types.js";

export const models: Model[] = [
  {
    id: "flux-1",
    name: "FLUX",
    description: "High fidelity prompt-following image model for cinematic and editorial generations.",
    type: "IMAGE",
    version: "1.0",
    creatorId: "creator_blackforest",
    creator: "Black Forest Lab",
    license: "Creator-distributed provider execution",
    category: "Photoreal",
    basePrice: 0.045,
    rating: 4.9,
    usageCount: 18420,
    capabilities: ["Text-to-image", "Editorial", "Product", "Cinematic"],
    previews: [
      "https://images.unsplash.com/photo-1635776062360-af423602aff3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80"
    ],
    providerAvailability: ["provider_alpha", "provider_beta", "provider_delta"]
  },
  {
    id: "sdxl",
    name: "SDXL",
    description: "Reliable open image model for fast creative iterations and broad visual styles.",
    type: "IMAGE",
    version: "1.0",
    creatorId: "creator_stability",
    creator: "Stability Community",
    license: "Open model execution",
    category: "General",
    basePrice: 0.025,
    rating: 4.7,
    usageCount: 32110,
    capabilities: ["Text-to-image", "Image-to-image", "Concept art"],
    previews: [
      "https://images.unsplash.com/photo-1620121684840-edffcfc4b878?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=900&q=80"
    ],
    providerAvailability: ["provider_alpha", "provider_gamma", "provider_delta"]
  },
  {
    id: "pixol-product",
    name: "ProductFrame Pro",
    description: "Commercial product imagery model tuned for clean surfaces, reflections, and packaging.",
    type: "IMAGE",
    version: "0.8",
    creatorId: "creator_pixol",
    creator: "PIXOL Studio",
    license: "Premium creator-operated inference",
    category: "Commerce",
    basePrice: 0.065,
    rating: 4.84,
    usageCount: 5120,
    capabilities: ["Product", "Advertising", "Transparent background"],
    previews: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
    ],
    providerAvailability: ["provider_beta", "provider_delta"]
  },
  {
    id: "anime-arc",
    name: "AnimeArc",
    description: "Stylized character and scene generator for anime concepts and storyboards.",
    type: "IMAGE",
    version: "2.1",
    creatorId: "creator_arc",
    creator: "Arc Models",
    license: "Licensed provider distribution",
    category: "Illustration",
    basePrice: 0.035,
    rating: 4.76,
    usageCount: 9220,
    capabilities: ["Characters", "Storyboards", "Illustration"],
    previews: [
      "https://images.unsplash.com/photo-1618331833071-ce81bd50d300?auto=format&fit=crop&w=900&q=80"
    ],
    providerAvailability: ["provider_gamma"]
  },
  {
    id: "motionforge-v",
    name: "MotionForge V",
    description: "Video-ready model profile reserved for future decentralized video generation.",
    type: "VIDEO",
    version: "0.2",
    creatorId: "creator_motion",
    creator: "MotionForge",
    license: "Future video execution terms",
    category: "Video",
    basePrice: 0.55,
    rating: 4.6,
    usageCount: 810,
    capabilities: ["Text-to-video", "Image-to-video"],
    previews: [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=900&q=80"
    ],
    providerAvailability: ["provider_delta"]
  }
];

export const providers: Provider[] = [
  {
    id: "provider_alpha",
    name: "Provider Alpha",
    status: "online",
    reputation: 4.92,
    uptime: 99.3,
    latency: 420,
    gpu: "RTX 4090",
    location: "US",
    models: ["flux-1", "sdxl"],
    successRate: 99.1,
    priceMultiplier: 1.1,
    history: [
      { day: "Mon", completed: 142, failed: 1, averageLatency: 410 },
      { day: "Tue", completed: 151, failed: 2, averageLatency: 430 },
      { day: "Wed", completed: 166, failed: 1, averageLatency: 420 }
    ]
  },
  {
    id: "provider_beta",
    name: "Provider Beta",
    status: "online",
    reputation: 4.84,
    uptime: 98.7,
    latency: 590,
    gpu: "A100 80GB",
    location: "EU",
    models: ["flux-1", "pixol-product"],
    successRate: 98.5,
    priceMultiplier: 0.96,
    history: [
      { day: "Mon", completed: 96, failed: 2, averageLatency: 620 },
      { day: "Tue", completed: 118, failed: 1, averageLatency: 580 },
      { day: "Wed", completed: 121, failed: 2, averageLatency: 590 }
    ]
  },
  {
    id: "provider_gamma",
    name: "Provider Gamma",
    status: "degraded",
    reputation: 4.63,
    uptime: 96.1,
    latency: 880,
    gpu: "RTX 3090",
    location: "BR",
    models: ["sdxl", "anime-arc"],
    successRate: 94.7,
    priceMultiplier: 0.78,
    history: [
      { day: "Mon", completed: 61, failed: 5, averageLatency: 910 },
      { day: "Tue", completed: 58, failed: 4, averageLatency: 870 },
      { day: "Wed", completed: 72, failed: 3, averageLatency: 880 }
    ]
  },
  {
    id: "provider_delta",
    name: "Provider Delta",
    status: "online",
    reputation: 4.88,
    uptime: 99,
    latency: 510,
    gpu: "H100",
    location: "SG",
    models: ["flux-1", "sdxl", "pixol-product", "motionforge-v"],
    successRate: 98.9,
    priceMultiplier: 1.28,
    history: [
      { day: "Mon", completed: 188, failed: 2, averageLatency: 520 },
      { day: "Tue", completed: 201, failed: 2, averageLatency: 500 },
      { day: "Wed", completed: 197, failed: 1, averageLatency: 510 }
    ]
  }
];

export const initialJobs: Job[] = Array.from({ length: 10 }, (_, index) => {
  const model = models[index % 4];
  const providerId = model.providerAvailability[0] ?? "provider_alpha";
  return {
    id: `job_completed_${index + 1}`,
    userId: "user_demo",
    modelId: model.id,
    providerId,
    prompt: [
      "A premium fintech AI dashboard in a glass office",
      "A futuristic city powered by decentralized GPU markets",
      "A minimal product photo on reflective black acrylic",
      "An editorial portrait with neon green rim light"
    ][index % 4],
    parameters: { aspectRatio: index % 2 === 0 ? "1:1" : "16:9", quality: "standard" },
    estimatedCost: Number((model.basePrice * 1.1).toFixed(3)),
    actualCost: Number((model.basePrice * 1.1).toFixed(3)),
    currency: "PIXOL",
    status: "COMPLETED",
    progress: 100,
    createdAt: new Date(Date.now() - (index + 1) * 3_600_000).toISOString(),
    startedAt: new Date(Date.now() - (index + 1) * 3_600_000 + 1000).toISOString(),
    completedAt: new Date(Date.now() - (index + 1) * 3_600_000 + 14_000).toISOString(),
    resultUrl: `https://picsum.photos/seed/pixol-${index + 1}/1200/900`
  };
});
