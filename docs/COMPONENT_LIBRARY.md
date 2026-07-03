# Component Library Architecture

## Purpose

This document defines the future component library responsibilities for Landing Engine. It does not implement components. It specifies how components should be organized, what each category owns, what data it receives, and what it must not do.

## Component Architecture Principles

- Components render data; they do not own product-specific content.
- Components receive normalized props from the engine renderer, not raw unvalidated product config.
- Static sections should be Server Components by default when implemented.
- Client Components should be limited to interaction, browser APIs, local state, and event dispatch.
- Components must not call vendor pixels directly.
- Components must not hardcode market-specific values such as currency, phone patterns, cities, or delivery promises.
- Components must expose stable analytics locations and IDs through props.
- Component variants should be explicit and registered, not created through ad hoc conditional markup.

## Library Layers

### 1. Primitives

Primitives are low-level UI building blocks. They should be product-agnostic and unaware of ecommerce concepts.

Examples:

- Button.
- Text.
- Heading.
- Container.
- Stack.
- Grid.
- Card.
- Badge.
- Icon.
- ImageFrame.
- Accordion.
- Tabs.
- Dialog.
- Field.
- Select.
- RadioGroup.
- QuantityStepper.

Responsibilities:

- Visual consistency.
- Accessibility foundations.
- Stable states.
- Token-based styling.
- Composition support.

Must not:

- Know about products, prices, analytics, or SEO.
- Contain product copy.
- Dispatch ecommerce events directly.

### 2. Commerce Components

Commerce components understand ecommerce concepts but are not full page sections.

Examples:

- PriceDisplay.
- VariantSelector.
- BundleSelector.
- RatingSummary.
- TrustBadge.
- ShippingPromise.
- PaymentMethodList.
- GuaranteeSummary.
- StockIndicator.
- OrderSummary.
- SupportLink.

Responsibilities:

- Format product and offer data.
- Handle commerce-specific display rules.
- Support market-aware formatting through injected formatters.
- Emit canonical user actions through callbacks.

Must not:

- Fetch product data directly.
- Own page layout.
- Call pixels directly.
- Embed fixed market assumptions.

### 3. Section Components

Section components map page information architecture to UI.

Examples:

- ProductHeroSection.
- TrustBarSection.
- MediaGallerySection.
- BenefitsSection.
- ProblemSolutionSection.
- FeatureCardsSection.
- ComparisonSection.
- ReviewsSection.
- OfferSection.
- FAQSection.
- OrderCaptureSection.
- StickyCTASection.

Responsibilities:

- Render a complete page section.
- Receive validated section props.
- Declare analytics location metadata.
- Use primitives and commerce components.
- Preserve accessibility and responsive behavior.

Must not:

- Decide whether the section exists on the page.
- Read raw product config directly.
- Hardcode product-specific content.
- Own global state.

### 4. Engine Components

Engine components orchestrate page generation.

Examples:

- ProductPageRenderer.
- SectionRenderer.
- PageShell.
- SectionBoundary.
- AnalyticsProvider.
- ExperimentProvider.
- MarketProvider.

Responsibilities:

- Resolve product config.
- Validate section list.
- Map section types to components.
- Provide shared page context.
- Handle unknown or invalid sections safely.
- Keep routing and page orchestration separate from visual sections.

Must not:

- Contain section-specific design details.
- Contain product copy.
- Contain vendor-specific tracking logic.

### 5. Integration Adapters

Adapters connect the engine to external systems.

Examples:

- Analytics adapters.
- Pixel adapters.
- Lead capture adapters.
- Checkout adapters.
- Wasilio catalog adapter.
- SEO metadata adapter.
- Media adapter.

Responsibilities:

- Translate engine contracts into external system calls.
- Isolate vendor differences.
- Keep secrets server-side.
- Provide test and mock modes.

Must not:

- Leak vendor APIs into visual components.
- Mix unrelated integration concerns.

## Recommended Component Inventory

### ProductHeroSection

Purpose:

Show product identity, primary outcome, hero media, primary CTA, and first trust cue.

Inputs:

- Product name.
- Headline.
- Subheadline.
- Hero media.
- Primary CTA.
- Secondary support CTA if configured.
- Price or offer summary if configured.
- Trust microcopy.
- Rating summary if configured.

Interactions:

- Primary CTA click.
- Secondary CTA click.
- Media interaction if hero media is interactive.

Acceptance:

- One clear `h1`.
- Product visible in first viewport.
- CTA visible on mobile.
- Trust cue close to CTA.

### TrustBarSection

Purpose:

Reduce anxiety early with concise trust signals.

Inputs:

- Trust items with semantic icon keys and text.
- Optional policy links.

Interactions:

- Policy click.
- Support click.

Acceptance:

- Scannable on mobile.
- Does not require horizontal scrolling.
- Icons have text labels.

### MediaGallerySection

Purpose:

Help shoppers inspect the product and understand usage.

Inputs:

- Main media list.
- Thumbnail list.
- Alt text.
- Video metadata if available.

Interactions:

