import { describe, it, expect } from "vitest";
import {
  canTransitionOrder,
  validateOrderTransition,
  DomainTransitionError,
} from "@gcp/domain";

describe("Order State Machine", () => {
  it("should permit valid sequential order transitions", () => {
    expect(canTransitionOrder("DRAFT", "PENDING_PAYMENT")).toBe(true);
    expect(canTransitionOrder("PENDING_PAYMENT", "PAID")).toBe(true);
    expect(canTransitionOrder("PAID", "AWAITING_FULFILMENT")).toBe(true);
    expect(canTransitionOrder("AWAITING_FULFILMENT", "SHIPPED")).toBe(true);
    expect(canTransitionOrder("SHIPPED", "DELIVERED")).toBe(true);
    expect(canTransitionOrder("DELIVERED", "COMPLETED")).toBe(true);
  });

  it("should prevent illegal arbitrary jumps", () => {
    // Cannot jump from DRAFT directly to DELIVERED
    expect(canTransitionOrder("DRAFT", "DELIVERED")).toBe(false);
    expect(() => validateOrderTransition("DRAFT", "DELIVERED")).toThrow(
      DomainTransitionError
    );

    // Cannot transition from CANCELLED to PAID
    expect(canTransitionOrder("CANCELLED", "PAID")).toBe(false);
    expect(() => validateOrderTransition("CANCELLED", "PAID")).toThrow(
      DomainTransitionError
    );
  });

  it("should permit refund from COMPLETED or DELIVERED", () => {
    expect(canTransitionOrder("COMPLETED", "REFUNDED")).toBe(true);
    expect(canTransitionOrder("DELIVERED", "PARTIALLY_REFUNDED")).toBe(true);
  });
});
