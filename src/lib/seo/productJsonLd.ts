import type { StorefrontProductPage } from '../../types/storefront';
import { absoluteUrl, getSiteOrigin } from './url';

export function createProductJsonLd(productPage: StorefrontProductPage) {
  const siteOrigin = getSiteOrigin(productPage.seo.canonicalUrl);
  const images = [productPage.media.mainImage, ...productPage.media.images].map((image) =>
    absoluteUrl(image, siteOrigin)
  );

  const offers =
    productPage.offer.variants.length > 0
      ? productPage.offer.variants.map((variant) => ({
          '@type': 'Offer',
          sku: variant.id,
          name: variant.name,
          price: variant.price,
          priceCurrency: productPage.offer.price.currency,
          availability:
            variant.stock > 0
              ? productPage.offer.availability
              : 'https://schema.org/OutOfStock',
          itemCondition: productPage.offer.condition,
          url: productPage.seo.canonicalUrl,
          priceValidUntil: productPage.offer.priceValidUntil,
        }))
      : {
          '@type': 'Offer',
          sku: productPage.product.id,
          price: productPage.offer.price.amount,
          priceCurrency: productPage.offer.price.currency,
          availability: productPage.offer.availability,
          itemCondition: productPage.offer.condition,
          url: productPage.seo.canonicalUrl,
          priceValidUntil: productPage.offer.priceValidUntil,
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productPage.seo.canonicalUrl}#product`,
    name: productPage.product.name,
    description: productPage.seo.seoDescription,
    image: images,
    sku: productPage.product.id,
    brand: {
      '@type': 'Brand',
      name: productPage.product.brand,
    },
    url: productPage.seo.canonicalUrl,
    offers,
    aggregateRating: productPage.product.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: productPage.product.aggregateRating.ratingValue,
          reviewCount: productPage.product.aggregateRating.reviewCount,
          bestRating: productPage.product.aggregateRating.bestRating,
          worstRating: productPage.product.aggregateRating.worstRating,
        }
      : undefined,
    review: productPage.sections.socialProof.reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.name,
      },
      reviewBody: review.testimonial,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
