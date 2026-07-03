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
  const galleryImages = [galleryData.mainImage, ...images];
  const hasBottomThumbnails = galleryVariant === 'bottom-thumbnails';

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
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <div className={hasBottomThumbnails ? 'grid grid-cols-1 gap-5' : 'grid grid-cols-1 gap-5 lg:grid-cols-[1fr_160px] lg:items-start'}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm">
            <Image
              key={mainImage}
              src={mainImage}
              alt={`Main view of ${productName}`}
              fill
              className="object-contain p-4 transition-opacity duration-300 sm:p-6"
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
            />
          </div>
          <div>
            <ul className={hasBottomThumbnails ? 'grid grid-cols-5 gap-2 lg:gap-3' : 'grid grid-cols-5 gap-2 lg:grid-cols-1 lg:gap-3'}>
              {galleryImages.map((image, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleGalleryClick(image, index)}
                    aria-label={`Show image ${index + 1} of ${productName}`}
                    className={`relative aspect-square w-full overflow-hidden rounded-md border bg-white transition-colors ${
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
        </div>
      </Container>
    </section>
  );
}
