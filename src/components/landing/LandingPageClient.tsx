'use client';

import { useEffect, useMemo, useState } from 'react';
import { LandingAnalytics } from '../analytics/LandingAnalytics';
import {
  BenefitsSection,
  ComparisonSection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  OrderFormSection,
  ProblemSolutionSection,
  ProductGallerySection,
  SocialProofSection,
  StickyCTASection,
  TrustSection,
} from '../sections';
import { createProductAnalyticsContext } from '../../lib/analytics/events';
import { assignExperiment } from '../../lib/experiments/assignExperiment';
import { resolveProductExperiments } from '../../lib/experiments/productExperiments';
import { getProductPresentation } from '../../lib/storefront/productPresentation';
import type {
  ResolvedStorefrontExperimentConfig,
  StorefrontProductPage,
} from '../../types/storefront';

type LandingPageClientProps = {
  productPage: StorefrontProductPage;
  fallbackExperiment: ResolvedStorefrontExperimentConfig;
};

export function LandingPageClient({
  productPage,
  fallbackExperiment,
}: LandingPageClientProps) {
  const [assignment, setAssignment] = useState({
    experiments: fallbackExperiment,
    ready: false,
  });
  const { experiments, ready: assignmentReady } = assignment;
  const variants = experiments.resolvedVariants;
  const presentation = getProductPresentation(productPage);
  const analyticsContext = useMemo(
    () => createProductAnalyticsContext(productPage, experiments),
    [productPage, experiments]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const assignedArm =
        assignExperiment(productPage.experiments) ??
        fallbackExperiment.experimentArm;

      setAssignment({
        experiments: resolveProductExperiments(productPage, assignedArm),
        ready: true,
      });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fallbackExperiment.experimentArm, productPage]);

  return (
    <>
      {assignmentReady && <LandingAnalytics context={analyticsContext} />}
      <HeroSection
        heroData={productPage.sections.hero}
        mainImage={productPage.media.mainImage}
        productName={productPage.product.name}
        brandName={productPage.product.brand}
        price={productPage.offer.price}
        availability={productPage.offer.availability}
        ctaTargetId={productPage.orderForm.sectionId}
        analyticsContext={analyticsContext}
        supportText={presentation.supportText}
        heroVariant={variants.heroVariant}
        ctaVariant={variants.ctaVariant}
        priceVariant={variants.priceVariant}
      />
      <TrustSection
        trustData={productPage.sections.trust}
        storeName={productPage.product.brand}
        availability={productPage.offer.availability}
        trustVariant={variants.trustVariant}
      />
      {presentation.showGallery && (
        <ProductGallerySection
          galleryData={productPage.media}
          productName={productPage.product.name}
          analyticsContext={analyticsContext}
          galleryVariant={variants.galleryVariant}
        />
      )}
      {presentation.showBenefits && (
        <BenefitsSection benefitsData={productPage.sections.benefits} />
      )}
      {presentation.showFeatures && (
        <FeaturesSection featuresData={productPage.sections.features} />
      )}
      {presentation.showProblemSolution && (
        <ProblemSolutionSection
          problemSolutionData={productPage.sections.problemSolution}
        />
      )}
      {presentation.showComparison && (
        <ComparisonSection comparisonData={productPage.sections.comparison} />
      )}
      {presentation.showSocialProof && (
        <SocialProofSection
          socialProofData={productPage.sections.socialProof}
          reviewVariant={variants.reviewVariant}
        />
      )}
      {presentation.showFAQ && <FAQSection faqData={productPage.sections.faq} />}
      <OrderFormSection
        variants={productPage.offer.variants}
        orderFormData={productPage.orderForm}
        storeName={productPage.product.brand}
        supportText={presentation.supportText}
        analyticsContext={analyticsContext}
      />
      <StickyCTASection
        ctaLabel={productPage.sections.hero.cta}
        price={productPage.offer.price}
        targetId={productPage.orderForm.sectionId}
        analyticsContext={analyticsContext}
        ctaVariant={variants.ctaVariant}
      />
    </>
  );
}
