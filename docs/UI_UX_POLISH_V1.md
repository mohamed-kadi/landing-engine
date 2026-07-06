# UI/UX Polish V1

## Purpose

Phase 18 improves the public landing page presentation for both local fixture products and Wasilio-fed products without changing provider contracts, route shape, analytics, SEO metadata inputs, A/B assignment, or order submission.

Phase 19 connects the polished Wasilio rendering path to published Storefront Product Profile content. Wasilio remains the source of truth for premium landing content; Landing Engine only normalizes and renders the public response.

## What Improved

- Hero hierarchy now emphasizes store name, availability, product promise, description, price, CTA, and trust cues.
- Price is visible in the hero and mobile sticky CTA.
- Product imagery has stronger framing, stable aspect ratios, and a clearer missing-image state.
- Single-image Wasilio products no longer render an empty-looking thumbnail rail.
- The trust strip now names the store and separates payment, delivery, support, and availability confidence.
- The order form includes near-submit reassurance for cash on delivery, confirmation before shipping, and store support.
- Empty review and FAQ sections are hidden instead of rendering bare headings.
- Empty FAQ JSON-LD is omitted when no real FAQ items exist.
- Wasilio-published profile headline, subheadline, benefits, features, FAQ, trust badges, gallery images, and SEO overrides now render as real landing-page sections.

## Minimal Wasilio Data Handling

Wasilio V1 can render a credible page with only product identity, store public name, description, price, currency, availability, primary image, and basic SEO fields.

When richer marketing sections are absent, the renderer keeps the product, trust, image, and order flow visible but suppresses known provider-generated fallback sections such as generic benefits, one-item generic features, generic problem/solution copy, generic comparison rows, empty reviews, and empty FAQ.

When Wasilio publishes `landingProfile`, those fields power the rich sections directly:

- `headline` and `subheadline` power the hero.
- `benefits` powers the benefits section.
- `features` powers the feature cards.
- `faq` powers the visible FAQ and FAQ JSON-LD.
- `trustBadges` powers trust badge labels and descriptions.
- `galleryImageUrls` powers gallery images alongside the primary product image.
- `seoTitle`, `seoDescription`, and `seoImageUrl` power SEO and social metadata overrides.

If Wasilio does not provide `product.imageUrl`, the page uses the neutral product placeholder with explicit missing-photo presentation. The placeholder is framed as an honest empty state, not as product media.

## Why Fake Reviews And FAQ Stay Hidden

Reviews and FAQ imply merchant/customer proof. Showing generated reviews, generated ratings, or invented questions would reduce trust and can create SEO and compliance risk.

The page should only show reviews, FAQ, ratings, and detailed comparison claims when Wasilio Storefront Publishing or local fixtures provide real content for those sections.

## Useful Future Wasilio Fields

Future Wasilio public product responses could improve the page further with:

- Product gallery images with alt text and ordering.
- Product availability and orderability labels suitable for customers.
- Store support channel labels and public contact intent URLs.
- Delivery promise by market or city.
- Return, warranty, and payment policy snippets.
- Real FAQ items and customer reviews.
- Variant images, names, availability, and option groups.
- Localized copy for country, currency, phone validation, and delivery cities.
