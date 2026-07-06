export type StorefrontMoney = {
  amount: number;
  currency: string;
};

export type StorefrontAvailability =
  | 'https://schema.org/InStock'
  | 'https://schema.org/OutOfStock'
  | 'https://schema.org/PreOrder'
  | 'https://schema.org/LimitedAvailability';

export type StorefrontCondition =
  | 'https://schema.org/NewCondition'
  | 'https://schema.org/UsedCondition'
  | 'https://schema.org/RefurbishedCondition';

export type StorefrontAggregateRating = {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
};

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  aggregateRating?: StorefrontAggregateRating;
};

export type StorefrontVariant = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type StorefrontOffer = {
  price: StorefrontMoney;
  variants: StorefrontVariant[];
  availability: StorefrontAvailability;
  condition: StorefrontCondition;
  priceValidUntil?: string;
};

export type StorefrontMedia = {
  mainImage: string;
  images: string[];
  video?: string;
};

export type StorefrontSEO = {
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

export type StorefrontFeature = {
  icon?: string;
  title: string;
  description: string;
  customerBenefit?: string;
};

export type StorefrontComparisonPoint = {
  feature: string;
  ordinary: string | boolean;
  premium: string | boolean;
};

export type StorefrontReview = {
  id: string;
  name: string;
  city: string;
  rating: number;
  testimonial: string;
  timestamp: string;
};

export type StorefrontFAQItem = {
  question: string;
  answer: string;
};

export type StorefrontSectionConfig = {
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
    secondaryCta: string;
  };
  benefits: {
    title: string;
    description: string;
    list: string[];
  };
  features: {
    title: string;
    list: StorefrontFeature[];
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
    points: StorefrontComparisonPoint[];
  };
  socialProof: {
    title: string;
    reviews: StorefrontReview[];
  };
  trust: {
    title: string;
    items: {
      icon: string;
      text: string;
      description?: string;
    }[];
  };
  faq: {
    title: string;
    items: StorefrontFAQItem[];
  };
};

export type StorefrontHeroExperimentVariant = 'standard' | 'compact';
export type StorefrontReviewExperimentVariant = 'cards' | 'compact';
export type StorefrontCTAExperimentVariant = 'primary' | 'high-contrast';
export type StorefrontTrustExperimentVariant = 'panel' | 'inline';
export type StorefrontGalleryExperimentVariant =
  | 'side-thumbnails'
  | 'bottom-thumbnails';
export type StorefrontPriceExperimentVariant = 'inline' | 'badge';

export type StorefrontExperimentVariants = {
  heroVariant: StorefrontHeroExperimentVariant;
  reviewVariant: StorefrontReviewExperimentVariant;
  ctaVariant: StorefrontCTAExperimentVariant;
  trustVariant: StorefrontTrustExperimentVariant;
  galleryVariant: StorefrontGalleryExperimentVariant;
  priceVariant: StorefrontPriceExperimentVariant;
};

export type StorefrontExperimentArm = Partial<StorefrontExperimentVariants> & {
  weight?: number;
};

export type StorefrontExperimentConfig = {
  experimentId: string;
  defaultArm?: string;
  arms: Record<string, StorefrontExperimentArm>;
};

export type ResolvedStorefrontExperimentConfig = {
  experimentId: string;
  experimentArm: string;
  resolvedVariants: StorefrontExperimentVariants;
};

export type StorefrontMarketConfig = {
  countryCode: string;
  locale: string;
  currency: string;
  deliveryCities: string[];
  phonePattern: string;
  paymentMethod: 'cash_on_delivery';
};

export type StorefrontOrderFormConfig = {
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

export type StorefrontProductPage = {
  product: StorefrontProduct;
  offer: StorefrontOffer;
  media: StorefrontMedia;
  sections: StorefrontSectionConfig;
  seo: StorefrontSEO;
  experiments?: StorefrontExperimentConfig;
  market: StorefrontMarketConfig;
  orderForm: StorefrontOrderFormConfig;
  analytics: {
    metaPixelId?: string;
    googleAnalyticsId?: string;
    googleAdsId?: string;
    tiktokPixelId?: string;
  };
};