- Image select.
- Swipe or next/previous.
- Video start/progress/complete.

Acceptance:

- Stable aspect ratio.
- Keyboard accessible controls.
- Meaningful alt text.
- Does not block hero loading.

### BenefitsSection

Purpose:

Communicate customer outcomes before detailed specifications.

Inputs:

- Section heading.
- Optional description.
- Benefit items.

Acceptance:

- Benefits are short and outcome-oriented.
- Works with 3 to 6 items.
- Icons are supportive, not required for meaning.

### ProblemSolutionSection

Purpose:

Frame the product as the answer to a familiar pain.

Inputs:

- Problem headline.
- Problem copy.
- Solution headline.
- Solution copy.
- Optional supporting media.

Acceptance:

- Problem is specific and believable.
- Solution connects directly to product mechanism.

### FeatureCardsSection

Purpose:

Explain product features through customer benefits.

Inputs:

- Feature title.
- Customer benefit.
- Description.
- Semantic icon key.

Acceptance:

- Does not become a technical spec dump.
- Cards remain readable on mobile.
- Unknown icons degrade gracefully.

### ComparisonSection

Purpose:

Help shoppers compare the product against ordinary alternatives.

Inputs:

- Comparison title.
- Comparison columns.
- Comparison rows.
- Highlighted product column.

Acceptance:

- Table is accessible.
- Mobile view remains readable.
- Claims are truthful and supportable.

### ReviewsSection

Purpose:

Provide customer proof and local credibility.

Inputs:

- Reviews.
- Rating summary.
- Reviewer metadata.
- Optional media reviews.

Acceptance:

- Real reviews only.
- Rating display accessible.
- Does not output structured data unless SEO config permits.

### OfferSection

Purpose:

Clarify price, included items, bundles, urgency, and guarantee.

Inputs:

- Price.
- Compare-at price.
- Currency.
- Bundle options.
- Included items.
- Delivery cost.
- Payment method.
- Guarantee.
- CTA.

Interactions:

- Bundle select.
- Quantity change.
- CTA click.

Acceptance:

- Offer is unambiguous.
- No fake scarcity.
- Visible terms match config and analytics payload.

### FAQSection

Purpose:

Answer buying objections late in the page.

Inputs:

- FAQ items with stable IDs.
- Optional category.

Interactions:

- FAQ open.
- FAQ close if tracked.

Acceptance:

- Accordion accessible.
- Answers are direct.
- Default open behavior is configurable.

### OrderCaptureSection

Purpose:

Capture lead or order intent for COD, WhatsApp, or future checkout flows.

Inputs:

- Conversion mode.
- Form fields.
- Validation schema reference.
- Selected product/variant/offer.
- Submit CTA.
- Trust and next-step copy.

Interactions:

- Form view.
- Form start.
- Field interaction.
- Submit attempt.
- Submit success.
- Submit failure.

Acceptance:

- Works on mobile.
- Field labels are explicit.
- Validation is helpful.
- PII is not sent to client analytics.

### StickyCTASection

Purpose:

Keep the primary conversion action available on mobile.

Inputs:

- CTA label.
- Target section.
- Offer summary.
- Visibility rules.

Interactions:

- Sticky CTA view.
- Sticky CTA click.

Acceptance:

- Does not cover important content.
- Can be hidden while form is focused or visible.
- Uses same conversion context as primary CTA.

## Data Flow

Recommended future flow:

1. Route receives product slug.
2. Product config is loaded through a product source adapter.
3. Config is validated and normalized.
4. SEO metadata is generated from normalized product data.
5. Page renderer receives normalized product page model.
6. Section renderer maps section definitions to registered section components.
7. Section components render with props and emit canonical callbacks.
8. Analytics dispatcher enriches and routes events to adapters.
9. Order or lead adapter handles conversion submission.

## Server And Client Boundaries

Use Server Components for:

- Page route.
- Product config loading.
- Static text sections.
- SEO metadata generation.
- Structured data generation.
- Non-interactive trust, benefit, feature, comparison, and proof layouts where possible.

Use Client Components for:

- Gallery controls.
- FAQ accordion state.
- Variant and bundle selectors.
- Quantity controls.
- Form state and validation feedback.
- Sticky CTA visibility.
- Browser analytics dispatch.

Client boundaries should be as small as possible. A page-level `"use client"` directive should be avoided for the final engine because it pulls too much of the module graph into the client bundle.

## Testing Expectations

Each component category should have a matching test strategy:

- Primitives: accessibility, states, keyboard behavior.
- Commerce components: formatting, edge cases, market rules.
- Sections: required content, responsive layout contracts, analytics callbacks.
- Engine: registry resolution, validation errors, section order, fallback behavior.
- Adapters: event mapping, deduplication, environment gating.

## Component Acceptance Criteria

- Product-agnostic.
- Typed props.
- Accessible states.
- Mobile-first layout behavior.
- No hardcoded product copy.
- No direct vendor pixel calls.
- Stable analytics metadata.
- Clear fallback for missing optional data.
- Works with design tokens rather than one-off styling.
