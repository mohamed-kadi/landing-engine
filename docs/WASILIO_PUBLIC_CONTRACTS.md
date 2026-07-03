# Wasilio Public Contracts

## Contract Readiness: V1 Draft

This document defines the smaller freeze-ready V1 public contract Wasilio can realistically implement first.

The goal of V1 is not to expose every future storefront capability. The goal is to provide enough public product data to render a basic COD storefront landing page and enough order intent data for Wasilio to ingest a safe public order request.

The Landing Engine does not connect to Wasilio yet. Local fixtures and the local order API remain the active development implementation.

## Contract 1: Public Storefront Product Page V1

Endpoint draft:

```http
GET /api/public/storefront/{storeSlug}/products/{productSlug}
```

Reason:

Product slugs are unique per store or tenant, not globally. Wasilio resolves internal tenant and merchant ownership from `storeSlug` and, later, from a custom domain.

### Purpose

Return a minimal public storefront product response that can be adapted into `StorefrontProductPage`.

V1 should support:

- Store public identity.
- Basic product identity.
- Price and currency.
- Primary product image.
- Public availability and orderability.
- Basic SEO fallback.
- Optional empty arrays for richer landing sections.

V1 must not expose Wasilio internal tenant IDs, merchant IDs, internal user IDs, internal product statuses, stock counts, or internal timestamps.

### Success Response Example

```json
{
  "storeSlug": "coolair-morocco",
  "storePublicName": "CoolAir Morocco",
  "supportChannel": {
    "type": "whatsapp",
    "value": "+212600000000"
  },
  "product": {
    "productId": "prod_01HZX4",
    "productSlug": "wearable-neck-fan",
    "productName": "Wearable Neck Fan",
    "description": "A hands-free wearable fan for daily comfort in hot weather.",
    "imageUrl": "https://cdn.wasilio.com/storefront/coolair-morocco/products/wearable-neck-fan/main.jpg",
    "availability": "AVAILABLE",
    "orderable": true
  },
  "offer": {
    "price": 299,
    "currency": "MAD"
  },
  "seo": {
    "title": "Wearable Neck Fan - CoolAir Morocco",
    "description": "Order a wearable neck fan from CoolAir Morocco with cash on delivery.",
    "imageUrl": "https://cdn.wasilio.com/storefront/coolair-morocco/products/wearable-neck-fan/main.jpg",
    "canonicalUrl": "https://coolair-morocco.wasilio.com/products/wearable-neck-fan"
  },
  "gallery": [],
  "variants": [],
  "faq": [],
  "testimonials": [],
  "trustBadges": [],
  "experiments": null,
  "analytics": {},
  "market": {
    "countryCode": "MA",
    "currency": "MAD",
    "deliveryCities": [],
    "phonePattern": "^(06|07)\\d{8}$"
  },
  "marketingSections": {}
}
```

### Required Fields

Required top-level fields:

- `storeSlug`
- `storePublicName`
- `product`
- `offer`
- `seo`

Required product fields:

- `product.productId`
- `product.productSlug`
- `product.productName`
- `product.description`
- `product.imageUrl`
- `product.availability`
- `product.orderable`

Required offer fields:

- `offer.price`
- `offer.currency`

Required SEO fallback fields:

- `seo.title`
- `seo.description`
- `seo.imageUrl`
- `seo.canonicalUrl`

### Optional Fields For V1

Optional fields may be omitted or returned as empty arrays/objects:

- `supportChannel`
- `gallery`
- `variants`
- `faq`
- `testimonials`
- `trustBadges`
- `experiments`
- `analytics`
- `market.deliveryCities`
- `marketingSections`

The Landing Engine provider should supply safe defaults when optional V1 fields are absent.

### Do Not Expose

The V1 public product response must not expose:

- `tenantId`
- `merchantId`
- Internal user IDs
- Internal product status values such as `DRAFT`, `ACTIVE`, or `ARCHIVED`
- Stock counts
- Cost or margin data
- Internal timestamps
- Admin workflow state
- Private merchant configuration

