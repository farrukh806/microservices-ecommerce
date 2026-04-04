![Status](https://img.shields.io/badge/Status-In%20progress-yellow)
![Apps](https://img.shields.io/badge/Apps-client-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB)
![License](https://img.shields.io/badge/License-TBD-lightgrey)

## E‑Commerce Monorepo

This repository is a **Turborepo-based monorepo** for an e‑commerce application. The primary app currently under development is the Next.js client in `apps/client`.

### Project Status

- **Status**: In progress
- **Current focus**: Building the storefront UI (product grid, filters, cart, checkout UX)

### Apps and Packages

- **`apps/client`** – Next.js (App Router) storefront for browsing products, filtering by category, and managing the cart
- **`@repo/eslint-config`** – Shared ESLint configuration
- **`@repo/typescript-config`** – Shared TypeScript configuration

All apps and packages use **TypeScript**.

### Tech Stack

- **Monorepo tooling**: Turborepo
- **Frontend**: Next.js 16.1.6 (App Router) + React 19.2.3
- **Styling**: Tailwind CSS 4 + custom CSS
- **Forms & validation**: `react-hook-form`, `zod`
- **Auth** (planned/partial): `@clerk/nextjs`

### Development

From the repo root:

```bash
npm install
npx turbo dev --filter=client
```

Or inside `apps/client`:

```bash
cd apps/client
npm install
npm run dev
```

Then open `http://localhost:3000` (or the configured port) in your browser.

### Environment

This repo uses the root `.env` file as the single source of truth for shared configuration values like `DATABASE_URL`.

- `apps/product-service`, `apps/order-service`, and `apps/payment-service` load `../../.env` from the repo root.
- `packages/product-db` also prefers the repo root `.env`, with `packages/product-db/.env` only used as a fallback for local Prisma tooling.

Keep the root `.env` synchronized across services so migrations and runtime connections use the same database.

### High-level Roadmap

- Complete cart and checkout flows
- Integrate authentication and user accounts
- Connect to a real product/catalog and orders backend
