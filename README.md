![Status](https://img.shields.io/badge/Status-Complete-brightgreen)
![Apps](https://img.shields.io/badge/Apps-client%2Cadmin-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB)
![License](https://img.shields.io/badge/License-TBD-lightgrey)

## E‑Commerce Monorepo

This repository is a **Turborepo-based monorepo** for a modular e-commerce platform built with Next.js, React, and TypeScript.

### What’s included

- **`apps/client`** – Customer storefront for browsing products, filters, wishlist, cart, checkout, and reviews.
- **`apps/admin`** – Admin dashboard for managing products, orders, inventory, coupons, reviews, customers, and settings.
- **`apps/order-service`** – Order and cart service with coupon, review, and wishlist APIs.
- **`apps/product-service`** – Product management service with image upload support.
- **`apps/payment-service`** – Payment service with Stripe integration.
- **`apps/email-service`** – Email delivery service for notifications.
- **`packages/product-db`** – Shared Prisma database layer.
- **`packages/shared-schemas`** – Shared TypeScript schemas across apps and services.
- **`packages/eslint-config`** – Shared ESLint configuration.
- **`packages/typescript-config`** – Shared TypeScript compiler settings.

All apps and packages use **TypeScript**.

### Features

#### Storefront (`apps/client`)

- Product listing and detail pages
- Category filtering and enhanced search UI
- Add-to-cart flow with quantity selection
- Cart summary, pricing breakdown, and checkout flow
- Wishlist support
- Coupon code input and validation
- Product reviews and star rating components
- Auth-ready architecture using `@clerk/nextjs`

#### Admin dashboard (`apps/admin`)

- Product and category management
- Order and customer management
- Inventory view and low-stock alerts
- Coupon management
- Review moderation
- Settings and admin navigation UI
- Protected admin experience with `@clerk/nextjs`

#### Backend services

- **`apps/order-service`**: cart, orders, coupons, reviews, wishlist APIs, and Clerk auth integration
- **`apps/product-service`**: product creation, product routes, image upload, and catalog management
- **`apps/payment-service`**: Stripe-powered payment processing
- **`apps/email-service`**: transactional email delivery via Resend

### Tech Stack

- **Monorepo tooling**: Turborepo
- **Frontend**: Next.js 16.1.6 + React 19.2.3
- **Styling**: Tailwind CSS 4 + shadcn/ui patterns
- **Forms & validation**: `react-hook-form`, `zod`
- **Auth**: `@clerk/nextjs`
- **Backend**: Fastify, Express, Hono, Stripe, Resend

### Development

From the repo root:

```bash
npm i turbo -g
npm install
turbo dev
```

Or launch an individual app:

```bash
cd apps/client
npm install
npm run dev
```

```bash
cd apps/admin
npm install
npm run dev
```

```bash
cd apps/order-service
npm install
npm run dev
```

```bash
cd apps/product-service
npm install
npm run dev
```

```bash
cd apps/payment-service
npm install
npm run dev
```

```bash
cd apps/email-service
npm install
npm run dev
```

### Environment

This repo uses the root `.env` file as the shared configuration source.

- `apps/product-service`, `apps/order-service`, and `apps/payment-service` load `../../.env` from the repo root.
- `packages/product-db` also prefers the repo root `.env`, with `packages/product-db/.env` used only as a local fallback.

Keep the root `.env` synchronized across services so migrations and runtime connections remain aligned.

### High-level Roadmap

- Complete checkout and payment flows
- Finish auth and account management
- Connect all services to a live database and payment provider
- Expand admin capabilities for product and order workflows
