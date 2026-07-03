# Baseline Checklist

## Install Status

- [x] `node_modules` is present.
- [x] `package-lock.json` is present.
- [x] `npm ls --depth=0` exits successfully.
- [ ] `npm install` run during Phase 0.5.

Notes:

- `npm install` was not run because dependencies are already present.
- `npm ls --depth=0` reports several extraneous packages in `node_modules`. This is not currently blocking, but a clean install should be considered after the Node version is corrected.
- Phase 0.6 added `.nvmrc` with `20.11.1` and `package.json` engines with `node >=20.9.0`.

## Runtime Status

- [x] Node version checked.
- [x] npm version checked.
- [x] Node version requirement documented in `.nvmrc`.
- [x] Node version requirement documented in `package.json` engines.
- [ ] Node version satisfies Next.js `16.2.9`.

Current versions:

```text
node: v18.16.1
npm: 9.5.1
```

Required version:

```text
Node.js >=20.9.0
```

Baseline note:

The project now documents the correct Node requirement, but the active shell is still running Node `v18.16.1`. Use `.nvmrc` or another Node manager to switch to Node `20.11.1` or any Node version `>=20.9.0` before running `next build`.

## TypeScript Status

- [x] `tsconfig.json` exists.
- [x] Strict mode is enabled.
- [ ] TypeScript compilation verified.

Status:

TypeScript was not fully verified because `npm run build` stops before compilation due to the Node version mismatch.

Known likely TypeScript issues to confirm after Node upgrade:

- `src/data/product.ts` references `ProductData` without importing it.
- `src/app/page.tsx` imports `product` twice, once at the top and once near the bottom.

## Lint Status

- [x] `lint` script exists.
- [x] `npm run lint` executed.
- [x] Lint passes.

Result:

```text
Passed
```

Latest lint output:

```text
> landing-engine@0.1.0 lint
> eslint
```

## Build Status

- [x] `build` script exists.
- [ ] `npm run build` executed during Phase 0.6.
- [ ] Build passes.

Result:

```text
Skipped during Phase 0.6
```

Reason:

```text
Active Node is v18.16.1, below the required >=20.9.0.
```

## Known Issues

- Current source is a single-product prototype, not the Landing Engine.
- `src/app/page.tsx` duplicates UI and section code that also exists under `src/components`.
- `src/app/page.tsx` is a page-level Client Component.
- `src/app/page.tsx` has a duplicate `product` import pattern that should be validated after Node upgrade.
- `src/components/sections/Features.tsx` is empty.
- `src/data/product.ts` is missing a `ProductData` import.
- `src/types/product.ts` is too broad for the future engine contract.
- Styling is utility-class prototype styling, not design-system token styling.
- Some Tailwind class names imply tokens that are not currently defined.
- Build status cannot be trusted until Node is upgraded.

## Commands Run

Inspection commands:

```text
rg --files docs
git status --short
ls node_modules
sed -n '1,260p' package.json
sed -n ... docs/*.md
find . -maxdepth 4 -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './.next/*'
find . -maxdepth 4 -type d -not -path './node_modules*' -not -path './.git*' -not -path './.next*'
find src -type f -empty -print
find public -maxdepth 4 -type f -print
npm ls --depth=0
nl -ba src/app/page.tsx
nl -ba src/types/product.ts
nl -ba src/data/product.ts
nl -ba src/components/sections/Hero.tsx
nl -ba src/components/sections/Benefits.tsx
nl -ba src/components/sections/ProductGallery.tsx
nl -ba src/components/sections/Trust.tsx
nl -ba src/components/ui/Button.tsx
nl -ba src/components/ui/Card.tsx
nl -ba src/components/ui/Container.tsx
nl -ba src/app/layout.tsx
nl -ba tsconfig.json
nl -ba next.config.ts
nl -ba eslint.config.mjs
nl -ba tailwind.config.ts
nl -ba postcss.config.mjs
nl -ba src/app/globals.css
node --version
npm --version
ls -ld . docs src src/app src/components public node_modules
rg -n duplicate-code search patterns in src/app and src/components
rg -n product-data search patterns in src/data src/types src/app src/components
```

Verification commands:

```text
npm run lint
```

Skipped command:

```text
npm install
npm run build
```

Reason:

- `npm install`: dependencies are present, and `npm ls --depth=0` exits successfully.
- `npm run build`: active Node is `v18.16.1`, below the required `>=20.9.0`.

## Next Safe Phase

The project is not yet safe for Phase 1 implementation until the local runtime is upgraded and the build is verified.

Safe next actions:

1. Switch Node to `20.11.1` from `.nvmrc`, or any version `>=20.9.0`.
2. Rerun `npm run build`.
3. Fix only build-breaking prototype issues needed to make checks pass.
4. Begin Phase 1 contracts and schemas after build output is trustworthy.

Do not implement new UI sections, SEO, analytics, or form logic before Phase 1 contracts are accepted.
