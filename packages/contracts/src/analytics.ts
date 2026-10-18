import { z } from "zod";

export const ExecutiveDashboardMetricsSchema = z.object({
  grossSalesGhs: z.number(),
  netSalesGhs: z.number(),
  revenueGhs: z.number(),
  costOfGoodsSoldGhs: z.number(),
  grossMarginPercent: z.number(),
  totalOrders: z.number().int(),
  averageOrderValueGhs: z.number(),
  totalRefundsGhs: z.number(),
  conversionRatePercent: z.number(),
  totalInventoryValuationGhs: z.number(),
  lowStockItemsCount: z.number().int(),
  stockTurnoverRate: z.number(),
  activeCustomersCount: z.number().int(),
  periodStartDate: z.string(),
  periodEndDate: z.string(),
});

export type ExecutiveDashboardMetrics = z.infer<typeof ExecutiveDashboardMetricsSchema>;

export const InventoryAnalyticsItemSchema = z.object({
  variantId: z.string(),
  productName: z.string(),
  sku: z.string(),
  branchName: z.string(),
  currentStock: z.number(),
  reorderPoint: z.number(),
  averageDailySales: z.number(),
  daysOfInventoryLeft: z.number(),
  stockStatus: z.enum(["HEALTHY", "LOW_STOCK", "OUT_OF_STOCK", "OVERSTOCKED", "DEAD_STOCK"]),
  turnoverRatio: z.number(),
});

export type InventoryAnalyticsItem = z.infer<typeof InventoryAnalyticsItemSchema>;

export const GroundedAiInsightSchema = z.object({
  id: z.string(),
  category: z.enum(["INVENTORY_REORDER", "MARGIN_OPPORTUNITY", "SLOW_MOVER", "AFFINITY_BUNDLE"]),
  title: z.string(),
  explanation: z.string(),
  groundedMetrics: z.record(z.any()),
  suggestedAction: z.string(),
  confidenceScore: z.number().min(0).max(1),
  createdAt: z.string().or(z.date()),
});

export type GroundedAiInsight = z.infer<typeof GroundedAiInsightSchema>;
