'use client';

import { Button } from '../ui/Button';
import { ANALYTICS_EVENTS } from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { ProductAnalyticsContext } from '../../lib/analytics/types';
import type {
  StorefrontCTAExperimentVariant,
  StorefrontOffer,
} from '../../types/storefront';

type StickyCTASectionProps = {
  ctaLabel: string;
  price: StorefrontOffer['price'];
  targetId: string;
  analyticsContext: ProductAnalyticsContext;
  ctaVariant?: StorefrontCTAExperimentVariant;
};

export function StickyCTASection({
  ctaLabel,
  price,
  targetId,
  analyticsContext,
  ctaVariant = 'primary',
}: StickyCTASectionProps) {
  const priceLabel = `${price.amount} ${price.currency}`;
  const buttonClassName =
    ctaVariant === 'high-contrast'
      ? 'w-full bg-zinc-950 shadow-lg shadow-zinc-900/15 hover:bg-zinc-800'
      : 'w-full shadow-lg shadow-emerald-900/10';

  const handleCTAClick = () => {
    trackEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      ...analyticsContext,
      source: 'sticky_cta',
      section: 'sticky_cta',
    });
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(24,24,27,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-24">
          <p className="text-xs font-medium text-zinc-500">COD price</p>
          <p className="text-base font-bold text-zinc-950">{priceLabel}</p>
        </div>
        <Button size="lg" className={buttonClassName} onClick={handleCTAClick}>
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
