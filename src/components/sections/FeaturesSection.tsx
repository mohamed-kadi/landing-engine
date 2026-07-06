import type { ElementType } from 'react';
import {
  Battery,
  Car,
  CircleHelp,
  Droplets,
  Feather,
  Filter,
  Gauge,
  PackageCheck,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Volume2,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/Card';
import { Container } from '../ui/Container';
import type { StorefrontSectionConfig } from '../../types/storefront';

type FeaturesSectionProps = {
  featuresData: StorefrontSectionConfig['features'];
};

const iconMap: Record<string, ElementType> = {
  battery: Battery,
  car: Car,
  cleaning: Sparkles,
  cordless: Battery,
  droplets: Droplets,
  feather: Feather,
  filter: Filter,
  gauge: Gauge,
  package: PackageCheck,
  plug: PlugZap,
  power: PlugZap,
  shield: ShieldCheck,
  sparkle: Sparkles,
  speed: Gauge,
  tools: Wrench,
  'volume-off': Volume2,
  wind: Wind,
  wrench: Wrench,
  zap: Zap,
};

export function FeaturesSection({ featuresData }: FeaturesSectionProps) {
  const { title, list } = featuresData;

  return (
    <section className="bg-white py-10 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-zinc-950 sm:text-4xl">
            {title}
          </h2>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-4">
          {list.map((feature) => {
            const IconComponent = iconMap[feature.icon ?? 'package'] ?? CircleHelp;
            return (
              <Card key={feature.title} className="h-full shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-zinc-950">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="mt-4 text-zinc-950">{feature.title}</CardTitle>
                  {feature.customerBenefit && (
                    <CardDescription className="font-medium text-emerald-700">
                      {feature.customerBenefit}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
