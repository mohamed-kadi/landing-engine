'use client';

import { Button } from '../ui/Button';
import { ANALYTICS_EVENTS } from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { ProductAnalyticsContext } from '../../lib/analytics/types';
import type { StorefrontCTAExperimentVariant } from '../../types/storefront';

type StickyCTASectionProps = {
  ctaLabel: string;
  targetId: string;
  analyticsContext: ProductAnalyticsContext;
  ctaVariant?: StorefrontCTAExperimentVariant;
};

export function StickyCTASection({
  ctaLabel,
  targetId,
  analyticsContext,
  ctaVariant = 'primary',
}: StickyCTASectionProps) {
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
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(24,24,27,0.08)] backdrop-blur lg:hidden">
      <Button size="lg" className={buttonClassName} onClick={handleCTAClick}>
        {ctaLabel}
      </Button>
    </div>
  );
}
