import type { StorefrontExperimentConfig } from '../../types/storefront';

const STORAGE_PREFIX = 'landing-engine:experiment';

export function assignExperiment(
  experimentConfig?: StorefrontExperimentConfig
): string | null {
  if (typeof window === 'undefined' || !experimentConfig) {
    return null;
  }

  const storageKey = getExperimentStorageKey(experimentConfig.experimentId);

  try {
    const storedArm = window.localStorage.getItem(storageKey);

    if (storedArm && experimentConfig.arms[storedArm]) {
      return storedArm;
    }

    const assignedArm = chooseWeightedArm(experimentConfig);

    if (!assignedArm) {
      return null;
    }

    window.localStorage.setItem(storageKey, assignedArm);
    return assignedArm;
  } catch {
    return getFallbackArm(experimentConfig);
  }
}

function getExperimentStorageKey(experimentId: string) {
  return `${STORAGE_PREFIX}:${experimentId}`;
}

function chooseWeightedArm(experimentConfig: StorefrontExperimentConfig) {
  const eligibleArms = Object.entries(experimentConfig.arms)
    .map(([name, arm]) => ({
      name,
      weight: normalizeWeight(arm.weight),
    }))
    .filter((arm) => arm.weight > 0);

  if (eligibleArms.length === 0) {
    return getFallbackArm(experimentConfig);
  }

  const totalWeight = eligibleArms.reduce((total, arm) => total + arm.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const arm of eligibleArms) {
    cursor -= arm.weight;

    if (cursor <= 0) {
      return arm.name;
    }
  }

  return (
    eligibleArms[eligibleArms.length - 1]?.name ??
    getFallbackArm(experimentConfig)
  );
}

function normalizeWeight(weight?: number) {
  if (typeof weight !== 'number' || !Number.isFinite(weight)) {
    return 1;
  }

  return Math.max(0, weight);
}

function getFallbackArm(experimentConfig: StorefrontExperimentConfig) {
  if (
    experimentConfig.defaultArm &&
    experimentConfig.arms[experimentConfig.defaultArm]
  ) {
    return experimentConfig.defaultArm;
  }

  if (experimentConfig.arms.control) {
    return 'control';
  }

  return Object.keys(experimentConfig.arms)[0] ?? null;
}
