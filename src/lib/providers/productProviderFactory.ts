import type { ProductProvider } from './ProductProvider';
import { localFixtureProductProvider } from './localFixtureProvider';
import { wasilioProductProvider } from './wasilioProductProvider';

export type ProductProviderMode = 'local' | 'wasilio';

export function getProductProvider(): ProductProvider {
  return getProductProviderMode() === 'wasilio'
    ? wasilioProductProvider
    : localFixtureProductProvider;
}

export function getProductProviderMode(): ProductProviderMode {
  return process.env.NEXT_PUBLIC_PRODUCT_PROVIDER === 'wasilio'
    ? 'wasilio'
    : 'local';
}
