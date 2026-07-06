import type { StorefrontProductPage } from '../../types/storefront';

export function getProductPresentation(productPage: StorefrontProductPage) {
  return {
    showBenefits:
      productPage.sections.benefits.list.length > 0 &&
      !hasGeneratedFallbackBenefits(productPage),
    showFeatures:
      productPage.sections.features.list.length > 0 &&
      !hasGeneratedFallbackFeatures(productPage),
    showProblemSolution:
      Boolean(productPage.sections.problemSolution.title) &&
      !hasGeneratedFallbackProblemSolution(productPage),
    showComparison:
      productPage.sections.comparison.points.length > 0 &&
      !hasGeneratedFallbackComparison(productPage),
    showSocialProof: productPage.sections.socialProof.reviews.length > 0,
    showFAQ: productPage.sections.faq.items.length > 0,
    showGallery: getUniqueGalleryImageCount(productPage) > 1,
    supportText: productPage.sections.trust.items.find(
      (item) => item.icon === 'support'
    )?.text,
  };
}

export function prepareProductPageForDisplay(
  productPage: StorefrontProductPage
): StorefrontProductPage {
  const presentation = getProductPresentation(productPage);

  return {
    ...productPage,
    sections: {
      ...productPage.sections,
      benefits: presentation.showBenefits
        ? productPage.sections.benefits
        : {
            title: '',
            description: '',
            list: [],
          },
      features: presentation.showFeatures
        ? productPage.sections.features
        : {
            title: '',
            list: [],
          },
      problemSolution: presentation.showProblemSolution
        ? productPage.sections.problemSolution
        : {
            title: '',
            problemLabel: '',
            problem: '',
            solutionLabel: '',
            solution: '',
          },
      comparison: presentation.showComparison
        ? productPage.sections.comparison
        : {
            title: '',
            columns: {
              feature: '',
              ordinary: '',
              premium: '',
            },
            points: [],
          },
      socialProof: presentation.showSocialProof
        ? productPage.sections.socialProof
        : {
            title: '',
            reviews: [],
          },
      faq: presentation.showFAQ
        ? productPage.sections.faq
        : {
            title: '',
            items: [],
          },
    },
  };
}

function hasGeneratedFallbackBenefits(productPage: StorefrontProductPage) {
  const { benefits } = productPage.sections;

  return (
    benefits.list.length === 3 &&
    benefits.title === `Why choose ${productPage.product.name}` &&
    benefits.list.includes(
      'Order online and pay only when the product arrives.'
    ) &&
    benefits.list.includes('Get a clear confirmation call before delivery.') &&
    benefits.list.includes(
      'Receive support from the store if you need help with your order.'
    )
    );
}

function getUniqueGalleryImageCount(productPage: StorefrontProductPage) {
  return [productPage.media.mainImage, ...productPage.media.images].filter(
    (image, index, allImages) => allImages.indexOf(image) === index
  ).length;
}

function hasGeneratedFallbackFeatures(productPage: StorefrontProductPage) {
  const features = productPage.sections.features.list;

  return (
    features.length === 1 &&
    features[0]?.icon === 'package' &&
    features[0]?.title === productPage.product.name &&
    features[0]?.customerBenefit === 'Ready for everyday use'
  );
}

function hasGeneratedFallbackProblemSolution(
  productPage: StorefrontProductPage
) {
  const { problemSolution } = productPage.sections;

  return (
    problemSolution.title ===
      `A simpler way to order ${productPage.product.name}` &&
    problemSolution.problemLabel === 'The Need' &&
    problemSolution.solutionLabel === 'The Solution'
  );
}

function hasGeneratedFallbackComparison(productPage: StorefrontProductPage) {
  const { comparison } = productPage.sections;

  return (
    comparison.title === 'What You Get' &&
    comparison.points.length === 2 &&
    comparison.points[0]?.feature === 'Ordering' &&
    comparison.points[1]?.feature === 'Payment'
  );
}
