import { describe, it, expect } from "vitest";
import { findCompatibleAccessories, isAccessoryCompatible } from "@gcp/domain";
import { SEED_PRODUCTS, SEED_COMPATIBILITIES } from "@gcp/database";

describe("Product Compatibility Engine", () => {
  it("should discover all verified accessories for iPhone 16 Pro Max", () => {
    const iphone = SEED_PRODUCTS.find((p) => p.id === "prod-iphone-16-pro-max")!;
    expect(iphone).toBeDefined();

    const compatible = findCompatibleAccessories(
      iphone,
      SEED_COMPATIBILITIES,
      SEED_PRODUCTS
    );

    // Should include Anker 100W, MagSafe charger, and Spigen case
    expect(compatible.length).toBe(3);

    const accessoryIds = compatible.map((c) => c.accessory.id);
    expect(accessoryIds).toContain("prod-anker-prime-100w");
    expect(accessoryIds).toContain("prod-apple-magsafe-charger");
    expect(accessoryIds).toContain("prod-spigen-ultra-hybrid-case");
  });

  it("should evaluate individual accessory compatibility", () => {
    const iphone = SEED_PRODUCTS.find((p) => p.id === "prod-iphone-16-pro-max")!;
    const anker = SEED_PRODUCTS.find((p) => p.id === "prod-anker-prime-100w")!;
    const macbook = SEED_PRODUCTS.find((p) => p.id === "prod-macbook-pro-16-m4")!;

    expect(isAccessoryCompatible(iphone, anker, SEED_COMPATIBILITIES)).toBe(true);
    // An iPhone is not an accessory to a MacBook
    expect(isAccessoryCompatible(macbook, iphone, SEED_COMPATIBILITIES)).toBe(false);
  });
});
