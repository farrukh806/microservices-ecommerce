![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Monorepo](https://img.shields.io/badge/Monorepo-Turborepo-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB)
![License](https://img.shields.io/badge/License-TBD-lightgrey)

## E-Commerce Monorepo

This repository is a Turborepo-based e-commerce platform built with Next.js, React, TypeScript, Prisma, Clerk, Stripe, and Resend.

It is organized as:

- `apps/client`: customer storefront
- `apps/admin`: admin dashboard
- `apps/product-service`: catalog and settings API
- `apps/order-service`: cart, order, coupon, review, and wishlist API
- `apps/payment-service`: Stripe payment API
- `apps/email-service`: transactional email and notification API
- `packages/product-db`: shared Prisma schema and generated client
- `packages/shared-schemas`: shared Zod schemas and TypeScript types
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TypeScript config

## What The Platform Supports

### Storefront

The client app includes:

- Product listing and product detail pages
- Category browsing and query-based filtering
- Search UI with autocomplete/search flow support
- Variant selection for size and color
- Cart management with quantity updates and removal
- Multi-step checkout UI
- Shipping address collection
- Coupon validation and application flow
- Order history pages
- Wishlist add/remove flow
- Product reviews with rating, review form, and helpful-vote actions
- Clerk authentication integration
- Admin-configurable global storefront theme
- Admin-configurable storefront typography and color palette

### Admin Dashboard

The admin app includes:

- Clerk-protected admin layout and navigation
- Dashboard shell with low-stock awareness
- Product creation and catalog management
- Category management
- Inventory listing and inventory updates
- Order listing and status management UI
- Coupon listing and management UI
- Review listing/moderation UI
- Customer listing and profile management UI
- Settings page for updating the storefront theme
- Local live preview for theme colors and typography before save

### Product Service

The product service exposes catalog and admin-facing APIs for:

- Product CRUD
- Product search
- Product autocomplete
- Product detail fetch
- Product image upload via Cloudinary
- Inventory listing
- Inventory updates
- Low-stock queries
- Category creation and listing
- User listing, fetch, update, and delete
- Global storefront theme get/update

### Order Service

The order service exposes:

- Cart fetch
- Add cart item
- Update cart item
- Remove cart item
- Clear cart
- Create order
- List orders
- Fetch order by id
- Update order status
- Validate coupon
- Apply coupon
- List reviews
- Create review
- Vote on review helpfulness
- Fetch wishlist
- Add wishlist item
- Remove wishlist item

It also handles:

- Clerk-authenticated user access
- Inventory reservation during order creation
- Coupon usage checks and discount calculation
- Tax and shipping calculation

### Payment Service

The payment service includes:

- Stripe payment-intent creation
- Payment lookup by order id
- Stripe webhook handling

### Email Service

The email service includes:

- Order confirmation emails
- Order shipped emails
- Price-drop emails
- Back-in-stock emails
- Back-in-stock subscription endpoint
- Notification record creation for email events

## Data Model

The shared Prisma schema includes:

- Products
- Categories
- Product inventory
- Users
- Addresses
- Carts and cart items
- Orders and order items
- Payments
- Coupons
- Reviews
- Wishlist items
- Notifications
- Back-in-stock subscriptions
- Global storefront theme settings

## Shared Packages

### `packages/product-db`

Contains:

- Prisma schema
- migrations
- generated Prisma client
- shared DB access used by the backend services

### `packages/shared-schemas`

Contains shared Zod schemas and TypeScript types for:

- products
- categories
- carts
- orders
- payments
- addresses
- reviews
- wishlists
- coupons
- notifications
- storefront theme settings

## Tech Stack

- Monorepo: Turborepo
- Frontend: Next.js App Router, React 19, TypeScript
- Styling: Tailwind CSS 4, shadcn/ui-style components
- State: Zustand
- Validation: Zod
- Forms: react-hook-form
- Auth: Clerk
- Product API: Express
- Order API: Fastify
- Payment/Email APIs: Hono
- Database: PostgreSQL via Prisma
- Payments: Stripe
- Email: Resend
- Image hosting: Cloudinary

## Ports

Default local ports:

- `apps/admin`: `http://localhost:3000`
- `apps/client`: `http://localhost:3001`
- `apps/product-service`: `http://localhost:8000`
- `apps/order-service`: `http://localhost:8001`
- `apps/payment-service`: `http://localhost:8002`
- `apps/email-service`: `http://localhost:8003`

## Development

Install dependencies from the repo root:

```bash
npm i turbo -g
npm install
turbo dev
```

Run the whole workspace with Turborepo:

```bash
npm run dev
```

Run type checks across the workspace:

```bash
npm run check-types
```

Run an individual app or package:

```bash
npm --workspace client run dev
npm --workspace admin run dev
npm --workspace product-service run dev
npm --workspace order-service run dev
npm --workspace payment-service run dev
npm --workspace email-service run dev
```

## Database

Generate the Prisma client:

```bash
npm --workspace @repo/product-db run db:generate
```

Apply committed migrations:

```bash
npm --workspace @repo/product-db run db:deploy
```

Create a new migration during development:

```bash
npm --workspace @repo/product-db run db:migrate
```

## Environment

The repo uses the root `.env` file as the shared configuration source.

Important variables include:

- `DATABASE_URL`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_PRODUCT_SERVICE_URL`
- `NEXT_PUBLIC_ORDER_SERVICE_URL`
- `NEXT_PUBLIC_PAYMENT_SERVICE_URL`

Current backend services load the root `.env` directly or prefer it as the primary source.

## Notes

- The storefront theme is managed from `apps/admin/app/settings/page.tsx`.
- Theme changes are persisted through `product-service` and applied globally in the client app at render time.
- The repo currently has some unrelated TypeScript issues in existing files outside this README update; those do not change the feature inventory listed here.
