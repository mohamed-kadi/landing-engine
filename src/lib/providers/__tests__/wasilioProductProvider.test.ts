import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import publicProductResponse from '../../../test/fixtures/wasilio/publicProductResponse.json';
import { wasilioProductProvider } from '../wasilioProductProvider';

const originalEnv = {
  NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_WASILIO_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_WASILIO_STORE_SLUG: process.env.NEXT_PUBLIC_WASILIO_STORE_SLUG,
};

describe('wasilioProductProvider', () => {
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

  it('maps Wasilio V1 product identity, offer, images, SEO, and default sections', async () => {
    const fetchMock = mockProductResponse(publicProductResponse, 200);

    const productPage = await wasilioProductProvider.getProductPageBySlug(
      'portable-air-cooler'
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.wasilio.test/api/public/storefront/coolair-morocco/products/portable-air-cooler',
      {
        headers: {
          Accept: 'application/json',
        },
        next: {
          revalidate: 300,
        },
      }
    );
    expect(productPage).toBeDefined();
    expect(productPage?.product).toEqual({
      id: 'prod_portable_air_cooler_001',
      slug: 'portable-air-cooler',
      name: 'Portable Air Cooler',
      brand: 'CoolAir Morocco',
    });
    expect(productPage?.offer.price).toEqual({
      amount: 349,
      currency: 'MAD',
    });
    expect(productPage?.offer.variants).toEqual([]);
    expect(productPage?.offer.availability).toBe('https://schema.org/InStock');
    expect(productPage?.media).toEqual({
      mainImage:
        'https://cdn.wasilio.test/products/portable-air-cooler/main.jpg',
      images: [
        'https://cdn.wasilio.test/products/portable-air-cooler/side.jpg',
        'https://cdn.wasilio.test/products/portable-air-cooler/detail.jpg',
      ],
    });
    expect(productPage?.seo.seoTitle).toBe(
      'Portable Air Cooler - CoolAir Morocco'
    );
    expect(productPage?.seo.ogTitle).toBe(
      'Portable Air Cooler - CoolAir Morocco'
    );
    expect(productPage?.seo.twitterImage).toBe(
      'https://cdn.wasilio.test/products/portable-air-cooler/main.jpg'
    );
    expect(productPage?.sections.hero).toEqual({
      headline: 'Portable Air Cooler',
      subheadline:
        'A compact evaporative air cooler for small rooms, desks, and bedside cooling.',
      cta: 'Order Now',
      secondaryCta: 'Cash on Delivery | Fast Shipping',
    });
    expect(productPage?.sections.features.list).toHaveLength(1);
    expect(productPage?.sections.socialProof.reviews).toEqual([]);
    expect(productPage?.sections.faq.items).toEqual([]);
    expect(productPage?.sections.trust.items).toEqual([
      { icon: 'cod', text: 'Cash on Delivery' },
      { icon: 'shipping', text: 'Fast Shipping in Morocco' },
      { icon: 'support', text: 'Store support available' },
    ]);
  });

  it('maps unavailable or non-orderable products to schema.org OutOfStock', async () => {
    mockProductResponse(
      {
        ...publicProductResponse,
        product: {
          ...publicProductResponse.product,
          availability: 'UNAVAILABLE',
          orderable: false,
        },
      },
      200
    );

    const productPage = await wasilioProductProvider.getProductPageBySlug(
      'portable-air-cooler'
    );

    expect(productPage?.offer.availability).toBe(
      'https://schema.org/OutOfStock'
    );
  });

  it('maps current Wasilio minimal responses with nullable description and image fields', async () => {
    mockProductResponse(
      {
        storeSlug: 'first-store',
        storePublicName: 'firstStore',
        supportChannel: {
          type: 'whatsapp',
          value: '+212600000101',
        },
        product: {
          productId: 'b2babebe-cf0d-49e5-94de-186c427f58b2',
          productSlug: 'wear-fan',
          productName: 'wearfan',
          description: null,
          imageUrl: null,
        },
        offer: {
          price: 50,
          currency: 'MAD',
          availability: 'available',
          orderable: true,
        },
        seo: {
          title: 'wearfan | firstStore',
          description: 'Order wearfan from firstStore.',
        },
      },
      200
    );

    const productPage =
      await wasilioProductProvider.getProductPageBySlug('wear-fan');

    expect(productPage?.product).toEqual({
      id: 'b2babebe-cf0d-49e5-94de-186c427f58b2',
      slug: 'wear-fan',
      name: 'wearfan',
      brand: 'firstStore',
    });
    expect(productPage?.offer.price).toEqual({
      amount: 50,
      currency: 'MAD',
    });
    expect(productPage?.offer.availability).toBe('https://schema.org/InStock');
    expect(productPage?.media.mainImage).toBe(
      '/images/product-placeholder.svg'
    );
    expect(productPage?.seo.seoDescription).toBe(
      'Order wearfan from firstStore.'
    );
    expect(productPage?.sections.hero.subheadline).toBe(
      'Order wearfan from firstStore.'
    );
  });

  it('returns undefined for a Wasilio 404 without using a local fixture', async () => {
    mockProductResponse({ ok: false }, 404);

    const productPage =
      await wasilioProductProvider.getProductPageBySlug('unknown-product');

    expect(productPage).toBeUndefined();
  });

  it('returns undefined for malformed Wasilio responses when no matching fixture exists', async () => {
    mockProductResponse({}, 200);

    const productPage =
      await wasilioProductProvider.getProductPageBySlug('unknown-product');

    expect(productPage).toBeUndefined();
  });
});

function mockProductResponse(body: unknown, status: number) {
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
