# Landing Engine Vision

## Purpose

Landing Engine is a reusable ecommerce page generation system for Wasilio. It is not a single landing page, theme, or campaign. Its purpose is to turn structured product, offer, proof, and tracking configuration into high-converting product pages that can be launched repeatedly across many products, markets, and acquisition channels.

The current repository contains an exploratory single-product landing page attempt for a wearable neck fan. That work is useful evidence of the first use case, but it must not define the long-term architecture. The engine must be product-agnostic, configuration-driven, measurable, mobile-first, and ready to integrate into the wider Wasilio commerce workflow.

## North Star

Enable a Wasilio operator or growth team to launch a new product page from validated product configuration with minimal engineering work while preserving high frontend quality, reliable analytics, SEO readiness, and conversion-oriented information architecture.

## Business Goals

- Reduce time to launch a new ecommerce product page from days to hours.
- Standardize page quality across campaigns, products, and regions.
- Improve conversion rate by enforcing proven CRO structure and measurement.
- Reduce engineering duplication by separating product data, page composition, component behavior, tracking, and integrations.
- Prepare the system to become a reusable Wasilio module rather than a one-off Next.js app.
- Support rapid experimentation without breaking analytics, SEO, accessibility, or brand standards.

## Ecommerce Goals

- Present the product clearly above the fold, especially on mobile.
- Make the primary offer, price, delivery promise, payment method, and guarantee unambiguous.
- Reduce purchase anxiety with trust signals, social proof, FAQs, return policy, and support access.
- Support direct response flows such as cash on delivery, WhatsApp-assisted ordering, and future cart or checkout handoff.
- Support variants, bundles, quantity offers, stock state, pricing, sale pricing, shipping rules, and urgency messaging through configuration.
- Preserve page speed and visual stability because paid traffic conversion depends on fast first impression.

## Conversion Goals

The engine must optimize for the full funnel, not only the final form submission.

- Increase qualified CTA clicks from hero, sticky CTA, offer blocks, and product proof sections.
- Increase order form starts and completion rate.
- Reduce abandonment caused by unclear pricing, shipping, payment, product fit, or warranty details.
- Improve scroll depth through a persuasive section sequence.
- Support A/B testing of headline, offer, imagery, section order, trust positioning, and CTA labels.
- Provide clean attribution for every conversion event so campaign decisions are based on trustworthy data.

## Target Audience

### Primary Buyer

The buyer is a mobile-first ecommerce shopper who arrives from social ads, short-form video, influencer posts, search, or direct sharing. They may not know the brand. They need to understand the product quickly, believe it works, trust delivery and payment terms, and complete the purchase with minimal friction.

Typical characteristics:

- Shops mostly on mobile.
- Makes decisions quickly after a paid or social click.
- Needs practical benefits more than technical specifications.
- Responds to trust signals such as cash on delivery, local delivery, warranty, WhatsApp support, and real customer proof.
- May compare against marketplace alternatives or low-quality substitutes.

### Internal Wasilio Users

- Growth operator: launches campaigns, changes offers, checks performance.
- Merchandising operator: manages product copy, variants, images, stock, guarantees, and FAQs.
- Performance marketer: needs pixel fidelity, attribution, event naming, UTMs, and funnel diagnostics.
- Frontend engineer: implements and extends the engine safely.
- Support or fulfillment team: needs order intent data to connect with downstream confirmation, delivery, or CRM flows.

## Product Principles

### Configuration Over Hardcoding

Product pages must be generated from structured product configuration. The rendering layer should know how to display a product page, but it should not contain product-specific copy, image paths, city lists, tracking IDs, pricing rules, or section sequence decisions.

### Mobile First

Most ecommerce traffic is expected to arrive on mobile. The mobile layout is the primary product experience. Desktop is an adaptation, not the baseline. This affects copy length, CTA placement, media aspect ratios, form design, scroll rhythm, sticky actions, and performance budgets.

### Trust Before Complexity

A page with fewer, clearer trust-building sections is preferable to a long page with unfocused content. Every section must either clarify the product, increase desire, reduce risk, answer objections, or move the user toward conversion.

### Measurable by Default

Every meaningful user action should have an analytics contract before implementation. The engine must avoid one-off event names and one-off pixel logic that make campaigns impossible to compare.

### Server-First Rendering

The current project uses Next.js 16 App Router. Future implementation should prefer Server Components for static and data-driven sections, with Client Components only for interactivity such as gallery controls, accordions, form behavior, sticky CTA visibility, and event dispatching. This keeps JavaScript smaller and improves first impression.

### Wasilio-Ready Boundaries

The engine must isolate domain boundaries so it can later be embedded inside Wasilio:

- Product catalog input.
- Offer and pricing rules.
- Media asset management.
- Page renderer.
- Analytics and pixel dispatch.
- Lead or order capture adapter.
- SEO metadata generation.
- Admin/editor configuration workflow.

## Phase 0 Non-Goals

This documentation phase must not implement:

- React components.
- `page.tsx` routes.
- CSS or Tailwind classes.
- Analytics scripts.
- SEO metadata files.
- Forms or order submission.
- Checkout integration.
- Visual redesign of the frozen page.

Phase 0 only defines the architecture and decision framework needed before implementation starts.

## Success Metrics

### Business Metrics

- Time to launch a new product page.
- Number of products launched without engineering changes.
- Reduction in duplicated landing page code.
- Campaign conversion rate improvement versus one-off pages.
- Percentage of launches with complete analytics and SEO configuration.

### Ecommerce Metrics

- Product page view to CTA click rate.
- CTA click to order form start rate.
- Form start to order submit rate.
- Overall product page conversion rate.
- Average order value where bundles or quantity offers exist.
- Refund, cancellation, or unconfirmed order rate.

### Quality Metrics

- Largest Contentful Paint within target on mobile.
- Cumulative Layout Shift within target on mobile.
- Accessibility checks pass for core flows.
- All required analytics events fire with valid payloads.
- SEO metadata and structured data validate for every generated product page.

## Strategic Outcome

Landing Engine should become the Wasilio standard for direct response product pages. It should allow Wasilio to scale campaigns with consistency while preserving enough flexibility for product-specific storytelling, localization, experimentation, and future checkout or CRM integration.
