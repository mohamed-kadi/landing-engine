# Landing Engine

[![CI](https://github.com/mohamed-kadi/landing-engine/actions/workflows/ci.yml/badge.svg)](https://github.com/mohamed-kadi/landing-engine/actions/workflows/ci.yml)

Landing Engine is a configurable, conversion-focused ecommerce landing page engine built for Wasilio-ready product campaigns. It renders product pages from one normalized storefront contract, supports local fixture products for fast iteration, and can switch to Wasilio public storefront APIs for product data and order capture.

The current implementation is optimized for cash-on-delivery product funnels in Morocco: product storytelling, gallery, trust badges, reviews, FAQs, order form validation, analytics events, SEO metadata, sitemap, robots, and product/FAQ structured data.

## Current State

- Next.js App Router application using Next `16.2.9` and React `19.2.4`.
- Local product fixture mode is the default.
- Two local products are configured:
  - `/products/wearable-neck-fan`
  - `/products/cordless-car-vacuum-cleaner`
- `/` renders the default product from the active product provider.
- Wasilio provider and order adapters are implemented behind environment variables.
- GitHub Actions CI is active on `main` and pull requests.

## Tech Stack

- Next.js `16.2.9`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- ESLint `9` with `eslint-config-next`
- Vitest
- lucide-react icons

## Requirements

- Node.js `>=20.9.0`
- npm

The repo includes `.nvmrc` with Node `20.11.1`.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful local routes:

```text
/
/products/wearable-neck-fan
/products/cordless-car-vacuum-cleaner
/robots.txt
/sitemap.xml
```

## Environment Variables

`local` mode works with the values in `.env.example`.

```env
NEXT_PUBLIC_PRODUCT_PROVIDER=local
NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_WASILIO_STORE_SLUG=
NEXT_PUBLIC_ANALYTICS_DEBUG=false
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PRODUCT_PROVIDER` | `local` uses TypeScript fixtures. `wasilio` fetches product data and sends order intents to Wasilio public APIs. |
| `NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL` | Public Wasilio API origin, for example `https://app.wasilio.com`. |
| `NEXT_PUBLIC_WASILIO_STORE_SLUG` | Store/tenant slug used in Wasilio public storefront routes. |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | Logs analytics events to the browser console when set to `true`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Enables Meta Pixel script and event forwarding. |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Enables GA4 script and event forwarding. |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` | Enables Google Ads conversion forwarding for lead/order events. |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Enables TikTok Pixel script and event forwarding. |

## Scripts

```bash
npm run dev
npm run lint
npm test
npm run build
npm run start
```

`npm run build` uses Next 16's default Turbopack production build. Next 16 no longer runs linting as part of `next build`, so CI runs `npm run lint` separately before tests and build.

## Architecture

The renderer receives a single page model:

```text
StorefrontProductPage
```

That contract lives in `src/types/storefront.ts` and contains product identity, offer data, media, section copy, SEO, experiments, market rules, order form config, and analytics settings.

### Provider Flow

```text
src/app/page.tsx
src/app/products/[slug]/page.tsx
  -> getProductProvider()
    -> localFixtureProductProvider
    -> wasilioProductProvider
  -> LandingPage
  -> LandingPageClient
  -> section components
```

The provider mode is selected by `NEXT_PUBLIC_PRODUCT_PROVIDER`.

| Mode | Behavior |
| --- | --- |
| `local` | Reads products from `src/data/products/*`. Best for development, demos, visual QA, SEO checks, and analytics work. |
| `wasilio` | Fetches `GET /api/public/storefront/{storeSlug}/products/{productSlug}` from Wasilio and normalizes the response into `StorefrontProductPage`. |

Unknown Wasilio product slugs return `404`. If Wasilio is unavailable for a known local fixture slug, the provider can fall back to the matching local fixture so the renderer remains usable during integration work.

### Product Configuration

Local products are defined in:

```text
src/data/products/neckFan.ts
src/data/products/carVacuum.ts
src/data/products/index.ts
```

Each product config controls:

- product ID, name, slug, brand, price, availability, and variants
- hero copy and CTA text
- gallery images
- benefits, features, problem/solution, comparison, reviews, trust, and FAQ sections
- order form labels, city list, and phone validation pattern
- SEO metadata and structured data inputs
- experiment arms and analytics IDs

## Order Capture

The order form is a client component, but submitted orders are still validated server-side.

Local mode:

```text
OrderFormSection
  -> localOrderCaptureAdapter
  -> POST /api/orders
  -> validateOrderSubmission()
  -> data/orders.jsonl in development
```

Production local storage is disabled; production submissions are logged server-side unless Wasilio mode is enabled.

Wasilio mode:

```text
OrderFormSection
  -> wasilioOrderCaptureAdapter
  -> POST /api/public/storefront/{storeSlug}/orders
```

The Wasilio order adapter sends a public-safe order intent payload with product selection, quantity, customer contact, delivery details, and attribution. It does not send tenant IDs, merchant IDs, or client-provided price authority.

Server-side validation checks:

- product slug exists
- product ID and name match the slug
- price and currency match product configuration
- selected variant exists when variants are configured
- Moroccan mobile phone format
- delivery city is allowed for the product
- required customer and address fields
- quantity is an integer greater than or equal to 1
- experiment attribution exists

## Analytics And Pixels

Analytics are centralized in:

```text
src/lib/analytics/events.ts
src/lib/analytics/track.ts
src/components/analytics/PixelScripts.tsx
src/components/analytics/LandingAnalytics.tsx
```

Current event surface:

- `PageView`
- `ViewContent`
- `Scroll25`, `Scroll50`, `Scroll75`
- `GalleryView`
- `CTA_Click`
- `Form_Start`
- `Form_Submit_Attempt`
- `Form_Submit_Error`
- `Lead`
- `Order_Submitted`

Events are enriched with product ID, slug, name, price, currency, experiment ID, experiment arm, and resolved UI variants.

## Experimentation

Product experiments are configured per product and resolved in:

```text
src/lib/experiments/productExperiments.ts
src/lib/experiments/assignExperiment.ts
```

Assignments are stored in browser `localStorage` by experiment ID. The current experiment surface can vary hero layout, review layout, CTA style, trust display, gallery layout, and price treatment.

## SEO

SEO is generated from the active product provider.

```text
src/lib/seo/metadata.ts
src/lib/seo/productJsonLd.ts
src/lib/seo/faqJsonLd.ts
src/app/sitemap.ts
src/app/robots.ts
```

Implemented SEO features:

- dynamic Next metadata per product
- canonical URLs
- Open Graph metadata
- Twitter card metadata
- product JSON-LD
- FAQ JSON-LD
- dynamic sitemap
- dynamic robots configuration

## Project Structure

```text
src/app/                 App Router routes, metadata, sitemap, robots, API route
src/components/          Landing sections, layout, analytics, and UI primitives
src/data/products/       Local product fixtures and default product registry
src/lib/analytics/       Event names, payload context, and pixel forwarding
src/lib/experiments/     Experiment resolution and browser assignment
src/lib/forms/           Order form validation and normalization
src/lib/orders/          Order capture adapters and server-side order validation
src/lib/providers/       Local and Wasilio product providers
src/lib/seo/             Metadata, canonical URLs, and structured data
src/test/fixtures/       Wasilio contract fixtures used by Vitest
src/types/               Product and normalized storefront contracts
docs/                    Product, architecture, SEO, analytics, Wasilio, and roadmap notes
public/images/           Product media assets
```

## Tests And CI

Local verification:

```bash
npm run lint
npm test
npm run build
```

CI is defined in `.github/workflows/ci.yml` and runs on:

- pushes to `main`
- pull requests targeting `main`
- manual workflow dispatch

The CI job:

1. checks out the repository
2. installs Node from `.nvmrc`
3. restores npm and Next build cache
4. runs `npm ci`
5. runs `npm run lint`
6. runs `npm test`
7. runs `npm run build`

## Documentation Index

Start here for product and architecture context:

- `docs/VISION.md`
- `docs/PRD.md`
- `docs/DEVELOPMENT_ROADMAP.md`
- `docs/PRODUCT_CONFIGURATION.md`
- `docs/MULTI_PRODUCT_ENGINE.md`
- `docs/PROVIDER_ADAPTER_ARCHITECTURE.md`
- `docs/WASILIO_PROVIDER_SETUP.md`
- `docs/WASILIO_PUBLIC_CONTRACTS.md`
- `docs/SEO_IMPLEMENTATION.md`
- `docs/ANALYTICS_IMPLEMENTATION.md`
- `docs/EXPERIMENT_ENGINE.md`
- `docs/VISUAL_QA_REVIEW.md`

## Deployment Notes

This repo currently has CI, not a deployment pipeline. A production deployment still needs a hosting target and deployment secrets.

For local fixture deployments:

- keep `NEXT_PUBLIC_PRODUCT_PROVIDER=local`
- make sure product canonical URLs point to the deployed domain
- configure real analytics pixel IDs only when ready to collect production traffic

For Wasilio-backed deployments:

- set `NEXT_PUBLIC_PRODUCT_PROVIDER=wasilio`
- set `NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL`
- set `NEXT_PUBLIC_WASILIO_STORE_SLUG`
- confirm Wasilio product slugs exist for the public store
- confirm Wasilio public order ingestion supports browser requests and returns public-safe receipts
- validate sitemap, robots, metadata, and order submission after deployment

## Contributor Notes

This project uses Next.js 16. Before changing Next-specific APIs, routing, config, metadata, or build behavior, read the relevant guide under:

```text
node_modules/next/dist/docs/
```

That local documentation is the source of truth for this repo's Next version.
