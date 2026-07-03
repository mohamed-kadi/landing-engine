import type { OrderCaptureAdapter } from './OrderCaptureAdapter';
import { localOrderCaptureAdapter } from './localOrderCaptureAdapter';
import { wasilioOrderCaptureAdapter } from './wasilioOrderCaptureAdapter';

export function getOrderCaptureAdapter(): OrderCaptureAdapter {
  return process.env.NEXT_PUBLIC_PRODUCT_PROVIDER === 'wasilio'
    ? wasilioOrderCaptureAdapter
    : localOrderCaptureAdapter;
}
