import { describe, it, expect, beforeEach } from "vitest";
import crypto from "crypto";
import { MultiTenantRepository } from "@gcp/database";
import { PaystackPaymentProvider, verifyPaystackSignature } from "@gcp/payments";
import { Order, PaymentIntent } from "@gcp/contracts";

describe("Paystack Strict Webhook Verification & Whitespace Sensitivity (A05, A06)", () => {
  const secretKey = "sk_test_paystack_secret_strictly_verified";
  let repo: MultiTenantRepository;
  let provider: PaystackPaymentProvider;

  beforeEach(() => {
    repo = new MultiTenantRepository();
    // Test mode is true, but strict verification must still be enforced
    provider = new PaystackPaymentProvider(secretKey, true);
  });

  it("should verify signature strictly and fail when whitespace is added/altered (A05)", () => {
    const rawCompact = '{"event":"charge.success","data":{"id":123,"reference":"TGM_001"}}';
    const rawFormatted = '{\n  "event": "charge.success",\n  "data": {\n    "id": 123,\n    "reference": "TGM_001"\n  }\n}';

    const compactSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawCompact)
      .digest("hex");

    // Valid on identical raw bytes
    expect(verifyPaystackSignature(rawCompact, compactSignature, secretKey)).toBe(true);

    // Fails on whitespace-altered body even if parsed JSON is equivalent
    expect(verifyPaystackSignature(rawFormatted, compactSignature, secretKey)).toBe(false);
  });

  it("should reject forged or missing signatures with explicit error (A06)", async () => {
    const payload = JSON.stringify({
      event: "charge.success",
      data: { reference: "ref_forged", amount: 10000, currency: "GHS" },
    });

    await expect(
      provider.processWebhook(payload, "invalid_forged_signature_hex", repo)
    ).rejects.toThrow(/HMAC SHA-512 verification failed/);

    await expect(
      provider.processWebhook(payload, undefined, repo)
    ).rejects.toThrow(/HMAC SHA-512 verification failed/);
  });

  it("should reject webhook when amount or currency does not match stored intent", async () => {
    const tenantId = "the-gadget-master-gh";
    const orderId = "ord-tamper-check-01";
    const reference = "TGM_REF_TAMPER_01";

    // Setup payment intent expecting 500 GHS (50,000 subunits)
    const intent: PaymentIntent = {
      id: "pi-tamper-01",
      tenantId,
      orderId,
      reference,
      provider: "PAYSTACK",
      amount: 500,
      currency: "GHS",
      customerEmail: "customer@example.gh",
      status: "PENDING",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.createPaymentIntent(intent);

    // Attacker tries to send 50 GHS (5,000 subunits) with valid HMAC for the tampered body
    const tamperedPayload = JSON.stringify({
      event: "charge.success",
      data: {
        id: 99881122,
        reference,
        amount: 5000, // 50 GHS instead of 500 GHS!
        currency: "GHS",
        status: "success",
      },
    });

    const validHmacForTampered = crypto
      .createHmac("sha512", secretKey)
      .update(tamperedPayload)
      .digest("hex");

    await expect(
      provider.processWebhook(tamperedPayload, validHmacForTampered, repo)
    ).rejects.toThrow(/Amount\/Currency mismatch/);
  });
});
