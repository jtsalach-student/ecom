# Paystack Payment Integration & Financial Correctness Guide

## 1. Overview
The platform uses Paystack as its primary payment gateway for Ghana, supporting:
- **Mobile Money (MoMo)**: MTN Mobile Money, Telecel Cash, AT Money
- **Card Payments**: Visa, Mastercard, Verve
- **Bank Transfers & In-Store Cash**: Reconciled through POS & digital checkout

---

## 2. Security & Signature Verification
All incoming webhooks sent to `POST /payments/webhook` are cryptographically verified using HMAC SHA-512 against the merchant secret key.

```typescript
import crypto from "crypto";

export function verifyPaystackSignature(
  rawBody: string | Buffer,
  signatureHeader: string | undefined,
  secretKey: string
): boolean {
  if (!signatureHeader || !secretKey) return false;

  const computedHash = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signatureHeader, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (signatureBuffer.length !== computedBuffer.length) return false;
  return crypto.timingSafeEqual(signatureBuffer, computedBuffer);
}
```

---

## 3. Idempotent Webhook Processing Flow
1. Receive webhook POST request with raw JSON body and `x-paystack-signature` header.
2. Verify HMAC SHA-512 signature. Reject invalid signatures with HTTP 400.
3. Check if `signature` or `event.reference` exists in `payment_events` with `is_processed = true`. If so, skip processing and return HTTP 200 immediately to prevent duplicate inventory deduction.
4. Locate matching `PaymentIntent` via `reference`.
5. Verify that `data.amount` (in pesewas) equals `intent.amount * 100` and `data.currency === intent.currency`.
6. Atomically transition `orders.status` from `PENDING_PAYMENT` to `PAID`.
7. Commit stock deductions from `branch_inventory.quantity_on_hand`.
8. Insert audit record into `payment_events`.
