# Product Requirements Document

## Product Name

Landing Engine

## Product Summary

Landing Engine is a reusable page generation system for ecommerce product pages. It consumes validated product configuration and renders conversion-focused product pages with consistent information architecture, design rules, tracking contracts, SEO metadata, and future Wasilio integration boundaries.

The product is currently in Phase 0. No UI implementation should begin until the architecture, data contracts, and implementation phases are accepted.

## Problem Statement

The current implementation path started as a single landing page. That approach does not scale across products because it hardcodes product content, UI sections, analytics assumptions, and form behavior into page code. Wasilio needs a system that can launch many product pages consistently without rebuilding the same structure for every campaign.

## Objectives

- Define a product-agnostic engine that creates high-converting ecommerce product pages from configuration.
- Separate page composition, product data, copy, design tokens, analytics, SEO, and integrations.
- Support rapid product launch while maintaining production-grade engineering standards.
- Provide a clear roadmap from the current exploratory app toward a reusable Wasilio module.

## Users

### Ecommerce Shopper

Goal: Understand the product and place an order quickly with confidence.

Needs:

- Clear product promise.
- Product media that explains the item visually.
- Price, offer, payment method, shipping, and guarantee clarity.
- Proof that the product works and the seller is trustworthy.
- Minimal form friction on mobile.

### Wasilio Operator

Goal: Launch and maintain product pages without editing React code.

Needs:

- Structured product configuration.
- Reusable section presets.
- Simple validation for missing content.
- Preview before publishing.
- Ability to change offers, copy, images, FAQs, and tracking IDs.

### Performance Marketer

Goal: Measure paid campaign quality and optimize funnel performance.

Needs:

- Consistent event taxonomy.
- Pixel support for Meta, Google, TikTok, and future channels.
- UTM capture and attribution persistence.
- Conversion event deduplication.
- Variant and experiment identifiers in event payloads.

### Frontend Engineer

Goal: Implement and extend the engine safely.

Needs:

- Stable contracts.
- Clear component responsibilities.
- Folder structure and naming conventions.
- Testing expectations.
- Server/client rendering rules.

## Scope

### In Scope For The Engine

- Product configuration model.
- Product page route architecture.
- Page composition model.
- Section registry architecture.
- Design system token strategy.
- Component library responsibilities.
- Copywriting and CRO guidance.
- SEO architecture.
- Analytics event and pixel strategy.
- Wasilio integration boundaries.
- Testing and quality standards.

### Out Of Scope For Phase 0

- UI component implementation.
- Styling implementation.
- Live analytics scripts.
- Real form submission.
- Checkout APIs.
- Product admin UI.
- CMS integration.
- A/B testing runtime.
- Actual Wasilio backend integration.

## Current Repository Assessment

The repository is a Next.js 16.2.9 app with React 19.2.4, Tailwind CSS 4, lucide-react, and class-variance-authority. It contains an exploratory product page under `src/app/page.tsx`, product data under `src/data/product.ts`, a product type under `src/types/product.ts`, and early component files under `src/components`.

Important observations:

- The app is currently single-product oriented.
- `src/app/page.tsx` contains many inline components and product-specific behavior.
- Separate component files exist, but the page still duplicates much of that logic inline.
- `src/components/sections/Features.tsx` exists but is empty.
- The current `ProductData` type is a useful starting point, but it mixes product, SEO, analytics, offer, content, and page composition concerns.
- These files should be treated as exploratory work, not as the final engine architecture.

## Functional Requirements

### Product Configuration

The engine must accept a structured product configuration that describes:

- Product identity: `id`, `slug`, `name`, `brand`, `category`.
- Market: country, locale, currency, language, delivery regions.
- Offer: price, compare-at price, discount, bundles, quantity breaks, warranty, return promise.
- Variants: color, size, material, SKU, stock, availability, default selection.
- Media: hero image, gallery, video, comparison media, usage media, thumbnails, alt text.
- Copy blocks: hero, benefit bullets, problem/solution, features, proof, comparison, FAQs, objection handling.
- Trust: payment methods, shipping promise, support channels, guarantee, security, fulfillment source.
- Page composition: ordered sections, section variants, visibility rules, fallback behavior.
- SEO: metadata, canonical URL, indexing rules, structured data fields.
- Analytics: channel IDs, experiment IDs, product group IDs, event enrichment fields.
- Integrations: order capture mode, checkout mode, CRM destination, Wasilio source identifiers.

