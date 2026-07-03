import type {
  ResolvedStorefrontExperimentConfig,
  StorefrontProductPage,
} from '../../types/storefront';
import { resolveProductExperiments } from '../experiments/productExperiments';
import type { AnalyticsEventName, ProductAnalyticsContext } from './types';

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'PageView',
  VIEW_CONTENT: 'ViewContent',
  SCROLL_25: 'Scroll25',
  SCROLL_50: 'Scroll50',
  SCROLL_75: 'Scroll75',
  GALLERY_VIEW: 'GalleryView',
  CTA_CLICK: 'CTA_Click',
  FORM_START: 'Form_Start',
  FORM_SUBMIT_ATTEMPT: 'Form_Submit_Attempt',
  FORM_SUBMIT_ERROR: 'Form_Submit_Error',
  LEAD: 'Lead',
  ORDER_SUBMITTED: 'Order_Submitted',
} as const satisfies Record<string, AnalyticsEventName>;

export const SCROLL_DEPTH_MILESTONES = [25, 50, 75] as const;

export type ScrollDepthMilestone = (typeof SCROLL_DEPTH_MILESTONES)[number];

export function createProductAnalyticsContext(
  productPage: StorefrontProductPage,
  experiments: ResolvedStorefrontExperimentConfig = resolveProductExperiments(productPage)
): ProductAnalyticsContext {
  return {
    productId: productPage.product.id,
    productSlug: productPage.product.slug,
    productName: productPage.product.name,
    price: productPage.offer.price.amount,
    currency: productPage.offer.price.currency,
    ...experiments,
  };
}

export function getScrollDepthEventName(milestone: ScrollDepthMilestone): AnalyticsEventName {
  return `Scroll${milestone}` as AnalyticsEventName;
}
