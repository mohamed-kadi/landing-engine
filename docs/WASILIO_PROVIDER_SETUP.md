# Wasilio Provider Setup

## Purpose

Phase 19 consumes Wasilio public storefront APIs through provider and adapter boundaries. The engine still works with local fixture products for development and demos, but production deployments can opt into Wasilio-backed product data, published storefront profile content, and order capture.

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

The Wasilio public response is normalized into `StorefrontProductPage`, which is the page model rendered by the Landing Engine. Landing Engine does not own or author rich Wasilio landing copy; Wasilio Storefront Publishing remains the source of truth and Landing Engine is only the renderer.

The provider consumes these product and SEO fields when Wasilio sends them:

- `defaultCountryCode` for the normalized `market.countryCode` fallback.
- `defaultCurrency` as the fallback for `offer.currency` and normalized market currency.
- `product.description` for page copy and SEO description fallback.
- `product.imageUrl` as the primary product image.
- `seo.image` as the default OpenGraph and Twitter image when more specific social image fields are absent.
- normalized `product.productSlug`, `offer.price`, and `offer.currency` values for the route product and displayed offer.

When a product storefront profile is published in Wasilio, the public response includes `landingProfile`. The provider maps the published profile fields into rendered landing sections:

| Wasilio field | Landing Engine mapping |
| --- | --- |
| `landingProfile.headline` | hero headline |
| `landingProfile.subheadline` | hero subheadline and section description fallback |
| `landingProfile.benefits` | benefits list |
| `landingProfile.features` | feature cards |
| `landingProfile.faq` | visible FAQ section and FAQ JSON-LD input |
| `landingProfile.trustBadges` | trust badge label and description |
| `landingProfile.galleryImageUrls` | gallery images alongside the primary product image |
| `landingProfile.seoTitle` | metadata title and social title fallback |
| `landingProfile.seoDescription` | metadata description and product JSON-LD description |
| `landingProfile.seoImageUrl` | OpenGraph and Twitter image fallback |

Wasilio also folds published profile SEO overrides into top-level `seo.title`, `seo.description`, and `seo.image`. Landing Engine reads both locations, with `landingProfile` taking precedence when present.

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

## Public Response Shape

The current Wasilio public product response provides:

- store public name
- support channel
- default country and currency
- product identity
- product description
- price and currency
- main image
- SEO title, description, and share image
- public availability/orderable status
- basic SEO fallback
- optional published `landingProfile`

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

Rich Wasilio page sections now come from Storefront Publishing through `landingProfile`. When Wasilio does not publish a profile, the public response omits `landingProfile`; the renderer keeps the product hero, product image/gallery state, availability, minimal operational trust, and order flow visible, but suppresses generated fallback benefits, features, comparison, reviews, and FAQ so the page does not look like it contains merchant-authored marketing content.

If Wasilio returns a minimal V1 product with `description`, `imageUrl`, `defaultCurrency`, `defaultCountryCode`, or `seo.image` missing, the provider keeps the product valid when possible by falling back to SEO description, the offer currency, Morocco market defaults, and a neutral local product placeholder image. This prevents valid orderable products from becoming 404s while Wasilio storefront content is incomplete.

Remaining limitations:

- `defaultCountryCode` does not localize the fallback city list, phone validation message, or generic trust copy by itself. Wasilio should send `market.deliveryCities`, `market.phonePattern`, and localized marketing sections for non-Morocco stores.
- `seo.image` and `landingProfile.seoImageUrl` are used for metadata/social sharing; JSON-LD product images and the visible gallery still come from `product.imageUrl` and `landingProfile.galleryImageUrls`.
- Reviews, FAQ, benefits, feature claims, and detailed trust copy should be managed in Wasilio Storefront Publishing before they appear on Wasilio-backed pages.

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
- Publish the storefront product profile in Wasilio for premium landing sections.
- Validate that Wasilio returns `product.imageUrl`, `landingProfile.galleryImageUrls`, and profile SEO image URLs suitable for public rendering and social sharing. Landing Engine will use its route fallback for canonical URLs until Wasilio exposes canonical URLs publicly.
- Confirm Wasilio order ingestion returns a public-safe receipt only.

Future improvements should add:

- Wasilio public product listing endpoint for static params and sitemap generation.
- Wasilio default product or storefront homepage endpoint for `/`.
- Merchant-managed pixels and experiment configuration.
- Server-side order/event attribution.
