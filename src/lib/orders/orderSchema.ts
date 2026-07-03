import { getProductProvider } from '../providers/productProviderFactory';
import type {
  StorefrontProductPage,
  StorefrontVariant,
} from '../../types/storefront';

const MOROCCAN_MOBILE_PHONE_PATTERN = /^(06|07)\d{8}$/;

export type OrderSubmissionInput = {
  productId: string;
  productSlug: string;
  productName: string;
  price: number;
  currency: string;
  variant?: string;
  quantity: number;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  experimentId: string;
  experimentArm: string;
  source?: string;
  submittedAt: string;
};

export type ValidatedOrderSubmission = OrderSubmissionInput & {
  variantName?: string;
};

export type OrderValidationResult =
  | {
      ok: true;
      order: ValidatedOrderSubmission;
      productPage: StorefrontProductPage;
      variant?: StorefrontVariant;
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

export async function validateOrderSubmission(
  input: unknown
): Promise<OrderValidationResult> {
  const payload = isRecord(input) ? input : {};
  const productSlug = readString(payload.productSlug);
  const productPage = productSlug
    ? await getProductProvider().getProductPageBySlug(productSlug)
    : undefined;
  const errors: Record<string, string> = {};

  const productId = readString(payload.productId);
  const productName = readString(payload.productName);
  const price = readNumber(payload.price);
  const currency = readString(payload.currency);
  const variantId = readOptionalString(payload.variant);
  const quantity = readNumber(payload.quantity);
  const customerName = readString(payload.customerName);
  const phone = normalizePhone(readString(payload.phone));
  const city = readString(payload.city);
  const address = readString(payload.address);
  const notes = readOptionalString(payload.notes);
  const experimentId = readString(payload.experimentId);
  const experimentArm = readString(payload.experimentArm);
  const source = readOptionalString(payload.source);
  const submittedAt = readString(payload.submittedAt);

  if (!productSlug) {
    errors.productSlug = 'Product slug is required.';
  } else if (!productPage) {
    errors.productSlug = 'Unknown product slug.';
  }

  if (!productId) {
    errors.productId = 'Product ID is required.';
  } else if (productPage && productId !== productPage.product.id) {
    errors.productId = 'Product ID does not match the product slug.';
  }

  if (!productName) {
    errors.productName = 'Product name is required.';
  } else if (productPage && productName !== productPage.product.name) {
    errors.productName = 'Product name does not match the product slug.';
  }

  if (price === undefined) {
    errors.price = 'Price is required.';
  }

  if (!currency) {
    errors.currency = 'Currency is required.';
  } else if (productPage && currency !== productPage.offer.price.currency) {
    errors.currency = 'Currency does not match the product configuration.';
  }

  let selectedVariant: StorefrontVariant | undefined;

  if (productPage && productPage.offer.variants.length > 0) {
    selectedVariant = productPage.offer.variants.find(
      (variant) => variant.id === variantId
    );

    if (!variantId) {
      errors.variant = 'Product variant is required.';
    } else if (!selectedVariant) {
      errors.variant = 'Unknown product variant.';
    }
  }

  const expectedPrice = selectedVariant?.price ?? productPage?.offer.price.amount;

  if (
    price !== undefined &&
    expectedPrice !== undefined &&
    price !== expectedPrice
  ) {
    errors.price = 'Price does not match the product configuration.';
  }

  if (!customerName) {
    errors.customerName = 'Customer name is required.';
  }

  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!MOROCCAN_MOBILE_PHONE_PATTERN.test(phone)) {
    errors.phone = 'Phone number must be a valid Moroccan mobile number.';
  }

  if (!city) {
    errors.city = 'City is required.';
  } else if (
    productPage &&
    !productPage.market.deliveryCities.includes(city)
  ) {
    errors.city = 'City is not available for this product.';
  }

  if (!address) {
    errors.address = 'Address is required.';
  }

  if (quantity === undefined) {
    errors.quantity = 'Quantity is required.';
  } else if (!Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  }

  if (!experimentId) {
    errors.experimentId = 'Experiment ID is required.';
  }

  if (!experimentArm) {
    errors.experimentArm = 'Experiment arm is required.';
  }

  if (!submittedAt) {
    errors.submittedAt = 'Submitted timestamp is required.';
  } else if (Number.isNaN(Date.parse(submittedAt))) {
    errors.submittedAt = 'Submitted timestamp must be a valid date.';
  }

  if (Object.keys(errors).length > 0 || !productPage) {
    return {
      ok: false,
      errors,
    };
  }

  return {
    ok: true,
    productPage,
    variant: selectedVariant,
    order: {
      productId,
      productSlug,
      productName,
      price: expectedPrice ?? price ?? productPage.offer.price.amount,
      currency,
      variant: variantId,
      variantName: selectedVariant?.name,
      quantity: quantity ?? 1,
      customerName,
      phone,
      city,
      address,
      notes,
      experimentId,
      experimentArm,
      source,
      submittedAt,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalString(value: unknown) {
  const text = readString(value);
  return text || undefined;
}

function readNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, '');
}
