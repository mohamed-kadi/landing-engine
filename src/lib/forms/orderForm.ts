import type {
  StorefrontOrderFormConfig,
  StorefrontVariant,
} from '../../types/storefront';

export type OrderFormValues = {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  variantId: string;
  quantity: string;
  notes: string;
};

export type OrderFormField = keyof OrderFormValues;
export type OrderFormErrors = Partial<Record<OrderFormField, string>>;
export type OrderFormTouched = Partial<Record<OrderFormField, boolean>>;

export type OrderFormSubmission = Omit<OrderFormValues, 'quantity'> & {
  quantity: number;
};

export function createInitialOrderFormValues(
  orderFormData: StorefrontOrderFormConfig
): OrderFormValues {
  return {
    fullName: '',
    phone: '',
    city: '',
    address: '',
    variantId: '',
    quantity: String(orderFormData.fields.quantity.min),
    notes: '',
  };
}

export function validateOrderForm(
  values: OrderFormValues,
  variants: StorefrontVariant[],
  orderFormData: StorefrontOrderFormConfig
): OrderFormErrors {
  const { fields } = orderFormData;
  const errors: OrderFormErrors = {};
  const phone = values.phone.trim();
  const quantity = values.quantity.trim();
  const quantityNumber = Number(quantity);
  const phonePattern = new RegExp(fields.phone.pattern);

  if (!values.fullName.trim()) {
    errors.fullName = fields.fullName.requiredMessage;
  }

  if (!phone) {
    errors.phone = fields.phone.requiredMessage;
  } else if (!phonePattern.test(phone)) {
    errors.phone = fields.phone.invalidMessage;
  }

  if (!values.city.trim() || !fields.city.options.includes(values.city)) {
    errors.city = fields.city.requiredMessage;
  }

  if (!values.address.trim()) {
    errors.address = fields.address.requiredMessage;
  }

  if (variants.length > 0 && !variants.some((variant) => variant.id === values.variantId)) {
    errors.variantId = fields.variant.requiredMessage;
  }

  if (!quantity) {
    errors.quantity = fields.quantity.requiredMessage;
  } else if (!Number.isFinite(quantityNumber) || quantityNumber < fields.quantity.min) {
    errors.quantity = fields.quantity.minMessage;
  }

  return errors;
}

export function normalizeOrderFormSubmission(values: OrderFormValues): OrderFormSubmission {
  return {
    ...values,
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    city: values.city.trim(),
    address: values.address.trim(),
    variantId: values.variantId.trim(),
    notes: values.notes.trim(),
    quantity: Number(values.quantity),
  };
}
