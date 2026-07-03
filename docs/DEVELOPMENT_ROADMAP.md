# Development Roadmap

## Purpose

This roadmap describes how to move from the current exploratory landing page toward a production-grade Landing Engine. It is intentionally architecture-first. No UI implementation belongs in Phase 0.

## Current State

The repository currently contains:

- Next.js 16.2.9 with App Router.
- React 19.2.4.
- Tailwind CSS 4.
- A single product data file under `src/data/product.ts`.
- A product type under `src/types/product.ts`.
- Exploratory section and UI component files.
- A large `src/app/page.tsx` containing inline components and product-specific behavior.

Current risks:

- The app is built as a single product page, not an engine.
- Page code mixes routing, UI, content, form behavior, analytics placeholders, and product details.
- Some components are duplicated inline and in separate files.
- `Features.tsx` is currently empty.
- Product type boundaries are too broad and combine unrelated concerns.

Decision:

Do not continue editing the current landing page as the engine. Treat it as prototype reference only.

## Roadmap Overview

| Phase | Name | Outcome |
| --- | --- | --- |
| 0 | Architecture and documentation | Shared plan and contracts |
| 1 | Domain modeling | Validated product/page config model |
| 2 | Engine skeleton | Renderer, registry, validation, no polished UI |
| 3 | Design system foundation | Tokens and primitives |
| 4 | Section library MVP | Core product page sections |
| 5 | Conversion flow | Order capture adapters and form architecture |
| 6 | Analytics and pixels | Canonical events and vendor adapters |
| 7 | SEO and publication | Metadata, structured data, sitemap, robots |
| 8 | Wasilio integration | Catalog, admin, orders, reporting boundaries |
| 9 | Optimization and experiments | A/B testing, CRO iteration, dashboards |

## Phase 0: Architecture And Documentation

Deliverables:

- `VISION.md`.
- `PRD.md`.
- `INFORMATION_ARCHITECTURE.md`.
- `DESIGN_SYSTEM.md`.
- `COPYWRITING_GUIDE.md`.
- `SEO_STRATEGY.md`.
- `ANALYTICS_STRATEGY.md`.
- `COMPONENT_LIBRARY.md`.
- `DEVELOPMENT_ROADMAP.md`.
- `IMPLEMENTATION_PHASES.md`.

Exit criteria:

- Documents reviewed.
- Non-goals accepted.
- Current frozen page status accepted.
- Phase 1 scope approved.

## Phase 1: Domain Modeling

Goal:

Define data contracts before UI.

Deliverables:

- Product config schema.
- Section config schema.
- Offer config schema.
- Market config schema.
- Analytics config schema.
- SEO config schema.
- Validation error model.
- Sample product config converted from the existing wearable neck fan data.

Engineering tasks:

- Split the current `ProductData` idea into smaller domain models.
- Define required and optional fields.
- Decide schema validation library.
- Create sample configs for at least two different product categories to prove generality.

Exit criteria:

- Invalid configs fail with readable errors.
- Product config contains no CSS classes.
- Product config supports section order without code changes.
- Product config can represent the current neck fan page without product-specific component logic.

## Phase 2: Engine Skeleton

Goal:

Build the page generation core without focusing on final UI polish.

Deliverables:

- Product page renderer.
- Section renderer.
- Section registry.
- Validation pipeline.
- Preview-safe error handling.
- Route architecture for product pages.

Engineering tasks:

- Create dynamic route structure.
- Load product config by slug.
- Normalize config before rendering.
- Render placeholder sections from registry.
- Add not-found and validation failure behavior.

Exit criteria:

- Adding a new product config creates a route.
- Unknown section type fails validation.
- Section order is config-driven.
- Server/client boundaries are deliberate.

## Phase 3: Design System Foundation

Goal:

Create the visual foundation used by every page.

Deliverables:

- Design token structure.
- Primitive component inventory.
- Accessibility standards.
- Responsive layout rules.
- CTA state model.

Engineering tasks:

- Define token naming.
- Implement primitives.
- Add visual and accessibility tests.
- Establish mobile-first layout constraints.

Exit criteria:

- Primitives are product-agnostic.
- Tokens control visual decisions.
- Buttons, inputs, cards, accordions, and media frames have complete states.
- Components meet accessibility baseline.

## Phase 4: Section Library MVP

Goal:

Implement the first reusable product page sections.

MVP sections:

- Product hero.
- Trust bar.
- Media gallery.
- Benefits.
- Feature cards.
- Comparison.
- Reviews.
- FAQ.
- Offer.
- Sticky CTA.

Engineering tasks:

- Define props per section.
- Connect sections to registry.
- Add analytics callback hooks without vendor adapters.
- Add responsive QA.

Exit criteria:

- Sections render from normalized config.
- No section contains hardcoded product copy.
- Mobile layout is stable.
- Sections expose analytics metadata.

