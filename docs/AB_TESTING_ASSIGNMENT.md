# A/B Testing Assignment

## Why Stable Assignment Matters

A/B tests only work when the same visitor keeps seeing the same experiment arm. If a visitor sees `control` on the first load and `variant_a` on the next load, the resulting behavior cannot be trusted because the user experience changed mid-journey.

Stable assignment protects:

- CTA click rate measurement
- Form start measurement
- Form completion measurement
- Lead quality comparison
- Return-visit behavior
- Variant-level funnel attribution

## Why Randomizing on Every Page Load Is Wrong

Randomizing on every page load mixes experiences for the same visitor. A user could see one hero layout, return from a WhatsApp share, then see another CTA or price treatment. That contaminates the test because the conversion may be influenced by multiple variants.

For ecommerce landing pages, this is especially harmful because many visitors do not convert on the first view. They may reload, revisit, share the page, or come back after checking the product with someone else.

## Current Assignment Strategy

The engine uses client-side stable assignment with `localStorage`.

Flow:

1. The server renders the product page with the configured `defaultArm`.
2. After hydration, `LandingPageClient` calls `assignExperiment()`.
3. `assignExperiment()` checks `localStorage` for an existing assignment using the experiment ID.
4. If an assignment exists and the arm still exists, it is reused.
5. If no assignment exists, the utility chooses a new arm using configured weights.
6. The chosen arm is persisted in `localStorage`.
7. The page resolves presentation variants for that arm and sends them with analytics events.

Storage key format:

```text
landing-engine:experiment:<experimentId>
```

## How Weights Work

Each experiment arm may define a `weight`.

Example:

```ts
arms: {
  control: { weight: 50 },
  variant_a: { weight: 25 },
  variant_b: { weight: 25 },
}
```

This means new visitors are assigned approximately:

- 50% to `control`
- 25% to `variant_a`
- 25% to `variant_b`

Weights only affect new assignments. Existing assignments remain stable as long as the assigned arm still exists in the experiment config.

If an arm has no weight, it defaults to `1`. If an arm has weight `0`, it is skipped for new assignments but existing visitors can keep the arm if it still exists.

## Hydration Strategy

The engine renders the default/control arm before client-side assignment. This prevents hydration mismatch because the server HTML and the first client render match.

After mount, the selected arm is applied from `localStorage` or weighted assignment. This can cause a small visual change for users assigned to a non-control arm, but it avoids broken hydration and keeps SEO stable.

Tradeoff:

- Benefit: no server/client markup mismatch.
- Benefit: SEO, JSON-LD, and canonical metadata stay deterministic.
- Cost: non-control users may briefly see the control layout before assignment applies.

For early testing this is acceptable. For mature experimentation, assignment should move closer to the server response.

## Analytics Fields

Every analytics event receives:

- `experimentId`
- `experimentArm`
- `resolvedVariants`

`resolvedVariants` contains:

- `heroVariant`
- `reviewVariant`
- `ctaVariant`
- `trustVariant`
- `galleryVariant`
- `priceVariant`

This lets dashboards compare complete funnel behavior by assigned arm and by the exact presentation variants shown to the visitor.

## Why localStorage Is Acceptable for Early Testing

`localStorage` is simple and works without backend infrastructure. It is enough to validate:

- Whether assignment is stable for a returning browser.
- Whether analytics events carry experiment context.
- Whether configured arms can change presentation without duplicated components.
- Whether product configs can define weighted experiment arms.

Limitations:

- Assignment is browser-specific.
- Assignment does not sync across devices.
- Clearing browser storage resets assignment.
- The server cannot know the assigned arm before rendering.
- A non-control visitor may briefly see the control arm before hydration.

## Future Server-Side Assignment

A production Wasilio experimentation service should eventually move assignment server-side or edge-side.

Server-side assignment would allow:

- Correct variant on first paint.
- Cookie-backed visitor IDs.
- Cross-session persistence independent of browser storage clearing.
- Centralized experiment exposure records.
- Better bot filtering.
- More reliable reporting.
- Merchant-level experiment controls.

The API could return:

```ts
{
  experimentId: 'neck-fan-layout-v1',
  experimentArm: 'variant_a',
  resolvedVariants: {
    heroVariant: 'compact',
    ctaVariant: 'high-contrast',
    priceVariant: 'badge',
  },
}
```

## Wasilio Merchant Evolution

Wasilio merchants could later create experiments from templates instead of editing configuration directly.

Examples:

- Test stronger CTA contrast for cold paid traffic.
- Test compact hero layouts for mobile-first products.
- Test trust badge placement for new brands.
- Test gallery thumbnail placement for visual products.
- Test price badge treatment for products with strong offer clarity.

Wasilio could automatically recommend winners based on:

- CTA click rate
- Form start rate
- Form completion rate
- Lead rate
- Confirmation success
- Delivery success
- Refund or return rate

For COD ecommerce, the winning variant should be the one that improves profitable confirmed orders, not just raw form submissions.
