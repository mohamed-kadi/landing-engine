import { PageShell } from '../layout';
import { LandingPageClient } from './LandingPageClient';
import { resolveProductExperiments } from '../../lib/experiments/productExperiments';
import { createFAQJsonLd } from '../../lib/seo/faqJsonLd';
import { serializeJsonLd } from '../../lib/seo/jsonLd';
import { createProductJsonLd } from '../../lib/seo/productJsonLd';
import { prepareProductPageForDisplay } from '../../lib/storefront/productPresentation';
import type { StorefrontProductPage } from '../../types/storefront';

type LandingPageProps = {
  productPage: StorefrontProductPage;
};

export function LandingPage({ productPage }: LandingPageProps) {
  const displayProductPage = prepareProductPageForDisplay(productPage);
  const fallbackExperiment = resolveProductExperiments(displayProductPage);
  const productJsonLd = createProductJsonLd(displayProductPage);
  const faqJsonLd =
    displayProductPage.sections.faq.items.length > 0
      ? createFAQJsonLd(displayProductPage.sections.faq)
      : undefined;

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
      <LandingPageClient
        key={displayProductPage.product.slug}
        productPage={displayProductPage}
        fallbackExperiment={fallbackExperiment}
      />
    </PageShell>
  );
}
