import { CheckCircle2 } from 'lucide-react';
import { Container } from '../ui/Container';
import type { StorefrontSectionConfig } from '../../types/storefront';

type BenefitsSectionProps = {
  benefitsData: StorefrontSectionConfig['benefits'];
};

export function BenefitsSection({ benefitsData }: BenefitsSectionProps) {
  const { title, description, list } = benefitsData;

  return (
    <section className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            {description}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
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
