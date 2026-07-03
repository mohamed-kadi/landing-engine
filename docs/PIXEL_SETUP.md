# Pixel Setup

## Purpose

Phase 6 adds optional browser pixel installation for Meta Pixel, Google Analytics 4, Google Ads, and TikTok Pixel. Pixels are installed only when their public environment variables are configured.

No real IDs are committed to the project. Missing IDs are safe and result in no provider script being loaded.

## Environment Variables

Add these values to a local `.env.local` or deployment environment:

```env
NEXT_PUBLIC_ANALYTICS_DEBUG=false
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
```

Use only public browser pixel IDs with the `NEXT_PUBLIC_` prefix. Do not put server-side conversion API tokens or private ad account secrets in these variables.

## Providers

### Meta Pixel

Set:

```env
NEXT_PUBLIC_META_PIXEL_ID=1234567890
```

When present, `PixelScripts` initializes `fbq` and loads Meta Pixel. It does not call `fbq('track', 'PageView')` directly. The canonical `LandingAnalytics` component emits `PageView` through `trackEvent`, and the provider dispatcher forwards it to `fbq`. This avoids duplicate PageView events.

### Google Analytics 4

Set:

```env
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

When present, `PixelScripts` loads `gtag.js`, initializes `gtag`, and configures the GA4 measurement ID with `send_page_view: false`. PageView is sent through the canonical analytics event layer.

### Google Ads

Set:

```env
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXX
```

When present, `PixelScripts` configures the Google Ads destination. The current dispatcher sends `Lead` and `Order_Submitted` as guarded conversion events. A future production setup may need a full `AW-ID/conversion-label` destination per campaign or merchant.

### TikTok Pixel

Set:

```env
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXX
```

When present, `PixelScripts` initializes `ttq` and loads TikTok Pixel. It does not call `ttq.page()` directly. The canonical `PageView` event is emitted by `LandingAnalytics` and forwarded by the provider dispatcher.

## How To Test

### Browser DevTools

1. Add one or more pixel IDs in `.env.local`.
2. Restart the Next.js dev server because `NEXT_PUBLIC_` values are bundled at build time.
3. Open the landing page.
4. In DevTools Network, filter for:
   - `fbevents.js` for Meta.
   - `gtag/js` for GA4 or Google Ads.
   - `analytics.tiktok.com` for TikTok.
5. Enable `NEXT_PUBLIC_ANALYTICS_DEBUG=true` and verify canonical events in the console.

### Meta Pixel Helper

1. Install Meta Pixel Helper in Chrome.
2. Open the landing page with `NEXT_PUBLIC_META_PIXEL_ID` configured.
3. Confirm the pixel initializes.
4. Trigger page, CTA, gallery, and form events.
5. Verify `PageView`, `ViewContent`, `Lead`, and custom events appear without duplicate PageView entries.

### GA4 DebugView

1. Configure `NEXT_PUBLIC_GA4_MEASUREMENT_ID`.
2. Enable debug mode through browser tooling or a GA debug extension.
3. Open GA4 DebugView.
4. Trigger events on the landing page.
5. Confirm canonical events such as `PageView`, `ViewContent`, `CTA_Click`, `Form_Start`, and `Lead`.

### TikTok Pixel Helper

1. Configure `NEXT_PUBLIC_TIKTOK_PIXEL_ID`.
2. Install TikTok Pixel Helper.
3. Open the landing page.
4. Trigger page, CTA, gallery, and form interactions.
5. Confirm TikTok receives the initialized pixel and forwarded events.

## Browser Events vs Server-Side Events

Browser pixels are useful for ad platform optimization and fast setup, but they can be blocked by browsers, consent rules, ad blockers, network issues, or user privacy settings.

Future server-side conversion events can improve reliability by sending confirmed lead or order outcomes from Wasilio backend systems. Server-side events should include stable event IDs so browser and server events can be deduplicated by ad platforms.

Phase 6 implements browser installation only. It does not add server-side conversion APIs.

## Wasilio Integration Path

Wasilio can later support merchant-owned pixels per landing page:

- Each merchant can store Meta, GA4, Google Ads, and TikTok IDs in Wasilio settings.
- Each published landing page can resolve the correct merchant pixel configuration.
- Wasilio can validate IDs before publishing.
- Merchant dashboards can compare browser pixel events with confirmed backend orders.
- Server-side events can be added per merchant once consent, deduplication, and data policies are defined.

The current `PixelScripts` component is intentionally environment-driven. A future Wasilio integration can replace environment lookups with merchant page configuration while keeping the provider-safe installation pattern.
