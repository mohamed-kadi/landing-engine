import type { MetadataRoute } from 'next';
import { getProductProvider } from '../lib/providers/productProviderFactory';
import { absoluteUrl, getSiteOrigin } from '../lib/seo/url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productPages = await getProductProvider().getAllProductPages();

  return productPages.map((productPage) => {
    const siteOrigin = getSiteOrigin(productPage.seo.canonicalUrl);
    const images = [productPage.media.mainImage, ...productPage.media.images].map((image) =>
      absoluteUrl(image, siteOrigin)
    );

    return {
      url: productPage.seo.canonicalUrl,
      changeFrequency: 'weekly',
      priority: 1,
      images,
    };
  });
}
