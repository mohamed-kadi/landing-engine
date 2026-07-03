'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Container } from '../ui/Container';
import type { StorefrontSectionConfig } from '../../types/storefront';

type FAQSectionProps = {
  faqData: StorefrontSectionConfig['faq'];
};

export function FAQSection({ faqData }: FAQSectionProps) {
  const { title, items } = faqData;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{title}</h2>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="rounded-lg border border-zinc-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-zinc-950"
                >
                  <span className="text-base font-semibold leading-6">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-zinc-500 transition-transform ${openIndex === index ? '-rotate-180' : 'rotate-0'}`}
                  />
                </button>
                <div
                  className={`overflow-hidden px-5 transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="pb-5 text-base leading-7 text-zinc-600">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
