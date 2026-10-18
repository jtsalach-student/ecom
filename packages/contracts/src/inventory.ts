import { z } from "zod";

export const BranchSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string().min(2),
  code: z.string(),
  address: z.string(),
  city: z.string(),
  region: z.string().default("Greater Accra"),
  country: z.string().default("Ghana"),
  phone: z.string(),
  isWarehouse: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.string().or(z.date()),
});

export type Branch = z.infer<typeof BranchSchema>;

export const StockMovementTypeEnum = z.enum([
  "RECEIVE_PO",
  "SALE_ORDER",
  "SALE_POS",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "RETURN_RESTOCK",
  "DAMAGED_WRITE_OFF",
  "INVENTORY_ADJUSTMENT",
  "RESERVATION_LOCK",
  "RESERVATION_RELEASE",
]);

export type StockMovementType = z.infer<typeof StockMovementTypeEnum>;

export const StockLedgerEntrySchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  branchId: z.string(),
  variantId: z.string(),
  movementType: StockMovementTypeEnum,
  quantityChange: z.number(), // positive or negative
  balanceAfter: z.number(),
  referenceType: z.string(), // ORDER, POS_SALE, PO, RMA
  referenceId: z.string(),
  performedByUserId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().or(z.date()),
});

export type StockLedgerEntry = z.infer<typeof StockLedgerEntrySchema>;

export const BranchInventorySchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  branchId: z.string(),
  variantId: z.string(),
  quantityOnHand: z.number().default(0),
  quantityReserved: z.number().default(0),
  quantityAvailable: z.number().default(0), // onHand - reserved
  reorderPoint: z.number().default(5),
  reorderQuantity: z.number().default(10),
  updatedAt: z.string().or(z.date()),
});

export type BranchInventory = z.infer<typeof BranchInventorySchema>;

export const SerializedDeviceSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  variantId: z.string(),
  branchId: z.string(),
  serialNumber: z.string(),
  imei1: z.string().optional(),
  imei2: z.string().optional(),
  status: z.enum(["IN_STOCK", "RESERVED", "SOLD", "DEFECTIVE", "IN_REPAIR", "RETURNED"]),
  orderId: z.string().optional(),
  posTransactionId: z.string().optional(),
  costPrice: z.number(),
  receivedAt: z.string().or(z.date()),
  soldAt: z.string().or(z.date()).optional(),
});

export type SerializedDevice = z.infer<typeof SerializedDeviceSchema>;

export const SupplierSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  paymentTerms: z.string().default("NET_30"),
  isActive: z.boolean().default(true),
});

export type Supplier = z.infer<typeof SupplierSchema>;
