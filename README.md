# PIXOL AI

Open-source decentralized AI media marketplace.

[Website](https://pixolmedia.github.io/) · [Whitepaper](https://pixolmedia.github.io/whitepaper.html) · [Telegram](https://t.me/pixol_ai) · [X](https://x.com/pixolmedia)

## Overview

PIXOL AI is a full-stack reference implementation for a decentralized AI media marketplace. The project is built around the idea described in the PIXOL whitepaper: users should be able to choose executable AI media offers that combine model access, inference capacity, price, reputation, and availability before creating images or videos.

Instead of hiding models, GPUs, pricing, and provider reliability behind one centralized generation button, PIXOL exposes the market:

```text
Offer -> Model -> Inference Provider -> Price -> Reputation -> Generate
```

This repository is the open-source application layer for that experience. It includes a React frontend, a Fastify backend, a Prisma schema, local/API inference execution, mock wallet/payment flows, media generation jobs, marketplace views, provider scoring, gallery/history screens, and dashboard data.

## What PIXOL Is

PIXOL is designed as a media-first marketplace where:

- Users compare executable offers and purchase media-generation tasks.
- Model creators can distribute models under clear terms or operate their own inference.
- Inference providers compete on model availability, GPU capability, price, uptime, latency, and reputation.
- The PIXOL token functions as a task-payment and consumption token for image generation, video generation, editing, model utilization, and future marketplace services.
- The inference protocol layer can be integrated behind a clean provider boundary.

The current application runs real local/API inference routes for media generation. SOLAI Network routing is intentionally disabled in this release and kept as a future provider integration.

## Features

- Marketplace-style model and provider discovery
- Executable offer estimation before generation
- Automatic provider scoring based on price, reliability, latency, and compatibility
- Image and video job lifecycle with generated artifact storage
- Job progress, cancellation, history, gallery, and dashboard APIs
- Mock PIXOL wallet balance and payment records
- Local-first development with optional Docker Compose services
- Local Ollama, Automatic1111, ComfyUI workflow and custom runtime support
- OpenAI-compatible image/video API gateway support
- Clean backend boundary for future SOLAI provider integration
- Media-first UI for image and video workflows

## Tech Stack

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- lucide-react

Backend:

- Node.js
- TypeScript
- Fastify
- Zod
- Prisma schema for PostgreSQL
- Mock inference protocol provider
- Mock wallet/payment services

Infrastructure:

- Docker Compose
- PostgreSQL
- Redis

## Repository Layout

```text
pixolai/
  frontend/              React/Vite application
  backend/               Fastify API server
    src/
      api/               HTTP routes and schemas
      auth/              Mock auth plugin
      inference/         Inference provider boundary, runtime adapters and catalog data
      payments/          Payment orchestration
      wallet/            Mock wallet provider
      types.ts           Shared backend domain types
    prisma/              Database schema
  docker-compose.yml     Local Postgres/Redis/app services
  .env.example           Environment template
```

## Quick Start

Requirements:

- Node.js 20+
- npm

Install dependencies:

```bash
npm install
```

Run the backend and frontend together:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Environment

Create a local `.env` from the example when needed:

```bash
cp .env.example .env
```

Common variables:

```text
DATABASE_URL=
REDIS_URL=
API_PORT=4000
JWT_SECRET=development-only-secret
PUBLIC_API_URL=http://localhost:4000
LOCAL_INFERENCE_RUNTIME=ollama
LOCAL_INFERENCE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
AUTOMATIC1111_URL=http://localhost:7860
COMFYUI_URL=http://localhost:8188
COMFYUI_WORKFLOW_JSON=
COMPATIBLE_INFERENCE_API_URL=http://localhost:8000/v1
COMPATIBLE_INFERENCE_API_KEY=
COMPATIBLE_IMAGE_MODEL=
COMPATIBLE_VIDEO_MODEL=
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:4000
```

For production, keep API keys in backend environment variables. The Settings page also allows a browser-side API key for local testing against compatible gateways.

Supported execution routes:

- `local + ollama`: calls `/api/generate` and produces a deterministic PIXOLAI image or animated SVG from the local LLM visual plan.
- `local + automatic1111`: calls `/sdapi/v1/txt2img` and stores the returned image.
- `local + comfyui`: submits `COMFYUI_WORKFLOW_JSON` to `/prompt`; use a custom runtime for workflow result collection.
- `local + custom`: calls `/generate` on your worker. Return `url`, `image_url`, `video_url`, `b64_json`, `data[0].url`, or `data[0].b64_json`.
- `api`: calls OpenAI-compatible `/images/generations` for images and `/videos/generations` for video-capable gateways.

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run prisma:generate
```

Workspace-specific commands:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
npm run build --workspace backend
npm run build --workspace frontend
```

## API Surface

The backend exposes the marketplace primitives used by the frontend:

```text
GET  /health
POST /api/auth/connect

GET  /api/models
GET  /api/models/:id

GET  /api/providers
GET  /api/providers/:id

POST /api/jobs/estimate
POST /api/jobs
GET  /api/jobs
GET  /api/jobs/:id
GET  /api/jobs/:id/result
POST /api/jobs/:id/cancel

GET  /api/wallet
GET  /api/wallet/balance

GET  /api/gallery
GET  /api/dashboard
```

## Inference Protocol Boundary

The backend keeps protocol execution behind `InferenceProtocolProvider`:

```text
backend/src/inference/InferenceProtocolProvider.ts
backend/src/inference/MockInferenceProtocolProvider.ts
```

`UniversalInferenceProvider` powers executable local and API-compatible routes while preserving the marketplace API and frontend workflows. The previous mock provider remains in the source tree as a development reference, but the server boots with the universal provider by default.

## Product Principles

PIXOL follows the principles stated in the whitepaper:

- Open: the interface and marketplace layer should remain extensible.
- Decentralized: compute should not depend on one centralized provider.
- User choice: users choose executable model-and-inference offers.
- Model creator economy: creators can monetize specialized media models.
- Provider competition: providers compete on price, performance, availability, and reputation.
- Local first: capable users should be able to use their own hardware when appropriate.
- Real utility: PIXOL is designed around actual media-generation usage.

## Current Status

This repository is a functional online platform implementation for configurable local/API image and video generation.

Not included in this repository:

- Production wallet custody
- Real token settlement
- Production GPU scheduling
- Real model hosting
- SOLAI provider routing
- Guaranteed pricing or economic returns

## Links

- Website: https://pixolmedia.github.io/
- Whitepaper: https://pixolmedia.github.io/whitepaper.html
- Telegram: https://t.me/pixol_ai
- X: https://x.com/pixolmedia

## License

MIT. See [LICENSE](LICENSE).
