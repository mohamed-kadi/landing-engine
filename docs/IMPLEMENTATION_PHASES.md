# Implementation Phases

## Purpose

This document converts the roadmap into implementation phases with concrete deliverables, gates, and recommended future folder structure. It is a planning document only. Do not create the proposed source files during Phase 0.

## Phase Gate Rules

- Do not implement UI until domain models and section contracts are approved.
- Do not add analytics pixels until the canonical event contract is approved.
- Do not add SEO route files until metadata and publication rules are approved.
- Do not integrate Wasilio until adapter inputs and outputs are agreed.
- Do not continue modifying the current `src/app/page.tsx` prototype as the engine.

## Phase 0 Deliverables

Status: documentation only.

Files:

- `docs/VISION.md`
- `docs/PRD.md`
- `docs/INFORMATION_ARCHITECTURE.md`
- `docs/DESIGN_SYSTEM.md`
- `docs/COPYWRITING_GUIDE.md`
- `docs/SEO_STRATEGY.md`
- `docs/ANALYTICS_STRATEGY.md`
- `docs/COMPONENT_LIBRARY.md`
- `docs/DEVELOPMENT_ROADMAP.md`
- `docs/IMPLEMENTATION_PHASES.md`

Acceptance:

- No React components created.
- No CSS created.
- No route implementation created.
- No analytics implementation created.
- No SEO implementation created.
- Documentation covers business goals, ecommerce goals, conversion goals, audience, mobile-first philosophy, funnel, copy, CRO, information hierarchy, design, components, analytics, pixels, SEO, structure, naming, coding standards, reusable config, and Wasilio integration.

## Phase 1: Contracts And Schemas

Objective:

Create the engine domain model and validation layer.

Recommended deliverables:

- Product identity model.
- Market model.
- Offer model.
- Variant model.
- Media model.
- Copy model.
- Trust model.
- SEO model.
- Analytics model.
- Section composition model.
- Validation result model.

Implementation notes:

- The current `src/types/product.ts` can inspire fields but should not be copied directly as the final boundary.
- Split concerns that are currently combined in `ProductData`.
- Use examples from at least two products to prevent overfitting to the wearable neck fan.
- Keep Wasilio identifiers optional but reserved.

Gate:

- A product config can be validated without rendering UI.
- Invalid config produces actionable validation messages.
- A senior engineer can add a new config without reading component internals.

## Phase 2: Engine Core

Objective:

Create the config-to-page orchestration layer.

Recommended deliverables:

- Product source adapter interface.
- Product config loader.
- Page model normalizer.
- Section registry.
- Section renderer.
- Render guard and fallback handling.
- Preview error display strategy.

Implementation notes:

- Follow Next.js App Router conventions for dynamic product routes.
- Keep route files thin and server-first.
- Use private or non-routable folders for colocated implementation details if stored under `app`.
- Avoid page-level `"use client"` in final engine routes.

Gate:

- Section order comes from config.
- Unknown section types fail validation.
- Missing optional data uses defined fallback behavior.
- Missing required data blocks publish.

## Phase 3: Design Tokens And Primitives

Objective:

Create reusable visual foundations.

Recommended deliverables:

- Token files.
- Primitive components.
- Accessibility behavior.
- Mobile layout utilities.
- Component state examples.

Gate:

- Primitives are product-agnostic.
- Design tokens can support Wasilio and merchant brand modes.
- Accessibility baseline passes for primitives.

## Phase 4: Section MVP

Objective:

Build reusable ecommerce sections.

Recommended deliverables:

- Product hero.
- Trust bar.
- Media gallery.
- Benefits.
- Features.
- Problem-solution.
- Comparison.
- Reviews.
- FAQ.
- Offer.
- Sticky CTA.

Gate:

- All sections render from normalized props.
- No hardcoded product copy.
- Mobile-first layout accepted.
- Sections expose canonical interaction callbacks.

## Phase 5: Conversion Adapters

Objective:

Support conversion capture without locking into one backend.

Recommended deliverables:

- Conversion mode model.
- COD lead form adapter.
- WhatsApp handoff adapter.
- External checkout adapter.
- Server submission boundary.
- Confirmation model.

Gate:

- Conversion mode is config-driven.
- PII is handled server-side.
- Lead/order payload includes attribution.
- Form behavior is market-aware.

## Phase 6: Analytics Runtime

Objective:

Connect canonical events to analytics systems.

Recommended deliverables:

- Analytics provider.
- Event dispatcher.
- Context provider.
- Attribution capture.
- Pixel adapters.
- Event QA tools.

Gate:

- Events follow `ANALYTICS_STRATEGY.md`.
- Vendor adapters are isolated.
- Draft and local modes do not send production events.
- Conversion deduplication is supported.

## Phase 7: SEO Runtime

Objective:

Generate SEO metadata and crawler assets from product config.

Recommended deliverables:

- Metadata builder.
- Structured data builder.
- Sitemap builder.
- Robots builder.
- OG image strategy.
- Publication state handling.

