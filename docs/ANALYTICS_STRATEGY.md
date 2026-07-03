# Analytics Strategy

## Purpose

Landing Engine analytics must make ecommerce performance measurable across products, campaigns, sections, and experiments. Analytics should be defined as a vendor-neutral event contract first, then dispatched to pixels and analytics tools through adapters.

Phase 0 does not implement analytics or pixels. This document defines the required architecture.

## Analytics Goals

- Measure the full product page funnel.
- Compare performance across products and campaigns.
- Support paid media optimization through reliable pixel events.
- Preserve attribution from UTMs and ad click identifiers.
- Enable section-level CRO decisions.
- Avoid duplicate, inconsistent, or hardcoded event names.
- Prepare for future Wasilio dashboard integration.

## Core Concepts

### Event Contract

The event contract is the source of truth. Vendor adapters map canonical events to Meta, Google, TikTok, or internal analytics.

### Context Enrichment

Every event should include shared context where available:

- `event_id`
- `timestamp`
- `product_id`
- `product_slug`
- `product_name`
- `category`
- `market`
- `locale`
- `currency`
- `page_type`
- `page_variant`
- `experiment_id`
- `experiment_variant`
- `campaign_id`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `referrer`
- `session_id`
- `anonymous_id`

### Event Deduplication

Conversion events that are sent to multiple systems must include a stable event ID. This is required for deduplication between browser pixels and future server-side conversion APIs.

## Event Naming Standards

- Event names use snake_case.
- Payload keys use snake_case.
- Events describe user actions or lifecycle states, not vendor names.
- Section IDs use kebab-case in payload values.
- Use stable product and variant identifiers.

## Event Catalog

### Page Lifecycle

| Event | Trigger | Required Payload |
| --- | --- | --- |
| `page_view` | Product page loaded | product context, URL, attribution |
| `product_view` | Product config resolved and visible | product ID, slug, category, price |
| `section_view` | Section enters viewport threshold | section ID, section type, position |
| `scroll_depth` | User reaches depth milestone | depth percent, max depth |

### CTA And Offer

| Event | Trigger | Required Payload |
| --- | --- | --- |
| `cta_click` | Any primary or secondary CTA click | cta ID, label, location, destination |
| `offer_view` | Offer block shown | offer ID, price, currency |
| `variant_select` | Variant selected | variant ID, variant attributes |
| `quantity_change` | Quantity changed | quantity, previous quantity |
| `bundle_select` | Bundle selected | bundle ID, price, savings |

### Media

| Event | Trigger | Required Payload |
| --- | --- | --- |
| `gallery_interaction` | Thumbnail, swipe, or image selection | media ID, index, action |
| `video_start` | Video begins | media ID, provider, location |
| `video_progress` | Video milestone | media ID, percent |
| `video_complete` | Video ends | media ID |

### Form And Conversion

| Event | Trigger | Required Payload |
| --- | --- | --- |
| `form_view` | Form enters viewport | form ID, location |
| `form_start` | User interacts with first field | form ID |
| `field_interaction` | User edits field | field name, field type |
| `form_validation_error` | Validation blocks submit | form ID, error codes |
| `lead_submit_attempt` | User clicks submit | form ID, selected variant, quantity |
| `lead_submit_success` | Lead/order intent accepted | lead ID or order intent ID, value, currency |
| `lead_submit_failure` | Submission fails | error type, retryable |
| `confirmation_view` | Confirmation message visible | lead ID or order intent ID |

### Trust And Support

| Event | Trigger | Required Payload |
| --- | --- | --- |
| `faq_open` | FAQ item opened | question ID, position |
| `support_click` | WhatsApp, phone, email, chat click | channel, location |
| `policy_click` | Return, warranty, shipping policy click | policy type, location |

## Pixel Strategy

### Vendor Adapters

The engine should support adapters for:

- Meta Pixel.
- Google Analytics 4.
- Google Ads.
- TikTok Pixel.
- Future Wasilio internal analytics.
- Future server-side conversion APIs.

The visual components must not call vendor pixels directly. Components should emit canonical events to an analytics dispatcher. Vendor adapters translate events to vendor-specific APIs.

### Pixel Loading

Pixel loading must be controlled by:

- Product or market analytics configuration.
- Consent requirements.
- Environment.
- Publication state.

Rules:

- Do not load production pixels in local development unless explicitly enabled.
- Do not load pixels on draft preview pages unless in test mode.
- Support separate test pixel IDs.
- Avoid duplicate initialization when navigating between routes.

### Event Mapping Examples

| Canonical Event | Meta | GA4 | Google Ads | TikTok |
| --- | --- | --- | --- | --- |
| `product_view` | `ViewContent` | `view_item` | remarketing event | `ViewContent` |
| `cta_click` | custom | custom | custom | custom |
| `lead_submit_success` | `Lead` or `Purchase` by mode | `generate_lead` or `purchase` | conversion | `SubmitForm` or `CompletePayment` |
| `variant_select` | custom | `select_item` | custom | custom |

The exact mapping must be configured per conversion mode. A cash-on-delivery lead may be `Lead`; a completed paid checkout may be `Purchase`.

## Attribution

The engine must capture and preserve:

- UTM parameters.
- Click IDs such as `fbclid`, `gclid`, `ttclid` where applicable.
- Referrer.
- Landing page URL.
- First-touch and current-touch campaign values where storage rules allow.

Attribution must be included in lead/order payloads for downstream Wasilio reporting.

## Section-Level CRO

Each section should emit `section_view` when it crosses a configured viewport threshold. This allows analysis of:

- Which sections are seen before conversion.
- Where users drop off.
- Which proof or offer sections correlate with CTA clicks.
- Whether long pages justify their length.

Section view payload:

- Section ID.
- Section type.
- Position.
- Product ID.
- Page variant.
- Experiment variant.

## Experiment Tracking

Experiment context must be attached to every event:

- `experiment_id`
- `experiment_variant`
- `page_variant`
- `section_variant`

Experiment assignment must be stable for a user where required. SEO indexability must be considered before exposing experiment variants through URLs.

## Privacy And Consent

The analytics architecture must support:

- Market-specific consent rules.
- Vendor enablement by market.
- PII minimization.
- Hashing or server-side handling where required by vendor policy.
- Clear separation between public pixel IDs and private API secrets.

Form PII must not be sent to browser analytics events unless explicitly approved, policy-compliant, and necessary.

## Wasilio Integration

Landing Engine should send canonical events to Wasilio analytics in the future. Wasilio can then:

- Store page performance by product and campaign.
- Connect lead/order outcomes to upstream page behavior.
- Support operator dashboards.
- Feed campaign optimization decisions.
- Identify products with poor conversion or high abandonment.

## Analytics QA Checklist

- Every page load emits one `page_view`.
- Product context is present on all events.
- CTA clicks include location and label.
- Form events follow the expected sequence.
- Conversion events have event IDs.
- Pixel adapters do not double-fire events.
- Draft pages do not send production events.
- UTM parameters are captured.
- Section IDs are stable.
- Test mode can verify events without polluting production reporting.
