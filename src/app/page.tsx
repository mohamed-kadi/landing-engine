import type { Metadata } from 'next';
import { LandingPage } from '../components/landing/LandingPage';
import { getProductProvider } from '../lib/providers/productProviderFactory';
import { createProductMetadata } from '../lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const productPage = await getProductProvider().getDefaultProductPage();
  return createProductMetadata(productPage);
}

export default async function HomePage() {
  const productPage = await getProductProvider().getDefaultProductPage();
  return <LandingPage productPage={productPage} />;
}
