# PIXOL AI

Open-source decentralized AI media marketplace MVP.

[Website](https://pixolmedia.github.io/) · [Whitepaper](https://pixolmedia.github.io/whitepaper.html) · [Telegram](https://t.me/pixol_ai) · [X](https://x.com/pixolmedia)

## Overview

PIXOL AI is a full-stack reference implementation for a decentralized AI media marketplace. The project is built around the idea described in the PIXOL whitepaper: users should be able to choose executable AI media offers that combine model access, inference capacity, price, reputation, and availability before creating images or videos.

Instead of hiding models, GPUs, pricing, and provider reliability behind one centralized generation button, PIXOL exposes the market:

```text
Offer -> Model -> Inference Provider -> Price -> Reputation -> Generate
```

This repository is the open-source application layer for that experience. It includes a React frontend, a Fastify backend, a Prisma schema, mock providers, mock wallet/payment flows, media generation jobs, marketplace views, provider scoring, gallery/history screens, and dashboard data.

## What PIXOL Is

PIXOL is designed as a media-first marketplace where:

- Users compare executable offers and purchase media-generation tasks.
- Model creators can distribute models under clear terms or operate their own inference.
- Inference providers compete on model availability, GPU capability, price, uptime, latency, and reputation.
- The PIXOL token functions as a task-payment and consumption token for image generation, video generation, editing, model utilization, and future marketplace services.
- The inference protocol layer can be integrated behind a clean provider boundary.

The current MVP runs in mock mode. It does not require real GPU nodes, blockchain settlement, production wallets, or a live decentralized protocol to run locally.

## Features

- Marketplace-style model and provider discovery
- Executable offer estimation before generation
- Automatic provider scoring based on price, reliability, latency, and compatibility
- Mock image generation job lifecycle
- Job progress, cancellation, history, gallery, and dashboard APIs
- Mock PIXOL wallet balance and payment records
- Local-first development with optional Docker Compose services
- Clean backend boundary for future inference protocol integrations
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
      inference/         Inference protocol provider boundary and mock data
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
INFERENCE_PROTOCOL_API_URL=
INFERENCE_PROTOCOL_API_KEY=
COMFYUI_URL=
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:4000
```

The MVP works without production values because it uses mock services by default.

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

`MockInferenceProtocolProvider` powers the local MVP with realistic models, providers, prices, ratings, latency, compatibility, job progress, and generated placeholder media. A future integration can replace that boundary while preserving the marketplace API and frontend workflows.

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

This repository is an MVP and reference implementation. It is suitable for local development, interface exploration, API design, and future protocol integration work.

Not included in the MVP:

- Production wallet custody
- Real token settlement
- Live decentralized provider execution
- Production GPU scheduling
- Real model hosting
- Guaranteed pricing or economic returns

## Links

- Website: https://pixolmedia.github.io/
- Whitepaper: https://pixolmedia.github.io/whitepaper.html
- Telegram: https://t.me/pixol_ai
- X: https://x.com/pixolmedia

## License

MIT. See [LICENSE](LICENSE).
