import { pgTable, text, timestamp, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";
import { ordersTable } from "./orders.js";

export const paymentIntentsTable = pgTable("payment_intents", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  orderId: text("order_id").notNull().references(() => ordersTable.id),
  reference: text("reference").notNull().unique(),
  provider: text("provider").default("PAYSTACK").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("GHS").notNull(),
  customerEmail: text("customer_email").notNull(),
  paymentMethod: text("payment_method"),
  status: text("status").default("PENDING").notNull(),
  providerReference: text("provider_reference"),
  authorizationUrl: text("authorization_url"),
  accessCode: text("access_code"),
  channel: text("channel"),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}).notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const paymentEventsTable = pgTable("payment_events", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  provider: text("provider").default("PAYSTACK").notNull(),
  event: text("event").notNull(),
  reference: text("reference").notNull(),
  signature: text("signature").notNull(),
  rawPayload: jsonb("raw_payload").notNull(),
  isProcessed: boolean("is_processed").default(false).notNull(),
  processedAt: timestamp("processed_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const refundRequestsTable = pgTable("refund_requests", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  paymentIntentId: text("payment_intent_id").notNull().references(() => paymentIntentsTable.id),
  orderId: text("order_id").notNull().references(() => ordersTable.id),
  amount: real("amount").notNull(),
  reason: text("reason").notNull(),
  approvedByUserId: text("approved_by_user_id"),
  status: text("status").default("REQUESTED").notNull(),
  providerRefundId: text("provider_refund_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