### Public Status Boundary

Wasilio internal product states must be normalized into public storefront concepts:

```ts
availability: 'AVAILABLE' | 'UNAVAILABLE'
orderable: boolean
```

Recommended mapping:

- Publicly sellable product: `availability = AVAILABLE`, `orderable = true`
- Out of stock or paused product: `availability = UNAVAILABLE`, `orderable = false`
- Draft, archived, hidden, or private product: return `404`

The client must not infer internal status from these public values.

### Validation Rules

Wasilio must enforce:

- `storeSlug` resolves to a public storefront.
- `productSlug` resolves inside that store.
- `product.productSlug` matches the route `productSlug`.
- `storeSlug` in the body matches the route `storeSlug`.
- `offer.price` is a positive number.
- `offer.currency` is an ISO currency code and matches the store market.
- `product.imageUrl` is a public image URL.
- `seo.canonicalUrl` is a public canonical URL for this store/product.
- `product.availability` is `AVAILABLE` or `UNAVAILABLE`.
- `product.orderable` is boolean.
- If `variants` are present, variant IDs are unique within the product.

### Cache Strategy

Recommended cache behavior:

- Cache V1 product responses at the CDN edge.
- Suggested header: `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`.
- Include `ETag` or `Last-Modified` when practical.
- Purge or revalidate when product name, description, price, currency, image, availability, orderability, or SEO fallback changes.
- Do not cache private preview responses publicly.

Because price authority belongs to Wasilio, cache invalidation must be triggered when price changes.

### Draft, Disabled, And Missing Product Behavior

Return `404` when:

- Store does not exist.
- Store is not public.
- Product slug does not exist inside the store.
- Product is draft, archived, hidden, deleted, or private.

Return `200` with `availability = UNAVAILABLE` and `orderable = false` only when Wasilio intentionally wants the public page visible but not orderable.

Example 404:

```json
{
  "ok": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product page was not found."
  }
}
```

## Contract 2: Public Order Intent V1

Endpoint draft:

```http
POST /api/public/storefront/{storeSlug}/orders
```

Reason:

The public client should not send merchant or tenant IDs. Wasilio resolves tenant/store ownership from the route `storeSlug` and, later, from a custom domain.

### Headers

Recommended headers:

```http
Content-Type: application/json
X-Correlation-ID: req_01J1ZYGHTN5KVV8Q56KT8V3D7M
```

`X-Correlation-ID` is optional but should be accepted when present. Wasilio should echo it in the response. If absent, Wasilio should generate a correlation ID server-side.

### Request Example

```json
{
  "idempotencyKey": "ordint_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "product": {
    "productSlug": "wearable-neck-fan",
    "productId": "prod_01HZX4"
  },
  "selection": {
    "variantId": "var_white",
    "quantity": 1
  },
  "customer": {
    "fullName": "Fatima Zahra",
    "phone": "0612345678"
  },
  "delivery": {
    "city": "Casablanca",
    "address": "123 Rue Example, Maarif",
    "notes": "Call before delivery"
  },
  "attribution": {
    "experimentId": "exp_prod_01HZX4_layout_v1",
    "experimentArm": "variant_a",
    "utmSource": "facebook",
    "utmMedium": "paid_social",
    "utmCampaign": "summer-neck-fan",
    "referrer": "https://facebook.com/"
  },
  "client": {
    "submittedAt": "2026-07-01T12:00:00.000Z",
    "landingPageUrl": "https://coolair-morocco.wasilio.com/products/wearable-neck-fan",
    "locale": "en-MA"
  }
}
```

### Required Fields

Required:

- `idempotencyKey`
- `product.productSlug` or `product.productId`
- `selection.quantity`
- `customer.fullName`
- `customer.phone`
- `delivery.city`
- `delivery.address`

Required when both identifiers are provided:

- `product.productSlug` and `product.productId` must resolve to the same product in the store.

Required when the product has variants:

