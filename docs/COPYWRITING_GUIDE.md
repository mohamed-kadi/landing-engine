# Copywriting Guide

## Purpose

This guide defines how product copy should be created for Landing Engine pages. The copy system must be reusable, structured, testable, and conversion-focused. Copy should be stored in product configuration and rendered by page sections; components must not hardcode product-specific messaging.

## Copy Strategy

Landing Engine copy must move the shopper from curiosity to confidence. It should explain the product in terms of customer outcomes, then support those claims with concrete details, proof, and risk reversal.

The default copy flow:

1. Outcome promise.
2. Product explanation.
3. Benefits.
4. Proof.
5. Differentiation.
6. Offer.
7. Risk reversal.
8. Clear action.

## Voice And Tone

The tone should be:

- Direct.
- Useful.
- Specific.
- Commercially confident.
- Trustworthy.
- Localized to the market.

Avoid:

- Generic hype.
- Unsupported superlatives.
- Long technical explanations before benefits.
- Manipulative scarcity.
- Claims that cannot be proven.
- Abstract brand slogans in the hero.

## Target Audience Messaging

The primary shopper needs quick clarity. Copy should assume the user is asking:

- What is this?
- Why is it better for me?
- Is it worth the price?
- Can I trust delivery and payment?
- What happens after I order?

Internal Wasilio users need structured fields that map to page sections, not freeform blobs that require custom layout for every product.

## Copy Inputs

Every product should gather these inputs before writing page copy:

- Product category.
- Customer pain points.
- Primary customer outcome.
- Top 3 to 5 customer benefits.
- Top product features.
- Proof sources.
- Price and offer.
- Delivery promise.
- Payment methods.
- Warranty or return policy.
- Support channels.
- Top objections.
- Competitor or alternative comparison.
- Market and language.

## Hero Copy

The hero must communicate the product promise quickly.

Required fields:

- Headline.
- Subheadline.
- Primary CTA.
- Trust microcopy.
- Optional rating or proof summary.
- Optional price or offer line.

Headline rules:

- Lead with the customer outcome, not the internal product name unless the product name is already the demand driver.
- Keep it short enough for mobile.
- Avoid vague claims like "The best solution for everyone."
- Use concrete nouns and active verbs.

Good headline patterns:

- "Stay cool anywhere without using your hands."
- "Clean your car seats in minutes, without a workshop visit."
- "Make fresh coffee at home without expensive machines."

Subheadline rules:

- Explain what the product is and who it is for.
- Add one proof, convenience, or trust detail when possible.
- Keep it to one or two short sentences.

CTA rules:

- Use action language.
- Match the conversion mode.
- Do not promise instant purchase if the next step is a confirmation call.

CTA examples:

- `Order Now`
- `Reserve Yours`
- `Complete My Order`
- `Check Availability`
- `Ask on WhatsApp`

## Benefits Copy

Benefits must explain the customer outcome. Features explain the product mechanism.

For every feature, define:

- Feature: what the product has.
- Benefit: what the customer gets.
- Proof or detail: why it is believable.

Example:

| Feature | Weak Copy | Stronger Benefit Copy |
| --- | --- | --- |
| Bladeless design | "Bladeless fan" | "Comfortable airflow without exposed blades near hair or clothing." |
| Large battery | "Long battery" | "Stays useful through commutes, errands, and outdoor time without constant charging." |

## Problem-Solution Copy

Use this section when the product solves a painful, familiar problem.

Structure:

- Name the problem in the customer's words.
- Show the cost of ignoring it.
- Introduce the product as the practical solution.
- Avoid making the problem feel exaggerated or fake.

Template:

```text
Problem: [Common situation] makes [desired outcome] difficult because [specific friction].
Solution: [Product] helps by [mechanism], so you can [customer outcome] without [old compromise].
```

## Feature Copy

Feature sections should be skimmable and benefit-led.

Each feature item should include:

- Semantic icon name.
- Feature title.
- Customer benefit.
- Short explanation.

Rules:

- Start with the customer benefit when possible.
- Keep descriptions short.
- Avoid repeating the same benefit in every feature.
- Do not use technical terms unless the audience values them.

## Comparison Copy

Comparison should help the user decide, not attack competitors unfairly.

Comparison dimensions should be:

- Relevant to buying decision.
- Easy to understand.
- Based on true product differences.
- Balanced enough to feel credible.

Recommended columns:

- Decision factor.
- Ordinary alternative.
- This product.

Avoid:

- Unsupported claims.
- Fake competitor names.
- Too many rows.
- Feature-only comparison without benefits.

## Social Proof Copy

Social proof should feel specific and believable.

Review fields:

- Reviewer name or initials.
- Location where relevant.
- Rating.
- Review text.
- Product variant if relevant.
- Timestamp or purchase context where trustworthy.

Rules:

- Do not invent reviews.
- Do not over-polish customer language.
- Prefer specific use cases over generic praise.
- Add a rating summary only when backed by real data.

## Offer Copy

The offer block must clarify:

- Price.
- Discount or compare-at price if real.
- Included items.
- Payment method.
- Delivery cost and timing.
- Warranty or return promise.
- Any bundle or quantity savings.

Offer copy should answer "What exactly do I get and what happens next?"

Avoid:

- Hidden fees.
- Ambiguous delivery language.
- Scarcity timers without real inventory logic.
- Sale claims that are not controlled by pricing data.

## FAQ And Objection Handling

FAQs should be selected from real buying objections.

Required categories:

- Delivery timing.
- Payment method.
- Return or warranty.
- Product use.
- Product fit or compatibility.
- Support.

FAQ answer rules:

- Answer directly in the first sentence.
- Add details only as needed.
- Keep answers factual.
- Do not use FAQ as a place for generic marketing copy.

## Localization

Copy must support market-specific language, currency, delivery promises, phone format, support expectations, and cultural trust signals.

Rules:

- Do not hardcode Moroccan cities, currency, or phone validation inside components.
- Market-specific copy should live in market or product configuration.
- Translation should preserve conversion intent, not word-for-word phrasing.
- CTA labels should be tested per language.

## CRO Principles

- Clarity beats cleverness.
- Show the product early.
- Lead with benefits, then support with features.
- Repeat the CTA at natural decision points.
- Place trust close to CTAs.
- Remove friction before the form.
- Answer objections before they become abandonment.
- Make the next step explicit.
- Use urgency only when grounded in real offer or stock state.

## Copy QA Checklist

- Hero explains the product and outcome in under five seconds.
- CTA copy matches the actual next step.
- Benefits are customer outcomes, not only features.
- Product claims are supportable.
- Offer details are complete.
- Delivery, payment, warranty, and support are clear.
- FAQs answer real objections.
- Mobile copy blocks are short enough to scan.
- No component requires hardcoded product copy.
