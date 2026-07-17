import type {
  StorefrontExperimentArm,
  StorefrontExperimentConfig,
  StorefrontExperimentVariants,
  StorefrontFAQItem,
  StorefrontProductPage,
  StorefrontReview,
  StorefrontSectionConfig,
  StorefrontVariant,
} from '../../types/storefront';
import type {
  ProductProvider,
  ProductProviderFetchOptions,
} from './ProductProvider';
import { localFixtureProductProvider } from './localFixtureProvider';

const WASILIO_PRODUCT_REVALIDATE_SECONDS = 300;
const MOROCCAN_MOBILE_PHONE_PATTERN = '^(06|07)\\d{8}$';
const DEFAULT_PRODUCT_IMAGE = '/images/product-placeholder.svg';
const DEFAULT_DELIVERY_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Meknes',
  'Tangier',
  'Agadir',
  'Oujda',
  'Kenitra',
  'Tetouan',
  'El Jadida',
  'Safi',
];

const HERO_VARIANTS: StorefrontExperimentVariants['heroVariant'][] = [
  'standard',
  'compact',
];
const REVIEW_VARIANTS: StorefrontExperimentVariants['reviewVariant'][] = [
  'cards',
  'compact',
];
const CTA_VARIANTS: StorefrontExperimentVariants['ctaVariant'][] = [
  'primary',
  'high-contrast',
];
const TRUST_VARIANTS: StorefrontExperimentVariants['trustVariant'][] = [
  'panel',
  'inline',
];
const GALLERY_VARIANTS: StorefrontExperimentVariants['galleryVariant'][] = [
  'side-thumbnails',
  'bottom-thumbnails',
];
const PRICE_VARIANTS: StorefrontExperimentVariants['priceVariant'][] = [
  'inline',
  'badge',
];

export const wasilioProductProvider: ProductProvider = {
  async getProductPageBySlug(slug, options) {
    const endpoint = buildWasilioProductEndpoint(slug);

    if (!endpoint) {
      return getLocalFallbackProductPage(slug, 'Wasilio provider is missing API base URL or store slug.');
    }

    try {
      const response = await fetch(endpoint, wasilioProductFetchOptions(options));

      if (response.status === 404) {
        return undefined;
      }

      if (!response.ok) {
        return getLocalFallbackProductPage(
          slug,
          `Wasilio product request failed with status ${response.status}.`
        );
      }

      const productPage = mapWasilioProductResponseToStorefrontPage(
        await response.json()
      );

      return (
        productPage ??
        (await getLocalFallbackProductPage(
          slug,
          'Wasilio product response did not match the public V1 contract.'
        ))
      );
    } catch {
      return getLocalFallbackProductPage(
        slug,
        'Wasilio product request failed before receiving a response.'
      );
    }
  },

  async getDefaultProductPage() {
    const localDefaultProductPage =
      await localFixtureProductProvider.getDefaultProductPage();
    const wasilioProductPage = await this.getProductPageBySlug(
      localDefaultProductPage.product.slug
    );

    return wasilioProductPage ?? localDefaultProductPage;
  },

  async getAllProductPages() {
    const localProductPages = await localFixtureProductProvider.getAllProductPages();
    const wasilioProductPages = await Promise.all(
      localProductPages.map((productPage) =>
        this.getProductPageBySlug(productPage.product.slug)
      )
    );
    const resolvedProductPages = wasilioProductPages.filter(
      (productPage): productPage is StorefrontProductPage => Boolean(productPage)
    );

    return resolvedProductPages.length > 0
      ? resolvedProductPages
      : localProductPages;
  },
};

function wasilioProductFetchOptions(options?: ProductProviderFetchOptions) {
  const headers = {
    Accept: 'application/json',
  };

  if (options?.fresh) {
    return {
      headers,
      cache: 'no-store' as const,
    };
  }

  return {
    headers,
    next: {
      revalidate: WASILIO_PRODUCT_REVALIDATE_SECONDS,
    },
  };
}

