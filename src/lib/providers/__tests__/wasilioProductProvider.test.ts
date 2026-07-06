import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import publicProductMinimalResponse from '../../../test/fixtures/wasilio/publicProductMinimalResponse.json';
import publicProductResponse from '../../../test/fixtures/wasilio/publicProductResponse.json';
import { createFAQJsonLd } from '../../seo/faqJsonLd';
import { prepareProductPageForDisplay } from '../../storefront/productPresentation';
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

  it('maps Wasilio published landingProfile content into storefront page sections', async () => {
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
      id: 'de5e9c8a-ef5d-4c76-b983-b76b74f39f28',
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
        'https://cdn.example.test/gallery-1.jpg',
      ],
    });
    expect(productPage?.market.countryCode).toBe('MA');
    expect(productPage?.market.currency).toBe('MAD');
    expect(productPage?.seo.seoTitle).toBe(
      'Portable CoolAir Morocco'
    );
    expect(productPage?.seo.seoDescription).toBe(
      'Order a portable CoolAir fan in Morocco.'
    );
    expect(productPage?.seo.ogTitle).toBe(
      'Portable CoolAir Morocco'
    );
    expect(productPage?.seo.ogImage).toBe(
      'https://cdn.example.test/seo-coolair.jpg'
    );
    expect(productPage?.seo.twitterImage).toBe(
      'https://cdn.example.test/seo-coolair.jpg'
    );
    expect(productPage?.sections.hero).toEqual({
      headline: 'Cool air without installation',
      subheadline: 'A portable fan for COD customers.',
      cta: 'Order Now',
      secondaryCta: 'Cash on Delivery | Fast Shipping',
    });
    expect(productPage?.sections.benefits.list).toEqual([
      'Fast COD delivery',
      'Easy returns',
    ]);
    expect(productPage?.sections.features.list).toEqual([
      {
        icon: 'package',
        title: 'Rechargeable',
        description: 'Runs for hours after charging.',
      },
    ]);
    expect(productPage?.sections.faq.items).toEqual([
      {
        question: 'Can I pay on delivery?',
        answer: 'Yes, cash on delivery is supported.',
      },
    ]);
    expect(productPage?.sections.socialProof.reviews).toEqual([]);
    expect(productPage?.sections.trust.items).toEqual([
      {
        icon: 'cod',
        text: 'COD',
        description: 'Pay when the package arrives.',
      },
    ]);
  });

  it('uses Wasilio default currency and country when offer and market fields are absent', async () => {
    mockProductResponse(
      {
        ...publicProductResponse,
        defaultCountryCode: 'CI',
        defaultCurrency: 'XOF',
        offer: {
          ...publicProductResponse.offer,
          currency: null,
        },
        market: null,
      },
      200
    );

    const productPage = await wasilioProductProvider.getProductPageBySlug(
      'portable-air-cooler'
    );

    expect(productPage?.offer.price).toEqual({
      amount: 349,
      currency: 'XOF',
    });
    expect(productPage?.market.countryCode).toBe('CI');
    expect(productPage?.market.currency).toBe('XOF');
  });

  it('maps unavailable or non-orderable products to schema.org OutOfStock', async () => {
    mockProductResponse(
      {
        ...publicProductResponse,
        offer: {
          ...publicProductResponse.offer,
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

  it('keeps missing or draft landingProfile responses on the sparse fallback path', async () => {
    mockProductResponse(publicProductMinimalResponse, 200);

    const productPage =
      await wasilioProductProvider.getProductPageBySlug('wear-fan');
    const displayProductPage = prepareProductPageForDisplay(productPage!);

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
    expect(productPage?.seo.ogImage).toBe('/images/product-placeholder.svg');
    expect(productPage?.sections.hero.subheadline).toBe(
      'Order wearfan from firstStore.'
    );
    expect(displayProductPage.sections.benefits.list).toEqual([]);
    expect(displayProductPage.sections.features.list).toEqual([]);
    expect(displayProductPage.sections.socialProof.reviews).toEqual([]);
    expect(displayProductPage.sections.faq.items).toEqual([]);
  });

  it('builds FAQ JSON-LD inputs only from real Wasilio FAQ content', async () => {
    mockProductResponse(publicProductResponse, 200);

    const productPage = await wasilioProductProvider.getProductPageBySlug(
      'portable-air-cooler'
    );
    const displayProductPage = prepareProductPageForDisplay(productPage!);
    const faqJsonLd =
      displayProductPage.sections.faq.items.length > 0
        ? createFAQJsonLd(displayProductPage.sections.faq)
        : undefined;

    expect(faqJsonLd?.mainEntity).toEqual([
      {
        '@type': 'Question',
        name: 'Can I pay on delivery?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, cash on delivery is supported.',
        },
      },
    ]);

    mockProductResponse(publicProductMinimalResponse, 200);

    const minimalProductPage =
      await wasilioProductProvider.getProductPageBySlug('wear-fan');
    const minimalDisplayProductPage = prepareProductPageForDisplay(
      minimalProductPage!
    );
    const minimalFaqJsonLd =
      minimalDisplayProductPage.sections.faq.items.length > 0
        ? createFAQJsonLd(minimalDisplayProductPage.sections.faq)
        : undefined;

    expect(minimalFaqJsonLd).toBeUndefined();
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
