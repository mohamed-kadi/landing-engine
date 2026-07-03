import type { MetadataRoute } from 'next';
import { getProductProvider } from '../lib/providers/productProviderFactory';
import { getSiteOrigin } from '../lib/seo/url';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const productPage = await getProductProvider().getDefaultProductPage();
  const siteOrigin = getSiteOrigin(productPage.seo.canonicalUrl);

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
