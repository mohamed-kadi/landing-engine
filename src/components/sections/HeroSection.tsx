'use client';

import Image from 'next/image';
import { BadgeCheck, Headset, PackageCheck, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ANALYTICS_EVENTS } from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { ProductAnalyticsContext } from '../../lib/analytics/types';
import type {
  StorefrontCTAExperimentVariant,
  StorefrontAvailability,
  StorefrontHeroExperimentVariant,
  StorefrontOffer,
  StorefrontPriceExperimentVariant,
  StorefrontSectionConfig,
} from '../../types/storefront';

type HeroSectionProps = {
  heroData: StorefrontSectionConfig['hero'];
  mainImage: string;
  productName: string;
  brandName: string;
  price: StorefrontOffer['price'];
  availability: StorefrontAvailability;
  ctaTargetId: string;
  analyticsContext: ProductAnalyticsContext;
  supportText?: string;
  heroVariant?: StorefrontHeroExperimentVariant;
  ctaVariant?: StorefrontCTAExperimentVariant;
  priceVariant?: StorefrontPriceExperimentVariant;
};

export function HeroSection({
  heroData,
  mainImage,
  productName,
  brandName,
  price,
  availability,
  ctaTargetId,
  analyticsContext,
  supportText,
  heroVariant = 'standard',
  ctaVariant = 'primary',
  priceVariant = 'inline',
}: HeroSectionProps) {
  const { headline, subheadline, cta, secondaryCta } = heroData;
  const isCompactHero = heroVariant === 'compact';
  const priceLabel = `${price.amount} ${price.currency}`;
  const showProductName =
    productName.trim().toLowerCase() !== headline.trim().toLowerCase();
  const isPlaceholderImage = mainImage === '/images/product-placeholder.svg';
  const isInStock = availability === 'https://schema.org/InStock';
  const availabilityLabel = isInStock
    ? 'Available to order'
    : 'Store confirms availability';
  const deliveryLabel =
    secondaryCta
      .split('|')
      .map((item) => item.trim())
      .find((item) => !item.toLowerCase().includes('cash')) ?? secondaryCta;
  const ctaClassName =
    ctaVariant === 'high-contrast'
      ? 'w-full bg-zinc-950 shadow-lg shadow-zinc-900/15 hover:bg-zinc-800 sm:w-auto'
      : 'w-full shadow-lg shadow-emerald-900/10 sm:w-auto';
  const priceClassName =
    priceVariant === 'badge'
      ? 'inline-flex items-baseline gap-2 rounded-md border border-zinc-200 bg-white px-4 py-3 shadow-sm'
      : 'inline-flex items-baseline gap-2';
  const trustCues = [
    {
      icon: ShieldCheck,
      text: 'Cash on delivery',
    },
    {
      icon: BadgeCheck,
      text: 'Confirm call',
    },
    {
      icon: Headset,
      text: supportText ?? 'Store support',
    },
    {
      icon: PackageCheck,
      text: availabilityLabel,
    },
  ];

  const handleCTAClick = () => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      ...analyticsContext,
      source: 'hero_cta',
      section: 'hero',
    });
    document.getElementById(ctaTargetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={isCompactHero ? 'bg-zinc-50 py-5 sm:py-12 lg:py-16' : 'bg-zinc-50 py-5 sm:py-14 lg:py-20'}>
      <Container>
        <div className={isCompactHero ? 'grid grid-cols-1 gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:items-center' : 'grid grid-cols-1 gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:items-center'}>
          <div className="text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {brandName}
              </span>
              <span className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                {availabilityLabel}
              </span>
            </div>
            {showProductName && (
              <p className="mt-4 text-sm font-semibold uppercase text-emerald-700">
                {productName}
              </p>
            )}
            <h1 className={isCompactHero ? 'mt-2 text-3xl font-bold leading-tight text-zinc-950 sm:text-5xl lg:text-5xl' : 'mt-2 text-3xl font-bold leading-tight text-zinc-950 sm:text-5xl lg:text-6xl'}>
              {headline}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 lg:mx-0">
              {subheadline}
            </p>
            <div className="mx-auto mt-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:inline-flex sm:items-center sm:gap-4 lg:mx-0">
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold uppercase text-zinc-500">
                  COD price
                </p>
                <div className={priceClassName}>
                  <span className="text-3xl font-bold leading-none text-zinc-950 sm:text-4xl">
                    {price.amount}
                  </span>
                  <span className="text-base font-semibold text-zinc-700">
                    {price.currency}
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className={`mt-4 ${ctaClassName} sm:mt-0`}
                onClick={handleCTAClick}
              >
                {cta}
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-700 sm:grid-cols-4 lg:max-w-2xl">
              {trustCues.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.text} className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 lg:justify-start">
                    <IconComponent className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span className="leading-5">{item.text}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-600">
              {deliveryLabel}
            </p>
          </div>

          <div>
            <div className="relative mx-auto max-w-md overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-xl shadow-zinc-900/10 sm:p-4 lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-100 lg:aspect-[1.03/1]">
                <Image
                  src={mainImage}
                  alt={`Main product image for ${productName}`}
                  fill
                  className={`object-contain ${isPlaceholderImage ? 'p-8 opacity-80 sm:p-14' : 'p-2 sm:p-5'}`}
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {isPlaceholderImage && (
                  <div className="absolute inset-x-4 bottom-4 rounded-md border border-zinc-200 bg-white/95 px-4 py-2 text-center text-sm font-medium text-zinc-700 shadow-sm">
                    Product photo coming soon
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm text-zinc-600">
                <span className="font-semibold text-zinc-900">{productName}</span>
                <span className="rounded-md bg-zinc-950 px-3 py-1.5 font-semibold text-white">
                  {priceLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
