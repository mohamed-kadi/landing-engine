# Product Configuration

## Purpose

Landing Engine renders product pages from the product registry in `src/data/products`. Product content should be changed in product configuration files, not inside React components.

The current implementation includes one local product fixture and a registry that can accept additional products without duplicating page code.

## Source Files

| File | Responsibility |
| --- | --- |
| `src/data/products/neckFan.ts` | Current neck fan product content and market/order configuration |
| `src/data/products/index.ts` | Product registry, lookup helpers, and default product slug |
| `src/data/product.ts` | Compatibility export for the default historical product import |
| `src/types/product.ts` | TypeScript contract for product configuration |
| `src/app/page.tsx` | Home route rendering the default product |
| `src/app/products/[slug]/page.tsx` | Route-aware product landing page |
| `src/components/landing/LandingPage.tsx` | Shared landing page renderer |
| `src/components/sections/*Section.tsx` | Section renderers that receive typed slices of product data |

## How To Add A New Product

Create a new product file in `src/data/products`, export a typed `ProductData` object, then register it in `src/data/products/index.ts`.

Example:

```ts
import { neckFan } from './neckFan';
import { anotherProduct } from './anotherProduct';

export const products = {
  [neckFan.slug]: neckFan,
  [anotherProduct.slug]: anotherProduct,
}
```

Each registered product becomes available at `/products/[slug]` and is included in the sitemap.

## Field Map

### Product Identity

Controls product identity shared across the page.

```ts
id: "WNF-001"
name: "Wearable Neck Fan"
slug: "wearable-neck-fan"
```

Used by:

- Product gallery alt text.
- Product routing, tracking, SEO, sitemap generation, and Wasilio product mapping.

### Price And Currency

Controls the primary product price.

```ts
price: {
  amount: 299,
  currency: "MAD",
}
```

Used by:

- Future offer displays.
- Product variants and order summaries.
- Future Wasilio offer mapping.

The current UI does not display a standalone price block yet, so this field is prepared for reuse without changing the visual page.

### Hero

Controls the first screen.

```ts
hero: {
  headline: "...",
  subheadline: "...",
  cta: "Order Now",
  secondaryCta: "Cash on Delivery | Fast Shipping",
}
```

Used by:

- `HeroSection`
- `StickyCTASection`

### Gallery

Controls product images.

```ts
gallery: {
  mainImage: "/images/neck-fan-main.jpg",
  images: ["/images/neck-fan-1.jpg"],
  video: "https://www.youtube.com/watch?v=example",
}
```

Used by:

- `HeroSection`
- `ProductGallerySection`

### Benefits

Controls the benefit section.

```ts
benefits: {
  title: "...",
  description: "...",
  list: ["..."],
}
```

Used by:

- `BenefitsSection`

### Features

Controls feature cards.

```ts
features: {
  title: "...",
  list: [
    {
      icon: "battery",
      title: "...",
      customerBenefit: "...",
      description: "...",
    },
  ],
}
```

Used by:

- `FeaturesSection`

Supported current icon keys:

- `battery`
- `wind`
- `volume-off`
- `feather`

### Problem And Solution

Controls problem framing.

```ts
problemSolution: {
  title: "...",
  problemLabel: "The Problem",
  problem: "...",
  solutionLabel: "The Solution",
  solution: "...",
}
```

Used by:

- `ProblemSolutionSection`

### Comparison

Controls comparison table headers and rows.

```ts
comparison: {
  title: "...",
  columns: {
    feature: "Feature",
    ordinary: "Ordinary Alternatives",
    premium: "This Product",
  },
  points: [
    { feature: "Portability", ordinary: "Clumsy / None", premium: "Hands-Free & Wearable" },
  ],
}
```

Used by:

- `ComparisonSection`

### Social Proof

Controls reviews.

```ts
socialProof: {
  title: "...",
  reviews: [
    {
      id: "1",
      name: "Fatima Z.",
      city: "Casablanca",
      rating: 5,
      testimonial: "...",
      timestamp: "2 weeks ago",
    },
  ],
}
```

Used by:

- `SocialProofSection`

### Trust Badges

Controls the trust strip.

```ts
trust: {
  title: "...",
  items: [
    { icon: "cod", text: "Cash on Delivery" },
  ],
}
```

