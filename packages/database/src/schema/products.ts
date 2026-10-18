import { pgTable, text, timestamp, boolean, real, integer, jsonb } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants.js";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  globalModelId: text("global_model_id"),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  modelNumber: text("model_number").notNull(),
  category: text("category").notNull(),
  condition: text("condition").default("BRAND_NEW").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  specs: jsonb("specs").$type<Record<string, any>>().default({}).notNull(),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  featuredImage: text("featured_image"),
  animationPackageId: text("animation_package_id"),
  isPublished: boolean("is_published").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  warrantyMonths: integer("warranty_months").default(12).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productVariantsTable = pgTable("product_variants", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  productId: text("product_id").notNull().references(() => productsTable.id),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  colorHex: text("color_hex"),
  storage: text("storage"),
  ram: text("ram"),
  retailPrice: real("retail_price").notNull(),
  compareAtPrice: real("compare_at_price"),
  costPrice: real("cost_price").notNull(),
  barcode: text("barcode"),
  gtin: text("gtin"),
  weightKg: real("weight_kg").default(0.5).notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const productCompatibilitiesTable = pgTable("product_compatibilities", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenantsTable.id),
  primaryProductId: text("primary_product_id").notNull().references(() => productsTable.id),
  compatibleProductId: text("compatible_product_id").notNull().references(() => productsTable.id),
  relationshipType: text("relationship_type").notNull(),
  notes: text("notes"),
});
