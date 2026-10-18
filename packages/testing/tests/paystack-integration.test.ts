import { describe, it, expect, beforeEach } from "vitest";
import crypto from "crypto";
import { MultiTenantRepository } from "@gcp/database";
import { PaystackPaymentProvider, verifyPaystackSignature } from "@gcp/payments";
import { Order, PaymentIntent } from "@gcp/contracts";

describe("Paystack Payment Integration", () => {
  const secretKey = "sk_test_mock_secret_key_12345";
  let repo: MultiTenantRepository;
  let provider: PaystackPaymentProvider;

  beforeEach(() => {
    repo = new MultiTenantRepository();
    provider = new PaystackPaymentProvider(secretKey, true);
  });

  it("should accurately verify HMAC SHA-512 signatures", () => {
    const rawPayload = JSON.stringify({ event: "charge.success", data: { reference: "ref_123" } });
    const validSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawPayload)
      .digest("hex");

    expect(verifyPaystackSignature(rawPayload, validSignature, secretKey)).toBe(true);
    expect(verifyPaystackSignature(rawPayload, "invalid_sig_hex", secretKey)).toBe(false);
  });

  it("should process webhook, mark order as paid, and maintain idempotency", async () => {
    const tenantId = "the-gadget-master-gh";
    const branchId = "branch-east-legon-flagship";
    const variantId = "var-iph16pm-256-nat";
    const orderId = "ord-paystack-test-01";
    const reference = "TGM_ORD_TEST_9999";

    // Create an order
    const testOrder: Order = {
      id: orderId,
      tenantId,
      orderNumber: "ORD-9999",
      customerId: "usr-customer-01",
      customerEmail: "customer@example.gh",
      customerName: "Esi Danquah",
      customerPhone: "+233 27 777 8899",
      channel: "STOREFRONT",
      branchId,
      status: "PENDING_PAYMENT",
      subtotal: 21500,
      discountTotal: 0,
      taxTotal: 0,
      deliveryFee: 35,
      grandTotal: 21535,
      currency: "GHS",
      deliveryDetails: {
        deliveryMethod: "STANDARD_DELIVERY",
        recipientName: "Esi Danquah",
        recipientPhone: "+233 27 777 8899",
        deliveryAddress: "Ring Road East",
        city: "Accra",
        region: "Greater Accra",
      },
      items: [
        {
          id: "item-01",
          orderId,
          variantId,
          productId: "prod-iphone-16-pro-max",
          name: "iPhone 16 Pro Max",
          sku: "TGM-IPH16PM-256-NAT",
          unitPrice: 21500,
          quantity: 1,
          totalPrice: 21500,
          discountAmount: 0,
          serialNumbers: [],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.saveOrder(testOrder);

    // Create payment intent
    const intent: PaymentIntent = {
      id: "pi-test-01",
      tenantId,
      orderId,
      reference,
      provider: "PAYSTACK",
      amount: 21535,
      currency: "GHS",
      customerEmail: "customer@example.gh",
      status: "PENDING",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.createPaymentIntent(intent);

    // Initial stock
    const initialInv = await repo.getBranchInventory(tenantId, branchId, variantId);
    const initialOnHand = initialInv?.quantityOnHand || 0;

    // Simulate Paystack charge.success webhook payload
    const payload = {
      event: "charge.success",
      data: {
        id: 99887766,
        reference,
        amount: 2153500, // 21535.00 GHS in pesewas
        currency: "GHS",
        status: "success",
        channel: "mobile_money",
      },
    };
    const rawBody = JSON.stringify(payload);
    const signature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    // Process webhook 1st time
    const res1 = await provider.processWebhook(rawBody, signature, repo);
    expect(res1.processed).toBe(true);

    // Verify order is now PAID
    const orderAfter = await repo.getOrder(tenantId, orderId);
    expect(orderAfter?.status).toBe("PAID");

    // Verify inventory on hand was decremented by 1
    const invAfter = await repo.getBranchInventory(tenantId, branchId, variantId);
    expect(invAfter?.quantityOnHand).toBe(initialOnHand - 1);

    // Process webhook 2nd time (duplicate delivery)
    const res2 = await provider.processWebhook(rawBody, signature, repo);
    expect(res2.processed).toBe(true);
    expect(res2.message).toContain("idempotent");

    // Inventory must NOT be decremented again
    const invAfter2 = await repo.getBranchInventory(tenantId, branchId, variantId);
    expect(invAfter2?.quantityOnHand).toBe(initialOnHand - 1);
  });
});
