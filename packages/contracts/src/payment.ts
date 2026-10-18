import { z } from "zod";

export const PaymentMethodEnum = z.enum([
  "MTN_MOBILE_MONEY",
  "TELECEL_CASH",
  "AT_MONEY",
  "VISA_MASTERCARD",
  "BANK_TRANSFER",
  "CASH_ON_PICKUP",
  "CASH_ON_DELIVERY",
  "CORPORATE_INVOICE",
]);

export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "ABANDONED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const PaymentIntentSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  orderId: z.string(),
  reference: z.string(), // Unique transaction reference (e.g. TGM_ORD_123456789)
  provider: z.enum(["PAYSTACK", "CASH", "MANUAL_BANK"]).default("PAYSTACK"),
  amount: z.number(), // In GHS (or major currency units)
  currency: z.string().default("GHS"),
  customerEmail: z.string().email(),
  paymentMethod: PaymentMethodEnum.optional(),
  status: PaymentStatusEnum.default("PENDING"),
  providerReference: z.string().optional(),
  authorizationUrl: z.string().optional(),
  accessCode: z.string().optional(),
  channel: z.string().optional(), // mobile_money, card
  metadata: z.record(z.any()).default({}),
  paidAt: z.string().or(z.date()).optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

export const PaymentWebhookEventSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  provider: z.string().default("PAYSTACK"),
  event: z.string(), // charge.success, refund.processed
  reference: z.string(),
  signature: z.string(),
  rawPayload: z.record(z.any()),
  isProcessed: z.boolean().default(false),
  processedAt: z.string().or(z.date()).optional(),
  error: z.string().optional(),
  createdAt: z.string().or(z.date()),
});

export type PaymentWebhookEvent = z.infer<typeof PaymentWebhookEventSchema>;

export const RefundRequestSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  paymentIntentId: z.string(),
  orderId: z.string(),
  amount: z.number(),
  reason: z.string().min(5),
  approvedByUserId: z.string().optional(),
  status: z.enum(["REQUESTED", "APPROVED", "PROCESSED", "REJECTED"]).default("REQUESTED"),
  providerRefundId: z.string().optional(),
  createdAt: z.string().or(z.date()),
});

export type RefundRequest = z.infer<typeof RefundRequestSchema>;
