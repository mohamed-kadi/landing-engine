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
src/test/fixtures/wasilio/publicOrderResponse.json
```

They follow the documented Wasilio V1 public contract:

- `GET /api/public/storefront/{storeSlug}/products/{productSlug}`
- `POST /api/public/storefront/{storeSlug}/orders`

The product fixture intentionally uses mostly minimal V1 fields. Rich marketing arrays are empty so the tests prove that the provider can create safe default section content for the existing renderer.

## What Is Tested Without Wasilio Running

Provider tests verify:

- product identity mapping
- store public name to brand mapping
- price and currency mapping
- main image and gallery mapping
- SEO fallback mapping for OpenGraph and Twitter fields
- default marketing sections when rich content is absent
- public availability/orderable mapping to schema.org availability
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
- Wasilio order ingestion creates operational orders correctly.
- Wasilio server-side validation matches the fixture examples exactly.
- Merchant dashboards receive attribution and order snapshots.
- Pixel and browser analytics behavior works against live ad platforms.

Those need a later integration test environment with a real Wasilio API base URL and test store.

## Updating Fixtures

When Wasilio changes the V1 contract:

1. Update `docs/WASILIO_PUBLIC_CONTRACTS.md`.
2. Update the JSON fixtures to match the new public contract.
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
