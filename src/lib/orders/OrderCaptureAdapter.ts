export type OrderCaptureRequest = {
  productId: string;
  productSlug: string;
  productName: string;
  price: number;
  currency: string;
  variant?: string;
  quantity: number;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  experimentId: string;
  experimentArm: string;
  source?: string;
  submittedAt: string;
};

export type OrderCaptureResult =
  | {
      ok: true;
      orderId: string;
      storage?: unknown;
    }
  | {
      ok: false;
      status: number;
      errors?: Record<string, string>;
      message: string;
    };

export type OrderCaptureAdapter = {
  submitOrderIntent(order: OrderCaptureRequest): Promise<OrderCaptureResult>;
};
