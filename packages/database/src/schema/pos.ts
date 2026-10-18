import { pgTable, text, timestamp, real, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";
import { branchesTable } from "./branches.js";
import { usersTable } from "./users.js";

export const cashierShiftsTable = pgTable("cashier_shifts", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  branchId: text("branch_id").notNull().references(() => branchesTable.id),
  userId: text("user_id").notNull().references(() => usersTable.id),
  registerNumber: text("register_number").default("REG-01").notNull(),
  openingCash: real("opening_cash").notNull(),
  expectedClosingCash: real("expected_closing_cash").default(0).notNull(),
  actualClosingCash: real("actual_closing_cash"),
  cashDifference: real("cash_difference"),
  totalSalesCash: real("total_sales_cash").default(0).notNull(),
  totalSalesCard: real("total_sales_card").default(0).notNull(),
  totalSalesMomo: real("total_sales_momo").default(0).notNull(),
  totalRefunds: real("total_refunds").default(0).notNull(),
  transactionCount: integer("transaction_count").default(0).notNull(),
  status: text("status").default("OPEN").notNull(),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
  closingNotes: text("closing_notes"),
});

export const posTransactionsTable = pgTable("pos_transactions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  branchId: text("branch_id").notNull().references(() => branchesTable.id),
  shiftId: text("shift_id").notNull().references(() => cashierShiftsTable.id),
  cashierUserId: text("cashier_user_id").notNull().references(() => usersTable.id),
  receiptNumber: text("receipt_number").notNull().unique(),
  customerName: text("customer_name").default("Walk-in Customer").notNull(),
  customerPhone: text("customer_phone"),
  subtotal: real("subtotal").notNull(),
  discountTotal: real("discount_total").default(0).notNull(),
  taxTotal: real("tax_total").default(0).notNull(),
  grandTotal: real("grand_total").notNull(),
  paymentMethod: text("payment_method").notNull(),
  amountTendered: real("amount_tendered").notNull(),
  changeDue: real("change_due").default(0).notNull(),
  items: jsonb("items").$type<Array<Record<string, any>>>().notNull(),
  status: text("status").default("COMPLETED").notNull(),
  isOfflineSync: boolean("is_offline_sync").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