function buildWasilioProductEndpoint(productSlug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL?.trim();
  const storeSlug = process.env.NEXT_PUBLIC_WASILIO_STORE_SLUG?.trim();

  if (!baseUrl || !storeSlug) {
    return undefined;
  }

  try {
    return new URL(
      `api/public/storefront/${encodeURIComponent(storeSlug)}/products/${encodeURIComponent(productSlug)}`,
      ensureTrailingSlash(baseUrl)
    ).toString();
  } catch {
    return undefined;
  }
}

function mapWasilioProductResponseToStorefrontPage(
  input: unknown
): StorefrontProductPage | undefined {
  const root = readRecord(input);
  const product = readRecord(root?.product);
  const offer = readRecord(root?.offer);

  if (!root || !product || !offer) {
    return undefined;
  }

  const storePublicName = readString(root.storePublicName);
  const defaultCountryCode = readCountryCode(root.defaultCountryCode);
  const defaultCurrency = readCurrencyCode(root.defaultCurrency);
  const productId = readString(product.productId);
  const productSlug =
    readString(product.productSlug) ?? readString(product.slug);
  const productName =
    readString(product.productName) ?? readString(product.name);
  const seo = readRecord(root.seo);
  const landingProfile = readRecord(root.landingProfile);
  const profileGalleryImages = readImageUrls(landingProfile?.galleryImageUrls);
  const profileSeoTitle = readString(landingProfile?.seoTitle);
  const profileSeoDescription = readString(landingProfile?.seoDescription);
  const profileSeoImage = readString(landingProfile?.seoImageUrl);
  const description =
    readString(product.description) ??
    readString(landingProfile?.subheadline) ??
    profileSeoDescription ??
    readString(seo?.description) ??
    `Order ${productName} from ${storePublicName}.`;
  const imageUrl =
    readString(product.imageUrl) ??
    profileGalleryImages[0] ??
    readString(seo?.imageUrl) ??
    DEFAULT_PRODUCT_IMAGE;
  const price = readNumber(offer.price);
  const currency = readCurrencyCode(offer.currency) ?? defaultCurrency;

  if (
    !storePublicName ||
    !productId ||
    !productSlug ||
    !productName ||
    price === undefined ||
    !currency
  ) {
    return undefined;
  }

  const supportChannel = readRecord(root.supportChannel);
  const galleryImages = uniqueStrings([
    ...profileGalleryImages,
    ...readImageUrls(root.gallery),
  ]).filter(
    (galleryImage) => galleryImage !== imageUrl
  );
  const market = buildMarketConfig(root.market, {
    countryCode: defaultCountryCode,
    currency,
  });
  const profileFaqItems = readFAQItems(landingProfile?.faq);
  const fallbackFaqItems = readFAQItems(root.faq);
  const faqItems =
    profileFaqItems.length > 0 ? profileFaqItems : fallbackFaqItems;
  const reviews = readTestimonials(root.testimonials);
  const profileTrustItems = readTrustItems(landingProfile?.trustBadges);
  const fallbackTrustItems = readTrustItems(root.trustBadges);
  const trustItems =
    profileTrustItems.length > 0
      ? profileTrustItems
      : fallbackTrustItems.length > 0
        ? fallbackTrustItems
        : buildFallbackTrustItems(supportChannel);
  const orderable =
    readBoolean(offer.orderable) ?? readBoolean(product.orderable) ?? false;
  const publicAvailability =
    readString(offer.availability) ?? readString(product.availability);
  const seoTitle = profileSeoTitle ?? readString(seo?.title) ?? productName;
  const seoDescription =
    profileSeoDescription ?? readString(seo?.description) ?? description;
  const seoImage =
    profileSeoImage ??
    readString(seo?.image) ??
    readString(seo?.imageUrl) ??
    imageUrl;
  const canonicalUrl =
    readString(seo?.canonicalUrl) ?? buildFallbackCanonicalUrl(productSlug);
  const variants = readVariants(root.variants, price, orderable);

  return {
    product: {
      id: productId,
      slug: productSlug,
      name: productName,
      brand: storePublicName,
    },
    offer: {
      price: {
        amount: price,
        currency,
      },
      variants,
      availability:
        publicAvailability?.toUpperCase() === 'AVAILABLE' && orderable
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      condition: 'https://schema.org/NewCondition',
    },
    media: {
      mainImage: imageUrl,
      images: galleryImages,
    },
    sections: buildSections({
      productName,
      description,
      reviews,
      faqItems,
      trustItems,
      landingProfile,
      marketingSections: root.marketingSections,
    }),
    seo: {
      canonicalUrl,
      seoTitle,
      seoDescription,
      ogTitle: readString(seo?.ogTitle) ?? seoTitle,
      ogDescription: readString(seo?.ogDescription) ?? seoDescription,
      ogImage: readString(seo?.ogImage) ?? seoImage,
      twitterTitle: readString(seo?.twitterTitle) ?? seoTitle,
      twitterDescription:
        readString(seo?.twitterDescription) ?? seoDescription,
      twitterImage: readString(seo?.twitterImage) ?? seoImage,
      keywords: readStringArray(seo?.keywords),
      robots: {
        index: true,
        follow: true,
      },
    },
    experiments: readExperimentConfig(root.experiments),
    market,
    orderForm: {
      sectionId: 'order-form',
      title: `Complete Your ${productName} Order`,
      fields: {
        fullName: {
          label: 'Full Name',
          requiredMessage: 'Full name is required.',
        },
        phone: {
          label: 'Phone Number',
          requiredMessage: 'Phone number is required.',
          invalidMessage:
            'Please enter a valid Moroccan phone number (e.g., 0612345678).',
          pattern: market.phonePattern,
        },
        city: {
          label: 'City',
          placeholder: 'Select your city',
          requiredMessage: 'City is required.',
          options: market.deliveryCities,
        },
        address: {
          label: 'Full Address',
          requiredMessage: 'Address is required.',
        },
        variant: {
          label: 'Variant',
          placeholder: 'Choose an option',
          requiredMessage: 'Please choose a product variant.',
        },
        quantity: {
          label: 'Quantity',
          requiredMessage: 'Quantity is required.',
          minMessage: 'Quantity must be at least 1.',
          min: 1,
        },
      },
      submitCta: 'Confirm Order',
      submittingCta: 'Confirming...',
      confirmation: {
        title: 'Thank You!',
        message:
          'Your order has been received. Our team will contact you shortly to confirm the details.',
      },
    },
    analytics: readAnalyticsConfig(root.analytics),
  };
}

