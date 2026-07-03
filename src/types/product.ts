// src/types/product.ts

export type ProductReview = {
  id: string;
  name: string;
  city: string;
  rating: number;
  testimonial: string;
  timestamp: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type ProductFeature = {
  icon: string; // Placeholder for icon component names or SVG paths
  title: string;
  description: string;
  customerBenefit: string;
};

export type ComparisonPoint = {
  feature: string;
  ordinary: string | boolean;
  premium: string | boolean;
};

export type ProductVariant = {
  id: string;
  name: string; // e.g., 'White', 'Black'
  price: number;
  stock: number;
};

export type ProductPrice = {
  amount: number;
  currency: string;
};

export type ProductAvailability =
  | 'https://schema.org/InStock'
  | 'https://schema.org/OutOfStock'
  | 'https://schema.org/PreOrder'
  | 'https://schema.org/LimitedAvailability';

export type ProductCondition =
  | 'https://schema.org/NewCondition'
  | 'https://schema.org/UsedCondition'
  | 'https://schema.org/RefurbishedCondition';

export type ProductAggregateRating = {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
};

export type ProductSeoConfig = {
  canonicalUrl: string;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  keywords?: string[];
  robots?: {
    index: boolean;
    follow: boolean;
  };
  alternates?: {
    languages: Record<string, string>;
  };
};

export type HeroExperimentVariant = 'standard' | 'compact';
export type ReviewExperimentVariant = 'cards' | 'compact';
export type CTAExperimentVariant = 'primary' | 'high-contrast';
export type TrustExperimentVariant = 'panel' | 'inline';
export type GalleryExperimentVariant = 'side-thumbnails' | 'bottom-thumbnails';
export type PriceExperimentVariant = 'inline' | 'badge';

export type ProductExperimentVariants = {
  heroVariant: HeroExperimentVariant;
  reviewVariant: ReviewExperimentVariant;
  ctaVariant: CTAExperimentVariant;
  trustVariant: TrustExperimentVariant;
  galleryVariant: GalleryExperimentVariant;
  priceVariant: PriceExperimentVariant;
};

export type ProductExperimentArm = Partial<ProductExperimentVariants> & {
  weight?: number;
};

export type ProductExperimentConfig = {
  experimentId: string;
  defaultArm?: string;
  arms: Record<string, ProductExperimentArm>;
};

export type ResolvedProductExperimentConfig = {
  experimentId: string;
  experimentArm: string;
  resolvedVariants: ProductExperimentVariants;
};

export type OrderFormConfig = {
  sectionId: string;
  title: string;
  fields: {
    fullName: {
      label: string;
      requiredMessage: string;
    };
    phone: {
      label: string;
      requiredMessage: string;
      invalidMessage: string;
      pattern: string;
    };
    city: {
      label: string;
      placeholder: string;
      requiredMessage: string;
      options: string[];
    };
    address: {
      label: string;
      requiredMessage: string;
    };
    variant: {
      label: string;
      placeholder: string;
      requiredMessage: string;
    };
    quantity: {
      label: string;
      requiredMessage: string;
      minMessage: string;
      min: number;
    };
  };
  submitCta: string;
  submittingCta: string;
  confirmation: {
    title: string;
    message: string;
  };
};

export type ProductData = {
  id: string;
  name: string;
  slug: string;
  price: ProductPrice;
  brand: string;
  availability: ProductAvailability;
  condition: ProductCondition;
  priceValidUntil?: string;
  aggregateRating?: ProductAggregateRating;
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    secondaryCta: string;
  };
  gallery: {
    mainImage: string;
    images: string[];
    video?: string;
  };
  benefits: {
    title: string;
    description: string;
    list: string[];
  };
  features: {
    title: string;
    list: ProductFeature[];
  };
  problemSolution: {
    title: string;
    problemLabel: string;
    problem: string;
    solutionLabel: string;
    solution: string;
  };
  comparison: {
    title: string;
    columns: {
      feature: string;
      ordinary: string;
      premium: string;
    };
    points: ComparisonPoint[];
  };
  socialProof: {
    title: string;
    reviews: ProductReview[];
  };
  trust: {
    title: string;
    items: {
      icon: string;
      text: string;
    }[];
  };
  faq: {
    title: string;
    items: FAQItem[];
  };
  variants: ProductVariant[];
  orderForm: OrderFormConfig;
  seo: ProductSeoConfig;
  experiments?: ProductExperimentConfig;
  analytics: {
    metaPixelId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    tiktokPixelId?: string;
  };
};
