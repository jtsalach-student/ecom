import { pgTable, text, timestamp, real, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";
import { productsTable, productVariantsTable } from "./products.js";
import { branchesTable } from "./branches.js";
import { usersTable } from "./users.js";

export const warrantyRecordsTable = pgTable("warranty_records", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  orderId: text("order_id"),
  posTransactionId: text("pos_transaction_id"),
  productId: text("product_id").notNull().references(() => productsTable.id),
  variantId: text("variant_id").notNull().references(() => productVariantsTable.id),
  serialNumber: text("serial_number").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  warrantyTerms: text("warranty_terms").notNull(),
  status: text("status").default("ACTIVE").notNull(),
});

export const repairJobCardsTable = pgTable("repair_job_cards", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  jobNumber: text("job_number").notNull().unique(),
  branchId: text("branch_id").notNull().references(() => branchesTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deviceBrand: text("device_brand").notNull(),
  deviceModel: text("device_model").notNull(),
  serialOrImei: text("serial_or_imei").notNull(),
  reportedFault: text("reported_fault").notNull(),
  diagnosticNotes: text("diagnostic_notes"),
  technicianUserId: text("technician_user_id").references(() => usersTable.id),
  estimatedCost: real("estimated_cost").default(0).notNull(),
  finalCost: real("final_cost").default(0).notNull(),
  status: text("status").default("RECEIVED").notNull(),
  partsUsed: jsonb("parts_used").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tradeInValuationsTable = pgTable("trade_in_valuations", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email").notNull(),
  deviceBrand: text("device_brand").notNull(),
  deviceModel: text("device_model").notNull(),
  storage: text("storage").notNull(),
  powersOn: boolean("powers_on").notNull(),
  screenCondition: text("screen_condition").notNull(),
  bodyCondition: text("body_condition").notNull(),
  batteryHealthPercent: real("battery_health_percent"),
  faceIdOrTouchIdWorking: boolean("face_id_or_touch_id_working").notNull(),
  camerasWorking: boolean("cameras_working").notNull(),
  preliminaryOfferGhs: real("preliminary_offer_ghs").notNull(),
  finalAppraisedOfferGhs: real("final_appraised_offer_ghs"),
  status: text("status").default("SUBMITTED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
