import { pgTable, text, timestamp, jsonb, real } from "drizzle-orm/pg-core";

export const tenantsTable = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  primaryDomain: text("primary_domain").notNull().unique(),
  additionalDomains: jsonb("additional_domains").$type<string[]>().default([]),
  currency: text("currency").default("GHS").notNull(),
  locale: text("locale").default("en-GH").notNull(),
  timezone: text("timezone").default("Africa/Accra").notNull(),
  taxRatePercent: real("tax_rate_percent").default(0).notNull(),
  subscriptionPlan: text("subscription_plan").default("growth").notNull(),
  subscriptionStatus: text("subscription_status").default("active").notNull(),
  branding: jsonb("branding").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
