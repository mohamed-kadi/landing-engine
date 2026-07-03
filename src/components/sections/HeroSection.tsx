'use client';

import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ANALYTICS_EVENTS } from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { ProductAnalyticsContext } from '../../lib/analytics/types';
import type {
  StorefrontCTAExperimentVariant,
  StorefrontHeroExperimentVariant,
  StorefrontOffer,
  StorefrontPriceExperimentVariant,
  StorefrontSectionConfig,
} from '../../types/storefront';

type HeroSectionProps = {
  heroData: StorefrontSectionConfig['hero'];
  mainImage: string;
  productName: string;
  price: StorefrontOffer['price'];
  ctaTargetId: string;
  analyticsContext: ProductAnalyticsContext;
  heroVariant?: StorefrontHeroExperimentVariant;
  ctaVariant?: StorefrontCTAExperimentVariant;
  priceVariant?: StorefrontPriceExperimentVariant;
};

export function HeroSection({
  heroData,
  mainImage,
  productName,
  price,
  ctaTargetId,
  analyticsContext,
  heroVariant = 'standard',
  ctaVariant = 'primary',
  priceVariant = 'inline',
}: HeroSectionProps) {
  const { headline, subheadline, cta, secondaryCta } = heroData;
  const isCompactHero = heroVariant === 'compact';
  const priceLabel = `${price.amount} ${price.currency}`;
  const ctaClassName =
    ctaVariant === 'high-contrast'
      ? 'w-full bg-zinc-950 shadow-lg shadow-zinc-900/15 hover:bg-zinc-800 sm:w-auto'
      : 'w-full shadow-lg shadow-emerald-900/10 sm:w-auto';
  const priceClassName =
    priceVariant === 'badge'
      ? 'rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm'
      : 'text-sm font-medium text-zinc-700';

  const handleCTAClick = () => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      ...analyticsContext,
      source: 'hero_cta',
      section: 'hero',
    });
    document.getElementById(ctaTargetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={isCompactHero ? 'bg-zinc-50 py-8 sm:py-12 lg:py-16' : 'bg-zinc-50 py-10 sm:py-14 lg:py-20'}>
      <Container>
        <div className={isCompactHero ? 'grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:items-center' : 'grid grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-center'}>
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase text-emerald-700">
              {productName}
            </p>
            <h1 className={isCompactHero ? 'mt-4 text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl lg:text-5xl' : 'mt-4 text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl lg:text-6xl'}>
              {headline}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600 lg:mx-0">
              {subheadline}
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className={ctaClassName}
                onClick={handleCTAClick}
              >
                {cta}
              </Button>
              <div className={priceClassName}>
                {priceLabel}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-600 lg:justify-start">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>{secondaryCta}</span>
            </div>
          </div>

          <div>
            <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-900/10 sm:p-4">
              <div className="relative aspect-square overflow-hidden rounded-md bg-zinc-100">
                <Image
                  src={mainImage}
                  alt={`Main product image for ${productName}`}
                  fill
                  className="object-contain p-4"
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-zinc-600">
                <span className="font-medium text-zinc-900">{productName}</span>
                <span>{priceLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
