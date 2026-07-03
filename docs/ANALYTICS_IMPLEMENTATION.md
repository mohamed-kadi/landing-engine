# Analytics Implementation

## Purpose

Phase 4 adds a provider-agnostic analytics event layer for the Landing Engine. The implementation prepares the page for Meta Pixel, Google Analytics 4, Google Ads, TikTok Pixel, and future Wasilio dashboards without adding real pixel IDs or loading external scripts.

The current implementation is intentionally safe:

- No provider script is injected.
- Empty provider environment variables keep tracking as a no-op.
- Missing browser globals such as `window.fbq`, `window.gtag`, and `window.ttq` never throw runtime errors.
- Console logging only happens when `NEXT_PUBLIC_ANALYTICS_DEBUG=true`.

## Files

| File | Responsibility |
| --- | --- |
| `src/lib/analytics/types.ts` | Shared event names, payload shape, and product analytics context |
| `src/lib/analytics/events.ts` | Event constants, scroll milestones, and product context helper |
| `src/lib/analytics/track.ts` | Safe provider dispatcher for Meta, GA4, Google Ads, and TikTok |
| `src/components/analytics/LandingAnalytics.tsx` | Non-visual client tracker for page lifecycle and scroll depth |
| `.env.example` | Public analytics environment variable template |

## Environment Variables

```env
NEXT_PUBLIC_ANALYTICS_DEBUG=false
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
```

These values are public because they are intended for browser-side pixels. Private server-side conversion API secrets must not use `NEXT_PUBLIC_` and should be introduced only when server-side tracking exists.

## Standard Payload

Events support this shared payload shape:

| Field | Meaning |
| --- | --- |
| `productId` | Product SKU or engine product ID |
| `productName` | Display product name |
| `price` | Product or selected variant unit price |
| `currency` | Currency code, currently `MAD` |
| `variant` | Selected variant name or ID |
| `quantity` | Selected order quantity |
| `city` | Selected delivery city |
| `source` | Interaction source, such as `hero_cta` or `order_form` |
| `section` | Page section where the event fired |
| `timestamp` | ISO timestamp generated at dispatch time |

Some events include extra safe diagnostics, such as `image`, `position`, `scrollDepth`, `errorFields`, and `errorCount`.

## Event Catalog

| Event | Fires From | Meaning | Funnel Metric |
| --- | --- | --- | --- |
| `PageView` | `LandingAnalytics` on first client render | The product page rendered in the browser | Landing visits |
| `ViewContent` | `LandingAnalytics` on first client render | Product content was available to the visitor | Product view rate |
| `Scroll25` | `LandingAnalytics` scroll listener | Visitor reached 25% page depth | Early engagement |
| `Scroll50` | `LandingAnalytics` scroll listener | Visitor reached 50% page depth | Mid-page engagement |
| `Scroll75` | `LandingAnalytics` scroll listener | Visitor reached 75% page depth | Deep engagement |
| `GalleryView` | `ProductGallerySection` thumbnail click | Visitor inspected a gallery image | Product inspection rate |
| `CTA_Click` | `HeroSection` and `StickyCTASection` CTA click | Visitor clicked an order CTA | CTA click-through rate |
| `Form_Start` | `OrderFormSection` first form focus | Visitor began interacting with the order form | Form start rate |
| `Form_Submit_Attempt` | `OrderFormSection` submit | Visitor attempted to submit the order form | Submit intent |
| `Form_Submit_Error` | `OrderFormSection` failed validation | Validation blocked submission | Form error rate |
| `Lead` | `OrderFormSection` valid submit | Valid COD lead was captured client-side | Lead conversion rate |
| `Order_Submitted` | `OrderFormSection` valid submit | Valid COD order intent was submitted | Order intent rate |

## Provider Mapping

The dispatcher keeps the page contract provider-agnostic and maps events only when a provider is configured and its browser global exists.

| Provider | Current Behavior |
| --- | --- |
| Meta Pixel | Sends `PageView`, `ViewContent`, and `Lead` as standard events. Other events use `trackCustom`. |
| GA4 | Sends each canonical event through `gtag('event', eventName, payload)`. |
| Google Ads | Sends `Lead` and `Order_Submitted` as conversion events when a conversion destination is configured. |
| TikTok Pixel | Calls `ttq.page()` for `PageView` when available and `ttq.track()` for other events. |

No provider script is loaded in Phase 4. If a host application or future Wasilio shell initializes a provider, the dispatcher can safely send events to it.

## Ecommerce Experimentation Value

These events create the minimum useful ecommerce funnel:

1. `PageView` and `ViewContent` show how much qualified traffic reaches the product experience.
2. Scroll events show whether visitors consume enough of the page to see proof, benefits, and offer details.
3. `GalleryView` shows product inspection intent.
4. `CTA_Click` measures whether page sections are strong enough to move visitors toward ordering.
5. `Form_Start`, `Form_Submit_Attempt`, and `Form_Submit_Error` show where form friction appears.
6. `Lead` and `Order_Submitted` measure the client-side conversion point before backend confirmation exists.

This lets the team compare experiments such as headline changes, gallery changes, benefit ordering, proof density, CTA wording, form field order, and variant presentation.

## Wasilio Dashboard Path

Later, Wasilio can consume the same canonical events through an internal adapter. Merchant dashboards can then show:

- Visits by product and campaign.
- CTA click rate by page section.
- Form start and completion rates.
- Validation error rates by field.
- Lead and order intent volume.
- Conversion by city, variant, and quantity.
- Scroll depth and gallery engagement before conversion.

When backend order capture is introduced, browser events should be joined with server-side order outcomes so Wasilio can report confirmed orders, canceled leads, delivery success, and revenue quality.

## QA Checklist

- `NEXT_PUBLIC_ANALYTICS_DEBUG=true` logs events locally.
- Empty pixel IDs do not cause runtime errors.
- Missing `window.fbq`, `window.gtag`, and `window.ttq` do not cause runtime errors.
- One first-render `PageView` and `ViewContent` fire per page mount.
- Scroll milestones fire once each at 25%, 50%, and 75%.
- Hero and sticky CTA clicks include product context and source.
- Gallery clicks include image and position.
- Form submit errors include failed field names and error count.
- Valid form submission emits both `Lead` and `Order_Submitted`.
