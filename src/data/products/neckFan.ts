import type { ProductData } from "../../types/product";

const moroccanCities = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fes",
  "Meknes",
  "Tangier",
  "Agadir",
  "Oujda",
  "Kenitra",
  "Tetouan",
];

export const neckFan: ProductData = {
  id: "WNF-001",
  name: "Wearable Neck Fan",
  slug: "wearable-neck-fan",
  price: {
    amount: 299,
    currency: "MAD",
  },
  brand: "Wasilio",
  availability: "https://schema.org/InStock",
  condition: "https://schema.org/NewCondition",
  priceValidUntil: "2026-12-31",
  aggregateRating: {
    ratingValue: 4.7,
    reviewCount: 3,
    bestRating: 5,
    worstRating: 1,
  },
  hero: {
    headline: "Stay Cool, Hands-Free, Anywhere You Go.",
    subheadline: "The revolutionary bladeless fan for active Moroccans who value comfort and style.",
    cta: "Order Now",
    secondaryCta: "Cash on Delivery | Fast Shipping",
  },
  gallery: {
    mainImage: "/images/neck-fan-main.jpg",
    images: [
      "/images/neck-fan-1.jpg",
      "/images/neck-fan-2.jpg",
      "/images/neck-fan-lifestyle-1.jpg",
      "/images/neck-fan-lifestyle-2.jpg",
    ],
    video: "https://www.youtube.com/watch?v=example",
  },
  benefits: {
    title: "Experience a New Level of Comfort",
    description: "Tired of the heat slowing you down? Here’s how the wearable neck fan changes everything:",
    list: [
      "Enjoy hours of cooling relief without searching for a power outlet.",
      "Stay safe with a design that won't catch your hair or clothes.",
      "Feel the breeze, not the noise. Perfect for work, study, or relaxation.",
      "Look good while staying cool with a sleek, modern design.",
    ],
  },
  features: {
    title: "Designed for Your Lifestyle",
    list: [
      {
        icon: "battery",
        title: "Long-Lasting Battery",
        customerBenefit: "Hours of Uninterrupted Cooling",
        description: "A powerful battery ensures you stay cool all day long on a single charge.",
      },
      {
        icon: "wind",
        title: "Bladeless & Safe",
        customerBenefit: "Worry-Free Comfort",
        description: "The bladeless design is safe for everyone, including children and pets.",
      },
      {
        icon: "volume-off",
        title: "Whisper-Quiet Motor",
        customerBenefit: "Focus on What Matters",
        description: "Enjoy a powerful breeze without the distracting noise of traditional fans.",
      },
      {
        icon: "feather",
        title: "Lightweight Design",
        customerBenefit: "Wear it All Day",
        description: "So light and comfortable, you'll forget you're even wearing it.",
      },
    ],
  },
  problemSolution: {
    title: "The End of Uncomfortable, Sweaty Days",
    problemLabel: "The Problem",
    problem: "Traditional fans are clumsy. Handheld fans occupy your hands. Air conditioning is expensive and not portable. The summer heat in Morocco can be draining, making work and daily activities a struggle.",
    solutionLabel: "The Solution",
    solution: "Our Wearable Neck Fan offers a personal cooling solution that is hands-free, portable, and stylish. It rests comfortably on your neck, directing a smooth, quiet breeze exactly where you need it, allowing you to reclaim your comfort and productivity.",
  },
  comparison: {
    title: "The Modern Solution vs. Old Alternatives",
    columns: {
      feature: "Feature",
      ordinary: "Ordinary Alternatives",
      premium: "This Product",
    },
    points: [
      { feature: "Portability", ordinary: "Clumsy / None", premium: "Hands-Free & Wearable" },
      { feature: "Safety", ordinary: "Exposed Blades", premium: "Safe Bladeless Design" },
      { feature: "Convenience", ordinary: "Occupies Hands", premium: "Completely Hands-Free" },
      { feature: "Noise", ordinary: "Loud & Distracting", premium: "Whisper-Quiet" },
      { feature: "Style", ordinary: "Bulky & Unattractive", premium: "Sleek & Modern" },
    ],
  },
  socialProof: {
    title: "Loved by Customers Across Morocco",
    reviews: [
      { id: "1", name: "Fatima Z.", city: "Casablanca", rating: 5, testimonial: "A lifesaver during my commute! I arrive at work fresh and cool. Highly recommended!", timestamp: "2 weeks ago" },
      { id: "2", name: "Youssef A.", city: "Marrakech", rating: 5, testimonial: "I use it at the gym and outdoors. It's lightweight and the battery lasts forever. Excellent product.", timestamp: "3 weeks ago" },
      { id: "3", name: "Amina K.", city: "Rabat", rating: 4, testimonial: "Very good fan, quiet and effective. I just wish it came in more colors. But the white is very clean.", timestamp: "1 month ago" },
    ],
  },
  trust: {
    title: "Your Satisfaction is Our Priority",
    items: [
      { icon: "cod", text: "Cash on Delivery" },
      { icon: "shipping", text: "Fast Shipping in Morocco" },
      { icon: "return", text: "Easy Return Policy" },
      { icon: "support", text: "WhatsApp Customer Support" },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { question: "How long does delivery take?", answer: "Delivery usually takes 1-3 business days, depending on your city." },
      { question: "Is it really cash on delivery?", answer: "Yes, you only pay when the delivery agent brings the product to your door." },
      { question: "What if I don't like it?", answer: "We offer a 7-day return policy. If you're not satisfied, contact our support on WhatsApp to arrange a return." },
      { question: "Does it have a warranty?", answer: "Yes, the product comes with a 6-month warranty against manufacturing defects." },
      { question: "How do I use it?", answer: "Simply charge it with the included USB cable, place it on your neck, and press the power button to cycle through the fan speeds." },
    ],
  },
  variants: [
    { id: "variant-white", name: "White", price: 299, stock: 50 },
    { id: "variant-black", name: "Black", price: 299, stock: 35 },
  ],
  orderForm: {
    sectionId: "order-form",
    title: "Complete Your Order",
    fields: {
      fullName: {
        label: "Full Name",
        requiredMessage: "Full name is required.",
      },
      phone: {
        label: "Phone Number",
        requiredMessage: "Phone number is required.",
        invalidMessage: "Please enter a valid Moroccan phone number (e.g., 0612345678).",
        pattern: "^(06|07)\\d{8}$",
      },
      city: {
        label: "City",
        placeholder: "Select your city",
        requiredMessage: "City is required.",
        options: moroccanCities,
      },
      address: {
        label: "Full Address",
        requiredMessage: "Address is required.",
      },
      variant: {
        label: "Variant",
        placeholder: "Choose a color",
        requiredMessage: "Please choose a product variant.",
      },
      quantity: {
        label: "Quantity",
        requiredMessage: "Quantity is required.",
        minMessage: "Quantity must be at least 1.",
        min: 1,
      },
    },
    submitCta: "Confirm Order",
    submittingCta: "Confirming...",
    confirmation: {
      title: "Thank You!",
      message: "Your order has been received. Our team will contact you shortly to confirm the details.",
    },
  },
  seo: {
    canonicalUrl: "https://yourdomain.com/products/wearable-neck-fan",
    seoTitle: "Premium Wearable Neck Fan - Hands-Free Cooling in Morocco",
    seoDescription: "Stay cool anywhere with the revolutionary bladeless wearable neck fan. Hands-free, quiet, and stylish. Order now with cash on delivery in Morocco.",
    ogTitle: "Premium Wearable Neck Fan for Morocco",
    ogDescription: "Order a bladeless wearable neck fan with cash on delivery and fast shipping across Morocco.",
    ogImage: "/images/neck-fan-main.jpg",
    twitterTitle: "Premium Wearable Neck Fan",
    twitterDescription: "Hands-free cooling for hot Moroccan days. Order with cash on delivery.",
    twitterImage: "/images/neck-fan-main.jpg",
    keywords: [
      "wearable neck fan",
      "neck fan Morocco",
      "portable fan",
      "bladeless fan",
      "cash on delivery",
    ],
    robots: {
      index: true,
      follow: true,
    },
  },
  experiments: {
    experimentId: "wearable-neck-fan-layout-v1",
    defaultArm: "control",
    arms: {
      control: {
        weight: 50,
        heroVariant: "standard",
        reviewVariant: "cards",
        ctaVariant: "primary",
        trustVariant: "panel",
        galleryVariant: "side-thumbnails",
        priceVariant: "inline",
      },
      variant_a: {
        weight: 25,
        heroVariant: "compact",
        reviewVariant: "compact",
        ctaVariant: "high-contrast",
        trustVariant: "inline",
        galleryVariant: "bottom-thumbnails",
        priceVariant: "badge",
      },
      variant_b: {
        weight: 25,
        heroVariant: "standard",
        reviewVariant: "cards",
        ctaVariant: "high-contrast",
        trustVariant: "panel",
        galleryVariant: "side-thumbnails",
        priceVariant: "badge",
      },
    },
  },
  analytics: {
    metaPixelId: "YOUR_META_PIXEL_ID",
    googleAnalyticsId: "YOUR_GA_ID",
    googleAdsId: "YOUR_GADS_ID",
    tiktokPixelId: "YOUR_TIKTOK_PIXEL_ID",
  },
};
