import { PageShell } from '../layout';
import { LandingPageClient } from './LandingPageClient';
import { resolveProductExperiments } from '../../lib/experiments/productExperiments';
import { createFAQJsonLd } from '../../lib/seo/faqJsonLd';
import { serializeJsonLd } from '../../lib/seo/jsonLd';
import { createProductJsonLd } from '../../lib/seo/productJsonLd';
import type { StorefrontProductPage } from '../../types/storefront';

type LandingPageProps = {
  productPage: StorefrontProductPage;
};

export function LandingPage({ productPage }: LandingPageProps) {
  const fallbackExperiment = resolveProductExperiments(productPage);
  const productJsonLd = createProductJsonLd(productPage);
  const faqJsonLd = createFAQJsonLd(productPage.sections.faq);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />
      <LandingPageClient
        key={productPage.product.slug}
        productPage={productPage}
        fallbackExperiment={fallbackExperiment}
      />
    </PageShell>
  );
}
