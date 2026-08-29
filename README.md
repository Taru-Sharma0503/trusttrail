# TrustTrail

The repository contains the v0-generated Next.js frontend and a standalone Express + PostgreSQL backend in [`backend`](backend). The backend is designed for SIH MVP use: it records off-chain metadata, while the blockchain remains the money-movement authority.

## Backend quick start

1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and a 32+ character `JWT_SECRET`.
2. Install dependencies: `pnpm install`.
3. Generate and migrate Prisma: `pnpm --dir backend db:generate` then `pnpm --dir backend db:migrate`.
4. Start the API: `pnpm backend:dev` (port 4000); start the UI separately with `pnpm dev`.

Useful commands: `pnpm backend:build`, `pnpm backend:test`, and `pnpm indexer`.

### Deployment configuration

Render must generate and compile the backend on every deploy. Set its build command to:

```bash
pnpm --dir backend db:generate && pnpm --dir backend build
```

Set its start command to:

```bash
pnpm --dir backend exec prisma migrate deploy && node backend/dist/server.js
```

Use Node 20 or newer (the backend declares `>=20`). In Render, set `DATABASE_URL`, a freshly rotated 32+ character `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CORS_ORIGIN` (one or more comma-separated origins with no trailing slash). Render supplies `PORT`; do not set it to a conflicting value. Leave `RPC_URL`, `VAULT_FACTORY_ADDRESS`, and `IPFS_API_URL` unset until those integrations exist.

In Vercel, set `NEXT_PUBLIC_API_URL` to the public Render API URL without a trailing slash. See [`.env.local.example`](.env.local.example) for the local frontend equivalent.

### API overview

- `POST /api/auth/nonce`, `POST /api/auth/verify` — one-time wallet-signature authentication.
- Public: `GET /api/campaigns`, `/api/campaigns/:id`, and related categories/milestones/donations/withdrawals routes; `GET /api/public/campaigns/:id/transparency`.
- NGO JWT: create/update campaigns, categories, milestones, and `POST /api/milestones/:id/proof`.
- `GET /api/donations/:id/receipt` produces a PDF after a donation is confirmed; `GET /health` reports DB/RPC/indexer status.

### Blockchain and IPFS

No smart contracts or ABI were present in this repository. The adapter in `backend/src/services/blockchain.ts` intentionally does not invent event signatures; once an audited ABI and deployed addresses are supplied, add decoding/mapping there. The indexer is already idempotent at the event persistence layer. Proofs use an IPFS-compatible add endpoint when `IPFS_API_URL` is configured, or clearly return a `local-sha256-*` development identifier otherwise (not an IPFS CID).

### MVP limitations

Campaign/NGO membership must be seeded or created through an administrative process; no onboarding route is exposed. Blockchain event decoding and on-chain state reads await the final contract ABI. The backend never represents a client-reported transaction as confirmed.

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_oVzsPim0N5tI4l4pA6JikcfkyxQA)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
