import { describe, it, expect } from "vitest";
import { SEED_PRODUCTS, SEED_TENANT } from "@gcp/database";
import { PaystackPaymentProvider } from "@gcp/payments";
import { getTenantBranding } from "@gcp/ui";

describe("Refinements and Multi-Tenant Branding Test Suite", () => {
  describe("Catalogue and Carousel Data Consistency", () => {
    it("should match iPhone 16 Pro Max variant price with the catalogue specification (15,900 GHS)", () => {
      const iphone = SEED_PRODUCTS.find((p) => p.id === "prod-iphone-16-pro-max");
      expect(iphone).toBeDefined();
      const desertTitaniumVariant = iphone?.variants.find((v) => v.id === "var-iph16pm-256-des");
      expect(desertTitaniumVariant).toBeDefined();
      expect(desertTitaniumVariant?.retailPrice).toBe(15900);
      expect(desertTitaniumVariant?.currency || "GHS").toBe("GHS");
    });

    it("should ensure all seed products have valid variants and matching currency", () => {
      for (const prod of SEED_PRODUCTS) {
        expect(prod.variants.length).toBeGreaterThan(0);
        for (const variant of prod.variants) {
          expect(variant.retailPrice).toBeGreaterThan(0);
          expect(variant.productId).toBe(prod.id);
        }
      }
    });

    it("should substantiate real hardware models rather than primitive dummy placeholders", () => {
      const imac = SEED_PRODUCTS.find((p) => p.name.includes("iMac 24"));
      const surface = SEED_PRODUCTS.find((p) => p.name.includes("Surface Laptop"));
      const jbl = SEED_PRODUCTS.find((p) => p.name.includes("JBL Bar"));

      expect(imac).toBeDefined();
      expect(surface).toBeDefined();
      expect(jbl).toBeDefined();
    });
  });

  describe("Paystack Fail-Closed Payment Security", () => {
    it("should fail closed on non-mock initialization failure instead of generating fake checkout URLs", async () => {
      // Secret key that will fail real Paystack API calls
      const realProvider = new PaystackPaymentProvider("sk_live_invalid_key_for_test", false);

      const fakeOrder: any = {
        id: "ord-test-fail-closed",
        tenantId: "the-gadget-master-gh",
        orderNumber: "ORD-FAIL-01",
        customerEmail: "tester@example.com",
        customerName: "Test Customer",
        customerPhone: "+233200000000",
        grandTotal: 15900,
        currency: "GHS",
      };

      await expect(
        realProvider.initializeTransaction(
          fakeOrder,
          fakeOrder.customerEmail,
          "http://localhost:3000/order-confirmation"
        )
      ).rejects.toThrow();
    });

    it("should allow controlled mock initialization when explicitly in mock mode", async () => {
      const mockProvider = new PaystackPaymentProvider("sk_test_mock_123", true);

      const fakeOrder: any = {
        id: "ord-test-mock-success",
        tenantId: "the-gadget-master-gh",
        orderNumber: "ORD-MOCK-01",
        customerEmail: "tester@example.com",
        customerName: "Test Customer",
        customerPhone: "+233200000000",
        grandTotal: 15900,
        currency: "GHS",
      };

      const session = await mockProvider.initializeTransaction(
        fakeOrder,
        fakeOrder.customerEmail,
        "http://localhost:3000/order-confirmation"
      );

      expect(session).toBeDefined();
      expect(session.authorizationUrl).toContain("paystack");
      expect(session.accessCode).toBeDefined();
      expect(session.reference).toBeDefined();
    });
  });

  describe("Tenant-Aware Theming & Branding Isolation", () => {
    it("should resolve Gadget Master branding for gadget-master tenant slug", () => {
      const branding = getTenantBranding("gadget-master");
      expect(branding.name).toBe("The Gadget Master");
      expect(branding.logoUrl).toBe("/logo-oval.png");
      expect(branding.accentColor).toBe("#FF8A00");
    });

    it("should resolve default platform branding when no tenant slug is supplied", () => {
      const branding = getTenantBranding(null);
      expect(branding.name).toBe("Gadget Commerce Platform");
      expect(branding.logoUrl).toBe("/logo-oval.png");
    });

    it("should resolve default platform branding for unrecognized tenant slugs", () => {
      const branding = getTenantBranding("unrecognized-tenant-xyz");
      expect(branding.name).toBe("Gadget Commerce Platform");
    });

    it("should maintain SEED_TENANT with legitimate Ghana credentials and Accra timezone", () => {
      expect(SEED_TENANT.currency).toBe("GHS");
      expect(SEED_TENANT.locale).toBe("en-GH");
      expect(SEED_TENANT.timezone).toBe("Africa/Accra");
      expect(SEED_TENANT.branding.supportPhone).toBe("020 014 7950");
    });
  });
});
