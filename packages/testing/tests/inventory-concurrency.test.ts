import { describe, it, expect, beforeEach } from "vitest";
import { MultiTenantRepository } from "@gcp/database";

describe("Inventory Concurrency & Overselling Prevention", () => {
  let repo: MultiTenantRepository;
  const tenantId = "the-gadget-master-gh";
  const branchId = "branch-accra-flagship";
  const variantId = "var-test-exclusive-stock";

  beforeEach(async () => {
    repo = new MultiTenantRepository();
    // Setup item with exactly 1 unit in stock
    const invMap = (repo as any).branchInventories as Map<string, any>;
    invMap.set(`${branchId}_${variantId}`, {
      id: "inv-test-exclusive",
      tenantId,
      branchId,
      variantId,
      quantityOnHand: 1,
      quantityReserved: 0,
      quantityAvailable: 1,
      reorderPoint: 1,
      reorderQuantity: 5,
      updatedAt: new Date(),
    });
  });

  it("should prevent overselling when two requests attempt to reserve the last unit", async () => {
    const user1ReservePromise = repo.reserveStock(
      tenantId,
      branchId,
      variantId,
      1,
      "ord-concurrent-01"
    );
    const user2ReservePromise = repo.reserveStock(
      tenantId,
      branchId,
      variantId,
      1,
      "ord-concurrent-02"
    );

    const [res1, res2] = await Promise.all([user1ReservePromise, user2ReservePromise]);

    // Exactly one reservation should succeed
    const successCount = (res1.success ? 1 : 0) + (res2.success ? 1 : 0);
    expect(successCount).toBe(1);

    // One failed
    const failCount = (!res1.success ? 1 : 0) + (!res2.success ? 1 : 0);
    expect(failCount).toBe(1);

    // Final available stock must be 0, never negative
    const finalInv = await repo.getBranchInventory(tenantId, branchId, variantId);
    expect(finalInv?.quantityReserved).toBe(1);
    expect(finalInv?.quantityAvailable).toBe(0);
  });
});
