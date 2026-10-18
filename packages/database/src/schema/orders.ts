import { pgTable, text, timestamp, real, integer, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";
import { productVariantsTable, productsTable } from "./products.js";

export const ordersTable = pgTable("orders", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  orderNumber: text("order_number").notNull().unique(),
  customerId: text("customer_id"),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  channel: text("channel").default("STOREFRONT").notNull(),
  branchId: text("branch_id"),
  status: text("status").default("PENDING_PAYMENT").notNull(),
  subtotal: real("subtotal").notNull(),
  discountTotal: real("discount_total").default(0).notNull(),
  taxTotal: real("tax_total").default(0).notNull(),
  deliveryFee: real("delivery_fee").default(0).notNull(),
  grandTotal: real("grand_total").notNull(),
  currency: text("currency").default("GHS").notNull(),
  notes: text("notes"),
  deliveryDetails: jsonb("delivery_details").$type<Record<string, any>>().notNull(),
  reservationExpiresAt: timestamp("reservation_expires_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItemsTable = pgTable("order_items", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  orderId: text("order_id").notNull().references(() => ordersTable.id),
  variantId: text("variant_id").notNull().references(() => productVariantsTable.id),
  productId: text("product_id").notNull().references(() => productsTable.id),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  unitPrice: real("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  totalPrice: real("total_price").notNull(),
  discountAmount: real("discount_amount").default(0).notNull(),
  serialNumbers: jsonb("serial_numbers").$type<string[]>().default([]).notNull(),
});