type SectionBuilderInput = {
  productName: string;
  description: string;
  reviews: StorefrontReview[];
  faqItems: StorefrontFAQItem[];
  trustItems: StorefrontSectionConfig['trust']['items'];
  landingProfile: unknown;
  marketingSections: unknown;
};

function buildSections({
  productName,
  description,
  reviews,
  faqItems,
  trustItems,
  landingProfile,
  marketingSections,
}: SectionBuilderInput): StorefrontSectionConfig {
  const profile = readRecord(landingProfile);
  const sections = readRecord(marketingSections);
  const hero = readRecord(sections?.hero);
  const benefits = readRecord(sections?.benefits);
  const features = readRecord(sections?.features);
  const problemSolution = readRecord(sections?.problemSolution);
  const comparison = readRecord(sections?.comparison);
  const comparisonColumns = readRecord(comparison?.columns);
  const socialProof = readRecord(sections?.socialProof);
  const trust = readRecord(sections?.trust);
  const faq = readRecord(sections?.faq);
  const profileBenefits = readStringArray(profile?.benefits);
  const profileFeatures = readFeatureList(profile?.features);

  return {
    hero: {
      headline:
        readString(profile?.headline) ??
        readString(hero?.headline) ??
        productName,
      subheadline:
        readString(profile?.subheadline) ??
        readString(hero?.subheadline) ??
        description,
      cta: readString(hero?.cta) ?? 'Order Now',
      secondaryCta:
        readString(hero?.secondaryCta) ?? 'Cash on Delivery | Fast Shipping',
    },
    benefits: {
      title: readString(benefits?.title) ?? `Why choose ${productName}`,
      description:
        readString(profile?.subheadline) ??
        readString(benefits?.description) ??
        description,
      list:
        profileBenefits ??
        readStringArray(benefits?.list) ??
        [
          'Order online and pay only when the product arrives.',
          'Get a clear confirmation call before delivery.',
          'Receive support from the store if you need help with your order.',
        ],
    },
    features: {
      title: readString(features?.title) ?? 'Product Details',
      list:
        profileFeatures ??
        readFeatureList(features?.list, {
          fallbackCustomerBenefit: 'Practical daily value',
        }) ??
        [
          {
            icon: 'package',
            title: productName,
            description,
            customerBenefit: 'Ready for everyday use',
          },
        ],
    },
    problemSolution: {
      title: readString(problemSolution?.title) ?? `A simpler way to order ${productName}`,
      problemLabel: readString(problemSolution?.problemLabel) ?? 'The Need',
      problem:
        readString(problemSolution?.problem) ??
        'Customers need clear product information, simple ordering, and reliable delivery confirmation before paying.',
      solutionLabel:
        readString(problemSolution?.solutionLabel) ?? 'The Solution',
      solution:
        readString(problemSolution?.solution) ??
        `${productName} can be ordered through a short cash-on-delivery form with a confirmation follow-up.`,
    },
    comparison: {
      title: readString(comparison?.title) ?? 'What You Get',
      columns: {
        feature: readString(comparisonColumns?.feature) ?? 'Feature',
        ordinary: readString(comparisonColumns?.ordinary) ?? 'Ordinary Option',
        premium: readString(comparisonColumns?.premium) ?? 'This Product',
      },
      points:
        readComparisonPoints(comparison?.points) ??
        [
          {
            feature: 'Ordering',
            ordinary: 'Unclear process',
            premium: 'Short COD form',
          },
          {
            feature: 'Payment',
            ordinary: 'Pay before seeing the product',
            premium: 'Pay on delivery',
          },
        ],
    },
    socialProof: {
      title: readString(socialProof?.title) ?? 'Customer Feedback',
      reviews,
    },
    trust: {
      title: readString(trust?.title) ?? 'Simple Ordering, Reliable Support',
      items: trustItems,
    },
    faq: {
      title: readString(faq?.title) ?? 'Frequently Asked Questions',
      items: faqItems,
    },
  };
}

