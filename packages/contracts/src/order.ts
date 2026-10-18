import { z } from "zod";

export const OrderStatusEnum = z.enum([
  "DRAFT",
  "PENDING_PAYMENT",
  "PAYMENT_PROCESSING",
  "PAID",
  "AWAITING_FULFILMENT",
  "PARTIALLY_FULFILLED",
  "SHIPPED",
  "READY_FOR_PICKUP",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const OrderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  variantId: z.string(),
  productId: z.string(),
  name: z.string(),
  sku: z.string(),
  unitPrice: z.number(),
  quantity: z.number().int().positive(),
  totalPrice: z.number(),
  discountAmount: z.number().default(0),
  serialNumbers: z.array(z.string()).default([]),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderDeliveryDetailsSchema = z.object({
  deliveryMethod: z.enum(["STANDARD_DELIVERY", "EXPRESS_SAME_DAY", "BRANCH_PICKUP"]),
  recipientName: z.string().min(2),
  recipientPhone: z.string().min(7),
  deliveryAddress: z.string().optional(),
  city: z.string().default("Accra"),
  region: z.string().default("Greater Accra"),
  pickupBranchId: z.string().optional(),
  trackingNumber: z.string().optional(),
  courierName: z.string().optional(),
  estimatedDeliveryDate: z.string().optional(),
  deliveredAt: z.string().or(z.date()).optional(),
});

export type OrderDeliveryDetails = z.infer<typeof OrderDeliveryDetailsSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  orderNumber: z.string(),
  customerId: z.string().nullable().default(null),
  customerEmail: z.string().email(),
  customerName: z.string(),
  customerPhone: z.string(),
  channel: z.enum(["STOREFRONT", "POS", "WHATSAPP", "PHONE"]).default("STOREFRONT"),
  branchId: z.string().nullable().default(null),
  status: OrderStatusEnum.default("PENDING_PAYMENT"),
  subtotal: z.number(),
  discountTotal: z.number().default(0),
  taxTotal: z.number().default(0),
  deliveryFee: z.number().default(0),
  grandTotal: z.number(),
  currency: z.string().default("GHS"),
  notes: z.string().optional(),
  deliveryDetails: OrderDeliveryDetailsSchema,
  items: z.array(OrderItemSchema).default([]),
  reservationExpiresAt: z.string().or(z.date()).optional(),
  paidAt: z.string().or(z.date()).optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type Order = z.infer<typeof OrderSchema>;
