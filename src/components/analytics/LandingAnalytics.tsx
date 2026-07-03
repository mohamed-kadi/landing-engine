'use client';

import { useEffect, useRef } from 'react';
import {
  ANALYTICS_EVENTS,
  SCROLL_DEPTH_MILESTONES,
  getScrollDepthEventName,
} from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { ProductAnalyticsContext } from '../../lib/analytics/types';

type LandingAnalyticsProps = {
  context: ProductAnalyticsContext;
};

export function LandingAnalytics({ context }: LandingAnalyticsProps) {
  const trackedInitialRender = useRef(false);

  useEffect(() => {
    if (trackedInitialRender.current) {
      return;
    }

    trackedInitialRender.current = true;
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, {
      ...context,
      source: 'page',
      section: 'page',
    });
    trackEvent(ANALYTICS_EVENTS.VIEW_CONTENT, {
      ...context,
      source: 'page',
      section: 'product_content',
    });
  }, [context]);

  useEffect(() => {
    const trackedMilestones = new Set<number>();
    let animationFrameId: number | null = null;

    const trackScrollDepth = () => {
      animationFrameId = null;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollDepth = Math.round((window.scrollY / scrollableHeight) * 100);

      SCROLL_DEPTH_MILESTONES.forEach((milestone) => {
        if (scrollDepth >= milestone && !trackedMilestones.has(milestone)) {
          trackedMilestones.add(milestone);
          trackEvent(getScrollDepthEventName(milestone), {
            ...context,
            source: 'scroll',
            section: 'page',
            scrollDepth: milestone,
          });
        }
      });
    };

    const handleScroll = () => {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(trackScrollDepth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    trackScrollDepth();

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [context]);

  return null;
}
