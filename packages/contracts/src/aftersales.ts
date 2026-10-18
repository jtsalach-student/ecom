import { z } from "zod";

export const WarrantyRecordSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  orderId: z.string().optional(),
  posTransactionId: z.string().optional(),
  productId: z.string(),
  variantId: z.string(),
  serialNumber: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().email(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  warrantyTerms: z.string(),
  status: z.enum(["ACTIVE", "CLAIMED", "EXPIRED", "VOIDED"]).default("ACTIVE"),
});

export type WarrantyRecord = z.infer<typeof WarrantyRecordSchema>;

export const RepairJobCardSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  jobNumber: z.string(),
  branchId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  deviceBrand: z.string(),
  deviceModel: z.string(),
  serialOrImei: z.string(),
  reportedFault: z.string(),
  diagnosticNotes: z.string().optional(),
  technicianUserId: z.string().optional(),
  estimatedCost: z.number().default(0),
  finalCost: z.number().default(0),
  status: z.enum([
    "RECEIVED",
    "DIAGNOSING",
    "AWAITING_APPROVAL",
    "PARTS_ORDERED",
    "IN_PROGRESS",
    "TESTING",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "CANNOT_REPAIR",
  ]).default("RECEIVED"),
  partsUsed: z.array(z.string()).default([]),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type RepairJobCard = z.infer<typeof RepairJobCardSchema>;

export const TradeInValuationSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().email(),
  deviceBrand: z.string(),
  deviceModel: z.string(),
  storage: z.string(),
  powersOn: z.boolean(),
  screenCondition: z.enum(["FLAWLESS", "SCRATCHED", "CRACKED", "BLEEDING"]),
  bodyCondition: z.enum(["FLAWLESS", "MINOR_WEAR", "DENTED"]),
  batteryHealthPercent: z.number().optional(),
  faceIdOrTouchIdWorking: z.boolean(),
  camerasWorking: z.boolean(),
  preliminaryOfferGhs: z.number(),
  finalAppraisedOfferGhs: z.number().optional(),
  status: z.enum([
    "SUBMITTED",
    "INSPECTION_SCHEDULED",
    "INSPECTED",
    "OFFER_MADE",
    "ACCEPTED",
    "REJECTED",
    "STORE_CREDIT_ISSUED",
  ]).default("SUBMITTED"),
  createdAt: z.string().or(z.date()),
});

export type TradeInValuation = z.infer<typeof TradeInValuationSchema>;
