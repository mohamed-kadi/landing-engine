import type { StorefrontProductPage } from '../../types/storefront';

export type ProductProviderFetchOptions = {
  fresh?: boolean;
};

export type ProductProvider = {
  getProductPageBySlug(
    slug: string,
    options?: ProductProviderFetchOptions
  ): Promise<StorefrontProductPage | undefined>;
  getDefaultProductPage(): Promise<StorefrontProductPage>;
  getAllProductPages(): Promise<StorefrontProductPage[]>;
};
