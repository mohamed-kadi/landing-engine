import { describe, expect, it } from 'vitest';
import { localFixtureProductProvider } from '../../providers/localFixtureProvider';
import {
  getProductPresentation,
  prepareProductPageForDisplay,
} from '../productPresentation';
import type { StorefrontProductPage } from '../../../types/storefront';

describe('productPresentation', () => {
  it('keeps rich local fixture sections visible', async () => {
    const productPage =
      await localFixtureProductProvider.getProductPageBySlug(
        'wearable-neck-fan'
      );

    expect(productPage).toBeDefined();

    const presentation = getProductPresentation(productPage!);

    expect(presentation.showBenefits).toBe(true);
    expect(presentation.showFeatures).toBe(true);
    expect(presentation.showProblemSolution).toBe(true);
    expect(presentation.showComparison).toBe(true);
    expect(presentation.showSocialProof).toBe(true);
    expect(presentation.showFAQ).toBe(true);
    expect(presentation.showGallery).toBe(true);
  });

  it('strips generated fallback sections for minimal Wasilio-fed pages', () => {
    const productPage = createMinimalWasilioProductPage();

    const presentation = getProductPresentation(productPage);
    const displayProductPage = prepareProductPageForDisplay(productPage);

    expect(presentation.showBenefits).toBe(false);
    expect(presentation.showFeatures).toBe(false);
    expect(presentation.showProblemSolution).toBe(false);
    expect(presentation.showComparison).toBe(false);
    expect(presentation.showSocialProof).toBe(false);
    expect(presentation.showFAQ).toBe(false);
    expect(presentation.showGallery).toBe(false);
    expect(displayProductPage.sections.benefits.list).toEqual([]);
    expect(displayProductPage.sections.features.list).toEqual([]);
    expect(displayProductPage.sections.comparison.points).toEqual([]);
    expect(displayProductPage.sections.socialProof.reviews).toEqual([]);
    expect(displayProductPage.sections.faq.items).toEqual([]);
  });

  it('shows gallery only when product media has multiple unique images', () => {
    const productPage = createMinimalWasilioProductPage();

    expect(getProductPresentation(productPage).showGallery).toBe(false);

    expect(
      getProductPresentation({
        ...productPage,
        media: {
          mainImage: '/images/product-placeholder.svg',
          images: ['/images/product-placeholder.svg'],
        },
      }).showGallery
    ).toBe(false);

    expect(
      getProductPresentation({
        ...productPage,
        media: {
          mainImage: '/images/product-placeholder.svg',
          images: ['/images/second-product-image.jpg'],
        },
      }).showGallery
    ).toBe(true);
  });
});

function createMinimalWasilioProductPage(): StorefrontProductPage {
  return {
    product: {
      id: 'prod_wearfan',
      slug: 'wear-fan',
      name: 'wearfan',
      brand: 'firstStore',
    },
    offer: {
      price: {
        amount: 50,
        currency: 'MAD',
      },
      variants: [],
      availability: 'https://schema.org/InStock',
      condition: 'https://schema.org/NewCondition',
    },
    media: {
      mainImage: '/images/product-placeholder.svg',
      images: [],
    },
    sections: {
      hero: {
        headline: 'wearfan',
        subheadline: 'Order wearfan from firstStore.',
        cta: 'Order Now',
        secondaryCta: 'Cash on Delivery | Fast Shipping',
      },
      benefits: {
        title: 'Why choose wearfan',
        description: 'Order wearfan from firstStore.',
        list: [
          'Order online and pay only when the product arrives.',
          'Get a clear confirmation call before delivery.',
          'Receive support from the store if you need help with your order.',
        ],
      },
      features: {
        title: 'Product Details',
        list: [
          {
            icon: 'package',
            title: 'wearfan',
            description: 'Order wearfan from firstStore.',
            customerBenefit: 'Ready for everyday use',
          },
        ],
      },
      problemSolution: {
        title: 'A simpler way to order wearfan',
        problemLabel: 'The Need',
        problem:
          'Customers need clear product information, simple ordering, and reliable delivery confirmation before paying.',
        solutionLabel: 'The Solution',
        solution:
          'wearfan can be ordered through a short cash-on-delivery form with a confirmation follow-up.',
      },
      comparison: {
        title: 'What You Get',
        columns: {
          feature: 'Feature',
          ordinary: 'Ordinary Option',
          premium: 'This Product',
        },
        points: [
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
        title: 'Customer Feedback',
        reviews: [],
      },
      trust: {
        title: 'Simple Ordering, Reliable Support',
        items: [
          { icon: 'cod', text: 'Cash on Delivery' },
          { icon: 'shipping', text: 'Fast Shipping in Morocco' },
          { icon: 'support', text: 'Store support available' },
        ],
      },
      faq: {
        title: 'Frequently Asked Questions',
        items: [],
      },
    },
    seo: {
      canonicalUrl: 'https://example.test/products/wear-fan',
      seoTitle: 'wearfan | firstStore',
      seoDescription: 'Order wearfan from firstStore.',
      ogTitle: 'wearfan | firstStore',
      ogDescription: 'Order wearfan from firstStore.',
      ogImage: '/images/product-placeholder.svg',
      twitterTitle: 'wearfan | firstStore',
      twitterDescription: 'Order wearfan from firstStore.',
      twitterImage: '/images/product-placeholder.svg',
      robots: {
        index: true,
        follow: true,
      },
    },
    market: {
      countryCode: 'MA',
      locale: 'en-MA',
      currency: 'MAD',
      deliveryCities: ['Casablanca'],
      phonePattern: '^(06|07)\\d{8}$',
      paymentMethod: 'cash_on_delivery',
    },
    orderForm: {
      sectionId: 'order-form',
      title: 'Complete Your wearfan Order',
      fields: {
        fullName: {
          label: 'Full Name',
          requiredMessage: 'Full name is required.',
        },
        phone: {
          label: 'Phone Number',
          requiredMessage: 'Phone number is required.',
          invalidMessage: 'Please enter a valid Moroccan phone number.',
          pattern: '^(06|07)\\d{8}$',
        },
        city: {
          label: 'City',
          placeholder: 'Select your city',
          requiredMessage: 'City is required.',
          options: ['Casablanca'],
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
        message: 'Your order has been received.',
      },
    },
    analytics: {},
  };
}
