import { z } from "zod";

export const TenantBrandingSchema = z.object({
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#0F172A"),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#3B82F6"),
  secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).default("#10B981"),
  fontFamily: z.string().default("Outfit, sans-serif"),
  heroTitle: z.string().default("Premium Electronics & Gadgets"),
  heroSubtitle: z.string().default("Flagship devices, verified specs, and cinematic 3D teardowns."),
  supportEmail: z.string().email().default("support@thegadgetmaster.gh"),
  supportPhone: z.string().default("+233 24 000 0000"),
  socialLinks: z.record(z.string()).default({}),
  featuredProductId: z.string().optional(),
});

export type TenantBranding = z.infer<typeof TenantBrandingSchema>;

export const TenantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  slug: z.string().min(2),
  primaryDomain: z.string(),
  additionalDomains: z.array(z.string()).default([]),
  currency: z.string().default("GHS"),
  locale: z.string().default("en-GH"),
  timezone: z.string().default("Africa/Accra"),
  taxRatePercent: z.number().default(0), // VAT/NHIL/GETFund handling
  subscriptionPlan: z.enum(["starter", "growth", "enterprise"]).default("growth"),
  subscriptionStatus: z.enum(["active", "trialing", "past_due", "suspended"]).default("active"),
  branding: TenantBrandingSchema.default({}),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type Tenant = z.infer<typeof TenantSchema>;
