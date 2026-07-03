# Order Form Reasoning

## Purpose

The Landing Engine order form is designed for Moroccan cash-on-delivery ecommerce. Its job is not to collect every possible customer detail. Its job is to capture enough accurate information for a merchant or confirmation team to verify the order quickly and increase the probability of successful delivery.

## Why COD Forms Should Stay Short

COD customers are often buying from mobile traffic, social ads, or messaging campaigns. They may not have a strong account relationship with the merchant yet, and every extra field adds friction before the lead is captured.

The baseline form should collect only:

- Full name
- Moroccan phone number
- City
- Full address
- Product variant when variants exist
- Quantity

Optional fields such as notes, coupon codes, or secondary contact methods should be introduced only when a merchant has a proven operational need. Short forms usually improve form completion rate because the customer can finish the order before attention drops or trust weakens.

## Why Phone Validation Matters In Morocco

For Moroccan COD, the phone number is the primary confirmation channel. The merchant, call center, or delivery partner usually needs to call or message the customer before dispatch.

The current validation expects Moroccan mobile numbers beginning with `06` or `07` followed by eight digits. This catches common invalid leads such as missing digits, landline-style entries, placeholder text, and accidental non-phone input.

Accurate phone capture affects:

- Lead quality
- Confirmation success
- Delivery success probability
- Operational cost per confirmed order

## Why City Selection Matters

City selection is operationally important because COD delivery speed, fees, courier availability, and confirmation expectations vary by location. A structured city list is more reliable than free text because it reduces misspellings and makes later integration with delivery zones easier.

The form should not silently default to a city. A placeholder forces the customer to make an explicit selection, which reduces accidental orders assigned to the wrong delivery city.

## Why Reducing Friction Improves Conversion

The form validates after fields are touched and after submit attempts, rather than showing all errors immediately. This keeps the first impression calm while still giving clear feedback when the customer interacts with a field or tries to submit.

The submit button is disabled while submission is in progress so the customer cannot create duplicate orders by clicking repeatedly. A success confirmation gives immediate feedback that the order was received, even before backend integration exists.

## Metrics Affected

The order form quality directly affects these funnel and operations metrics:

| Metric | Expected Impact |
| --- | --- |
| Form start rate | Short, familiar fields reduce hesitation before typing |
| Form completion rate | Touched/submit validation avoids overwhelming users with early errors |
| Lead quality | Required contact, city, address, variant, and quantity reduce unusable orders |
| Confirmation success | Moroccan phone validation improves the chance of reaching the customer |
| Delivery success probability | Accurate city, address, product choice, and quantity reduce fulfillment mistakes |

## Implementation Notes

Validation lives in `src/lib/forms/orderForm.ts` so `OrderFormSection` remains focused on rendering and state transitions. The section still uses `product.orderForm` for labels, placeholders, validation messages, submit copy, and confirmation copy.

No backend, analytics, or SEO behavior is implemented in Phase 3. The current submission path only normalizes the client-side order payload and shows the existing confirmation state after a valid submit.
