'use client';

import { CheckCircle2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { ANALYTICS_EVENTS } from '../../lib/analytics/events';
import { trackEvent } from '../../lib/analytics/track';
import type { AnalyticsEventPayload, ProductAnalyticsContext } from '../../lib/analytics/types';
import { getOrderCaptureAdapter } from '../../lib/orders/orderCaptureAdapterFactory';
import {
  createInitialOrderFormValues,
  normalizeOrderFormSubmission,
  validateOrderForm,
  type OrderFormErrors,
  type OrderFormField,
  type OrderFormTouched,
  type OrderFormValues,
} from '../../lib/forms/orderForm';
import type {
  StorefrontOrderFormConfig,
  StorefrontVariant,
} from '../../types/storefront';

type OrderFormSectionProps = {
  variants: StorefrontVariant[];
  orderFormData: StorefrontOrderFormConfig;
  analyticsContext: ProductAnalyticsContext;
};

export function OrderFormSection({ variants, orderFormData, analyticsContext }: OrderFormSectionProps) {
  const { fields } = orderFormData;
  const hasVariants = variants.length > 0;
  const [formData, setFormData] = useState<OrderFormValues>(() => createInitialOrderFormValues(orderFormData));
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [touched, setTouched] = useState<OrderFormTouched>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const validateValues = (values: OrderFormValues) => {
    const nextErrors = validateOrderForm(values, variants, orderFormData);
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleFieldChange = (field: OrderFormField, value: string) => {
    const nextFormData = { ...formData, [field]: value };
    setFormData(nextFormData);
    setSubmitError(undefined);

    if (touched[field] || submitAttempted) {
      setErrors(validateOrderForm(nextFormData, variants, orderFormData));
    }
  };

  const handleFieldBlur = (field: OrderFormField) => {
    setTouched((currentTouched) => ({ ...currentTouched, [field]: true }));
    validateValues(formData);
  };

  const getFieldError = (field: OrderFormField) => {
    if (!touched[field] && !submitAttempted) {
      return undefined;
    }

    return errors[field];
  };

  const getOrderAnalyticsPayload = (values: OrderFormValues): AnalyticsEventPayload => {
    const selectedVariant = variants.find((variant) => variant.id === values.variantId);
    const quantity = Number(values.quantity);

    return {
      ...analyticsContext,
      price: selectedVariant?.price || analyticsContext.price,
      variant: selectedVariant?.name || values.variantId || undefined,
      quantity: Number.isFinite(quantity) ? quantity : undefined,
      city: values.city || undefined,
      source: 'order_form',
      section: orderFormData.sectionId,
    };
  };

  const handleFormStart = () => {
    if (formStarted) {
      return;
    }

    setFormStarted(true);
    trackEvent(ANALYTICS_EVENTS.FORM_START, getOrderAnalyticsPayload(formData));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(undefined);
    setSubmitAttempted(true);
    setTouched({
      fullName: true,
      phone: true,
      city: true,
      address: true,
      variantId: hasVariants,
      quantity: true,
    });

    const submitPayload = getOrderAnalyticsPayload(formData);
    trackEvent(ANALYTICS_EVENTS.FORM_SUBMIT_ATTEMPT, submitPayload);

    const nextErrors = validateValues(formData);

    if (Object.keys(nextErrors).length > 0) {
      const errorFields = Object.keys(nextErrors);
      trackEvent(ANALYTICS_EVENTS.FORM_SUBMIT_ERROR, {
        ...submitPayload,
        errorFields,
        errorCount: errorFields.length,
      });
      return;
    }

    const submission = normalizeOrderFormSubmission(formData);
    const selectedVariant = variants.find((variant) => variant.id === submission.variantId);
    const successPayload = {
      ...submitPayload,
      price: selectedVariant?.price || analyticsContext.price,
      variant: selectedVariant?.name || submission.variantId || undefined,
      quantity: submission.quantity,
      city: submission.city,
    };
    const orderPayload = {
      productId: analyticsContext.productId,
      productSlug: analyticsContext.productSlug,
      productName: analyticsContext.productName,
      price: selectedVariant?.price || analyticsContext.price,
      currency: analyticsContext.currency,
      variant: selectedVariant?.id || submission.variantId || undefined,
      quantity: submission.quantity,
      customerName: submission.fullName,
      phone: submission.phone,
      city: submission.city,
      address: submission.address,
      notes: submission.notes,
      experimentId: analyticsContext.experimentId,
      experimentArm: analyticsContext.experimentArm,
      source: 'order_form',
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const result = await getOrderCaptureAdapter().submitOrderIntent(orderPayload);

      if (!result.ok) {
        const errorCount = Object.keys(result.errors ?? {}).length || 1;

        trackEvent(ANALYTICS_EVENTS.FORM_SUBMIT_ERROR, {
          ...submitPayload,
          errorFields: ['api'],
          errorCount,
          errorMessage: result.message,
        });

        setSubmitError('We could not submit your order. Please check your details and try again.');
        return;
      }

      trackEvent(ANALYTICS_EVENTS.LEAD, successPayload);
      trackEvent(ANALYTICS_EVENTS.ORDER_SUBMITTED, successPayload);
      setSubmitted(true);
    } catch {
      trackEvent(ANALYTICS_EVENTS.FORM_SUBMIT_ERROR, {
        ...submitPayload,
        errorFields: ['network'],
        errorCount: 1,
        errorMessage: 'Order API request failed.',
      });

      setSubmitError('We could not submit your order. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id={orderFormData.sectionId} className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
        <Container className="text-center">
          <div className="mx-auto max-w-2xl rounded-lg border border-emerald-200 bg-white p-8 shadow-sm sm:p-10">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
            <h2 className="mt-5 text-3xl font-bold text-zinc-950 sm:text-4xl">{orderFormData.confirmation.title}</h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              {orderFormData.confirmation.message}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const fullNameError = getFieldError('fullName');
  const phoneError = getFieldError('phone');
  const cityError = getFieldError('city');
  const addressError = getFieldError('address');
  const variantError = getFieldError('variantId');
  const quantityError = getFieldError('quantity');
  const fieldClassName = 'mt-2 block w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 sm:text-sm';
  const labelClassName = 'block text-sm font-semibold text-zinc-800';
  const errorClassName = 'mt-2 text-sm font-medium text-red-600';

  return (
    <section id={orderFormData.sectionId} className="bg-zinc-50 py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">{analyticsContext.productName}</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">
              {orderFormData.title}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            onFocus={handleFormStart}
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-lg shadow-zinc-900/5 sm:p-6 lg:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClassName}>{fields.fullName.label}</label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  onBlur={() => handleFieldBlur('fullName')}
                  autoComplete="name"
                  aria-invalid={Boolean(fullNameError)}
                  aria-describedby={fullNameError ? 'fullName-error' : undefined}
                  className={fieldClassName}
                />
                {fullNameError && <p id="fullName-error" className={errorClassName}>{fullNameError}</p>}
              </div>
              <div>
                <label htmlFor="phone" className={labelClassName}>{fields.phone.label}</label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  onBlur={() => handleFieldBlur('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? 'phone-error' : undefined}
                  className={fieldClassName}
                />
                {phoneError && <p id="phone-error" className={errorClassName}>{phoneError}</p>}
              </div>
              <div>
                <label htmlFor="city" className={labelClassName}>{fields.city.label}</label>
                <select
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  onBlur={() => handleFieldBlur('city')}
                  aria-invalid={Boolean(cityError)}
                  aria-describedby={cityError ? 'city-error' : undefined}
                  className={fieldClassName}
                >
                  <option value="">{fields.city.placeholder}</option>
                  {fields.city.options.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                {cityError && <p id="city-error" className={errorClassName}>{cityError}</p>}
              </div>
              {hasVariants && (
                <div>
                  <label htmlFor="variantId" className={labelClassName}>{fields.variant.label}</label>
                  <select
                    id="variantId"
                    value={formData.variantId}
                    onChange={(e) => handleFieldChange('variantId', e.target.value)}
                    onBlur={() => handleFieldBlur('variantId')}
                    aria-invalid={Boolean(variantError)}
                    aria-describedby={variantError ? 'variantId-error' : undefined}
                    className={fieldClassName}
                  >
                    <option value="">{fields.variant.placeholder}</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>{variant.name}</option>
                    ))}
                  </select>
                  {variantError && <p id="variantId-error" className={errorClassName}>{variantError}</p>}
                </div>
              )}
              <div>
                <label htmlFor="quantity" className={labelClassName}>{fields.quantity.label}</label>
                <input
                  type="number"
                  id="quantity"
                  min={fields.quantity.min}
                  step={1}
                  inputMode="numeric"
                  value={formData.quantity}
                  onChange={(e) => handleFieldChange('quantity', e.target.value)}
                  onBlur={() => handleFieldBlur('quantity')}
                  aria-invalid={Boolean(quantityError)}
                  aria-describedby={quantityError ? 'quantity-error' : undefined}
                  className={fieldClassName}
                />
                {quantityError && <p id="quantity-error" className={errorClassName}>{quantityError}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className={labelClassName}>{fields.address.label}</label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  onBlur={() => handleFieldBlur('address')}
                  autoComplete="street-address"
                  aria-invalid={Boolean(addressError)}
                  aria-describedby={addressError ? 'address-error' : undefined}
                  rows={3}
                  className={fieldClassName}
                />
                {addressError && <p id="address-error" className={errorClassName}>{addressError}</p>}
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-6 w-full shadow-lg shadow-emerald-900/10" disabled={isSubmitting}>
              {isSubmitting ? orderFormData.submittingCta : orderFormData.submitCta}
            </Button>
            {submitError && (
              <p className="mt-3 text-center text-sm font-medium text-red-600">
                {submitError}
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}
