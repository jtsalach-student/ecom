import { Tenant } from "@gcp/contracts";
import { MultiTenantRepository } from "@gcp/database";

export interface TenantContext {
  tenant: Tenant;
  tenantId: string;
}

export async function resolveTenantContext(
  repo: MultiTenantRepository,
  options: {
    host?: string;
    tenantHeader?: string;
    tenantQuery?: string;
    fallbackTenantId?: string;
  }
): Promise<TenantContext> {
  // 1. Explicit Header
  if (options.tenantHeader) {
    const tenant = await repo.getTenant(options.tenantHeader);
    if (tenant) {
      assertTenantActive(tenant);
      return { tenant, tenantId: tenant.id };
    }
  }

  // 2. Query parameter (e.g. for preview or API tests)
  if (options.tenantQuery) {
    const tenant = await repo.getTenant(options.tenantQuery);
    if (tenant) {
      assertTenantActive(tenant);
      return { tenant, tenantId: tenant.id };
    }
  }

  // 3. Domain lookup
  if (options.host) {
    const cleanHost = options.host.split(":")[0].toLowerCase();
    const tenant = await repo.getTenant(cleanHost);
    if (tenant) {
      assertTenantActive(tenant);
      return { tenant, tenantId: tenant.id };
    }
  }

  // 4. Default fallback (e.g. The Gadget Master)
  const defaultId = options.fallbackTenantId || process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "the-gadget-master-gh";
  const defaultTenant = await repo.getTenant(defaultId);
  if (defaultTenant) {
    assertTenantActive(defaultTenant);
    return { tenant: defaultTenant, tenantId: defaultTenant.id };
  }

  throw new Error(`Unable to resolve tenant context for host '${options.host || "unknown"}'`);
}

function assertTenantActive(tenant: Tenant): void {
  if (tenant.subscriptionStatus === "suspended") {
    throw new Error(`Tenant '${tenant.name}' account is suspended. Please contact platform support.`);
  }
}