type MarketFallbacks = {
  countryCode?: string;
  currency: string;
};

function buildMarketConfig(input: unknown, fallbacks: MarketFallbacks) {
  const market = readRecord(input);
  const deliveryCities = readStringArray(market?.deliveryCities);
  const countryCode =
    readCountryCode(market?.countryCode) ?? fallbacks.countryCode ?? 'MA';

  return {
    countryCode,
    locale: readString(market?.locale) ?? 'en-MA',
    currency: readCurrencyCode(market?.currency) ?? fallbacks.currency,
    deliveryCities:
      deliveryCities && deliveryCities.length > 0
        ? deliveryCities
        : DEFAULT_DELIVERY_CITIES,
    phonePattern: readString(market?.phonePattern) ?? MOROCCAN_MOBILE_PHONE_PATTERN,
    paymentMethod: 'cash_on_delivery' as const,
  };
}

function readVariants(
  input: unknown,
  fallbackPrice: number,
  productOrderable: boolean
): StorefrontVariant[] {
  const variants = readArray(input);

  return variants
    .map((variantInput) => {
      const variant = readRecord(variantInput);
      const id =
        readString(variant?.variantId) ??
        readString(variant?.id) ??
        readString(variant?.slug);
      const name =
        readString(variant?.variantName) ??
        readString(variant?.name) ??
        readString(variant?.label);

      if (!id || !name) {
        return undefined;
      }

      const variantOrderable = readBoolean(variant?.orderable) ?? productOrderable;

      return {
        id,
        name,
        price: readNumber(variant?.price) ?? fallbackPrice,
        stock: variantOrderable ? 1 : 0,
      };
    })
    .filter((variant): variant is StorefrontVariant => Boolean(variant));
}

type FeatureListOptions = {
  fallbackCustomerBenefit?: string;
};