### Page Composition

The engine must render pages from a section list instead of a hardcoded sequence. Each section definition must include:

- Section type.
- Stable section ID.
- Data reference or inline section content.
- Visibility conditions.
- Experiment variant key if applicable.
- Analytics exposure tracking requirement.
- Accessibility requirements specific to the section.

### Section Registry

The engine must use a registry that maps section type names to implementation components. The registry should reject unknown section types during validation rather than failing silently at render time.

Example section type names for future implementation:

- `hero.product`
- `trust.bar`
- `media.gallery`
- `benefits.grid`
- `problemSolution.split`
- `features.cards`
- `comparison.table`
- `proof.reviews`
- `offer.sticky`
- `faq.accordion`
- `order.codForm`

### Validation

Before a page can be generated, configuration must be validated for:

- Required product fields.
- Valid slug and canonical URL.
- Valid currency and market.
- Missing media alt text.
- Broken section references.
- Missing CTA copy.
- Missing price or offer data when order capture is enabled.
- Analytics event payload completeness.
- SEO metadata minimums.
- Duplicate section IDs.
- Unsupported section type names.

### Localization

The engine must support multiple locales in the future. The first production implementation can target one locale, but the architecture must avoid hardcoding copy, currency formatting, city lists, date formatting, or phone validation rules into components.

### Orders And Leads

The engine must support multiple conversion modes through adapters:

- Lead capture for cash-on-delivery confirmation.
- WhatsApp handoff.
- External checkout link.
- Future Wasilio checkout flow.

Phase 0 does not implement any mode. The requirement is to preserve the boundary.

### Analytics

The engine must emit a stable event contract for page views, section views, CTA clicks, product media interactions, offer interactions, form interactions, and conversion outcomes. Analytics must be defined independently from pixel vendor implementation.

### SEO

The engine must support product-specific metadata, canonical URLs, structured data, sitemap generation, robots policy, Open Graph images, and indexability rules. In Next.js App Router, metadata should be generated from server-side product configuration when implemented.

## Non-Functional Requirements

### Performance

- Mobile performance is the primary target.
- Avoid unnecessary client JavaScript.
- Prefer server-rendered static sections.
- Use client boundaries only for interactive components.
- Images must have stable dimensions or aspect ratios.
- Above-the-fold content must prioritize hero media, headline, offer, and CTA.

### Accessibility

- Every page must have one clear `h1`.
- Interactive controls must be keyboard accessible.
- Images must have meaningful alt text or be marked decorative.
- Accordion, gallery, form, and modal patterns must meet accessibility expectations.
- Color contrast must meet WCAG 2.2 AA for normal text and controls.
- Page title must be unique and descriptive because route announcements depend on title or `h1`.

### Maintainability

- Components must not contain product-specific copy.
- Product config must not contain implementation-specific CSS classes.
- Analytics logic must not be embedded inside visual sections.
- SEO metadata generation must not be duplicated across page templates.
- Naming conventions must be consistent across config, components, files, and analytics events.

### Security And Privacy

- Pixel IDs and public tracking IDs may be public config.
- Secrets must never be sent to the client.
- PII from forms must be handled only through approved server-side adapters.
- Consent requirements must be supported per market before activating optional marketing pixels where required.

## Success Criteria For Phase 1 Readiness

Implementation should not start until:

- These docs are reviewed and accepted.
- Product configuration boundaries are agreed.
- Initial section registry is selected.
- Analytics event taxonomy is accepted.
- SEO metadata strategy is accepted.
- Folder structure is approved.
- Current exploratory page is either archived, ignored, or migrated intentionally.
