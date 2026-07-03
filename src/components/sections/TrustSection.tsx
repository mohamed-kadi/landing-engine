import type { ElementType } from 'react';
import { Headset, RefreshCw, ShieldCheck, Truck } from 'lucide-react';
import { Container } from '../ui/Container';
import type {
  StorefrontSectionConfig,
  StorefrontTrustExperimentVariant,
} from '../../types/storefront';

type TrustSectionProps = {
  trustData: StorefrontSectionConfig['trust'];
  trustVariant?: StorefrontTrustExperimentVariant;
};

const iconMap: Record<string, ElementType> = {
  cod: ShieldCheck,
  shipping: Truck,
  return: RefreshCw,
  support: Headset,
};

export function TrustSection({ trustData, trustVariant = 'panel' }: TrustSectionProps) {
  const isInline = trustVariant === 'inline';

  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className={isInline ? '' : 'rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-6'}>
          <p className="text-center text-sm font-semibold uppercase text-zinc-500">
            {trustData.title}
          </p>
          <div className={isInline ? 'mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4' : 'mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'}>
          {trustData.items.map((item) => {
            const IconComponent = iconMap[item.icon] ?? ShieldCheck;
            return (
              <div key={item.text} className={isInline ? 'flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-4 py-3 shadow-sm' : 'flex items-center gap-3 rounded-md bg-white px-4 py-3 shadow-sm'}>
                <IconComponent className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-zinc-800">{item.text}</span>
              </div>
            );
          })}
          </div>
        </div>
      </Container>
    </section>
  );
}
