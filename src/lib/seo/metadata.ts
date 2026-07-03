import type { Metadata } from 'next';
import type { StorefrontProductPage } from '../../types/storefront';
import { absoluteUrl, getSiteOrigin } from './url';

export function createProductMetadata(productPage: StorefrontProductPage): Metadata {
  const { seo } = productPage;
  const siteOrigin = getSiteOrigin(seo.canonicalUrl);
  const robotsIndex = seo.robots?.index ?? true;
  const robotsFollow = seo.robots?.follow ?? true;

  return {
    metadataBase: new URL(siteOrigin),
    title: seo.seoTitle,
    description: seo.seoDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
      languages: seo.alternates?.languages,
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonicalUrl,
      siteName: productPage.product.brand,
      type: 'website',
      images: [
        {
          url: absoluteUrl(seo.ogImage, siteOrigin),
          alt: `${productPage.product.name} product image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: [absoluteUrl(seo.twitterImage, siteOrigin)],
    },
  };
}
