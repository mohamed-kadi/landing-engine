# Lead Capture

## Current Flow

The COD order form now submits valid orders to the internal API route:

```text
POST /api/orders
```

Client flow:

1. The customer completes the order form.
2. `OrderFormSection` runs client-side validation.
3. If the form is valid, the component posts a normalized payload to `/api/orders`.
4. The API route performs server-side validation against the product registry.
5. If the API accepts the order, the form shows the existing success confirmation.
6. `Lead` and `Order_Submitted` analytics events fire only after API success.
7. If the API rejects the order or the request fails, the form shows a clean retry message and fires `Form_Submit_Error`.

## Submitted Fields

The API accepts:

- `productId`
- `productSlug`
- `productName`
- `price`
- `currency`
- `variant`
- `quantity`
- `customerName`
- `phone`
- `city`
- `address`
- `notes`
- `experimentId`
- `experimentArm`
- `source`
- `submittedAt`

The route also creates:

- `orderId`
- `serverReceivedAt`

## Server-Side Validation

Server validation lives in:

```text
src/lib/orders/orderSchema.ts
```

It validates:

- Required product fields.
- Known product slug from the product registry.
- Product ID and product name match the configured product.
- Currency matches the configured product.
- Price matches the selected variant or product base price.
- Moroccan mobile phone format: `06` or `07` followed by eight digits.
- City exists in the product order form city list.
- Quantity is an integer greater than or equal to `1`.
- Variant exists when the product has variants.
- Experiment ID and experiment arm are present.
- Submitted timestamp is a valid date.

Server-side validation matters because client-side validation can be bypassed. The browser form improves user experience, but the API route protects lead quality and prevents malformed submissions from entering downstream order systems.

## Storage Behavior

This phase does not add a database.

Current storage behavior:

- Every accepted order is clearly logged on the server with `[orders] COD order received`.
- In local development only, accepted orders are appended to:

```text
data/orders.jsonl
```

The JSONL file is ignored by Git through `.gitignore`.

In production runtime, local JSONL writing is disabled and the route returns `server-log-only` storage mode. This is intentional because many Next.js production runtimes are serverless or ephemeral, so filesystem writes should not be treated as durable order storage.

## Limitations

Current limitations:

- Local JSONL storage is for development only.
- Server logs are not a production order database.
- No deduplication exists yet.
- No admin order dashboard exists yet.
- No order status lifecycle exists yet.
- No merchant notification exists yet.
- No Wasilio backend synchronization exists yet.

This phase proves the capture boundary and validation flow without committing to a database or backend architecture too early.

## Future Wasilio Integration

The next production step is to replace local storage with a Wasilio order adapter.

Wasilio should receive:

- Product identity.
- Product slug.
- Variant.
- Price and currency.
- Customer contact details.
- Delivery city and address.
- Experiment context.
- Traffic source.
- Browser analytics correlation fields if available.
- Submission timestamp.

This will let Wasilio connect landing-page behavior to order outcomes such as confirmation success, cancellation, delivery success, and return rate.

## Future Production Options

Possible production storage or delivery targets:

- Wasilio backend API.
- PostgreSQL.
- Google Sheets.
- Airtable.
- CRM webhook.
- Email notification.
- WhatsApp notification.

Recommended production direction:

1. Start with a Wasilio backend order API.
2. Store orders in PostgreSQL.
3. Add idempotency keys to prevent duplicate submissions.
4. Add order status tracking.
5. Add merchant notifications.
6. Join submitted orders back to analytics and experiment assignments.

For COD ecommerce, the useful metric is not only submitted leads. The durable system should measure confirmed orders, delivery success, and profitable conversion by product and experiment arm.
