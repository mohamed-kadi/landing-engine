import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import { Container } from '../ui/Container';
import { Star } from 'lucide-react';
import type {
  StorefrontReviewExperimentVariant,
  StorefrontSectionConfig,
} from '../../types/storefront';

type SocialProofSectionProps = {
  socialProofData: StorefrontSectionConfig['socialProof'];
  reviewVariant?: StorefrontReviewExperimentVariant;
};

export function SocialProofSection({
  socialProofData,
  reviewVariant = 'cards',
}: SocialProofSectionProps) {
  const { title, reviews } = socialProofData;
  const isCompact = reviewVariant === 'compact';
  const gridClassName = isCompact
    ? 'mt-10 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'
    : 'mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">{title}</h2>
        </div>
        <div className={gridClassName}>
          {reviews.map((review) => (
            <Card key={review.id} className="h-full">
              <CardHeader className={isCompact ? 'flex flex-row items-start justify-between gap-4 p-5' : 'flex flex-row items-start justify-between gap-4'}>
                <div>
                  <CardTitle className="text-zinc-950">{review.name}</CardTitle>
                  <CardDescription>{review.city}</CardDescription>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`}
                    />
                  ))}
                </div>
              </CardHeader>
              <CardContent className={isCompact ? 'p-5 pt-0' : ''}>
                <p className={isCompact ? 'text-sm leading-6 text-zinc-700' : 'text-base leading-7 text-zinc-700'}>&quot;{review.testimonial}&quot;</p>
                <p className="mt-5 text-xs font-medium uppercase text-zinc-400">{review.timestamp}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
