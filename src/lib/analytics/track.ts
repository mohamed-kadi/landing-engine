import type { AnalyticsEvent, AnalyticsEventName, AnalyticsEventPayload } from './types';

type ProviderPayload = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (method: 'track' | 'trackCustom', eventName: string, payload?: ProviderPayload) => void;
    dataLayer?: unknown[];
    gtag?: {
      (command: 'event', eventName: string, payload?: ProviderPayload): void;
      (command: 'config', targetId: string, payload?: ProviderPayload): void;
      (command: 'js', date: Date): void;
    };
    ttq?: {
      page?: () => void;
      track?: (eventName: string, payload?: ProviderPayload) => void;
    };
  }
}

const config = {
  debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
  googleAdsConversionId: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID || '',
  tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || '',
};

const metaStandardEvents = new Set<AnalyticsEventName>(['PageView', 'ViewContent', 'Lead']);
const googleAdsConversionEvents = new Set<AnalyticsEventName>(['Lead', 'Order_Submitted']);

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}) {
  const event: AnalyticsEvent = {
    name,
    payload: compactPayload({
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    }),
  };

  if (config.debug) {
    console.info('[analytics]', event.name, event.payload);
  }

  if (typeof window === 'undefined') {
    return;
  }

  trackMetaPixel(event);
  trackGa4(event);
  trackGoogleAds(event);
  trackTikTok(event);
}

function trackMetaPixel(event: AnalyticsEvent) {
  if (!config.metaPixelId || typeof window.fbq !== 'function') {
    return;
  }

  const method = metaStandardEvents.has(event.name) ? 'track' : 'trackCustom';
  window.fbq(method, event.name, toProviderPayload(event.payload));
}

function trackGa4(event: AnalyticsEvent) {
  if (!config.ga4MeasurementId || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', event.name, {
    ...toProviderPayload(event.payload),
    send_to: config.ga4MeasurementId,
  });
}

function trackGoogleAds(event: AnalyticsEvent) {
  if (
    !config.googleAdsConversionId ||
    typeof window.gtag !== 'function' ||
    !googleAdsConversionEvents.has(event.name)
  ) {
    return;
  }

  window.gtag('event', 'conversion', {
    send_to: config.googleAdsConversionId,
    value: event.payload.price,
    currency: event.payload.currency,
    ...toProviderPayload(event.payload),
  });
}

function trackTikTok(event: AnalyticsEvent) {
  if (!config.tiktokPixelId || !window.ttq) {
    return;
  }

  if (event.name === 'PageView' && typeof window.ttq.page === 'function') {
    window.ttq.page();
    return;
  }

  if (typeof window.ttq.track === 'function') {
    window.ttq.track(event.name, toProviderPayload(event.payload));
  }
}

function compactPayload(payload: AnalyticsEventPayload): AnalyticsEventPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== undefined && value !== '';
    })
  ) as AnalyticsEventPayload;
}

function toProviderPayload(payload: AnalyticsEventPayload): ProviderPayload {
  return payload;
}