Gate:

- Published products are indexable by config.
- Draft products are not indexed.
- Product structured data matches visible page content.
- Canonical URLs are validated.

## Phase 8: Wasilio Integration

Objective:

Connect the engine to Wasilio product, order, and reporting systems.

Recommended deliverables:

- Wasilio product adapter.
- Wasilio media adapter.
- Wasilio lead/order adapter.
- Wasilio analytics sink.
- Operator preview route.
- Publication workflow.

Gate:

- Wasilio can create or update product page config.
- Landing Engine can render Wasilio-backed product pages.
- Conversion outcomes can return to Wasilio.
- Analytics can be joined to Wasilio products and campaigns.

## Phase 9: Experimentation And CRO

Objective:

Support measured optimization.

Recommended deliverables:

- Experiment config model.
- Variant assignment.
- Section variant registry.
- Experiment analytics context.
- Winning variant promotion workflow.

Gate:

- Experiment data is trustworthy.
- Variants do not create accidental duplicate SEO pages.
- Operators can compare funnel metrics by variant.

## Recommended Future Folder Structure

This is a recommended structure for implementation planning only. Do not create these files as part of Phase 0.

```text
src/
  app/
    layout.tsx
    globals.css
    (public)/
      products/
        [slug]/
          page.tsx
          loading.tsx
          not-found.tsx
          opengraph-image.tsx
    (preview)/
      preview/
        products/
          [slug]/
            page.tsx
    api/
      leads/
        route.ts
      webhooks/
        wasilio/
          route.ts
  engine/
    config/
      product.schema.ts
      market.schema.ts
      offer.schema.ts
      section.schema.ts
      seo.schema.ts
      analytics.schema.ts
    models/
      product.ts
      market.ts
      offer.ts
      section.ts
      seo.ts
      analytics.ts
      conversion.ts
    sources/
      productSource.ts
      localProductSource.ts
      wasilioProductSource.ts
    validation/
      validateProductConfig.ts
      validateSections.ts
      validateSeo.ts
      validateAnalytics.ts
      validationErrors.ts
    render/
      ProductPageRenderer.tsx
      SectionRenderer.tsx
      PageContext.tsx
      renderFallbacks.ts
    registry/
      sectionRegistry.ts
      componentRegistry.ts
      adapterRegistry.ts
    analytics/
      eventCatalog.ts
      eventContext.ts
      dispatchEvent.ts
      attribution.ts
      pixelAdapters/
        meta.ts
        ga4.ts
        googleAds.ts
        tiktok.ts
        wasilio.ts
    seo/
      buildMetadata.ts
      buildStructuredData.ts
      buildSitemapEntries.ts
      buildRobotsPolicy.ts
    conversion/
      conversionModes.ts
      submitLead.ts
      adapters/
        codLeadAdapter.ts
        whatsappAdapter.ts
        externalCheckoutAdapter.ts
        wasilioOrderAdapter.ts
  components/
    primitives/
      Button.tsx
      Card.tsx
      Container.tsx
      Field.tsx
      Accordion.tsx
      MediaFrame.tsx
    commerce/
      PriceDisplay.tsx
      VariantSelector.tsx
      BundleSelector.tsx
      RatingSummary.tsx
      TrustBadge.tsx
      StockIndicator.tsx
    sections/
      ProductHeroSection.tsx
      TrustBarSection.tsx
      MediaGallerySection.tsx
      BenefitsSection.tsx
      ProblemSolutionSection.tsx
      FeatureCardsSection.tsx
      ComparisonSection.tsx
      ReviewsSection.tsx
      OfferSection.tsx
      FAQSection.tsx
      OrderCaptureSection.tsx
      StickyCTASection.tsx
  content/
    products/
      examples/
    markets/
    experiments/
  design-system/
    tokens/
      color.ts
      typography.ts
      spacing.ts
      radius.ts
      shadow.ts
      motion.ts
  lib/
    formatters/
      currency.ts
      phone.ts
      date.ts
    guards/
    utilities/
  tests/
    fixtures/
    engine/
    analytics/
    seo/
```

## Migration From Current Prototype

Recommended migration path:

1. Freeze the current single-page implementation.
2. Extract useful content from `src/data/product.ts` into a sample product config during Phase 1.
3. Do not reuse `src/app/page.tsx` as the final product route.
4. Rebuild section behavior through the registry after contracts are accepted.
5. Delete or archive prototype-only duplicated components after equivalent engine components exist.
6. Keep useful primitives only if they meet the new design system and accessibility standards.

## Definition Of Done For First Production Engine Release

- At least one product page generated from config.
- At least one second product config proves reuse.
- Product page is mobile-first and accessible.
- Analytics event contract fires in test mode.
- SEO metadata validates for published pages.
- Conversion flow works through one approved adapter.
- No product-specific copy exists in components.
- Wasilio integration boundary is preserved even if the first source is local config.
