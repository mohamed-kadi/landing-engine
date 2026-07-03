import { Container } from '../ui/Container';
import type { StorefrontSectionConfig } from '../../types/storefront';

type ComparisonSectionProps = {
  comparisonData: StorefrontSectionConfig['comparison'];
};

export function ComparisonSection({ comparisonData }: ComparisonSectionProps) {
  const { title, columns, points } = comparisonData;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{title}</h2>
        </div>
        <div className="mt-10 flow-root">
          <div className="overflow-x-auto rounded-lg border border-zinc-200 shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200 bg-white">
              <thead className="bg-zinc-950">
                <tr>
                  <th scope="col" className="px-5 py-4 text-left text-xs font-semibold uppercase text-white">{columns.feature}</th>
                  <th scope="col" className="px-5 py-4 text-center text-xs font-semibold uppercase text-zinc-300">{columns.ordinary}</th>
                  <th scope="col" className="px-5 py-4 text-center text-xs font-semibold uppercase text-emerald-200">{columns.premium}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {points.map((point) => (
                  <tr key={point.feature} className="odd:bg-white even:bg-zinc-50">
                    <td className="min-w-36 px-5 py-4 text-sm font-semibold text-zinc-950">{point.feature}</td>
                    <td className="min-w-44 px-5 py-4 text-center text-sm text-zinc-500">{typeof point.ordinary === 'boolean' ? (point.ordinary ? 'Yes' : 'No') : point.ordinary}</td>
                    <td className="min-w-44 px-5 py-4 text-center text-sm font-semibold text-emerald-700">{typeof point.premium === 'boolean' ? (point.premium ? 'Yes' : 'No') : point.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}
