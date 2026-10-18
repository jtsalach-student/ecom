import { z } from "zod";

export const ProductConditionEnum = z.enum([
  "BRAND_NEW",
  "OPEN_BOX",
  "CERTIFIED_REFURBISHED",
  "PRE_OWNED_EXCELLENT",
  "PRE_OWNED_GOOD",
]);

export type ProductCondition = z.infer<typeof ProductConditionEnum>;

export const ProductCategoryEnum = z.enum([
  "SMARTPHONES",
  "LAPTOPS",
  "TABLETS",
  "SMARTWATCHES",
  "AUDIO_HEADPHONES",
  "GAMING_CONSOLES",
  "NETWORKING_SATELLITE",
  "TELEVISIONS",
  "HOME_APPLIANCES",
  "ACCESSORIES",
  "PARTS_COMPONENTS",
]);

export type ProductCategory = z.infer<typeof ProductCategoryEnum>;

export const TechnicalSpecsSchema = z.object({
  processor: z.string().optional(),
  cpuCores: z.number().optional(),
  gpu: z.string().optional(),
  ramGb: z.number().optional(),
  storageGb: z.number().optional(),
  storageType: z.string().optional(), // NVMe, UFS 4.0, etc.
  displaySizeInches: z.number().optional(),
  displayResolution: z.string().optional(),
  displayRefreshRateHz: z.number().optional(),
  displayType: z.string().optional(), // OLED, AMOLED, Liquid Retina
  batteryCapacityMah: z.number().optional(),
  chargingWattage: z.number().optional(),
  cameraSpecs: z.string().optional(),
  connectivity: z.array(z.string()).optional(),
  operatingSystem: z.string().optional(),
  color: z.string().optional(),
  colorHex: z.string().optional(),
  weightGrams: z.number().optional(),
  dimensionsMm: z.string().optional(),
  inTheBox: z.array(z.string()).optional(),
  capacityBtu: z.string().optional(),
}).passthrough();

export type TechnicalSpecs = z.infer<typeof TechnicalSpecsSchema>;

export const ProductVariantSchema = z.object({
  id: z.string(),
  productId: z.string(),
  sku: z.string(),
  name: z.string(),
  color: z.string(),
  colorHex: z.string().optional(),
  storage: z.string().optional(),
  ram: z.string().optional(),
  retailPrice: z.number(),
  compareAtPrice: z.number().optional(),
  costPrice: z.number(),
  barcode: z.string().optional(),
  gtin: z.string().optional(),
  weightKg: z.number().default(0.5),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductListingSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  globalModelId: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  brand: z.string(),
  model: z.string(),
  modelNumber: z.string(),
  category: ProductCategoryEnum,
  condition: ProductConditionEnum.default("BRAND_NEW"),
  description: z.string(),
  shortDescription: z.string().optional(),
  specs: TechnicalSpecsSchema.default({}),
  images: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  animationPackageId: z.string().optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  warrantyMonths: z.number().default(12),
  tags: z.array(z.string()).default([]),
  advertisementProvenance: z.object({
    sourceUrl: z.string().optional(),
    retrievalDate: z.string().optional(),
    advertisedPriceGhs: z.number().optional(),
    priceConfirmed: z.boolean().optional(),
    availabilityStatus: z.enum(["IN_STOCK", "CALL_FOR_STOCK", "SPECIAL_ORDER"]).optional(),
    notes: z.string().optional(),
  }).optional(),
  variants: z.array(ProductVariantSchema).default([]),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type ProductListing = z.infer<typeof ProductListingSchema>;

export const ProductCompatibilitySchema = z.object({
  id: z.string(),
  primaryProductId: z.string(),
  compatibleProductId: z.string(),
  relationshipType: z.enum([
    "CHARGER",
    "CABLE",
    "CASE_COVER",
    "SCREEN_PROTECTOR",
    "BATTERY_REPLACEMENT",
    "DOCKING_STATION",
    "AUDIO_ACCESSORY",
    "SPARE_PART",
  ]),
  notes: z.string().optional(),
});

export type ProductCompatibility = z.infer<typeof ProductCompatibilitySchema>;
