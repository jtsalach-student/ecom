import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";

export const branchesTable = pgTable("branches", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  name: text("name").notNull(),
  code: text("code").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  region: text("region").default("Greater Accra").notNull(),
  country: text("country").default("Ghana").notNull(),
  phone: text("phone").notNull(),
  isWarehouse: boolean("is_warehouse").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
