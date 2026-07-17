'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Container } from '../ui/Container';
import { ANALYTICS_EVENTS } from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { ProductAnalyticsContext } from '../../lib/analytics/types';
import type {
  StorefrontGalleryExperimentVariant,
  StorefrontMedia,
} from '../../types/storefront';

type ProductGallerySectionProps = {
  galleryData: StorefrontMedia;
  productName: string;
  analyticsContext: ProductAnalyticsContext;
  galleryVariant?: StorefrontGalleryExperimentVariant;
};

export function ProductGallerySection({
  galleryData,
  productName,
  analyticsContext,
  galleryVariant = 'side-thumbnails',
}: ProductGallerySectionProps) {
  const { images } = galleryData;
  const [mainImage, setMainImage] = useState(galleryData.mainImage);
  const galleryImages = [galleryData.mainImage, ...images].filter(
    (image, index, allImages) => allImages.indexOf(image) === index
  );
  const hasMultipleImages = galleryImages.length > 1;
  const hasBottomThumbnails = galleryVariant === 'bottom-thumbnails';
  const isPlaceholderImage = mainImage === '/images/product-placeholder.svg';

  const handleGalleryClick = (image: string, index: number) => {
    setMainImage(image);
    trackEvent(ANALYTICS_EVENTS.GALLERY_VIEW, {
      ...analyticsContext,
      source: 'thumbnail',
      section: 'product_gallery',
      image,
      position: index + 1,
    });
  };

  return (
    <section className="bg-white py-8 sm:py-14 lg:py-20">
      <Container>
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">
              Product view
            </p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-950 sm:text-3xl">
              {productName}
            </h2>
          </div>
          {!hasMultipleImages && (
            <p className="max-w-sm text-sm leading-6 text-zinc-600">
              {isPlaceholderImage
                ? 'The store has not published a product photo yet.'
                : 'Primary product photo'}
            </p>
          )}
        </div>
        <div className={hasBottomThumbnails || !hasMultipleImages ? 'grid grid-cols-1 gap-3 sm:gap-4' : 'grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[1fr_144px] lg:items-start'}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm">
            <div className="absolute inset-3 rounded-md border border-white bg-white sm:inset-4" />
            <Image
              key={mainImage}
              src={mainImage}
              alt={`Main view of ${productName}`}
              fill
              className={`object-contain transition-opacity duration-300 ${isPlaceholderImage ? 'p-14 opacity-80 sm:p-20' : 'p-5 sm:p-8'}`}
              loading="eager"
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
            />
            {isPlaceholderImage && (
              <div className="absolute inset-x-5 bottom-5 rounded-md border border-zinc-200 bg-white/95 px-4 py-3 text-center text-sm font-medium text-zinc-700 shadow-sm">
                Product photo coming soon
              </div>
            )}
          </div>
          {hasMultipleImages && (
            <div>
              <ul className={hasBottomThumbnails ? 'grid grid-cols-4 gap-2 sm:grid-cols-5 lg:gap-3' : 'grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-1 lg:gap-3'}>
                {galleryImages.map((image, index) => (
                  <li key={image}>
                    <button
                      type="button"
                      onClick={() => handleGalleryClick(image, index)}
                      aria-label={`Show image ${index + 1} of ${productName}`}
                      className={`relative aspect-square w-full overflow-hidden rounded-md border bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                        mainImage === image ? 'border-emerald-600' : 'border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1} of ${productName}`}
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="80px"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
