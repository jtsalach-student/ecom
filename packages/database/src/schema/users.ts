import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").references(() => tenantsTable.id),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull(),
  branchId: text("branch_id"),
  isActive: boolean("is_active").default(true).notNull(),
  mfaEnabled: boolean("mfa_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
