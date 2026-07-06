import { afterEach, describe, expect, it } from 'vitest';
import {
  getProductProvider,
  getProductProviderMode,
} from '../productProviderFactory';

const originalProviderMode = process.env.NEXT_PUBLIC_PRODUCT_PROVIDER;

describe('productProviderFactory', () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_PRODUCT_PROVIDER = originalProviderMode;
  });

  it('keeps local fixture mode as the default provider path', async () => {
    delete process.env.NEXT_PUBLIC_PRODUCT_PROVIDER;

    const productPage = await getProductProvider().getProductPageBySlug(
      'wearable-neck-fan'
    );

    expect(getProductProviderMode()).toBe('local');
    expect(productPage?.sections.benefits.list.length).toBeGreaterThan(0);
    expect(productPage?.sections.features.list.length).toBeGreaterThan(0);
    expect(productPage?.sections.faq.items.length).toBeGreaterThan(0);
  });
});
