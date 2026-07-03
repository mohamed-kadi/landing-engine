# SEO Implementation

## Purpose

Phase 5 adds production-oriented SEO support to the Landing Engine without changing page design, form behavior, analytics scripts, or visible content. The page now exposes product metadata, social preview data, Product JSON-LD, FAQ JSON-LD, robots configuration, and sitemap output from reusable product configuration.

## Why Metadata Matters

Metadata helps search engines and ad platforms understand what the page is about before they evaluate the full page body. A product landing page should expose a clear title, description, canonical URL, index/follow robots settings, and stable product context.

This matters for:

- Organic search relevance.
- Paid landing page quality signals.
- Cleaner search snippets.
- Canonical consolidation when campaigns or tracking URLs point to the same page.
- Future Wasilio merchant pages where product data may come from merchant catalogs.

## Why OpenGraph Matters

OpenGraph and Twitter metadata control how a product page appears when shared through social and messaging surfaces. This is important for ecommerce because product links are often shared through WhatsApp, Facebook, Telegram, LinkedIn, and direct messages.

Good social metadata improves:

- Link preview clarity.
- Product trust before click.
- Visual consistency across campaigns.
- Merchant control over image, title, and description.

## Why Product JSON-LD Matters

Product JSON-LD gives search engines structured product context in a machine-readable format. The current helper includes:

- Product name.
- Product description.
- Product image URLs.
- SKU.
- Brand.
- Canonical URL.
- Offers for variants.
- Price and currency.
- Availability.
- Item condition.
- Price validity date when configured.
- Aggregate rating when configured.
- Review snippets from configured social proof.

This does not guarantee rich results, but it gives crawlers the clean product data they expect.

## Why FAQ JSON-LD Matters

FAQ JSON-LD makes product support questions easier for crawlers to understand. The Landing Engine already has FAQ content in product configuration, so the schema can reuse the same source of truth.

FAQ structured data is useful because it:

- Clarifies delivery, COD, return, warranty, and usage concerns.
- Helps crawlers understand commercial objections.
- Keeps SEO data aligned with visible page content.

## Configurable Fields

The following fields are product-configurable:

| Field | Purpose |
| --- | --- |
| `slug` | Future route and page identity |
| `seo.canonicalUrl` | Canonical product URL |
| `seo.seoTitle` | Search title |
| `seo.seoDescription` | Search description |
| `seo.ogTitle` | Social share title |
| `seo.ogDescription` | Social share description |
| `seo.ogImage` | OpenGraph preview image |
| `seo.twitterTitle` | Twitter/X card title |
| `seo.twitterDescription` | Twitter/X card description |
| `seo.twitterImage` | Twitter/X card image |
| `seo.keywords` | Optional keyword hints |
| `seo.robots` | Index/follow behavior |
| `seo.alternates` | Optional alternate language URLs |
| `brand` | Product brand for schema |
| `availability` | Schema availability URL |
| `condition` | Schema item condition URL |
| `priceValidUntil` | Optional offer price validity date |
| `aggregateRating` | Optional aggregate rating schema |

## Files

| File | Responsibility |
| --- | --- |
| `src/lib/seo/metadata.ts` | Creates Next.js `Metadata` from product SEO config |
| `src/lib/seo/productJsonLd.ts` | Creates Product JSON-LD from product config |
| `src/lib/seo/faqJsonLd.ts` | Creates FAQPage JSON-LD from configured FAQ items |
| `src/lib/seo/jsonLd.ts` | Serializes JSON-LD safely for script injection |
| `src/lib/seo/url.ts` | Normalizes canonical and image URLs |
| `src/app/page.tsx` | Exports product metadata and renders JSON-LD scripts |
| `src/app/robots.ts` | Generates simple product-aware robots output |
| `src/app/sitemap.ts` | Generates simple product-aware sitemap output |

## Wasilio Integration Path

Later, Wasilio can generate this SEO layer from merchant product data:

- Merchant product name can seed SEO titles.
- Merchant descriptions can seed SEO descriptions.
- Wasilio media library images can become OG, Twitter, and schema images.
- Inventory state can map to schema availability.
- Product variants can map to schema offers.
- Merchant reviews can map to aggregate rating and review schema after validation.
- Published merchant slugs can become canonical URLs and sitemap entries.

Before publishing merchant-generated pages, Wasilio should validate that every product has a canonical URL, title, description, preview image, price, currency, and availability state.

## QA Checklist

- Page metadata comes from `product.seo`.
- Canonical URL is absolute.
- OG and Twitter images resolve against the canonical origin when configured as relative paths.
- Product JSON-LD includes offers and product images.
- FAQ JSON-LD mirrors visible FAQ content.
- `robots.ts` points to the sitemap for the configured origin.
- `sitemap.ts` includes the product canonical URL and image URLs.
- No external analytics or SEO scripts are loaded in this phase.
