# Multi-Product Engine

## Purpose

Phase 6.5 converts the Landing Engine from a single hardcoded product page into a reusable product-page renderer backed by a typed product registry.

The UI, analytics behavior, SEO behavior, pixel behavior, and form validation behavior remain the same. The change is architectural: multiple products can now use the same landing page sections and infrastructure.

## Routing Strategy

The canonical product route is:

```txt
/products/[slug]
```

The existing home route `/` continues to render the default neck fan product instead of redirecting. This is the least risky option because it preserves the current entry behavior for anyone already using the root page during development. The page metadata still uses the product canonical URL, so search engines are pointed at the product-specific route.

Current default product:

```txt
/products/wearable-neck-fan
```

## Files

| File | Responsibility |
| --- | --- |
| `src/data/products/neckFan.ts` | Neck fan product configuration |
| `src/data/products/index.ts` | Product registry and lookup helpers |
| `src/data/product.ts` | Compatibility export for the default product |
| `src/components/landing/LandingPage.tsx` | Shared product landing page renderer |
| `src/app/page.tsx` | Renders the default product at `/` |
| `src/app/products/[slug]/page.tsx` | Renders product pages by slug |
| `src/app/sitemap.ts` | Emits all registered product canonical URLs |
| `src/app/robots.ts` | Uses the default product origin for sitemap location |

## Registry API

The registry exports:

```ts
products
getProductBySlug(slug)
getAllProducts()
getDefaultProduct()
```

`generateStaticParams()` uses `getAllProducts()` to prebuild product pages. Unknown slugs call `notFound()`.

## How To Add A New Product

1. Create a new file:

```txt
src/data/products/exampleProduct.ts
```

2. Export a typed `ProductData` object:

```ts
import type { ProductData } from '../../types/product';

export const exampleProduct: ProductData = {
  id: 'EXAMPLE-001',
  name: 'Example Product',
  slug: 'example-product',
  // complete the remaining required product fields
};
```

3. Register it in `src/data/products/index.ts`:

```ts
import { exampleProduct } from './exampleProduct';

export const products = {
  [neckFan.slug]: neckFan,
  [exampleProduct.slug]: exampleProduct,
};
```

4. Visit:

```txt
/products/example-product
```

## Slugs

Slugs must be stable, lowercase, URL-safe identifiers. A product slug controls:

- The route path under `/products/[slug]`.
- Static route generation.
- Product lookup in the registry.
- Future Wasilio merchant page URLs.

The slug and `seo.canonicalUrl` should agree. For example:

```ts
slug: 'wearable-neck-fan'
seo: {
  canonicalUrl: 'https://yourdomain.com/products/wearable-neck-fan'
}
```

## SEO Per Product

Each product owns its SEO fields under `product.seo`. The dynamic route calls `createProductMetadata(product)` so title, description, canonical URL, OpenGraph, Twitter card, robots, and alternates are product-specific.

The shared `LandingPage` renderer also creates Product JSON-LD and FAQ JSON-LD from the product passed to it.

The sitemap is product-aware and includes every registered product with its configured canonical URL and image URLs.

## Analytics Per Product

`LandingPage` creates analytics context from the product:

- `productId`
- `productName`
- `price`
- `currency`

That context is passed to the existing analytics layer, CTA tracking, gallery tracking, scroll tracking, and order form tracking. No event names or provider behavior changed in this phase.

## Wasilio Integration Path

The current registry is a local in-repo source adapter. Later, Wasilio can replace or generate this registry from merchant product data:

- Merchant products become `ProductData`.
- Merchant slugs map to `/products/[slug]`.
- Merchant media maps to galleries, social images, and JSON-LD images.
- Merchant variants map to form variant choices and Product schema offers.
- Merchant delivery zones map to city options.
- Merchant pixel settings can feed the optional pixel layer.
- Merchant SEO settings can feed `product.seo`.

The important boundary is that React sections should continue receiving a typed `product` object. They should not fetch directly from Wasilio APIs.

## QA Checklist

- `/` renders the default product.
- `/products/wearable-neck-fan` renders the same product through the route-aware renderer.
- Unknown product slugs return `notFound()`.
- `generateStaticParams()` includes every registered product slug.
- `sitemap.ts` includes every registered product canonical URL.
- Analytics payloads contain the active product ID and name.
- JSON-LD is generated from the active product.
