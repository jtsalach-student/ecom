import { z } from "zod";

export const CashierShiftSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  branchId: z.string(),
  userId: z.string(),
  registerNumber: z.string().default("REG-01"),
  openingCash: z.number(),
  expectedClosingCash: z.number().default(0),
  actualClosingCash: z.number().optional(),
  cashDifference: z.number().optional(),
  totalSalesCash: z.number().default(0),
  totalSalesCard: z.number().default(0),
  totalSalesMomo: z.number().default(0),
  totalRefunds: z.number().default(0),
  transactionCount: z.number().default(0),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
  openedAt: z.string().or(z.date()),
  closedAt: z.string().or(z.date()).optional(),
  closingNotes: z.string().optional(),
});

export type CashierShift = z.infer<typeof CashierShiftSchema>;

export const PosCartItemSchema = z.object({
  variantId: z.string(),
  productId: z.string(),
  name: z.string(),
  sku: z.string(),
  barcode: z.string().optional(),
  unitPrice: z.number(),
  quantity: z.number().int().positive(),
  discountAmount: z.number().default(0),
  totalPrice: z.number(),
  selectedSerial: z.string().optional(),
});

export type PosCartItem = z.infer<typeof PosCartItemSchema>;

export const PosTransactionSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  branchId: z.string(),
  shiftId: z.string(),
  cashierUserId: z.string(),
  receiptNumber: z.string(),
  customerName: z.string().default("Walk-in Customer"),
  customerPhone: z.string().optional(),
  subtotal: z.number(),
  discountTotal: z.number().default(0),
  taxTotal: z.number().default(0),
  grandTotal: z.number(),
  paymentMethod: z.enum(["CASH", "MTN_MOMO", "TELECEL_CASH", "CARD", "SPLIT"]),
  amountTendered: z.number(),
  changeDue: z.number().default(0),
  items: z.array(PosCartItemSchema),
  status: z.enum(["COMPLETED", "VOIDED", "REFUNDED"]).default("COMPLETED"),
  isOfflineSync: z.boolean().default(false),
  createdAt: z.string().or(z.date()),
});

export type PosTransaction = z.infer<typeof PosTransactionSchema>;
