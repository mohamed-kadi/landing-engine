# Information Architecture

## Purpose

This document defines how Landing Engine organizes product information into a persuasive ecommerce page. It describes the user journey, conversion funnel, section hierarchy, page composition rules, and recommended future folder structure at an architectural level.

## User Journey

### 1. Arrival

The shopper arrives from a paid ad, social post, search result, influencer link, WhatsApp share, or direct campaign URL. They are likely on mobile and have low initial trust.

The page must answer immediately:

- What is this product?
- What problem does it solve?
- Why should I care now?
- How much does it cost?
- Can I trust the seller?
- What do I do next?

### 2. First Impression

The first viewport must contain the strongest product signal:

- Product name or category.
- Clear headline focused on customer outcome.
- Product media that shows the actual item.
- Primary CTA.
- Offer or trust microcopy such as cash on delivery, fast shipping, warranty, or return policy.

The first viewport must not be a generic brand hero. The shopper clicked for a product.

### 3. Desire Building

After the first CTA, the page explains benefits, use cases, and product proof. This content turns initial curiosity into purchase intent.

Required questions:

- How does this improve my life?
- How is it used?
- What makes it better than alternatives?
- What do other customers say?

### 4. Risk Reduction

The page must reduce anxiety before the final conversion action.

Common objections:

- Will it work as shown?
- Is the quality good?
- Is delivery reliable?
- Can I pay safely?
- What if I do not like it?
- Is customer support available?

### 5. Conversion

The conversion block must make the order action straightforward. For cash-on-delivery flows, the order form must be short, mobile-friendly, and clear about what happens after submission. For checkout handoff flows, the CTA must communicate the next step accurately.

### 6. Post-Submit Expectation

After conversion, the user must understand:

- The order or lead was received.
- The next confirmation step.
- Expected contact or delivery timing.
- Support channel.

## Conversion Funnel

The engine must model the product page as a funnel with measurable stages:

| Funnel Stage | User State | Page Responsibility | Example Events |
| --- | --- | --- | --- |
| Impression | User arrived | Load quickly and identify product | `page_view`, `product_view` |
| Engagement | User evaluates | Show media and core benefits | `section_view`, `gallery_interaction` |
| Intent | User considers buying | Show offer and CTAs repeatedly | `cta_click`, `offer_view` |
| Form Start | User begins conversion | Reduce friction and validate gently | `form_start`, `field_interaction` |
| Submit | User converts | Capture order intent reliably | `lead_submit`, `purchase_intent` |
| Confirmation | User waits | Clarify next step | `confirmation_view` |

## Page Information Hierarchy

The recommended default hierarchy for direct-response product pages is:

1. Product hero.
2. Trust bar.
3. Product media gallery or proof media.
4. Benefit-led explanation.
5. Problem and solution.
6. Feature cards tied to benefits.
7. Offer block or bundle selector.
8. Comparison against alternatives.
9. Social proof.
10. Guarantee, delivery, and support reassurance.
11. FAQs and objections.
12. Conversion block.
13. Sticky mobile CTA.

This sequence is a default, not a hardcoded rule. The engine must allow section order to be controlled by configuration while still validating that critical conversion information exists somewhere on the page.

## Section Priority Rules

### Above The Fold

Must include:

- Product identity.
- Outcome-driven headline.
- Product image or media.
- Primary CTA.
- Offer or trust microcopy.

Should include when available:

- Price or starting price.
- Rating summary.
- Delivery promise.
- Payment method.

Must avoid:

- Long paragraphs.
- Generic brand copy.
- Multiple competing CTAs.
- Decorative visuals that do not show the product.

### Early Page

Must build momentum:

- Benefits before technical specifications.
- Visual product evidence before dense comparison tables.
- Trust signal near first CTA.
- Section rhythm that keeps mobile scroll light.

### Middle Page

Must handle evaluation:

- How it works.
- Use cases.
- Detailed features.
- Before/after or comparison logic.
- Reviews, testimonials, ratings, and customer context.

### Late Page

Must handle objections and conversion:

- Guarantee.
- Delivery and return policy.
- FAQ.
- Final offer.
- Form or checkout handoff.

## Content Slots

The engine should define reusable content slots that map to section needs:

