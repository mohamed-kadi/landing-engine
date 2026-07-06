import type { ElementType } from 'react';
import {
  BadgeCheck,
  Headset,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Container } from '../ui/Container';
import type {
  StorefrontAvailability,
  StorefrontSectionConfig,
  StorefrontTrustExperimentVariant,
} from '../../types/storefront';

type TrustSectionProps = {
  trustData: StorefrontSectionConfig['trust'];
  storeName: string;
  availability: StorefrontAvailability;
  trustVariant?: StorefrontTrustExperimentVariant;
};

const iconMap: Record<string, ElementType> = {
  available: PackageCheck,
  cod: ShieldCheck,
  confirm: BadgeCheck,
  shield: ShieldCheck,
  shipping: Truck,
  return: RefreshCw,
  support: Headset,
};

export function TrustSection({
  trustData,
  storeName,
  availability,
  trustVariant = 'panel',
}: TrustSectionProps) {
  const isInline = trustVariant === 'inline';
  const isInStock = availability === 'https://schema.org/InStock';
  const supportText = trustData.items.find((item) => item.icon === 'support')?.text;
  const displayItems = trustData.items.filter((item) => item.icon !== 'support');
  const trustCards = dedupeTrustItems([
    {
      icon: 'available',
      text: isInStock ? 'Available to order' : 'Store confirms availability',
    },
    ...displayItems,
    {
      icon: 'confirm',
      text: 'Confirmed before shipping',
    },
    {
      icon: 'support',
      text: supportText ? `${supportText}` : `Support from ${storeName}`,
    },
  ]);

  return (
    <section className="bg-white py-5 sm:py-9">
      <Container>
        <div className={isInline ? '' : 'rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:p-6'}>
          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase text-zinc-500 sm:text-sm">
                {trustData.title}
              </p>
              <p className="mt-1 text-base font-semibold text-zinc-950">
                Ordering with {storeName}
              </p>
            </div>
            <div className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-800">
              <PackageCheck className="h-4 w-4" />
              {isInStock ? 'Available to order' : 'Store will confirm availability'}
            </div>
          </div>
          <div className={isInline ? 'mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3' : 'mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3'}>
            {trustCards.map((item) => {
              const IconComponent = iconMap[item.icon] ?? ShieldCheck;
              return (
                <div key={item.text} className={isInline ? 'flex min-h-16 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-4' : 'flex min-h-16 items-center gap-2 rounded-md bg-white px-3 py-3 shadow-sm sm:gap-3 sm:px-4'}>
                  <IconComponent className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <span className="text-sm leading-5 text-zinc-800">
                    <span className="block font-semibold">{item.text}</span>
                    {item.description && (
                      <span className="mt-0.5 block text-xs leading-5 text-zinc-600">
                        {item.description}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function dedupeTrustItems(items: StorefrontSectionConfig['trust']['items']) {
  return items.filter(
    (item, index, allItems) =>
      allItems.findIndex(
        (candidate) => candidate.text.toLowerCase() === item.text.toLowerCase()
      ) === index
  );
}
