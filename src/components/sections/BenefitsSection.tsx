import { CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import type { StorefrontSectionConfig } from '../../types/storefront';

type BenefitsSectionProps = {
  benefitsData: StorefrontSectionConfig['benefits'];
};

export function BenefitsSection({ benefitsData }: BenefitsSectionProps) {
  const { title, description, list } = benefitsData;

  return (
    <section className="bg-zinc-50 py-10 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-10 lg:gap-4">
          {list.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-base font-medium leading-7 text-zinc-900">{benefit}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
