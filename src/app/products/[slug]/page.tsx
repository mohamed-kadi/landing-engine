import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingPage } from '../../../components/landing/LandingPage';
import {
  getProductProvider,
  getProductProviderMode,
} from '../../../lib/providers/productProviderFactory';
import { createProductMetadata } from '../../../lib/seo/metadata';

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  if (getProductProviderMode() === 'wasilio') {
    return [];
  }

  const productPages = await getProductProvider().getAllProductPages();

  return productPages.map((productPage) => ({
    slug: productPage.product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const productPage = await getProductProvider().getProductPageBySlug(slug);

  if (!productPage) {
    notFound();
  }

  return createProductMetadata(productPage);
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params;
  const productPage = await getProductProvider().getProductPageBySlug(slug, {
    fresh: isWasilioPreview(await searchParams),
  });

  if (!productPage) {
    notFound();
  }

  return <LandingPage productPage={productPage} />;
}

function isWasilioPreview(searchParams?: Record<string, string | string[] | undefined>) {
  const preview = searchParams?.wasilioPreview;
  return preview === '1' || preview === 'true';
}
