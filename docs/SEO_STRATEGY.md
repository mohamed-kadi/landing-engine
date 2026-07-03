# SEO Strategy

## Purpose

Landing Engine must generate product pages that are indexable, shareable, crawlable, and resistant to duplicate-content problems. SEO must be part of product configuration and route architecture, not a manual afterthought.

Phase 0 does not implement SEO. This document defines the architecture and requirements for later implementation.

## SEO Goals

- Generate unique metadata for every product page.
- Support clean canonical URLs.
- Prevent campaign and experiment URLs from creating duplicate indexable pages.
- Generate structured product data where product data is complete.
- Support Open Graph and social sharing images.
- Generate sitemap and robots policy from page publication state.
- Support future Wasilio multi-market SEO.

## URL Strategy

Recommended canonical product route:

```text
/products/[slug]
```

Recommended paid campaign route if needed:

```text
/p/[slug]
```

Rules:

- The canonical URL should usually point to the clean product route.
- UTM parameters must not change canonical URLs.
- Experiment query parameters must not create separate indexable pages by default.
- Product slugs must be stable after publish.
- If a product is discontinued, route behavior must be deliberate: keep page, redirect replacement, or return not found.

## Metadata Architecture

Every product config should provide or derive:

- Page title.
- Meta description.
- Canonical URL.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Twitter card fields.
- Robots policy.
- Locale and alternate language links when applicable.

In Next.js App Router, future implementation should generate metadata from server-side product configuration using the framework metadata APIs. Static `metadata` is appropriate for global defaults; product routes need dynamic metadata derived from the product slug and product config.

## Metadata Rules

### Title

Recommended pattern:

```text
[Product Name or Core Outcome] | [Brand or Store]
```

Rules:

- Keep title specific to the product.
- Avoid keyword stuffing.
- Include market or delivery promise only when useful and truthful.

### Description

Rules:

- Summarize product outcome, primary differentiator, and trust or offer.
- Keep it readable for search results.
- Avoid repeating the title.
- Do not include false scarcity or unsupported claims.

### Canonical

Rules:

- Must be absolute.
- Must match the intended indexable product page.
- Must ignore UTM and ad click parameters.
- Must be unique per product unless multiple campaign pages intentionally consolidate to one product.

## Structured Data

The engine should support product structured data when required fields are available.

Recommended schema types:

- `Product`.
- `Offer`.
- `AggregateRating` when real rating data exists.
- `Review` when real review data exists and policy allows.
- `FAQPage` when FAQ content is shown and valid.
- `BreadcrumbList` when breadcrumbs are present.

Required product structured data inputs:

- Product name.
- Description.
- Image URLs.
- SKU or product ID where available.
- Brand.
- Offer price.
- Currency.
- Availability.
- URL.

Rules:

- Do not output fake ratings or reviews.
- Do not output structured data for content hidden from users.
- Availability must match stock and offer configuration.
- Price and currency must match visible page content.

## Indexing Rules

Recommended indexability states:

| State | Behavior |
| --- | --- |
| `draft` | noindex, not in sitemap |
| `preview` | noindex, not in sitemap |
| `published` | index allowed, in sitemap |
| `campaign_only` | canonical to product, optional noindex |
| `discontinued` | keep indexed, noindex, redirect, or 404 based on business decision |

Indexability must be explicit in product or publication configuration.

## Sitemap Strategy

The sitemap should be generated from published product configuration.

Each sitemap entry should include:

- URL.
- Last modified date.
- Change frequency where useful.
- Priority where useful.
- Locale alternates when supported.

Rules:

- Draft and preview pages must not be included.
- Campaign URLs should generally not be included unless intentionally indexable.
- Deleted products must be removed or redirected.

## Robots Strategy

Robots policy should:

- Allow crawling of public product pages.
- Disallow preview, internal, and admin paths.
- Avoid blocking assets required for rendering.
- Include sitemap location.

Future implementation can use Next.js file conventions for generated robots output.

## Open Graph And Social Sharing

Each product should define:

- OG title.
- OG description.
- OG image.
- Image alt text.
- Product URL.

Rules:

- OG image should show the actual product and major offer cue.
- Do not rely on generic brand graphics for product shares.
- Generated OG images may be used later when product data and media are reliable.

## Content SEO

Product pages must include crawlable content that matches user intent:

- Product category and name.
- Benefits and use cases.
- Feature details.
- Delivery and payment information.
- FAQs.
- Reviews where real.
- Comparison against alternatives where truthful.

Avoid:

- Thin pages with only hero and form.
- Duplicate copy across many products.
- Hidden keyword blocks.
- Indexing every ad variant as a separate page.

## Technical SEO Requirements

- One descriptive `h1`.
- Logical heading hierarchy.
- Server-rendered metadata.
- Fast mobile performance.
- Stable image dimensions.
- Descriptive image alt text.
- Valid canonical URL.
- Valid structured data.
- Accessible links and controls.
- Product data consistency between visible content and structured data.

## Wasilio SEO Integration

When integrated into Wasilio, Landing Engine should receive:

- Product publication state.
- Product canonical route.
- Market and locale data.
- Product media URLs.
- Pricing and availability.
- Brand or merchant identity.
- Last modified date.

Landing Engine should return:

- Metadata object.
- Structured data object.
- Sitemap entry data.
- Robots/indexing recommendation.
- SEO validation results.

## SEO QA Checklist

- Product has unique title and description.
- Canonical URL is correct.
- Draft pages are noindex.
- Published pages are in sitemap.
- Product structured data validates.
- Visible price matches structured data price.
- OG image is product-specific.
- Page has one `h1`.
- FAQ structured data is only emitted for visible FAQs.
- Campaign parameters do not create duplicate indexed pages.
