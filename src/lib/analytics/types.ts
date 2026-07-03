import type { ResolvedStorefrontExperimentConfig } from '../../types/storefront';

export type AnalyticsEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Scroll25'
  | 'Scroll50'
  | 'Scroll75'
  | 'GalleryView'
  | 'CTA_Click'
  | 'Form_Start'
  | 'Form_Submit_Attempt'
  | 'Form_Submit_Error'
  | 'Lead'
  | 'Order_Submitted';

export type ProductAnalyticsContext = {
  productId: string;
  productSlug: string;
  productName: string;
  price: number;
  currency: string;
} & ResolvedStorefrontExperimentConfig;

export type AnalyticsEventPayload = Partial<ProductAnalyticsContext> & {
  variant?: string;
  quantity?: number;
  city?: string;
  source?: string;
  section?: string;
  timestamp?: string;
  image?: string;
  position?: number;
  scrollDepth?: number;
  errorFields?: string[];
  errorCount?: number;
  errorMessage?: string;
};

export type AnalyticsEvent = {
  name: AnalyticsEventName;
  payload: AnalyticsEventPayload;
};
