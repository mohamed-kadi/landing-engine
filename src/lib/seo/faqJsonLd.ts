import type { StorefrontSectionConfig } from '../../types/storefront';

export function createFAQJsonLd(faq: StorefrontSectionConfig['faq']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