function readFeatureList(
  input: unknown,
  options: FeatureListOptions = {}
): StorefrontSectionConfig['features']['list'] | undefined {
  const features = readArray(input)
    .map(
      (featureInput): StorefrontSectionConfig['features']['list'][number] | undefined => {
        const feature = readRecord(featureInput);
        const title = readString(feature?.title);
        const description = readString(feature?.description);
        const customerBenefit =
          readString(feature?.customerBenefit) ??
          options.fallbackCustomerBenefit;

        if (!title || !description) {
          return undefined;
        }

        return {
          icon: readString(feature?.icon) ?? 'package',
          title,
          description,
          ...(customerBenefit ? { customerBenefit } : {}),
        };
      }
    )
    .filter(
      (
        feature
      ): feature is StorefrontSectionConfig['features']['list'][number] =>
        Boolean(feature)
    );

  return features.length > 0 ? features : undefined;
}

function readComparisonPoints(
  input: unknown
): StorefrontSectionConfig['comparison']['points'] | undefined {
  const points = readArray(input)
    .map((pointInput) => {
      const point = readRecord(pointInput);
      const feature = readString(point?.feature);
      const ordinary = readStringOrBoolean(point?.ordinary);
      const premium = readStringOrBoolean(point?.premium);

      if (!feature || ordinary === undefined || premium === undefined) {
        return undefined;
      }

      return {
        feature,
        ordinary,
        premium,
      };
    })
    .filter(
      (
        point
      ): point is StorefrontSectionConfig['comparison']['points'][number] =>
        Boolean(point)
    );

  return points.length > 0 ? points : undefined;
}

function readFAQItems(input: unknown): StorefrontFAQItem[] {
  return readArray(input)
    .map((itemInput) => {
      const item = readRecord(itemInput);
      const question = readString(item?.question);
      const answer = readString(item?.answer);

      return question && answer ? { question, answer } : undefined;
    })
    .filter((item): item is StorefrontFAQItem => Boolean(item));
}

function readTestimonials(input: unknown): StorefrontReview[] {
  return readArray(input)
    .map((itemInput, index) => {
      const item = readRecord(itemInput);
      const name = readString(item?.name);
      const testimonial =
        readString(item?.testimonial) ?? readString(item?.quote);

      if (!name || !testimonial) {
        return undefined;
      }

      return {
        id: readString(item?.id) ?? `wasilio-review-${index + 1}`,
        name,
        city: readString(item?.city) ?? '',
        rating: readNumber(item?.rating) ?? 5,
        testimonial,
        timestamp:
          readString(item?.timestamp) ??
          readString(item?.createdAt) ??
          'Recently',
      };
    })
    .filter((item): item is StorefrontReview => Boolean(item));
}

function readTrustItems(
  input: unknown
): StorefrontSectionConfig['trust']['items'] {
  return readArray(input)
    .map((itemInput) => {
      const item = readRecord(itemInput);
      const text = readString(item?.text) ?? readString(item?.label);
      const description = readString(item?.description);

      return text
        ? {
            icon:
              readString(item?.icon) ?? inferTrustIcon(text, description),
            text,
            ...(description ? { description } : {}),
          }
        : undefined;
    })
    .filter(
      (item): item is StorefrontSectionConfig['trust']['items'][number] =>
        Boolean(item)
    );
}

function buildFallbackTrustItems(
  supportChannel?: Record<string, unknown>
): StorefrontSectionConfig['trust']['items'] {
  const supportValue = readString(supportChannel?.value);

  return [
    { icon: 'cod', text: 'Cash on Delivery' },
    {
      icon: 'support',
      text: supportValue ? 'Store support available' : 'Customer Support',
    },
  ];
}

function inferTrustIcon(label: string, description?: string) {
  const text = `${label} ${description ?? ''}`.toLowerCase();

  if (text.includes('cod') || text.includes('cash') || text.includes('pay')) {
    return 'cod';
  }

  if (text.includes('ship') || text.includes('delivery')) {
    return 'shipping';
  }

  if (text.includes('return') || text.includes('refund')) {
    return 'return';
  }

  if (text.includes('support') || text.includes('whatsapp')) {
    return 'support';
  }

  return 'shield';
}

function readImageUrls(input: unknown): string[] {
  return readArray(input)
    .map((imageInput) => {
      if (typeof imageInput === 'string') {
        return imageInput.trim() || undefined;
      }

      const image = readRecord(imageInput);
      return readString(image?.url) ?? readString(image?.imageUrl);
    })
    .filter((image): image is string => Boolean(image));
}

