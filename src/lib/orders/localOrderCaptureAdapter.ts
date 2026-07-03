import type {
  OrderCaptureAdapter,
  OrderCaptureRequest,
  OrderCaptureResult,
} from './OrderCaptureAdapter';

export const localOrderCaptureAdapter: OrderCaptureAdapter = {
  async submitOrderIntent(order) {
    return submitLocalOrder(order);
  },
};

async function submitLocalOrder(
  order: OrderCaptureRequest
): Promise<OrderCaptureResult> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        errors: readErrors(result),
        message: 'Order API rejected the submission.',
      };
    }

    return {
      ok: true,
      orderId:
        result && typeof result.orderId === 'string'
          ? result.orderId
          : 'unknown',
      storage: result && typeof result === 'object' ? result.storage : undefined,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Order API request failed.',
    };
  }
}

function readErrors(result: unknown) {
  if (
    result &&
    typeof result === 'object' &&
    'errors' in result &&
    result.errors &&
    typeof result.errors === 'object'
  ) {
    return result.errors as Record<string, string>;
  }

  return undefined;
}
