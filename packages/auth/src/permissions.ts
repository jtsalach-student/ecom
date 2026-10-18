import { UserRole, PlatformRole, TenantRole, CustomerRole } from "@gcp/contracts";

export const Permission = {
  // Platform Permissions
  MANAGE_PLATFORM_TENANTS: "MANAGE_PLATFORM_TENANTS",
  MANAGE_PLATFORM_SUBSCRIPTIONS: "MANAGE_PLATFORM_SUBSCRIPTIONS",
  VIEW_PLATFORM_AUDIT_LOGS: "VIEW_PLATFORM_AUDIT_LOGS",

  // Tenant Administration
  MANAGE_TENANT_SETTINGS: "MANAGE_TENANT_SETTINGS",
  MANAGE_STAFF_MEMBERS: "MANAGE_STAFF_MEMBERS",
  MANAGE_BRANCHES: "MANAGE_BRANCHES",

  // Catalog
  CREATE_PRODUCT: "CREATE_PRODUCT",
  EDIT_PRODUCT: "EDIT_PRODUCT",
  PUBLISH_PRODUCT: "PUBLISH_PRODUCT",
  MANAGE_3D_ASSETS: "MANAGE_3D_ASSETS",

  // Inventory & Procurement
  VIEW_INVENTORY: "VIEW_INVENTORY",
  ADJUST_STOCK: "ADJUST_STOCK",
  TRANSFER_STOCK: "TRANSFER_STOCK",
  MANAGE_SUPPLIERS: "MANAGE_SUPPLIERS",

  // Sales & Orders
  PROCESS_POS_SALE: "PROCESS_POS_SALE",
  VIEW_ORDERS: "VIEW_ORDERS",
  FULFILL_ORDER: "FULFILL_ORDER",
  APPROVE_REFUND: "APPROVE_REFUND",

  // After-Sales
  MANAGE_WARRANTY: "MANAGE_WARRANTY",
  MANAGE_REPAIRS: "MANAGE_REPAIRS",
  APPRAISE_TRADE_IN: "APPRAISE_TRADE_IN",

  // Analytics
  VIEW_EXECUTIVE_ANALYTICS: "VIEW_EXECUTIVE_ANALYTICS",
  VIEW_INVENTORY_ANALYTICS: "VIEW_INVENTORY_ANALYTICS",

  // Customer
  SHOP_ONLINE: "SHOP_ONLINE",
  VIEW_OWN_ORDERS: "VIEW_OWN_ORDERS",
} as const;

export type PermissionType = typeof Permission[keyof typeof Permission];

const ROLE_PERMISSIONS: Record<string, PermissionType[]> = {
  [PlatformRole.SUPER_ADMIN]: Object.values(Permission),
  [PlatformRole.SUPPORT]: [
    Permission.VIEW_PLATFORM_AUDIT_LOGS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_ORDERS,
  ],
  [TenantRole.OWNER]: [
    Permission.MANAGE_TENANT_SETTINGS,
    Permission.MANAGE_STAFF_MEMBERS,
    Permission.MANAGE_BRANCHES,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.PUBLISH_PRODUCT,
    Permission.MANAGE_3D_ASSETS,
    Permission.VIEW_INVENTORY,
    Permission.ADJUST_STOCK,
    Permission.TRANSFER_STOCK,
    Permission.MANAGE_SUPPLIERS,
    Permission.PROCESS_POS_SALE,
    Permission.VIEW_ORDERS,
    Permission.FULFILL_ORDER,
    Permission.APPROVE_REFUND,
    Permission.MANAGE_WARRANTY,
    Permission.MANAGE_REPAIRS,
    Permission.APPRAISE_TRADE_IN,
    Permission.VIEW_EXECUTIVE_ANALYTICS,
    Permission.VIEW_INVENTORY_ANALYTICS,
  ],
  [TenantRole.ADMIN]: [
    Permission.MANAGE_STAFF_MEMBERS,
    Permission.MANAGE_BRANCHES,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.PUBLISH_PRODUCT,
    Permission.VIEW_INVENTORY,
    Permission.ADJUST_STOCK,
    Permission.TRANSFER_STOCK,
    Permission.VIEW_ORDERS,
    Permission.FULFILL_ORDER,
    Permission.APPROVE_REFUND,
    Permission.VIEW_EXECUTIVE_ANALYTICS,
    Permission.VIEW_INVENTORY_ANALYTICS,
  ],
  [TenantRole.STORE_MANAGER]: [
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.VIEW_INVENTORY,
    Permission.ADJUST_STOCK,
    Permission.TRANSFER_STOCK,
    Permission.PROCESS_POS_SALE,
    Permission.VIEW_ORDERS,
    Permission.FULFILL_ORDER,
    Permission.APPROVE_REFUND,
    Permission.MANAGE_WARRANTY,
    Permission.MANAGE_REPAIRS,
    Permission.APPRAISE_TRADE_IN,
    Permission.VIEW_INVENTORY_ANALYTICS,
  ],
  [TenantRole.CASHIER]: [
    Permission.PROCESS_POS_SALE,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_WARRANTY,
  ],
  [CustomerRole.CUSTOMER]: [
    Permission.SHOP_ONLINE,
    Permission.VIEW_OWN_ORDERS,
  ],
};

export function hasPermission(role: string, permission: PermissionType): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export function assertPermission(role: string, permission: PermissionType): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Unauthorized: Role '${role}' lacks required permission '${permission}'`);
  }
}
