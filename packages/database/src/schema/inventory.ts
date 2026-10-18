import { pgTable, text, timestamp, integer, real } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";
import { branchesTable } from "./branches.js";
import { productVariantsTable } from "./products.js";

export const suppliersTable = pgTable("suppliers", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  paymentTerms: text("payment_terms").default("NET_30").notNull(),
});

export const branchInventoryTable = pgTable("branch_inventory", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  branchId: text("branch_id").notNull().references(() => branchesTable.id),
  variantId: text("variant_id").notNull().references(() => productVariantsTable.id),
  quantityOnHand: integer("quantity_on_hand").default(0).notNull(),
  quantityReserved: integer("quantity_reserved").default(0).notNull(),
  quantityAvailable: integer("quantity_available").default(0).notNull(),
  reorderPoint: integer("reorder_point").default(5).notNull(),
  reorderQuantity: integer("reorder_quantity").default(10).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stockLedgerTable = pgTable("stock_ledger", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  branchId: text("branch_id").notNull().references(() => branchesTable.id),
  variantId: text("variant_id").notNull().references(() => productVariantsTable.id),
  movementType: text("movement_type").notNull(),
  quantityChange: integer("quantity_change").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  referenceType: text("reference_type").notNull(),
  referenceId: text("reference_id").notNull(),
  performedByUserId: text("performed_by_user_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const serializedDevicesTable = pgTable("serialized_devices", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  variantId: text("variant_id").notNull().references(() => productVariantsTable.id),
  branchId: text("branch_id").notNull().references(() => branchesTable.id),
  serialNumber: text("serial_number").notNull(),
  imei1: text("imei_1"),
  imei2: text("imei_2"),
  status: text("status").default("IN_STOCK").notNull(),
  orderId: text("order_id"),
  posTransactionId: text("pos_transaction_id"),
  costPrice: real("cost_price").notNull(),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  soldAt: timestamp("sold_at"),
});
