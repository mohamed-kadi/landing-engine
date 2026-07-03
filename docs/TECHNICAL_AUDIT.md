# Technical Audit

## Scope

This audit is the Phase 0.5 baseline for Landing Engine. It inspects the current repository state after the Phase 0 documentation pass. It does not implement UI, SEO, analytics, forms, routes, or engine code.

## Current App State

The project is a Next.js App Router application in prototype state.

Framework and package baseline:

| Area | Current State |
| --- | --- |
| App framework | Next.js `16.2.9` |
| React | `19.2.4` |
| TypeScript | `^5`, strict mode enabled in `tsconfig.json` |
| Styling | Tailwind CSS `^4` with `@tailwindcss/postcss` |
| UI helpers | `class-variance-authority`, `lucide-react` |
| Scripts | `dev`, `build`, `start`, `lint` |
| Local Node runtime | `v18.16.1` |
| Required Node runtime for current Next version | `>=20.9.0` |

Current folder structure:

```text
docs/
public/
  images/
src/
  app/
  components/
    sections/
    ui/
  data/
  lib/
  types/
```

The current app is still a single-product landing page prototype. The Phase 0 docs correctly define the future direction as a reusable config-driven engine, but the source code has not been migrated to that architecture.

## Existing Styling Approach

- Styling is mostly Tailwind utility classes directly inside JSX.
- `src/app/globals.css` contains only Tailwind directives.
- `tailwind.config.ts` exists with content paths and a small background-image extension.
- There is no design token layer yet.
- Some component classes reference token-like names such as `bg-card`, `text-card-foreground`, `ring`, `input`, `accent`, and `muted-foreground`, but no matching theme tokens or CSS variables are currently defined.
- Styling is prototype-level and should not be treated as the final design system foundation.

## Existing Product Data Structure

The current product data lives in `src/data/product.ts` and follows `ProductData` from `src/types/product.ts`.

Useful current fields:

- Product identity: `id`, `name`, `slug`.
- Hero copy.
- Gallery images.
- Benefits.
- Features.
- Problem/solution.
- Comparison.
- Social proof.
- Trust items.
- FAQ.
- Variants.
- SEO.
- Analytics placeholder IDs.

Current data model issues:

- `ProductData` mixes product content, page composition, SEO, analytics, variants, offer data, and trust copy in one broad type.
- There is no section composition list.
- There is no market model.
- There is no validation boundary.
- There is no distinction between public pixel IDs, product config, publication state, and future Wasilio identifiers.
- `src/data/product.ts` references `ProductData` without importing it, which is likely to fail TypeScript checking once the build reaches compilation.
- Moroccan cities and Moroccan phone validation are hardcoded in prototype code rather than modeled as market configuration.

## Problems Found

### Build Environment Blocker

`npm run build` does not reach app compilation because the local Node runtime is too old for Next.js `16.2.9`.

Exact command:

```text
npm run build
```

Exact error:

```text
You are using Node.js 18.16.1. For Next.js, Node.js version ">=20.9.0" is required.
```

Recommended fix:

Upgrade the local Node runtime to `20.9.0` or newer before using `next build` as a baseline gate.

### Lint Failure

`npm run lint` fails on `src/app/page.tsx`.

Exact command:

```text
npm run lint
```

Exact errors:

```text
/Users/mohamednajibkadi/Desktop/landing-engine/src/app/page.tsx
  404:46  error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
  404:67  error  `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`  react/no-unescaped-entities
```

This is a prototype page lint issue, not an engine architecture issue.

### Duplicate Prototype Code

The following code exists both inline in `src/app/page.tsx` and in extracted component files:

| Responsibility | Inline Location | Extracted Location |
| --- | --- | --- |
| Button | `src/app/page.tsx` | `src/components/ui/Button.tsx` |
| Container | `src/app/page.tsx` | `src/components/ui/Container.tsx` |
| Card primitives | `src/app/page.tsx` | `src/components/ui/Card.tsx` |
| Hero | `src/app/page.tsx` | `src/components/sections/Hero.tsx` |
| Trust | `src/app/page.tsx` | `src/components/sections/Trust.tsx` |
| ProductGallery | `src/app/page.tsx` | `src/components/sections/ProductGallery.tsx` |
| Benefits | `src/app/page.tsx` | `src/components/sections/Benefits.tsx` |

This duplication should not be cleaned up during Phase 0.5 unless a build-breaking syntax error must be fixed. It should be addressed during Phase 1 or Phase 2 migration planning.

