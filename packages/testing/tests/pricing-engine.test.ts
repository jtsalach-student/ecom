import { describe, it, expect } from "vitest";
import { calculateOrderPricing } from "@gcp/domain";

describe("Pricing Engine", () => {
  it("should accurately compute subtotal and grand total for standard cart", () => {
    const result = calculateOrderPricing({
      items: [
        { unitPrice: 21500, quantity: 1 }, // iPhone 16 Pro Max
        { unitPrice: 1250, quantity: 2 },  // 2x Anker chargers
      ],
      deliveryMethod: "STANDARD_DELIVERY",
      deliveryZoneRate: 35,
    });

    expect(result.subtotal).toBe(24000);
    expect(result.deliveryFee).toBe(35);
    expect(result.grandTotal).toBe(24035);
  });

  it("should apply percentage and coupon discounts correctly", () => {
    const result = calculateOrderPricing({
      items: [
        { unitPrice: 1000, quantity: 1, discountPercent: 10 }, // 100 GHS discount
      ],
      couponDiscountAmount: 50,
      deliveryMethod: "BRANCH_PICKUP",
    });

    expect(result.subtotal).toBe(1000);
    expect(result.discountTotal).toBe(150);
    expect(result.deliveryFee).toBe(0);
    expect(result.grandTotal).toBe(850);
  });

  it("should apply Ghana VAT rate when configured", () => {
    const result = calculateOrderPricing({
      items: [{ unitPrice: 1000, quantity: 1 }],
      taxRatePercent: 15,
      deliveryMethod: "BRANCH_PICKUP",
    });

    expect(result.subtotal).toBe(1000);
    expect(result.taxTotal).toBe(150);
    expect(result.grandTotal).toBe(1150);
  });
});
