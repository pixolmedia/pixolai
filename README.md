# PIXOL AI

Open-source decentralized AI media marketplace.

[Website](https://pixolmedia.github.io/) · [Whitepaper](https://pixolmedia.github.io/whitepaper.html) · [Telegram](https://t.me/pixol_ai) · [X](https://x.com/pixolmedia)

## Overview

PIXOL AI is a production frontend interface for AI media generation and a reference backend for future provider integrations. The project is built around the idea described in the PIXOL whitepaper: users should be able to choose executable AI media routes that combine model access, inference capacity, price, reputation, and availability before creating images or videos.

Instead of hiding models, GPUs, pricing, and provider reliability behind one centralized generation button, PIXOL exposes the market:

```text
Offer -> Model -> Inference Provider -> Price -> Reputation -> Generate
```

This repository is the open-source application layer for that experience. It includes a React frontend, browser-side local/API inference execution, persisted user settings, media generation jobs, marketplace views, provider scoring, gallery/history screens, dashboard data, and a Fastify backend scaffold for future SOLAI/provider work.

## What PIXOL Is

PIXOL is designed as a media-first marketplace where:

- Users compare executable offers and purchase media-generation tasks.
- Model creators can distribute models under clear terms or operate their own inference.
- Inference providers compete on model availability, GPU capability, price, uptime, latency, and reputation.
- The PIXOL token functions as a task-payment and consumption token for image generation, video generation, editing, model utilization, and future marketplace services.
- The inference protocol layer can be integrated behind a clean provider boundary.

The deployed application is production-ready for bring-your-own API keys and local runtimes. Users paste their own API key or point PIXOLAI at their own local endpoint; credentials and job history persist in that user's browser. SOLAI API routing is the remaining provider integration planned for a later release.

## Features

- Marketplace-style model and provider discovery
- Executable offer estimation before generation
- Automatic provider scoring based on price, reliability, latency, and compatibility
- Image and video job lifecycle persisted in the browser
- Job progress, cancellation, history, gallery, and dashboard APIs
- Mock PIXOL wallet balance and payment records
- Frontend-only production deploy on GitHub Pages
- Local Ollama, Automatic1111, ComfyUI workflow and custom runtime support
- Bring-your-own-key OpenAI-compatible image/video API support
- Backend scaffold for future SOLAI API provider integration
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

Run the frontend:

```bash
npm run dev --workspace frontend
```

Local URLs:

- Frontend: `http://localhost:5173`
- Optional backend scaffold: `http://localhost:4000`

## Environment

Create a local `.env` from the example when needed:

```bash
cp .env.example .env
```

Common variables for the optional backend scaffold:

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

For the production GitHub Pages app, users configure API endpoints and their own API keys in Settings. Those values are stored by the browser and sent directly from the user's machine to the selected API or local runtime.

Supported execution routes:

- `local + ollama`: browser calls the user's Ollama `/api/generate` endpoint and turns the response into PIXOLAI media.
- `local + automatic1111`: browser calls the user's `/sdapi/v1/txt2img` endpoint.
- `local + comfyui`: use a local custom bridge endpoint for workflow result collection.
- `local + custom`: browser calls the user's `/generate` worker. Return `url`, `image_url`, `video_url`, `b64_json`, `data[0].url`, or `data[0].b64_json`.
- `api`: browser calls the user's configured OpenAI-compatible `/images/generations` or `/videos/generations` endpoint with the user's own key.
- `solai`: planned as another API endpoint route once the SOLAI backend API is ready.

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

The optional backend scaffold exposes the same marketplace primitives for future hosted-provider work:

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

The optional backend keeps protocol execution behind `InferenceProtocolProvider`:

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

This repository is a functional online platform implementation for browser-based BYOK API generation and local-runtime image/video generation.

Not included in this repository:

- Production wallet custody
- Real token settlement
- Production GPU scheduling
- Real model hosting
- SOLAI API provider routing
- Guaranteed pricing or economic returns

## Links

- Website: https://pixolmedia.github.io/
- Whitepaper: https://pixolmedia.github.io/whitepaper.html
- Telegram: https://t.me/pixol_ai
- X: https://x.com/pixolmedia

## License

MIT. See [LICENSE](LICENSE).
