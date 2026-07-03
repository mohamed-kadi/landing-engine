# Experiment Engine

## Purpose

The Landing Engine now supports configurable conversion experiments per product without duplicating routes, landing page components, SEO logic, analytics providers, or order form validation.

The objective is to let Wasilio test landing page presentation choices such as hero density, CTA contrast, trust badge layout, gallery placement, review density, and price emphasis while keeping the page architecture stable.

## Architecture

Experiments are configured on each product through the `experiments` field in `ProductData`.

Current experiment fields:

- `experimentId`
- `defaultArm`
- `arms`
- `arms.<name>.weight`
- `arms.<name>.heroVariant`
- `arms.<name>.reviewVariant`
- `arms.<name>.ctaVariant`
- `arms.<name>.trustVariant`
- `arms.<name>.galleryVariant`
- `arms.<name>.priceVariant`

The implementation is intentionally layered:

- Product configuration defines named weighted experiment arms.
- `LandingPage` renders the default/control arm as the server-safe fallback.
- `LandingPageClient` assigns a stable arm after mount and passes resolved presentation variants to sections.
- `assignExperiment()` persists the visitor assignment in `localStorage`.
- `resolveProductExperiments()` applies safe defaults for missing arm fields.
- `createProductAnalyticsContext()` receives the same resolved experiment object and attaches it to analytics events.
- SEO metadata and JSON-LD do not read experiment fields.

This keeps experiments a rendering and measurement concern, not a routing or SEO concern.

## Current Variant Surface

Hero variants:

- `standard`: existing hero spacing and hierarchy.
- `compact`: slightly denser hero spacing for faster first-screen product evaluation.

Review variants:

- `cards`: existing full review cards.
- `compact`: denser review cards for products where social proof should scan faster.

CTA variants:

- `primary`: existing emerald primary CTA.
- `high-contrast`: darker high-contrast CTA treatment.

Trust variants:

- `panel`: existing grouped trust panel.
- `inline`: trust badges as independent bordered items.

Gallery variants:

- `side-thumbnails`: existing desktop side-thumbnail layout.
- `bottom-thumbnails`: thumbnail rail below the main image.

Price variants:

- `inline`: existing text price treatment.
- `badge`: price shown as a bordered badge.

## Variant Selection

Variant selection is driven by named experiment arms. Each arm can override only the presentation fields it needs. Missing fields fall back to the control presentation defaults.

Example:

```ts
experiments: {
  experimentId: 'cordless-car-vacuum-layout-v1',
  defaultArm: 'control',
  arms: {
    control: {
      weight: 50,
      heroVariant: 'standard',
      priceVariant: 'inline',
    },
    variant_a: {
      weight: 25,
      heroVariant: 'compact',
      ctaVariant: 'high-contrast',
      priceVariant: 'badge',
    },
    variant_b: {
      weight: 25,
      trustVariant: 'inline',
      galleryVariant: 'bottom-thumbnails',
    },
  },
}
```

Weights are used only for new assignments. If a visitor already has an assignment in `localStorage`, the engine keeps that assignment as long as the arm still exists.

## Analytics

Every analytics event now receives the resolved experiment context through `ProductAnalyticsContext`.

The following fields are included in event payloads:

- `experimentId`
- `experimentArm`
- `resolvedVariants`

This applies to:

- `PageView`
- `ViewContent`
- `Scroll25`
- `Scroll50`
- `Scroll75`
- `GalleryView`
- `CTA_Click`
- `Form_Start`
- `Form_Submit_Attempt`
- `Form_Submit_Error`
- `Lead`
- `Order_Submitted`

Because the analytics provider layer forwards payloads generically, Meta Pixel, GA4, Google Ads, and TikTok can receive experiment context without provider-specific component changes.

## SEO Stability

SEO must remain identical across experiment variants.

Experiment fields are not used by:

- `createProductMetadata()`
- Product JSON-LD
- FAQ JSON-LD
- `robots.ts`
- `sitemap.ts`

This prevents A/B experiments from creating different canonical URLs, OpenGraph values, or structured-data representations for the same product page.

## A/B Testing Strategy

The engine now includes local stable assignment and weighted arms. The next evolution should move assignment to a server, edge, or Wasilio-controlled experimentation service when pre-hydration consistency and centralized reporting become necessary.

Recommended approach:

- Keep one canonical product URL.
- Define experiment arms in product or merchant configuration.
- Assign visitors with a stable anonymous ID.
- Persist assignment locally for early testing, then migrate to cookies or a server-side assignment record.
- Include the assigned variants in every analytics event.
- Avoid changing SEO metadata by experiment arm.
- Prefer server-side or edge assignment for consistency before first paint.

Example future shape:

```ts
experiments: {
  experimentId: 'neck-fan-hero-price-test-001',
  defaultArm: 'control',
  arms: {
    control: {
      weight: 50,
      heroVariant: 'standard',
      priceVariant: 'inline',
    },
    treatment: {
      weight: 50,
      heroVariant: 'compact',
      priceVariant: 'badge',
    },
  },
}
```

The current client-side strategy renders the default/control arm first and applies the assigned arm after mount. This avoids hydration mismatch while preserving stable assignment for returning visitors.

## Statistical Considerations

Each experiment should define one primary success metric before launch.

Recommended primary metrics by experiment type:

- Hero tests: CTA click rate or form start rate.
- CTA tests: CTA click rate and form start rate.
- Trust tests: form start rate and form completion rate.
- Gallery tests: gallery interaction rate, CTA click rate, and lead rate.
- Review tests: scroll depth, form start rate, and lead rate.
- Price display tests: CTA click rate, form start rate, and lead rate.

Operational rules:

- Do not stop tests only because early results look favorable.
- Avoid running many overlapping tests on the same product unless assignment can isolate effects.
- Compare conversion rate and lead quality, not only click rate.
- Track sample size per variant before declaring a winner.
- Segment results by traffic source when paid ads, organic visits, and direct visits behave differently.
- Monitor delivery success and confirmation success for COD products, because lead volume without lead quality can hurt operations.

## Wasilio Merchant Optimization

Wasilio can later use this engine to optimize merchant product pages automatically.

Possible merchant-facing capabilities:

- Recommended experiment templates by product category.
- Automatic CTA contrast testing for cold paid traffic.
- Gallery layout testing for products with strong visual proof.
- Trust placement testing for new stores or high-ticket products.
- Review density testing for products with many customer testimonials.
- Price presentation testing by product price band.

Possible dashboard outputs:

- Variant-level page views.
- Variant-level CTA clicks.
- Variant-level form starts.
- Variant-level submit attempts.
- Variant-level validation errors.
- Variant-level leads.
- Variant-level confirmed orders.
- Variant-level delivery success rate.

The long-term goal is not just to show merchants what changed. The goal is to let the engine learn which presentation patterns improve conversion and lead quality for each product category, traffic source, and market.
