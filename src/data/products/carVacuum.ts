import type { ProductData } from '../../types/product';

const moroccanCities = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fes',
  'Meknes',
  'Tangier',
  'Agadir',
  'Oujda',
  'Kenitra',
  'Tetouan',
  'El Jadida',
  'Safi',
];

export const carVacuum: ProductData = {
  id: 'CV-001',
  name: 'Cordless Car Vacuum Cleaner',
  slug: 'cordless-car-vacuum-cleaner',
  price: {
    amount: 399,
    currency: 'MAD',
  },
  brand: 'Wasilio',
  availability: 'https://schema.org/InStock',
  condition: 'https://schema.org/NewCondition',
  priceValidUntil: '2026-12-31',
  aggregateRating: {
    ratingValue: 4.8,
    reviewCount: 3,
    bestRating: 5,
    worstRating: 1,
  },
  hero: {
    headline: 'Keep Your Car Clean Without the Car Wash Run.',
    subheadline:
      'A compact cordless vacuum for drivers who want quick dust, sand, and crumb cleanup at home, work, or on the road.',
    cta: 'Order Now',
    secondaryCta: 'Cash on Delivery | Fast Shipping',
  },
  gallery: {
    mainImage: '/images/car-vacuum-main.svg',
    images: [
      '/images/car-vacuum-1.svg',
      '/images/car-vacuum-2.svg',
      '/images/car-vacuum-lifestyle-1.svg',
      '/images/car-vacuum-lifestyle-2.svg',
    ],
  },
  benefits: {
    title: 'Clean Seats, Mats, and Corners in Minutes',
    description:
      'Built for everyday car owners who need fast, practical cleaning between full washes.',
    list: [
      'Remove crumbs, dust, and sand before they build up in the cabin.',
      'Clean tight spaces around seats, cup holders, and dashboard corners.',
      'Keep a cordless cleaner in the trunk without carrying bulky equipment.',
      'Empty and rinse the filter quickly after routine use.',
    ],
  },
  features: {
    title: 'Made for Everyday Car Cleanup',
    list: [
      {
        icon: 'battery',
        title: 'Cordless Rechargeable Power',
        customerBenefit: 'Clean Anywhere',
        description:
          'Use it in the parking lot, garage, or street without connecting to the car outlet.',
      },
      {
        icon: 'filter',
        title: 'Washable HEPA-Style Filter',
        customerBenefit: 'Lower Maintenance Cost',
        description:
          'The reusable filter helps trap fine dust and can be rinsed after heavy cleaning sessions.',
      },
      {
        icon: 'gauge',
        title: 'Strong Compact Suction',
        customerBenefit: 'Handles Daily Mess',
        description:
          'Designed for common car mess like crumbs, dust, pet hair, and dry sand.',
      },
      {
        icon: 'car',
        title: 'Car-Friendly Attachments',
        customerBenefit: 'Reach Awkward Corners',
        description:
          'Slim nozzles help clean seat rails, door pockets, vents, and small gaps.',
      },
    ],
  },
  problemSolution: {
    title: 'A Cleaner Cabin Without Planning a Full Wash',
    problemLabel: 'The Problem',
    problem:
      'Car interiors collect dust, sand, snack crumbs, and small debris every week. Full car washes take time, and ordinary home vacuums are too large or inconvenient for quick cabin cleaning.',
    solutionLabel: 'The Solution',
    solution:
      'The Cordless Car Vacuum Cleaner gives drivers a fast, portable way to clean the interior whenever mess appears. It stores easily, reaches tight spaces, and keeps the car feeling fresh between professional washes.',
  },
  comparison: {
    title: 'Quick Car Cleanup vs. Ordinary Options',
    columns: {
      feature: 'Feature',
      ordinary: 'Basic Cleaning Tools',
      premium: 'This Product',
    },
    points: [
      {
        feature: 'Cabin Dust and Crumbs',
        ordinary: 'Brushes push dirt around',
        premium: 'Direct suction pickup',
      },
      {
        feature: 'Seat Rail Access',
        ordinary: 'Hard to reach',
        premium: 'Slim attachment included',
      },
      {
        feature: 'Portability',
        ordinary: 'Bulky home vacuum',
        premium: 'Compact cordless design',
      },
      {
        feature: 'Filter Care',
        ordinary: 'Disposable or difficult',
        premium: 'Washable filter',
      },
      {
        feature: 'Routine Cleaning',
        ordinary: 'Requires planning',
        premium: 'Ready for quick use',
      },
    ],
  },
  socialProof: {
    title: 'Trusted by Drivers Across Morocco',
    reviews: [
      {
        id: '1',
        name: 'Karim B.',
        city: 'Casablanca',
        rating: 5,
        testimonial:
          'Very practical for cleaning after my kids eat in the car. The small nozzle reaches under the seats well.',
        timestamp: '1 week ago',
      },
      {
        id: '2',
        name: 'Salma R.',
        city: 'Rabat',
        rating: 5,
        testimonial:
          'I keep it in the trunk and use it after beach trips. It handles dry sand much better than a brush.',
        timestamp: '2 weeks ago',
      },
      {
        id: '3',
        name: 'Mehdi T.',
        city: 'Tangier',
        rating: 4,
        testimonial:
          'Good suction for daily cleaning and easy to empty. The plus kit attachments are useful.',
        timestamp: '1 month ago',
      },
    ],
  },
  trust: {
    title: 'Simple Ordering, Reliable Delivery',
    items: [
      { icon: 'cod', text: 'Cash on Delivery' },
      { icon: 'shipping', text: 'Fast Shipping in Morocco' },
      { icon: 'return', text: 'Easy Return Policy' },
      { icon: 'support', text: 'WhatsApp Customer Support' },
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'How long does delivery take?',
        answer: 'Delivery usually takes 1-3 business days, depending on your city.',
      },
      {
        question: 'Can I pay when it arrives?',
        answer: 'Yes, this product is available with cash on delivery across supported Moroccan cities.',
      },
      {
        question: 'Is the filter washable?',
        answer:
          'Yes. Remove the dust container, take out the filter, rinse it gently, and let it dry fully before reuse.',
      },
      {
        question: 'Does it work for wet spills?',
        answer:
          'This configuration is intended for dry debris like dust, crumbs, pet hair, and sand. It should not be used for liquid spills.',
      },
      {
        question: 'What is included in the plus kit?',
        answer:
          'The plus kit includes the cordless vacuum, charging cable, washable filter, brush nozzle, and extra slim nozzle attachments.',
      },
    ],
  },
  variants: [
    {
      id: 'car-vacuum-standard-kit',
      name: 'Standard Kit',
      price: 399,
      stock: 45,
    },
    {
      id: 'car-vacuum-plus-kit',
      name: 'Plus Kit with Extra Nozzles',
      price: 449,
      stock: 28,
    },
  ],
  orderForm: {
    sectionId: 'order-form',
    title: 'Complete Your Order',
    fields: {
      fullName: {
        label: 'Full Name',
        requiredMessage: 'Full name is required.',
      },
      phone: {
        label: 'Phone Number',
        requiredMessage: 'Phone number is required.',
        invalidMessage: 'Please enter a valid Moroccan phone number (e.g., 0612345678).',
        pattern: '^(06|07)\\d{8}$',
      },
      city: {
        label: 'City',
        placeholder: 'Select your city',
        requiredMessage: 'City is required.',
        options: moroccanCities,
      },
      address: {
        label: 'Full Address',
        requiredMessage: 'Address is required.',
      },
      variant: {
        label: 'Kit Option',
        placeholder: 'Choose your kit',
        requiredMessage: 'Please choose a kit option.',
      },
      quantity: {
        label: 'Quantity',
        requiredMessage: 'Quantity is required.',
        minMessage: 'Quantity must be at least 1.',
        min: 1,
      },
    },
    submitCta: 'Confirm Order',
    submittingCta: 'Confirming...',
    confirmation: {
      title: 'Thank You!',
      message:
        'Your order has been received. Our team will contact you shortly to confirm the details.',
    },
  },
  seo: {
    canonicalUrl: 'https://yourdomain.com/products/cordless-car-vacuum-cleaner',
    seoTitle: 'Cordless Car Vacuum Cleaner - Cash on Delivery in Morocco',
    seoDescription:
      'Order a compact cordless car vacuum cleaner for dust, crumbs, sand, and tight car corners. Cash on delivery and fast shipping in Morocco.',
    ogTitle: 'Cordless Car Vacuum Cleaner for Moroccan Drivers',
    ogDescription:
      'Keep your car interior clean between washes with a portable cordless vacuum. Order with cash on delivery.',
    ogImage: '/images/car-vacuum-main.svg',
    twitterTitle: 'Cordless Car Vacuum Cleaner',
    twitterDescription:
      'Portable car interior cleaning for dust, crumbs, and sand. Cash on delivery in Morocco.',
    twitterImage: '/images/car-vacuum-main.svg',
    keywords: [
      'car vacuum cleaner Morocco',
      'cordless car vacuum',
      'portable vacuum cleaner',
      'car accessories Morocco',
      'cash on delivery',
    ],
    robots: {
      index: true,
      follow: true,
    },
  },
  experiments: {
    experimentId: 'cordless-car-vacuum-layout-v1',
    defaultArm: 'control',
    arms: {
      control: {
        weight: 50,
        heroVariant: 'standard',
        reviewVariant: 'cards',
        ctaVariant: 'primary',
        trustVariant: 'panel',
        galleryVariant: 'side-thumbnails',
        priceVariant: 'inline',
      },
      variant_a: {
        weight: 25,
        heroVariant: 'compact',
        reviewVariant: 'compact',
        ctaVariant: 'high-contrast',
        trustVariant: 'inline',
        galleryVariant: 'bottom-thumbnails',
        priceVariant: 'badge',
      },
      variant_b: {
        weight: 25,
        heroVariant: 'compact',
        reviewVariant: 'cards',
        ctaVariant: 'primary',
        trustVariant: 'inline',
        galleryVariant: 'bottom-thumbnails',
        priceVariant: 'inline',
      },
    },
  },
  analytics: {},
};
