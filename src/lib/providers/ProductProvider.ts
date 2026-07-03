import type { StorefrontProductPage } from '../../types/storefront';

export type ProductProvider = {
  getProductPageBySlug(slug: string): Promise<StorefrontProductPage | undefined>;
  getDefaultProductPage(): Promise<StorefrontProductPage>;
  getAllProductPages(): Promise<StorefrontProductPage[]>;
};
