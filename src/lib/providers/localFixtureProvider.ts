import {
  getAllProducts,
  getDefaultProduct,
  getProductBySlug,
} from '../../data/products';
import type { ProductData } from '../../types/product';
import type {
  StorefrontExperimentConfig,
  StorefrontProductPage,
} from '../../types/storefront';
import type { ProductProvider } from './ProductProvider';

export const localFixtureProductProvider: ProductProvider = {
  async getProductPageBySlug(slug) {
    const product = getProductBySlug(slug);
    return product ? mapProductDataToStorefrontProductPage(product) : undefined;
  },

  async getDefaultProductPage() {
    return mapProductDataToStorefrontProductPage(getDefaultProduct());
  },

  async getAllProductPages() {
    return getAllProducts().map(mapProductDataToStorefrontProductPage);
  },
};

export function mapProductDataToStorefrontProductPage(
  product: ProductData
): StorefrontProductPage {
  return {
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      aggregateRating: product.aggregateRating,
    },
    offer: {
      price: product.price,
      variants: product.variants,
      availability: product.availability,
      condition: product.condition,
      priceValidUntil: product.priceValidUntil,
    },
    media: product.gallery,
    sections: {
      hero: product.hero,
      benefits: product.benefits,
      features: product.features,
      problemSolution: product.problemSolution,
      comparison: product.comparison,
      socialProof: product.socialProof,
      trust: product.trust,
      faq: product.faq,
    },
    seo: product.seo,
    experiments: product.experiments as StorefrontExperimentConfig | undefined,
    market: {
      countryCode: 'MA',
      locale: 'en-MA',
      currency: product.price.currency,
      deliveryCities: product.orderForm.fields.city.options,
      phonePattern: product.orderForm.fields.phone.pattern,
      paymentMethod: 'cash_on_delivery',
    },
    orderForm: product.orderForm,
    analytics: product.analytics,
  };
}
