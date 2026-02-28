![Status](https://img.shields.io/badge/Status-In%20progress-yellow)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB)
![License](https://img.shields.io/badge/License-TBD-lightgrey)

## E‑Commerce Client (Next.js App Router)

This is the **client-side application** for an e‑commerce project built with the Next.js App Router.

### Project Status

- **Status**: In progress
- **Focus**: Product browsing, category filtering, cart, and checkout UX

### Tech Stack

- **Framework**: Next.js (App Router, `app/` directory)
- **Language**: TypeScript + React
- **Styling**: Tailwind CSS + custom styles in `app/globals.css`
- **Icons**: `lucide-react`

### Implemented Features

- **Product listing**: Responsive grid of products with aligned cards (`ProductList`, `ProductCard`)
- **Product data**: Static catalog in `app/static/products.ts` with categories, sizes, colors, and realistic descriptions
- **Category filters**: Horizontal category bar (`Categories`) with query-string based filtering (`?category=...`)
- **Product options**: Size selector and color swatches per product
- **Cart flow**: Basic cart page and shipping address form (`app/cart/page.tsx`, `ShippingAddress.tsx`)

### Running the App

From `apps/client`:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Project Structure (client)

- `app/layout.tsx` – Root layout and global configuration
- `app/page.tsx` – Home page with hero, categories, and product grid
- `app/cart/page.tsx` – Cart and checkout entry
- `app/static/products.ts` – Product catalog used by the UI
- `components/ProductList.tsx` – Product grid with category filtering
- `components/ProductCard.tsx` – Individual product card
- `components/Categories.tsx` – Category selector
- `components/ShippingAddress.tsx` – Shipping address form
- `public/products/` – Product images used by the catalog

### Next Steps (Planned)

- Wire cart and checkout to a real backend or API
- Add authentication and user accounts
- Implement order history and wishlists

