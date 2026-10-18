import { z } from "zod";

export const PlatformRole = {
  SUPER_ADMIN: "PLATFORM_SUPER_ADMIN",
  SUPPORT: "PLATFORM_SUPPORT",
  BILLING: "PLATFORM_BILLING",
  AUDITOR: "PLATFORM_AUDITOR",
} as const;

export const TenantRole = {
  OWNER: "TENANT_OWNER",
  ADMIN: "TENANT_ADMIN",
  BRANCH_MANAGER: "BRANCH_MANAGER",
  STORE_MANAGER: "STORE_MANAGER",
  CASHIER: "CASHIER",
  SALES_REP: "SALES_REP",
  INVENTORY_OFFICER: "INVENTORY_OFFICER",
  PROCUREMENT_OFFICER: "PROCUREMENT_OFFICER",
  FINANCE_OFFICER: "FINANCE_OFFICER",
  MARKETING_OFFICER: "MARKETING_OFFICER",
  SUPPORT_OFFICER: "SUPPORT_OFFICER",
  REPAIR_TECHNICIAN: "REPAIR_TECHNICIAN",
  FULFILMENT_OFFICER: "FULFILMENT_OFFICER",
  AUDITOR: "TENANT_AUDITOR",
} as const;

export const CustomerRole = {
  CUSTOMER: "CUSTOMER",
} as const;

export const AllRoles = {
  ...PlatformRole,
  ...TenantRole,
  ...CustomerRole,
} as const;

export type UserRole = typeof AllRoles[keyof typeof AllRoles];

export const UserSchema = z.object({
  id: z.string().min(1),
  tenantId: z.string().nullable().default(null),
  email: z.string().email(),
  fullName: z.string().min(2),
  phone: z.string().optional(),
  role: z.string(),
  branchId: z.string().nullable().default(null),
  isActive: z.boolean().default(true),
  mfaEnabled: z.boolean().default(false),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  tenantId: z.string().optional(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: UserSchema,
  expiresIn: z.number().default(86400),
});

export type AuthTokenResponse = z.infer<typeof AuthTokenResponseSchema>;
