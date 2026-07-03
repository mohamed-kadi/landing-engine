# Wasilio Provider Setup

## Purpose

Phase 15 connects the Landing Engine to Wasilio public storefront APIs through provider and adapter boundaries. The engine still works with local fixture products for development and demos, but production deployments can now opt into Wasilio-backed product data and order capture.

This phase does not remove local fixtures, the local `/api/orders` route, SEO, analytics, pixels, or the reusable landing renderer.

## Environment Variables

Add these variables to `.env.local` or the deployment environment:

```env
NEXT_PUBLIC_PRODUCT_PROVIDER=local
NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_WASILIO_STORE_SLUG=
```

Provider values:

| Value | Behavior |
| --- | --- |
| `local` | Uses local TypeScript fixture products and the local `/api/orders` route. This is the default and safest development mode. |
| `wasilio` | Fetches product pages from Wasilio and submits order intents to Wasilio public order ingestion. |

`NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL` should be the public Wasilio API origin, for example:

```env
NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL=https://app.wasilio.com
```

`NEXT_PUBLIC_WASILIO_STORE_SLUG` identifies the public store/tenant boundary:

```env
NEXT_PUBLIC_WASILIO_STORE_SLUG=coolair-morocco
```

## Local Mode

Local mode uses:

- `localFixtureProductProvider`
- `localOrderCaptureAdapter`
- `src/data/products/*`
- `POST /api/orders`

This keeps the current development routes working:

- `/`
- `/products/wearable-neck-fan`
- `/products/cordless-car-vacuum-cleaner`

Local mode remains useful for UI work, demos, visual QA, SEO validation, analytics testing, and experimentation development when Wasilio is unavailable.

## Wasilio Product Mode

When `NEXT_PUBLIC_PRODUCT_PROVIDER=wasilio`, the provider calls:

```http
GET /api/public/storefront/{storeSlug}/products/{productSlug}
```

The full URL is built from:

- `NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_WASILIO_STORE_SLUG`
- the route `productSlug`

Example:

```http
GET https://app.wasilio.com/api/public/storefront/coolair-morocco/products/wearable-neck-fan
```

The Wasilio V1 response is normalized into `StorefrontProductPage`, which is the page model rendered by the Landing Engine.

## Wasilio Order Mode

When `NEXT_PUBLIC_PRODUCT_PROVIDER=wasilio`, the order form uses `wasilioOrderCaptureAdapter` and posts to:

```http
POST /api/public/storefront/{storeSlug}/orders
```

The adapter sends:

- `idempotencyKey`
- product slug, product ID, and selected variant inside `selection.product`
- quantity inside `selection.quantity`
- customer name and phone
- delivery city, address, and notes
- experiment attribution hints
- landing page URL when available
- `X-Correlation-ID`

The adapter does not send tenant IDs, merchant IDs, price authority, currency authority, IP address, or user agent. Wasilio must resolve and snapshot those values server-side.

The public Wasilio response is mapped back into the current `OrderCaptureResult` shape so the existing order form success/error behavior remains unchanged.

## V1 Response Limitations

Wasilio V1 is intentionally narrower than the local fixture model. It can provide a minimal product page with:

- store public name
- support channel
- product identity
- product description
- price and currency
- main image
- public availability/orderable status
- basic SEO fallback

The local fixtures already support richer ecommerce content:

- gallery
- variants
- benefits
- features
- problem/solution copy
- comparison rows
- testimonials
- FAQ
- trust badges
- experiments
- analytics pixels
- market/delivery rules

When Wasilio does not provide rich sections, the provider creates conservative generic section data from the product name, description, price, image, delivery market, FAQ/testimonials when present, and trust badges when present. This keeps the renderer stable without hardcoding product-specific UI.

If Wasilio returns a minimal V1 product with `description` or `imageUrl` missing, the provider uses SEO description as the marketing description and a neutral local product placeholder image. This prevents valid orderable products from becoming 404s while Wasilio storefront media support is still minimal.

## Static Generation Boundary

Wasilio V1 does not yet expose a public product listing endpoint or default product endpoint. Because of that:

- Local provider mode uses local fixture slugs from `generateStaticParams()`.
- Wasilio provider mode returns an empty `generateStaticParams()` array and uses `dynamicParams = true`, so product slugs are resolved by Wasilio at request time.
- The `/` default route starts from the local default product slug.
- If Wasilio is unreachable during build or for the default local slug, the provider can use the matching local fixture as a documented safety fallback.
- A real Wasilio production rollout should add a public listing/default endpoint or configure deployment routes explicitly.

Unknown Wasilio product slugs that return `404` are treated as missing products and do not fall back silently.

## Slug Mapping

The route format remains:

```text
/products/{productSlug}
```

The Wasilio request format is:

```text
/api/public/storefront/{storeSlug}/products/{productSlug}
```

`storeSlug` scopes product slugs per tenant/store. `productSlug` does not need to be globally unique across Wasilio.

## Architecture Summary

Product rendering uses:

```text
getProductProvider()
  local   -> localFixtureProductProvider
  wasilio -> wasilioProductProvider
```

Order capture uses:

```text
getOrderCaptureAdapter()
  local   -> localOrderCaptureAdapter
  wasilio -> wasilioOrderCaptureAdapter
```

The landing page renderer still receives one normalized contract:

```text
StorefrontProductPage
```

This keeps the UI independent from local fixtures and Wasilio API response details.

## Production Notes

For production Wasilio mode:

- Set `NEXT_PUBLIC_PRODUCT_PROVIDER=wasilio`.
- Set a valid Wasilio public API base URL.
- Set the correct store slug.
- Ensure product slugs in routes exist for that store.
- Validate that Wasilio returns canonical URLs and image URLs suitable for public SEO and social sharing.
- Confirm Wasilio order ingestion returns a public-safe receipt only.

Future improvements should add:

- Wasilio public product listing endpoint for static params and sitemap generation.
- Wasilio default product or storefront homepage endpoint for `/`.
- Merchant-managed rich marketing sections.
- Merchant-managed pixels and experiment configuration.
- Server-side order/event attribution.
