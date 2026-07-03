# Design System

## Purpose

The Landing Engine design system defines the visual and interaction rules that product pages must follow when implementation begins. It is not a CSS file or component implementation. It is the contract that keeps generated pages consistent, trustworthy, mobile-first, and conversion-focused across many products.

## Design Philosophy

Landing Engine pages should feel clear, useful, and commercially credible. The design must support fast buying decisions, not distract from them.

Principles:

- Product first: the product and offer must be the strongest visual signals.
- Mobile first: the narrow viewport is the primary layout.
- Trust through restraint: avoid visual noise, gimmicks, and over-decorated sections.
- Benefit-led hierarchy: use typography and spacing to guide attention toward outcomes, proof, offer, and CTA.
- Reusable but not generic: layouts should support many products while still allowing category-specific media and copy.
- Accessible by default: contrast, focus, keyboard behavior, semantics, and readable type are system requirements.

## Brand Relationship To Wasilio

Landing Engine should be able to operate in three brand modes:

| Mode | Use Case | Design Implication |
| --- | --- | --- |
| Wasilio-owned | Product pages published under Wasilio | Wasilio brand cues, support, trust, footer |
| Merchant-powered | Wasilio powers pages for merchant products | Merchant product brand primary, Wasilio trust secondary |
| Campaign-specific | Performance landing pages | Product and offer dominate; brand presence minimal but credible |

The design system should allow tokens to change by brand mode without changing section logic.

## Mobile-First Layout Rules

- Start design at mobile width before desktop.
- Primary CTA must be visible in the hero and available later through a sticky CTA pattern.
- Avoid side-by-side content as the primary mobile pattern.
- Use short line lengths and compact copy blocks.
- Give product media stable aspect ratios to avoid layout shift.
- Use vertical section rhythm that makes scrolling feel intentional.
- Place trust microcopy near decision points.
- Keep form fields large enough for touch.
- Avoid hover-only interactions.

## Typography System

Typography should create clear hierarchy without oversized marketing decoration.

Recommended roles:

| Role | Purpose | Notes |
| --- | --- | --- |
| Display | Hero headline only | Used once per page |
| H1 | Product promise | Must be clear and specific |
| H2 | Section headline | Describes section value |
| H3 | Card or item title | Short and scannable |
| Body | Explanation | Default reading text |
| Caption | Meta and support text | Delivery, timestamp, helper text |
| Button | Action text | Short verb phrase |

Rules:

- Do not scale font size with viewport width.
- Avoid negative letter spacing.
- Avoid all-caps for long text.
- Keep hero headline specific and short enough to fit mobile.
- Use one `h1` per page.
- Section headings must be meaningful without surrounding context.

## Color System

Color must support clarity and trust. Avoid one-note palettes where the entire UI is dominated by one hue family.

Token categories:

- `color.brand.primary`
- `color.brand.secondary`
- `color.intent.success`
- `color.intent.warning`
- `color.intent.danger`
- `color.surface.default`
- `color.surface.muted`
- `color.surface.inverse`
- `color.border.subtle`
- `color.text.primary`
- `color.text.secondary`
- `color.text.muted`
- `color.action.primary`
- `color.action.primaryHover`
- `color.focus.ring`

Rules:

- Primary CTA color must be reserved for buying actions.
- Trust and success colors must be used consistently.
- Urgency colors must not be overused.
- Sale pricing must be clear without relying on color alone.
- All text and controls must meet contrast requirements.

## Spacing And Density

Landing pages need enough breathing room for trust but enough density for mobile conversion.

Recommended spacing tokens:

- `space.1`: smallest inline gap.
- `space.2`: compact control gap.
- `space.3`: card internal gap.
- `space.4`: section content gap.
- `space.5`: related block separation.
- `space.6`: section padding mobile.
- `space.8`: section padding desktop.

Rules:

- Mobile sections should not feel like disconnected hero panels.
- Related trust, offer, and CTA content should be visually grouped.
- Cards should not be nested inside cards.
- Page sections should be full-width bands or unframed layouts.

## Shape And Elevation

Use shape and elevation to clarify grouping, not to decorate every element.

Rules:

- Cards should use restrained radius, generally 8px or less unless brand tokens specify otherwise.
- Avoid heavy shadows on repeated content.
- Avoid floating page sections as cards.
- Use borders for comparison tables, forms, and structured content.
- Reserve stronger elevation for sticky CTA, modal, or important overlay patterns.

## Iconography

Use icons to support scanning, especially for trust and feature summaries.

Rules:

- Icons must have stable semantic meaning across pages.
- Use icons for recognizable concepts such as shipping, support, warranty, payment, rating, and safety.
- Do not rely on icons alone for critical information.
- Unknown icons need accessible labels or adjacent text.
- The implementation may use lucide-react because it already exists in the project, but icon choice must be abstracted by semantic names in config.

## Media Guidelines

Product media is a conversion asset, not decoration.

Required media principles:

- The hero image should show the actual product clearly.
- Gallery images should include product detail, scale, usage context, and variant views.
- Media assets require alt text in configuration.
- Avoid dark, blurred, stock-like, or purely atmospheric imagery when users need to inspect the product.
- Use consistent aspect ratios per section to avoid layout shift.
- Video should have a poster image and must not block initial page load.

## Component State Standards

Every interactive component must define:

- Default state.
- Hover state where applicable.
- Focus-visible state.
- Active state.
- Loading state.
- Disabled state.
- Error state where applicable.
- Empty state where applicable.
- Success or confirmation state where applicable.

Form states must also define:

- Helper text.
- Validation message.
- Required marker strategy.
- Input masking or formatting expectations.
- Submission progress.

## CTA System

CTA hierarchy:

| CTA Type | Use | Examples |
| --- | --- | --- |
| Primary | Purchase or order action | `Order Now`, `Complete Order` |
| Secondary | Lower-intent support action | `Ask on WhatsApp`, `View Details` |
| Text | Low emphasis action | `Read return policy` |
| Sticky | Mobile conversion shortcut | Fixed bottom CTA after hero |

Rules:

- The primary CTA must use consistent action language across page sections unless testing intentionally changes it.
- CTA labels must describe the next step accurately.
- Sticky CTA must not cover form fields or required content.
- Multiple CTAs in one viewport must not compete for unrelated goals.

## Accessibility Standards

The design system must support:

- Keyboard navigation.
- Visible focus states.
- Sufficient contrast.
- Reduced motion support.
- Meaningful alt text.
- Proper heading order.
- Labels for all form fields.
- Error messages connected to relevant fields.
- Touch targets sized for mobile use.

## Design Tokens

Future implementation should store design decisions as tokens, not scattered utility classes.

Recommended token groups:

- Color.
- Typography.
- Spacing.
- Radius.
- Shadow.
- Breakpoint.
- Z-index.
- Motion.
- Container width.
- Media aspect ratios.

## Visual QA Checklist

Before a page template is considered production-ready:

- Hero communicates product and offer within one mobile viewport.
- Text does not overflow buttons, cards, or form fields.
- Sticky elements do not cover conversion controls.
- Repeated cards have stable heights where needed.
- Images load with correct crop and aspect ratio.
- Page does not read as a single-color theme.
- CTA hierarchy is visually obvious.
- Trust signals are visible before the final form.
- Desktop adaptation improves scanning without weakening mobile.
