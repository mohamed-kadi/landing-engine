import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import publicOrderResponse from '../../../test/fixtures/wasilio/publicOrderResponse.json';
import type { OrderCaptureRequest } from '../OrderCaptureAdapter';
import { wasilioOrderCaptureAdapter } from '../wasilioOrderCaptureAdapter';

const originalEnv = {
  NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_WASILIO_STORE_SLUG: process.env.NEXT_PUBLIC_WASILIO_STORE_SLUG,
};

describe('wasilioOrderCaptureAdapter', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL =
      'https://api.wasilio.test';
    process.env.NEXT_PUBLIC_WASILIO_STORE_SLUG = 'coolair-morocco';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL =
      originalEnv.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL;
    process.env.NEXT_PUBLIC_WASILIO_STORE_SLUG =
      originalEnv.NEXT_PUBLIC_WASILIO_STORE_SLUG;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('maps a successful Wasilio public order response into the local success shape', async () => {
    const fetchMock = mockOrderResponse(publicOrderResponse, 202);

    const result =
      await wasilioOrderCaptureAdapter.submitOrderIntent(createOrderRequest());

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'https://api.wasilio.test/api/public/storefront/coolair-morocco/orders'
    );
    expect(result).toEqual({
      ok: true,
      orderId: 'order_intent_01JTESTWASILIO',
      storage: {
        mode: 'wasilio-public-api',
        accepted: true,
        status: 'accepted',
        correlationId: expect.stringMatching(/^corr-/),
        calculatedTotal: undefined,
      },
    });
  });

  it('sends a public-safe order intent payload without internal IDs or price authority', async () => {
    const fetchMock = mockOrderResponse(publicOrderResponse, 202);

    await wasilioOrderCaptureAdapter.submitOrderIntent(createOrderRequest());

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const body = JSON.parse(String(requestInit.body));

    expect(requestInit.method).toBe('POST');
    expect(requestInit.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Correlation-ID': expect.stringMatching(/^corr-/),
    });
    expect(body.idempotencyKey).toMatch(/^order-portable-air-cooler-/);
    expect(body.selection).toEqual({
      product: {
        productId: 'prod_portable_air_cooler_001',
        productSlug: 'portable-air-cooler',
        variantId: 'variant-white',
      },
      quantity: 2,
    });
    expect(body.customer).toEqual({
      name: 'Fatima Zahra',
      phone: '0612345678',
    });
    expect(body.delivery).toEqual({
      city: 'Casablanca',
      address: '12 Rue Example, Maarif',
      notes: 'Call before delivery',
    });
    expect(body.attribution).toEqual({
      source: 'order_form',
      campaign: 'portable-air-cooler-layout-v1',
      content: 'control',
    });
    expect(body).not.toHaveProperty('product');
    expect(body).not.toHaveProperty('tenantId');
    expect(body).not.toHaveProperty('merchantId');
    expect(body).not.toHaveProperty('source');
    expect(body).not.toHaveProperty('price');
    expect(body).not.toHaveProperty('currency');
  });

  it('maps a 400 validation error response', async () => {
    mockOrderResponse(
      {
        ok: false,
        message: 'Validation failed.',
        errors: {
          phone: 'Phone number is invalid.',
        },
      },
      400
    );

    const result =
      await wasilioOrderCaptureAdapter.submitOrderIntent(createOrderRequest());

    expect(result).toEqual({
      ok: false,
      status: 400,
      errors: {
        phone: 'Phone number is invalid.',
      },
      message: 'Validation failed.',
    });
  });

  it('maps a 404 store or product response', async () => {
    mockOrderResponse(
      {
        ok: false,
        message: 'Store or product was not found.',
      },
      404
    );

    const result =
      await wasilioOrderCaptureAdapter.submitOrderIntent(createOrderRequest());

    expect(result).toEqual({
      ok: false,
      status: 404,
      errors: undefined,
      message: 'Store or product was not found.',
    });
  });

  it('maps a 409 idempotency conflict response', async () => {
    mockOrderResponse(
      {
        ok: false,
        message: 'Idempotency key already accepted for another payload.',
      },
      409
    );

    const result =
      await wasilioOrderCaptureAdapter.submitOrderIntent(createOrderRequest());

    expect(result).toEqual({
      ok: false,
      status: 409,
      errors: undefined,
      message: 'Idempotency key already accepted for another payload.',
    });
  });
});

function createOrderRequest(): OrderCaptureRequest {
  return {
    productId: 'prod_portable_air_cooler_001',
    productSlug: 'portable-air-cooler',
    productName: 'Portable Air Cooler',
    price: 349,
    currency: 'MAD',
    variant: 'variant-white',
    quantity: 2,
    customerName: 'Fatima Zahra',
    phone: '0612345678',
    city: 'Casablanca',
    address: '12 Rue Example, Maarif',
    notes: 'Call before delivery',
    experimentId: 'portable-air-cooler-layout-v1',
    experimentArm: 'control',
    source: 'order_form',
    submittedAt: '2026-07-02T12:00:00.000Z',
  };
}

function mockOrderResponse(body: unknown, status: number) {
  const fetchMock = vi.fn(async () => {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
