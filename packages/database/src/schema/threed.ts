import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const animationPackagesTable = pgTable("animation_packages", {
  id: text("id").primaryKey(),
  brand: text("brand").notNull(),
  exactModel: text("exact_model").notNull(),
  hardwareRevision: text("hardware_revision").notNull(),
  modelGlbUrl: text("model_glb_url").notNull(),
  environmentHdrUrl: text("environment_hdr_url"),
  components: jsonb("components").$type<Array<Record<string, any>>>().default([]).notNull(),
  cameraSequence: jsonb("camera_sequence").$type<Array<Record<string, any>>>().default([]).notNull(),
  qualityProfiles: jsonb("quality_profiles").$type<Record<string, any>>().default({}).notNull(),
  reviewStatus: text("review_status").default("DRAFT").notNull(),
  technicalReviewerNotes: text("technical_reviewer_notes"),
  visualReviewerNotes: text("visual_reviewer_notes"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
