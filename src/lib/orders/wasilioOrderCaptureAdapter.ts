import type {
  OrderCaptureAdapter,
  OrderCaptureRequest,
  OrderCaptureResult,
} from './OrderCaptureAdapter';

type WasilioOrderResponse = {
  ok?: boolean;
  accepted?: boolean;
  inboundOrderId?: string;
  orderIntentId?: string;
  receiptId?: string;
  status?: string;
  correlationId?: string;
  calculatedTotal?: {
    amount: number;
    currency: string;
  };
  errors?: Record<string, string>;
  title?: string;
  detail?: string;
  message?: string;
};

export const wasilioOrderCaptureAdapter: OrderCaptureAdapter = {
  async submitOrderIntent(order) {
    return submitWasilioOrder(order);
  },
};

async function submitWasilioOrder(
  order: OrderCaptureRequest
): Promise<OrderCaptureResult> {
  const endpoint = buildWasilioOrderEndpoint();

  if (!endpoint) {
    return {
      ok: false,
      status: 0,
      message:
        'Wasilio order capture is not configured. Check public API base URL and store slug.',
    };
  }

  const correlationId = createStableId('corr');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
      },
      body: JSON.stringify(createWasilioOrderPayload(order)),
    });
    const result = (await response.json().catch(() => null)) as
      | WasilioOrderResponse
      | null;
    const orderId =
      result?.orderIntentId ??
      result?.inboundOrderId ??
      result?.receiptId ??
      result?.correlationId ??
      correlationId;

    if (!response.ok || !result || result.ok === false) {
      return {
        ok: false,
        status: response.status,
        errors: result?.errors,
        message:
          result?.message ??
          result?.detail ??
          result?.title ??
          'Wasilio rejected the order submission.',
      };
    }

    return {
      ok: true,
      orderId,
      storage: {
        mode: 'wasilio-public-api',
        accepted: result.accepted ?? response.status === 202,
        status: result.status,
        correlationId: result.correlationId ?? correlationId,
        calculatedTotal: result.calculatedTotal,
      },
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Wasilio order API request failed.',
    };
  }
}

function createWasilioOrderPayload(order: OrderCaptureRequest) {
  return {
    idempotencyKey: createStableId(`order-${order.productSlug}`),
    selection: {
      product: {
        productId: order.productId,
        productSlug: order.productSlug,
        variantId: order.variant,
      },
      quantity: order.quantity,
    },
    customer: {
      name: order.customerName,
      phone: order.phone,
    },
    delivery: {
      city: order.city,
      address: order.address,
      notes: order.notes,
    },
    attribution: {
      source: order.source,
      campaign: order.experimentId,
      content: order.experimentArm,
      landingPageUrl:
        typeof window !== 'undefined' ? window.location.href : undefined,
    },
  };
}

function buildWasilioOrderEndpoint() {
  const baseUrl = process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL?.trim();
  const storeSlug = process.env.NEXT_PUBLIC_WASILIO_STORE_SLUG?.trim();

  if (!baseUrl || !storeSlug) {
    return undefined;
  }

  try {
    return new URL(
      `api/public/storefront/${encodeURIComponent(storeSlug)}/orders`,
      ensureTrailingSlash(baseUrl)
    ).toString();
  } catch {
    return undefined;
  }
}

function createStableId(prefix: string) {
  const randomValue =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${randomValue}`;
}

function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`;
}
