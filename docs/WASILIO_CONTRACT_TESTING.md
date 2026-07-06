# Wasilio Contract Testing

## Purpose

The Landing Engine can now talk to Wasilio public storefront APIs, but normal development and CI should not require a live Wasilio server. Contract fixtures let the engine verify the agreed V1 request/response shapes locally.

These tests protect the provider and adapter boundary:

- Wasilio product responses are normalized into `StorefrontProductPage`.
- Wasilio order receipts are normalized into the engine's `OrderCaptureResult`.
- Public-safe client payloads do not require tenant IDs, merchant IDs, or price authority.
- Missing products and error responses are handled without breaking the page.

## Fixtures

Fixtures live in:

```text
src/test/fixtures/wasilio/publicProductResponse.json
src/test/fixtures/wasilio/publicProductMinimalResponse.json
src/test/fixtures/wasilio/publicOrderResponse.json
```

They follow the documented Wasilio V1 public contract:

- `GET /api/public/storefront/{storeSlug}/products/{productSlug}`
- `POST /api/public/storefront/{storeSlug}/orders`

The main product fixture follows the current Wasilio implementation: product, offer, support, top-level SEO, and a published `landingProfile`. The profile includes `headline`, `subheadline`, `benefits`, `features`, `faq`, `trustBadges`, `galleryImageUrls`, `seoTitle`, `seoDescription`, and `seoImageUrl`.

The minimal product fixture represents the public response when no product storefront profile is published, including draft-profile behavior because Wasilio omits `landingProfile` from public responses unless the profile is `PUBLISHED`. It proves the provider still accepts products when profile content, description, or image fields are absent or null and can fall back to SEO description, offer currency, Morocco defaults, and the neutral local product placeholder image.

## What Is Tested Without Wasilio Running

Provider tests verify:

- product identity mapping
- store public name to brand mapping
- price and currency mapping
- `defaultCurrency` fallback when offer currency is missing
- `defaultCountryCode` fallback when market country is missing
- main image and gallery mapping
- `landingProfile.galleryImageUrls` mapping alongside the primary product image
- `landingProfile.seoTitle`, `landingProfile.seoDescription`, and `landingProfile.seoImageUrl` metadata overrides
- `seo.image` fallback mapping for OpenGraph and Twitter fields when profile SEO image is absent
- product description mapping into page copy and SEO description fallback
- published `landingProfile` mapping into hero, benefits, features, FAQ, and trust sections
- sparse display behavior when `landingProfile` is absent
- FAQ JSON-LD inputs are created only when real FAQ items survive display preparation
- local fixture mode remains the default provider path
- public availability/orderable mapping to schema.org availability
- legacy/minimal nullable product response behavior
- `404` and malformed response behavior

Order adapter tests verify:

- success response mapping into local order success shape
- request URL construction from `storeSlug`
- idempotency key and correlation ID creation
- public-safe order payload structure
- `400` validation error handling
- `404` store/product handling
- `409` idempotency conflict handling

## What Still Requires Integration Or E2E Testing

Contract tests do not prove:

- Wasilio is deployed and reachable.
- CDN or CORS configuration is correct.
- Real product images load in browsers.
- `seo.image` social cards are accepted by external crawlers.
- Wasilio order ingestion creates operational orders correctly.
- Wasilio server-side validation matches the fixture examples exactly.
- Merchant dashboards receive attribution and order snapshots.
- Pixel and browser analytics behavior works against live ad platforms.
- Non-Morocco fallback copy, city lists, or phone validation are localized unless Wasilio sends explicit market fields.
- Wasilio Storefront Publishing has been configured by a merchant and published for a real product.

Those need a later integration test environment with a real Wasilio API base URL and test store.

## Updating Fixtures

When Wasilio changes the V1 contract:

1. Update `docs/WASILIO_PUBLIC_CONTRACTS.md`.
2. Update the JSON fixtures to match the new public contract, keeping a minimal fixture if older nullable responses must remain supported.
3. Update provider or adapter mapping only if the normalized `StorefrontProductPage` or `OrderCaptureResult` boundary needs it.
4. Run:

```bash
npm test
npm run lint
npm run build
```

Fixture updates should remain public-safe. Do not add internal Wasilio fields such as `tenantId`, `merchantId`, internal user IDs, stock counts, internal product statuses, or operational order lifecycle IDs.

## Current Test Runner

The project uses Vitest for contract tests:

```bash
npm test
```

Vitest was chosen because it runs TypeScript test files directly with a small setup and does not require a browser or live Next.js server for these contract-level checks.
