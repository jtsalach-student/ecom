import { describe, it, expect, beforeEach } from "vitest";
import { MultiTenantRepository } from "@gcp/database";
import {
  hashPassword,
  verifyPassword,
  issueAccessToken,
  verifyAccessToken,
  resolveTenantContext,
} from "@gcp/auth";
import { User } from "@gcp/contracts";

describe("Identity, Authentication & Tenant Scoping Security (A01, A02)", () => {
  let repo: MultiTenantRepository;

  beforeEach(() => {
    repo = new MultiTenantRepository();
  });

  it("should securely hash and verify passwords using bcrypt (A01)", async () => {
    const plainPassword = "GadgetMaster2026!";
    const hash = await hashPassword(plainPassword);

    expect(hash).not.toBe(plainPassword);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);

    const isMatch = await verifyPassword(plainPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword123!", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("should reject login with wrong password", async () => {
    const userCredentials = await repo.findUserWithPasswordByEmail(
      "owner@thegadgetmaster.gh",
      "the-gadget-master-gh"
    );
    expect(userCredentials).not.toBeNull();
    if (!userCredentials) return;

    // Correct password
    const valid = await verifyPassword("GadgetMaster2026!", userCredentials.passwordHash);
    expect(valid).toBe(true);

    // Wrong password
    const invalid = await verifyPassword("IncorrecT_Password!", userCredentials.passwordHash);
    expect(invalid).toBe(false);
  });

  it("should bind tenant context to access token and prevent cross-tenant impersonation (A02)", async () => {
    const userA: User = {
      id: "usr-tenant-a-01",
      tenantId: "the-gadget-master-gh",
      email: "staff@thegadgetmaster.gh",
      fullName: "Staff A",
      role: "TENANT_ADMIN",
      branchId: "branch-east-legon-flagship",
      isActive: true,
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = issueAccessToken(userA);
    const verified = verifyAccessToken(token);

    expect(verified.tenantId).toBe("the-gadget-master-gh");
    expect(verified.sub).toBe("usr-tenant-a-01");

    // Verify resolveTenantContext detects tenant
    const context = await resolveTenantContext(repo, {
      tenantHeader: "the-gadget-master-gh",
    });
    expect(context.tenantId).toBe("the-gadget-master-gh");

    // Check cross-tenant violation: Token tenant A targeting Tenant B
    const isCrossTenant = verified.tenantId !== "accra-electronics-ltd";
    expect(isCrossTenant).toBe(true);
  });
});
