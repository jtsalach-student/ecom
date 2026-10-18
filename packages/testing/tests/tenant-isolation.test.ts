import { describe, it, expect, beforeEach } from "vitest";
import { MultiTenantRepository } from "@gcp/database";
import { Tenant } from "@gcp/contracts";

describe("Multi-Tenant Data Isolation", () => {
  let repo: MultiTenantRepository;

  beforeEach(() => {
    repo = new MultiTenantRepository();
  });

  it("should isolate products between different tenants", async () => {
    // Flagship Tenant (The Gadget Master)
    const flagshipProducts = await repo.listProducts("the-gadget-master-gh");
    expect(flagshipProducts.length).toBeGreaterThan(0);

    // Another tenant
    const secondTenant: Tenant = {
      id: "accra-electronics-ltd",
      name: "Accra Electronics Ltd",
      slug: "accra-electronics",
      primaryDomain: "accraelec.com",
      additionalDomains: [],
      currency: "GHS",
      locale: "en-GH",
      timezone: "Africa/Accra",
      taxRatePercent: 0,
      subscriptionPlan: "growth",
      subscriptionStatus: "active",
      branding: {
        primaryColor: "#111827",
        accentColor: "#F59E0B",
        secondaryColor: "#10B981",
        fontFamily: "Inter, sans-serif",
        heroTitle: "Tech Deals Accra",
        heroSubtitle: "Quality gadgets",
        supportEmail: "info@accraelec.com",
        supportPhone: "+233 20 000 0000",
        socialLinks: {},
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repo.createTenant(secondTenant);

    // Verify second tenant cannot see The Gadget Master's products
    const secondTenantProducts = await repo.listProducts("accra-electronics-ltd");
    expect(secondTenantProducts.length).toBe(0);

    // Add product to second tenant
    await repo.saveProduct({
      id: "prod-accra-sample-01",
      tenantId: "accra-electronics-ltd",
      name: "Smart Watch SE",
      slug: "smart-watch-se",
      brand: "Generic",
      model: "SW-01",
      modelNumber: "SW01",
      category: "SMARTWATCHES",
      condition: "BRAND_NEW",
      description: "Sample watch",
      specs: {},
      images: [],
      isPublished: true,
      isFeatured: false,
      warrantyMonths: 6,
      tags: [],
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const secondProductsAfter = await repo.listProducts("accra-electronics-ltd");
    expect(secondProductsAfter.length).toBe(1);

    // Verify The Gadget Master does not see second tenant's product
    const flagshipProductsAfter = await repo.listProducts("the-gadget-master-gh");
    expect(flagshipProductsAfter.some((p) => p.id === "prod-accra-sample-01")).toBe(false);
  });
});
