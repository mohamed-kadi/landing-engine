import { Container } from '../ui/Container';
import type { StorefrontSectionConfig } from '../../types/storefront';

type ProblemSolutionSectionProps = {
  problemSolutionData: StorefrontSectionConfig['problemSolution'];
};

export function ProblemSolutionSection({ problemSolutionData }: ProblemSolutionSectionProps) {
  const { title, problemLabel, problem, solutionLabel, solution } = problemSolutionData;

  return (
    <section className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{title}</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase text-zinc-500">{problemLabel}</p>
            <p className="mt-4 text-lg leading-8 text-zinc-700">{problem}</p>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase text-emerald-700">{solutionLabel}</p>
            <p className="mt-4 text-lg leading-8 text-zinc-800">{solution}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