### Broken Or Empty Files

- `src/components/sections/Features.tsx` is empty.
- `src/data/product.ts` is missing a `ProductData` type import.
- `src/app/page.tsx` imports `product` at the top and then imports `product` again with `moroccanCities` near the end of the file. This is likely to become a compile-time issue once the Node runtime is corrected.
- `src/app/page.tsx` is marked `'use client'` at page level, which conflicts with the documented future server-first architecture.
- `src/lib/` exists but currently has no files.

### Prototype Logic Mixed Into The Page

`src/app/page.tsx` currently mixes:

- Route component.
- UI primitives.
- Section components.
- Product page section order.
- Gallery state.
- FAQ state.
- Form state.
- Moroccan phone validation.
- Console-only form submission.
- Sticky CTA behavior.
- Product-specific section copy assumptions.

This is acceptable as frozen prototype evidence, but it is not a safe base for the engine.

## Files That Should Be Kept

Keep these as current baseline assets or references:

- `docs/*.md`: Phase 0 and Phase 0.5 planning documents.
- `package.json`: current dependency and script source of truth.
- `package-lock.json`: current npm lockfile.
- `tsconfig.json`: strict TypeScript baseline.
- `eslint.config.mjs`: lint baseline.
- `next.config.ts`: minimal Next config baseline.
- `postcss.config.mjs`: Tailwind PostCSS integration.
- `tailwind.config.ts`: current Tailwind scan configuration, pending design-system review.
- `public/images/*`: current product media reference assets.
- `src/types/product.ts`: useful input for Phase 1 domain modeling, not final contract.
- `src/data/product.ts`: useful sample content for a future product config fixture, not final product source.

## Files That Should Be Refactored Later

Refactor after Phase 1 contracts are accepted:

- `src/app/page.tsx`: replace prototype page with thin route/renderer architecture later.
- `src/components/sections/*.tsx`: migrate from raw `ProductData` props to normalized section props.
- `src/components/ui/*.tsx`: review against design tokens, accessibility, and primitive responsibilities.
- `src/types/product.ts`: split into product, offer, market, section, SEO, analytics, and conversion models.
- `src/data/product.ts`: convert into sample product config fixture with explicit imports and validation.
- `src/app/layout.tsx`: replace generic metadata only after SEO architecture implementation starts.
- `src/app/globals.css`: evolve only when the design-system token layer is ready.
- `tailwind.config.ts`: align with the selected Tailwind 4 and token strategy.

## Files That Should Not Be Touched Yet

Do not touch these during Phase 0.5:

- `src/app/page.tsx`, except for a required build-breaking syntax fix.
- `src/components/sections/*`, because new UI sections are explicitly out of scope.
- `src/components/ui/*`, because design-system implementation has not started.
- `src/app/globals.css`, because CSS implementation is out of scope.
- `src/app/layout.tsx`, because SEO implementation is out of scope.
- `src/data/product.ts`, except during Phase 1 config extraction.
- `public/images/*`, because they are current sample assets.

## Permission And Filesystem Risk Areas

No permission error was encountered during this audit.

Observed filesystem context:

- Workspace is writable at `/Users/mohamednajibkadi/Desktop/landing-engine`.
- `docs/`, `src/`, `public/`, and `node_modules/` are readable.
- The repo has a dirty working tree with pre-existing prototype changes and new docs.
- Future work should avoid destructive cleanup commands and avoid reverting existing uncommitted user or agent changes.

Risk:

- Commands that need network access, dependency downloads, GUI access, or writes outside the workspace may require approval in this environment.
- `npm install` was not run because `node_modules` exists and dependencies are installed.

## Recommended Safe Implementation Strategy

1. Upgrade Node to `20.9.0` or newer and rerun `npm run build`.
2. Fix only baseline-breaking prototype issues needed to make lint/build report cleanly.
3. Do not continue implementing the current `src/app/page.tsx` as the engine.
4. Start Phase 1 by defining schemas and domain contracts in isolated engine/model files.
5. Convert the current neck fan content into a sample fixture after the schema is defined.
6. Add a second sample product fixture before implementing renderer behavior to avoid overfitting.
7. Build validation first, then registry, then renderer.
8. Keep UI sections frozen until normalized section contracts are accepted.
9. Keep analytics, SEO, and forms as documented contracts until their implementation phases.
10. Use the prototype only as reference material for content and interaction requirements, not as the architecture base.