## Phase 5: Conversion Flow

Goal:

Support order intent capture through an adapter boundary.

Deliverables:

- Conversion mode model.
- Form schema model.
- Client-side validation behavior.
- Server-side submission adapter interface.
- Confirmation state.
- Error and retry behavior.

Engineering tasks:

- Define COD lead capture fields by market.
- Keep PII out of browser analytics.
- Add submission tests.
- Add adapter mock for local development.

Exit criteria:

- Conversion mode is selected by config.
- Forms are market-aware.
- Submission path is not hardcoded to a single provider.
- Confirmation copy is configurable.

## Phase 6: Analytics And Pixels

Goal:

Implement canonical analytics events and vendor adapter mapping.

Deliverables:

- Event catalog implementation.
- Analytics dispatcher.
- Context enrichment.
- Meta Pixel adapter.
- GA4 adapter.
- TikTok adapter.
- Test mode.
- Event QA tooling.

Engineering tasks:

- Capture attribution.
- Generate event IDs.
- Prevent duplicate firing.
- Add section view tracking.
- Add conversion event mapping by conversion mode.

Exit criteria:

- Events follow the canonical taxonomy.
- Production pixels are gated by environment and config.
- Conversion events have deduplication IDs.
- Analytics can be tested without polluting production data.

## Phase 7: SEO And Publication

Goal:

Make generated pages SEO-ready.

Deliverables:

- Metadata builder.
- Structured data builder.
- Sitemap generation.
- Robots policy.
- Publication state handling.
- OG image strategy.

Engineering tasks:

- Generate product metadata by slug.
- Validate canonical URL.
- Generate product schema only when fields are complete.
- Exclude drafts from sitemap.

Exit criteria:

- Published pages have complete metadata.
- Draft pages are noindex.
- Product schema matches visible content.
- Sitemap contains only intended routes.

## Phase 8: Wasilio Integration

Goal:

Connect Landing Engine to Wasilio domain systems.

Deliverables:

- Wasilio product catalog adapter.
- Wasilio media adapter.
- Wasilio order or lead adapter.
- Wasilio analytics sink.
- Operator preview workflow.
- Publication workflow.

Engineering tasks:

- Map Wasilio product data into Landing Engine config.
- Define ownership of offer and stock state.
- Add preview mode.
- Add integration tests around data mapping.

Exit criteria:

- Wasilio can supply product data.
- Landing Engine can render Wasilio-backed pages.
- Leads or orders can flow back to Wasilio.
- Analytics can be joined with Wasilio outcomes.

## Phase 9: Optimization And Experimentation

Goal:

Improve conversion through measured iteration.

Deliverables:

- Experiment assignment.
- Section variant testing.
- Headline and offer testing.
- CRO dashboard requirements.
- Performance budgets.

Engineering tasks:

- Add experiment context to every event.
- Support variant selection without SEO duplication.
- Track funnel by variant.
- Add performance monitoring.

Exit criteria:

- Experiments are measurable.
- Variants are stable per user where needed.
- Winning variants can be promoted to default config.

## Coding Standards

When implementation begins:

- Use TypeScript for all engine contracts.
- Keep route files thin.
- Prefer Server Components for non-interactive rendering.
- Use Client Components only where interactivity is required.
- Avoid page-level client boundaries.
- Keep product config free of CSS classes.
- Keep analytics vendor code out of visual components.
- Validate data at boundaries.
- Use semantic names for icons, sections, and events.
- Keep components small and single-purpose.
- Write tests proportional to risk and shared behavior.

## Testing Standards

Required test categories:

- Schema validation tests.
- Renderer and registry tests.
- Component accessibility tests.
- Analytics event mapping tests.
- SEO metadata tests.
- Form validation and submission tests.
- Responsive visual QA for critical pages.
- Integration tests for Wasilio adapters when available.

## Recommended Branching And Delivery

Recommended workflow:

- Phase branches for major architecture milestones.
- Small pull requests by domain area.
- Documentation updated with each architectural change.
- Product config examples reviewed like code.
- Analytics and SEO contracts reviewed before release.

## Roadmap Risks

| Risk | Mitigation |
| --- | --- |
| Engine becomes a hardcoded page again | Enforce config-driven section registry |
| Analytics becomes inconsistent | Canonical event catalog and adapters |
| UI ships before contracts | Phase gates and documentation review |
| Wasilio integration rewrites engine | Define adapter boundaries early |
| Product config becomes too flexible | Schema validation and section contracts |
| Mobile performance degrades | Server-first rendering and performance budgets |

## Roadmap Acceptance

The roadmap is successful if implementation can begin with clear contracts, avoids continuing the frozen single-page approach, and creates a path for Wasilio integration without requiring a full rewrite later.