Used by:

- `TrustSection`

Supported current icon keys:

- `cod`
- `shipping`
- `return`
- `support`

### FAQ

Controls FAQ content.

```ts
faq: {
  title: "Frequently Asked Questions",
  items: [
    { question: "...", answer: "..." },
  ],
}
```

Used by:

- `FAQSection`

### Variants

Controls available product variants.

```ts
variants: [
  { id: "variant-white", name: "White", price: 299, stock: 50 },
]
```

Used by:

- `OrderFormSection` initial variant state.
- Future variant selector and offer display.

### Order Form

Controls form copy, city options, validation messages, and confirmation text.

```ts
orderForm: {
  sectionId: "order-form",
  title: "Complete Your Order",
  fields: {
    fullName: {
      label: "Full Name",
      requiredMessage: "Full name is required.",
    },
    phone: {
      label: "Phone Number",
      requiredMessage: "Phone number is required.",
      invalidMessage: "Please enter a valid Moroccan phone number (e.g., 0612345678).",
      pattern: "^(06|07)\\d{8}$",
    },
    city: {
      label: "City",
      placeholder: "Select your city",
      requiredMessage: "City is required.",
      options: ["Casablanca", "Rabat"],
    },
    address: {
      label: "Full Address",
      requiredMessage: "Address is required.",
    },
    variant: {
      label: "Variant",
      placeholder: "Choose a color",
      requiredMessage: "Please choose a product variant.",
    },
    quantity: {
      label: "Quantity",
      requiredMessage: "Quantity is required.",
      minMessage: "Quantity must be at least 1.",
      min: 1,
    },
  },
  submitCta: "Confirm Order",
  submittingCta: "Confirming...",
  confirmation: {
    title: "Thank You!",
    message: "...",
  },
}
```

Used by:

- `OrderFormSection`
- `src/lib/forms/orderForm.ts` validation rules and submission normalization
- `HeroSection` CTA scroll target through `sectionId`
- `StickyCTASection` CTA scroll target through `sectionId`

### SEO And Structured Data

Controls search metadata, social previews, robots behavior, and JSON-LD inputs.

```ts
brand: "Wasilio"
availability: "https://schema.org/InStock"
condition: "https://schema.org/NewCondition"
priceValidUntil: "2026-12-31"
aggregateRating: {
  ratingValue: 4.7,
  reviewCount: 3,
  bestRating: 5,
  worstRating: 1,
}
seo: {
  canonicalUrl: "https://yourdomain.com/products/wearable-neck-fan",
  seoTitle: "Premium Wearable Neck Fan - Hands-Free Cooling in Morocco",
  seoDescription: "...",
  ogTitle: "Premium Wearable Neck Fan for Morocco",
  ogDescription: "...",
  ogImage: "/images/neck-fan-main.jpg",
  twitterTitle: "Premium Wearable Neck Fan",
  twitterDescription: "...",
  twitterImage: "/images/neck-fan-main.jpg",
  keywords: ["wearable neck fan", "neck fan Morocco"],
  robots: {
    index: true,
    follow: true,
  },
}
```

Used by:

- `src/lib/seo/metadata.ts`
- `src/lib/seo/productJsonLd.ts`
- `src/lib/seo/faqJsonLd.ts`
- `src/app/robots.ts`
- `src/app/sitemap.ts`

## Wasilio Integration Path

Later, Wasilio merchant products can map into this same contract:

| Landing Engine Field | Future Wasilio Source |
| --- | --- |
| `id` | Wasilio product ID or SKU |
| `name` | Merchant product name |
| `slug` | Published product page slug |
| `price` | Active offer or product price |
| `brand` | Merchant brand or store name |
| `availability` | Inventory and publishable stock status |
| `condition` | Product condition |
| `seo` | Merchant page SEO settings or generated defaults |
| `gallery` | Wasilio media library |
| `variants` | Merchant product variants |
| `orderForm.fields.city.options` | Market or delivery zone configuration |
| `trust.items` | Merchant/Wasilio fulfillment promises |
| `faq.items` | Merchant product support content |

The future integration should load and validate merchant product data before rendering. Components should continue receiving typed section data rather than calling Wasilio APIs directly.
