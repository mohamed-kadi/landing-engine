import type { ProductData } from '../../types/product';
import { carVacuum } from './carVacuum';
import { neckFan } from './neckFan';

export const DEFAULT_PRODUCT_SLUG = neckFan.slug;

export const products: Record<string, ProductData> = {
  [neckFan.slug]: neckFan,
  [carVacuum.slug]: carVacuum,
};

export function getProductBySlug(slug: string) {
  return products[slug];
}

export function getAllProducts() {
  return Object.values(products);
}

export function getDefaultProduct() {
  return products[DEFAULT_PRODUCT_SLUG];
}