- `selection.variantId`

The route `storeSlug` is required and is not repeated in the request body.

### Optional Fields

Optional:

- `product.productSlug` if `product.productId` is provided
- `product.productId` if `product.productSlug` is provided
- `selection.variantId` when product has no variants
- `delivery.notes`
- `attribution.experimentId`
- `attribution.experimentArm`
- UTM fields
- `attribution.referrer`
- `client.submittedAt`
- `client.landingPageUrl`
- `client.locale`
- `X-Correlation-ID` header

### Do Not Trust Client-Provided Values

Wasilio must not trust public client-provided:

- `merchantId`
- `tenantId`
- Internal user IDs
- `source`
- `ipAddress`
- `userAgent`
- Price
- Currency
- Product name
- Variant name
- Stock or availability
- Operational order status

If these fields are sent, Wasilio should ignore them or reject the request.

### Server-Side Authority Rules

Wasilio must:

- Resolve tenant/store from `storeSlug`.
- Resolve product server-side from `productSlug` and/or `productId`.
- Validate both product identifiers match if both are present.
- Validate product is public and orderable.
- Validate variant belongs to product when provided.
- Validate quantity is an integer greater than or equal to `1`.
- Validate customer name and address are present.
- Validate phone using store/market rules.
- Validate delivery city using Wasilio delivery rules when available.
- Force `source = WASILIO_STOREFRONT`.
- Derive IP address server-side.
- Derive user agent server-side.
- Derive price and currency server-side.
- Route accepted request into Wasilio Order Ingestion.

### Snapshot Requirements

Wasilio must snapshot public order facts at ingestion time:

- Store slug.
- Store public name.
- Product ID.
- Product slug.
- Product name.
- Variant ID if selected.
- Variant name if selected.
- Unit price.
- Currency.
- Quantity.
- Calculated total.
- Customer name.
- Customer phone.
- Delivery city.
- Delivery address.
- Delivery notes.
- Attribution hints.
- Forced source `WASILIO_STOREFRONT`.
- Server-derived IP and user agent.
- Correlation ID.
- Idempotency key.
- Server received timestamp.

The snapshot is required because product names, prices, variants, and orderability may change after submission.

### Idempotency Behavior

Wasilio should require `idempotencyKey`.

Recommended behavior:

- Same `idempotencyKey` and same normalized payload returns the original public receipt.
- Same `idempotencyKey` and conflicting payload returns `409 IDEMPOTENCY_CONFLICT`.
- Scope idempotency by `storeSlug`.
- Expire idempotency records after an implementation-defined window, for example 24 hours.

### Success Response V1

Return only public-safe fields:

```json
{
  "ok": true,
  "accepted": true,
  "orderIntentId": "oi_01J1ZYM3W2CYG99VPVSKDYQ5B5",
  "status": "received",
  "correlationId": "req_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "calculatedTotal": {
    "amount": 299,
    "currency": "MAD"
  }
}
```

`inboundOrderId` may be used instead of `orderIntentId` if that matches Wasilio naming better, but the response must not expose internal lifecycle order IDs.

### Do Not Expose In V1 Response

The public order response must not expose:

- Internal lifecycle order ID.
- Operational order status.
- Admin workflow state.
- Internal tenant ID.
- Internal merchant ID.
- Internal user IDs.
- Stock counts.
- Internal routing decisions.
- Private validation/debug details.

### Error Response Examples

Validation error:

```json
{
  "ok": false,
  "accepted": false,
  "correlationId": "req_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Order intent is invalid.",
    "fields": {
      "customer.phone": "Phone number must be a valid Moroccan mobile number.",
      "selection.quantity": "Quantity must be at least 1."
    }
  }
}
```

Unknown store:

```json
{
  "ok": false,
  "accepted": false,
  "correlationId": "req_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "error": {
    "code": "STORE_NOT_FOUND",
    "message": "Storefront was not found."
  }
}
```

Unknown or unorderable product:

```json
{
  "ok": false,
  "accepted": false,
  "correlationId": "req_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "error": {
    "code": "PRODUCT_UNAVAILABLE",
    "message": "Product was not found or is not currently orderable."
  }
}
```

Identifier mismatch:

```json
{
  "ok": false,
  "accepted": false,
  "correlationId": "req_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "error": {
    "code": "PRODUCT_IDENTIFIER_MISMATCH",
    "message": "Product ID and product slug do not refer to the same product."
  }
}
```

Idempotency conflict:

```json
{
  "ok": false,
  "accepted": false,
  "correlationId": "req_01J1ZYGHTN5KVV8Q56KT8V3D7M",
  "error": {
    "code": "IDEMPOTENCY_CONFLICT",
    "message": "This idempotency key was already used with a different payload."
  }
}
```

## V1 / Later Split

### V1

V1 includes:

- Store slug.
- Store public name.
- Support channel when available.
- Product ID.
- Product slug.
- Product name.
- Description.
- Price.
- Currency.
- Primary image URL.
- Public availability.
- Public orderability.
- Basic SEO fallback.
- Minimal COD order intent ingestion.
- Idempotency key.
- Correlation ID support.
- Public-safe receipt response.

### Later

Later versions can add:

- Variants as a full production feature.
- Media gallery.
- Product video.
- SEO management.
- FAQ.
- Testimonials.
- Trust badges.
- Market and delivery rules.
- Analytics pixels.
- A/B experiments.
- Attribution dashboards.
- Custom domains.
- Server-side experiment assignment.
- Webhook notifications.
- Full public StorefrontProductPage parity.

## Ownership Rules

### Wasilio Owns

- Catalog product.
- Store and tenant resolution.
- Public store identity.
- Price authority.
- Variant authority.
- Stock and availability.
- Public orderability.
- Order ingestion.
- Order snapshots.
- Customer and contact data.
- Attribution storage.
- Dashboard analytics.
- Durable order lifecycle.

### Landing Engine Owns

- Rendering.
- UX.
- Client-side validation.
- SEO rendering from public fields.
- JSON-LD rendering from public fields.
- Pixel and browser event emission.
- Public order intent capture.
- Provider and adapter integration points.

## Future Integration Notes

### WasilioProductProvider

`WasilioProductProvider` should eventually replace `localFixtureProvider`.

It should:

- Fetch `GET /api/public/storefront/{storeSlug}/products/{productSlug}`.
- Adapt V1 minimal fields into the current engine model.
- Fill missing optional arrays with empty defaults.
- Derive basic landing sections from `productName`, `description`, `price`, `imageUrl`, and store identity until richer content exists.
- Treat `404`, `UNAVAILABLE`, and `orderable = false` as public storefront states.

### WasilioOrderCaptureAdapter

`WasilioOrderCaptureAdapter` should eventually replace `localOrderCaptureAdapter`.

It should:

- Submit to `POST /api/public/storefront/{storeSlug}/orders`.
- Generate or pass an idempotency key.
- Pass `X-Correlation-ID` when available.
- Avoid sending merchant IDs, tenant IDs, IP address, user agent, price, or currency as authority fields.
- Map Wasilio errors into user-safe form errors.
- Preserve the rule that conversion analytics fire only after Wasilio accepts the order intent.

### OpenAPI And Generated TypeScript Client

Wasilio should publish an OpenAPI specification for V1.

Recommended usage:

- Generate a TypeScript client for `WasilioProductProvider`.
- Generate request/response types for `WasilioOrderCaptureAdapter`.
- Keep the Landing Engine's internal storefront model separate from Wasilio transport types.
- Validate Wasilio responses at the provider boundary before rendering.

### Local Fixtures Remain Useful

Local fixtures should remain available after Wasilio integration.

They are useful for:

- UI development without backend availability.
- Demo products.
- Regression testing.
- Visual QA.
- Experiment examples.
- Development when Wasilio staging is unavailable.

The local fixture provider remains a development and fallback provider, not the production source of truth.
