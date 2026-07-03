# Provider Adapter Architecture

## Purpose

The Landing Engine should remain a generic presentation engine. It should render a normalized product page model, not know whether the data came from local TypeScript fixtures, Wasilio, a CMS, or another commerce backend.

Phase 12 introduces two boundaries:

- Product providers: supply normalized storefront product pages.
- Order capture adapters: submit COD order intent to a capture destination.

Local fixtures remain active for development, but they are no longer the only shape the route layer understands.

## Product Providers

The provider interface lives in:

```text
src/lib/providers/ProductProvider.ts
```

It exposes:

- `getProductPageBySlug(slug)`
- `getDefaultProductPage()`
- `getAllProductPages()`

The methods are asynchronous so a future Wasilio provider can fetch product pages from an API without changing route signatures.

## Local Fixture Provider

The current local fixture provider lives in:

```text
src/lib/providers/localFixtureProvider.ts
```

It wraps the existing local product registry:

```text
src/data/products
```

The provider converts legacy `ProductData` into the normalized `StorefrontProductPage` contract. This preserves:

- Wearable neck fan page.
- Cordless car vacuum page.
- Existing product routes.
- Existing metadata.
- Existing structured data.
- Existing experiment assignment.
- Existing COD form validation.
- Existing local API order capture.

## StorefrontProductPage Contract

The normalized storefront contract lives in:

```text
src/types/storefront.ts
```

`StorefrontProductPage` separates page concerns into:

- `product`: identity, slug, name, brand, aggregate rating.
- `offer`: price, currency, availability, condition, variants.
- `media`: product images and optional video.
- `sections`: marketing content rendered by the landing page.
- `seo`: canonical URL, metadata, OpenGraph, Twitter, robots, keywords.
- `experiments`: weighted A/B test arms.
- `market`: locale, currency, delivery cities, phone format, payment method.
- `orderForm`: COD form labels, validation messages, options, and confirmation copy.
- `analytics`: optional provider IDs for future product or merchant-specific tracking.

This contract is the shape the Landing Engine should render over time.

## ProductData vs StorefrontProductPage

`ProductData` remains the local fixture authoring format. It is convenient for hand-written product examples in this repository.

`StorefrontProductPage` is the normalized rendering contract. It is the shape expected from providers.

The important difference:

- `ProductData` reflects the current local file structure.
- `StorefrontProductPage` reflects the page model the engine needs, regardless of source.

Future implementation should avoid adding new renderer dependencies on `ProductData`. New product sources should adapt into `StorefrontProductPage`.

## Order Capture Adapters

The order capture interface lives in:

```text
src/lib/orders/OrderCaptureAdapter.ts
```

It defines a generic `submitOrderIntent(order)` boundary.

The current local adapter lives in:

```text
src/lib/orders/localOrderCaptureAdapter.ts
```

It posts to the existing local route:

```text
POST /api/orders
```

The local API route remains in place. It validates the payload server-side, logs accepted orders, and writes JSONL only during local development.

## Future Wasilio Provider

Wasilio should eventually become the production product provider.

A future Wasilio provider should return `StorefrontProductPage` objects from merchant-controlled data:

- Merchant product catalog.
- Product media.
- Pricing and variants.
- Delivery market configuration.
- SEO settings.
- Experiment settings.
- Order form requirements.
- Merchant tracking configuration.

The Landing Engine should not need to know Wasilio database tables or internal APIs. It should only consume the normalized provider contract.

## Future Wasilio Order Ingestion

Order capture should later move from the local API route to Wasilio Public Order Ingestion.

The production adapter should submit:

- Product identity.
- Product slug.
- Selected variant.
- Price and currency.
- Quantity.
- Customer name.
- Phone.
- City.
- Address.
- Notes.
- Experiment ID and arm.
- Source.
- Submission timestamp.

Wasilio can then handle:

- Order persistence.
- Lead deduplication.
- Merchant notifications.
- Confirmation workflow.
- Delivery status.
- Reporting.
- Experiment outcome attribution.

## Ownership Boundaries

Presentation-owned:

- Page composition.
- Reusable section components.
- Visual variants.
- Client-side form UX.
- Analytics event names and browser dispatch.
- SEO rendering from normalized fields.
- JSON-LD rendering from normalized fields.

Provider-owned:

- Product identity.
- Offer and variant data.
- Product media URLs.
- Marketing content.
- SEO configuration.
- Market and delivery rules.
- Experiment configuration.
- Order form labels and validation messages.

Wasilio-owned in production:

- Merchant catalog source of truth.
- Inventory and availability.
- Durable order storage.
- Order status lifecycle.
- Merchant dashboards.
- Delivery integrations.
- Customer contact workflows.
- Confirmed-order and delivery-success reporting.

## Current State

Current routes use `localFixtureProductProvider`, so behavior remains identical while route code no longer imports the fixture registry directly.

Current order form submission uses `localOrderCaptureAdapter`, so the component no longer hardcodes the local API call. The adapter still points to `/api/orders` until a Wasilio adapter exists.

This phase is a boundary introduction, not a backend integration.
