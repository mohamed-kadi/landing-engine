# Wasilio Contract Review Notes

## Summary

The original public contract direction was correct, but the first draft was too broad for Wasilio's near-term implementation path and exposed internal ownership concepts that should not be part of a public storefront API.

The revised V1 contract is smaller, store-scoped, and focused on the minimum surface needed to render a basic public product page and submit a COD order intent.

## What Changed From The Original Draft

Product route changed from:

```http
GET /api/public/storefront/products/{slug}
```

to:

```http
GET /api/public/storefront/{storeSlug}/products/{productSlug}
```

Reason:

Product slugs are unique per store or tenant, not globally.

Order route changed from:

```http
POST /api/public/storefront/orders
```

to:

```http
POST /api/public/storefront/{storeSlug}/orders
```

Reason:

Wasilio resolves tenant and store ownership from `storeSlug` or a future custom domain. The public client must not send merchant or tenant IDs.

Internal identifiers were removed from public request/response examples:

- `tenantId`
- `merchantId`
- Internal user IDs
- Internal lifecycle order IDs
- Admin workflow states

Product status was normalized from internal states to public concepts:

- `availability: AVAILABLE | UNAVAILABLE`
- `orderable: boolean`

The product response was narrowed to a V1 surface:

- Store slug and public name.
- Support channel when available.
- Product ID and slug.
- Product name and description.
- Price and currency.
- Primary image.
- Availability and orderability.
- Basic SEO fallback.

Rich content was moved to later phases:

- Gallery.
- Variants.
- FAQ.
- Testimonials.
- Trust badges.
- Experiments.
- Analytics pixels.
- Market/delivery rules.
- Rich marketing sections.

The order intent contract now requires:

- Route-scoped `storeSlug`.
- Product slug or product ID.
- Idempotency key.
- Public customer and delivery fields.
- Optional attribution hints.
- Optional `X-Correlation-ID`.

The order response was narrowed to public-safe receipt fields only.

## Why The Contract Was Narrowed

The original draft assumed Wasilio could immediately provide a complete storefront rendering model similar to the Landing Engine's internal `StorefrontProductPage`.

That is a useful long-term goal, but it is too broad for V1 because Wasilio may not yet have:

- Rich landing page content management.
- Full SEO management.
- Public experiment configuration.
- Merchant-owned pixel configuration.
- Structured FAQ/testimonial/trust content.
- Delivery-market configuration exposed publicly.
- Public product gallery normalization.

The V1 contract should be implementable with current or near-term catalog and order-ingestion capabilities.

## Missing Wasilio Concepts Today

The revised V1 assumes some concepts may not exist yet or may not be public-ready:

- Storefront public profile per store.
- Stable `storeSlug`.
- Public product page availability separate from internal status.
- Public `orderable` state.
- CDN-backed primary product image URL.
- Basic SEO fallback fields.
- Public support channel.
- Public order idempotency handling.
- Public-safe order receipt ID.
- Correlation ID propagation.
- Store-scoped product lookup.

These are the concepts Wasilio should prioritize before attempting richer landing-engine parity.

## Future Contexts That Will Expand The Contract

The contract can expand after V1 once Wasilio has the necessary product and merchant systems.

Likely future contexts:

- Custom domains resolving store identity without `storeSlug` in visible URLs.
- Full product variants and option groups.
- Media gallery and product video.
- Rich landing section content.
- FAQ management.
- Testimonials and reviews.
- Trust badge configuration.
- Store delivery rules and supported cities.
- SEO management.
- Merchant analytics/pixel configuration.
- Server-side A/B experiment assignment.
- Attribution dashboards.
- Webhook notifications.
- Order status callbacks.
- Generated OpenAPI client integration.

## Recommended Implementation Order

1. Implement store-scoped product lookup.
2. Return V1 minimal product response.
3. Implement store-scoped order intent ingestion.
4. Add idempotency and correlation IDs.
5. Add public receipt response.
6. Add provider/adapter integration in the Landing Engine.
7. Expand optional storefront fields only when Wasilio owns reliable source data for them.

## Readiness

The V1 contract is ready for Wasilio implementation planning.

It is intentionally smaller than the internal Landing Engine model and avoids public dependency on internal Wasilio IDs, statuses, or operational order state.
