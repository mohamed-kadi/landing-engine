import type {
  ResolvedStorefrontExperimentConfig,
  StorefrontExperimentArm,
  StorefrontExperimentConfig,
  StorefrontExperimentVariants,
  StorefrontProductPage,
} from '../../types/storefront';

export const DEFAULT_EXPERIMENT_ARM = 'control';

export const DEFAULT_PRODUCT_EXPERIMENT_VARIANTS: StorefrontExperimentVariants = {
  heroVariant: 'standard',
  reviewVariant: 'cards',
  ctaVariant: 'primary',
  trustVariant: 'panel',
  galleryVariant: 'side-thumbnails',
  priceVariant: 'inline',
};

export const DEFAULT_PRODUCT_EXPERIMENTS: ResolvedStorefrontExperimentConfig = {
  experimentId: 'control',
  experimentArm: DEFAULT_EXPERIMENT_ARM,
  resolvedVariants: DEFAULT_PRODUCT_EXPERIMENT_VARIANTS,
};

export function resolveProductExperiments(
  productPage: StorefrontProductPage,
  assignedArm?: string | null
): ResolvedStorefrontExperimentConfig {
  const experimentConfig = productPage.experiments;
  const experimentId =
    experimentConfig?.experimentId ?? `${productPage.product.slug}-control`;

  if (!experimentConfig) {
    return {
      experimentId,
      experimentArm: DEFAULT_EXPERIMENT_ARM,
      resolvedVariants: DEFAULT_PRODUCT_EXPERIMENT_VARIANTS,
    };
  }

  const experimentArm = resolveExperimentArmName(experimentConfig, assignedArm);
  const armConfig = experimentConfig.arms[experimentArm];

  return {
    experimentId,
    experimentArm,
    resolvedVariants: resolveExperimentVariants(armConfig),
  };
}

function resolveExperimentArmName(
  experimentConfig: StorefrontExperimentConfig,
  assignedArm?: string | null
) {
  if (assignedArm && experimentConfig.arms[assignedArm]) {
    return assignedArm;
  }

  if (
    experimentConfig.defaultArm &&
    experimentConfig.arms[experimentConfig.defaultArm]
  ) {
    return experimentConfig.defaultArm;
  }

  if (experimentConfig.arms[DEFAULT_EXPERIMENT_ARM]) {
    return DEFAULT_EXPERIMENT_ARM;
  }

  return Object.keys(experimentConfig.arms)[0] ?? DEFAULT_EXPERIMENT_ARM;
}

function resolveExperimentVariants(
  armConfig?: StorefrontExperimentArm
): StorefrontExperimentVariants {
  return {
    heroVariant:
      armConfig?.heroVariant ?? DEFAULT_PRODUCT_EXPERIMENT_VARIANTS.heroVariant,
    reviewVariant:
      armConfig?.reviewVariant ?? DEFAULT_PRODUCT_EXPERIMENT_VARIANTS.reviewVariant,
    ctaVariant:
      armConfig?.ctaVariant ?? DEFAULT_PRODUCT_EXPERIMENT_VARIANTS.ctaVariant,
    trustVariant:
      armConfig?.trustVariant ?? DEFAULT_PRODUCT_EXPERIMENT_VARIANTS.trustVariant,
    galleryVariant:
      armConfig?.galleryVariant ?? DEFAULT_PRODUCT_EXPERIMENT_VARIANTS.galleryVariant,
    priceVariant:
      armConfig?.priceVariant ?? DEFAULT_PRODUCT_EXPERIMENT_VARIANTS.priceVariant,
  };
}