| Slot | Purpose | Example Content |
| --- | --- | --- |
| `product.identity` | Stable product details | Name, category, brand |
| `offer.primary` | Purchase proposition | Price, discount, bundles |
| `media.hero` | First product visual | Primary image, video poster |
| `copy.hero` | First message | Headline, subheadline, CTA |
| `copy.benefits` | Desire creation | Outcome bullets |
| `copy.features` | Product explanation | Feature plus customer benefit |
| `proof.reviews` | Social proof | Reviews, ratings, cities |
| `trust.delivery` | Risk reduction | Shipping, COD, support |
| `seo.metadata` | Search metadata | Title, description, canonical |
| `analytics.context` | Event enrichment | Product ID, campaign, experiment |

## Page Composition Model

Each product page should be composed from a list of sections. Each section should define:

- `id`: stable page-local identifier.
- `type`: registered section type.
- `contentRef`: reference to product config content.
- `priority`: rendering and analytics priority.
- `visibility`: conditions such as stock, market, or experiment.
- `analytics`: whether the section emits view and interaction events.
- `fallback`: what happens if optional content is missing.

The renderer should reject invalid configurations before publish.

## Navigation Model

Direct-response product pages should not use heavy navigation by default. Navigation creates escape routes and can reduce conversion focus.

Recommended behavior:

- Minimal header or no header for paid traffic pages.
- Sticky mobile CTA after initial hero scroll.
- Optional section anchors only when the page is long or comparison-heavy.
- Footer limited to trust, legal, support, and Wasilio brand requirements.

## URL Architecture

Future URL options:

- Product route: `/products/[slug]`.
- Campaign route: `/p/[slug]` for paid traffic.
- Market route: `/[locale]/products/[slug]`.
- Experiment route handled by query or server assignment, not by exposing variant-heavy URLs where possible.

Recommended initial architecture:

- Public product pages use product slugs.
- Campaign tracking uses UTMs and internal campaign IDs.
- Canonical URL points to the clean product route.
- Experiment variants must not create duplicate indexable URLs unless explicitly intended.

## Recommended Folder Structure

This structure is recommended for future implementation only. Do not create these files during Phase 0.

```text
src/
  app/
    (public)/
      products/
        [slug]/
          page.tsx
          loading.tsx
          not-found.tsx
          opengraph-image.tsx
    api/
      lead/
        route.ts
  engine/
    config/
      product.schema.ts
      section.schema.ts
      analytics.schema.ts
      seo.schema.ts
    registry/
      sectionRegistry.ts
      integrationRegistry.ts
    render/
      ProductPageRenderer.tsx
      SectionRenderer.tsx
      renderGuards.ts
    validation/
      validateProductConfig.ts
      validateSectionTree.ts
      validateSeoConfig.ts
      validateAnalyticsConfig.ts
    analytics/
      eventCatalog.ts
      eventDispatcher.ts
      pixelAdapters/
    seo/
      metadataBuilder.ts
      structuredDataBuilder.ts
      sitemapBuilder.ts
    integrations/
      orderCapture/
      checkout/
      wasilio/
  components/
    primitives/
    sections/
    commerce/
    feedback/
  content/
    products/
    markets/
    experiments/
  design-system/
    tokens/
    foundations/
  lib/
    formatters/
    guards/
    utilities/
  types/
    product.ts
    section.ts
    analytics.ts
    seo.ts
```

## Naming Conventions

- Product slugs: lowercase kebab-case, stable after publish.
- Section IDs: lowercase kebab-case scoped to page, for example `hero-main`, `reviews-primary`.
- Section types: dot notation, for example `hero.product`, `faq.accordion`.
- Analytics events: snake_case, for example `cta_click`.
- Analytics payload keys: snake_case.
- React components: PascalCase.
- Files exporting one component: PascalCase file name.
- Utility files: camelCase.
- Config files: kebab-case or dot-qualified by domain, for example `wearable-neck-fan.config.ts`.

## IA Acceptance Criteria

- A new product can be described without changing page code.
- The section sequence can vary per product.
- Required conversion information is validated before publish.
- Each section has a clear role in the funnel.
- Mobile users can understand product, offer, trust, and CTA in the first screen.
- SEO, analytics, and conversion are represented in the architecture, not treated as afterthoughts.