function uniqueStrings(values: string[]) {
  return values.filter(
    (value, index, allValues) => allValues.indexOf(value) === index
  );
}

function readAnalyticsConfig(input: unknown) {
  const analytics = readRecord(input);

  return {
    metaPixelId: readString(analytics?.metaPixelId),
    googleAnalyticsId: readString(analytics?.googleAnalyticsId),
    googleAdsId: readString(analytics?.googleAdsId),
    tiktokPixelId: readString(analytics?.tiktokPixelId),
  };
}

function readExperimentConfig(
  input: unknown
): StorefrontExperimentConfig | undefined {
  const experiment = readRecord(input);
  const armsInput = readRecord(experiment?.arms);
  const experimentId = readString(experiment?.experimentId);

  if (!experimentId || !armsInput) {
    return undefined;
  }

  const arms = Object.fromEntries(
    Object.entries(armsInput)
      .map(([armName, armInput]) => {
        const arm = readExperimentArm(armInput);
        return arm ? [armName, arm] : undefined;
      })
      .filter((entry): entry is [string, StorefrontExperimentArm] =>
        Boolean(entry)
      )
  );

  if (Object.keys(arms).length === 0) {
    return undefined;
  }

  return {
    experimentId,
    defaultArm: readString(experiment?.defaultArm),
    arms,
  };
}

function readExperimentArm(input: unknown): StorefrontExperimentArm | undefined {
  const armInput = readRecord(input);

  if (!armInput) {
    return undefined;
  }

  const arm: StorefrontExperimentArm = {};
  const heroVariant = readAllowedString(armInput.heroVariant, HERO_VARIANTS);
  const reviewVariant = readAllowedString(
    armInput.reviewVariant,
    REVIEW_VARIANTS
  );
  const ctaVariant = readAllowedString(armInput.ctaVariant, CTA_VARIANTS);
  const trustVariant = readAllowedString(armInput.trustVariant, TRUST_VARIANTS);
  const galleryVariant = readAllowedString(
    armInput.galleryVariant,
    GALLERY_VARIANTS
  );
  const priceVariant = readAllowedString(armInput.priceVariant, PRICE_VARIANTS);
  const weight = readNumber(armInput.weight);

  if (heroVariant) {
    arm.heroVariant = heroVariant;
  }

  if (reviewVariant) {
    arm.reviewVariant = reviewVariant;
  }

  if (ctaVariant) {
    arm.ctaVariant = ctaVariant;
  }

  if (trustVariant) {
    arm.trustVariant = trustVariant;
  }

  if (galleryVariant) {
    arm.galleryVariant = galleryVariant;
  }

  if (priceVariant) {
    arm.priceVariant = priceVariant;
  }

  if (weight !== undefined) {
    arm.weight = weight;
  }

  return arm;
}

async function getLocalFallbackProductPage(slug: string, reason: string) {
  const productPage = await localFixtureProductProvider.getProductPageBySlug(slug);

  if (productPage && process.env.NODE_ENV !== 'production') {
    console.warn(`[wasilioProductProvider] ${reason} Using local fixture fallback for "${slug}".`);
  }

  return productPage;
}

function buildFallbackCanonicalUrl(productSlug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL?.trim() ??
    'https://yourdomain.com';

  try {
    return new URL(`/products/${productSlug}`, baseUrl).toString();
  } catch {
    return `https://yourdomain.com/products/${productSlug}`;
  }
}

function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`;
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function readCountryCode(value: unknown) {
  return readString(value)?.toUpperCase();
}

function readCurrencyCode(value: unknown) {
  return readString(value)?.toUpperCase();
}

function readStringArray(value: unknown) {
  const values = readArray(value)
    .map((item) => readString(item))
    .filter((item): item is string => Boolean(item));

  return values.length > 0 ? values : undefined;
}

function readNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function readStringOrBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  return readString(value);
}

function readAllowedString<T extends string>(
  value: unknown,
  allowedValues: readonly T[]
): T | undefined {
  const text = readString(value);
  return text && allowedValues.includes(text as T) ? (text as T) : undefined;
}
