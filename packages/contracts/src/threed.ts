import { z } from "zod";

export const ExplodedComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  meshName: z.string(),
  category: z.enum([
    "CHASSIS_FRAME",
    "DISPLAY_PANEL",
    "MOTHERBOARD",
    "PROCESSOR_SOC",
    "BATTERY_PACK",
    "CAMERA_MODULE",
    "LENS_ARRAY",
    "SPEAKER_HAPTICS",
    "VAPOR_CHAMBER_COOLING",
    "BACK_GLASS",
    "BUTTONS_PORT",
  ]),
  materialType: z.string(),
  description: z.string(),
  verifiedSpecs: z.record(z.string()).default({}),
  offsetPosition: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z] exploded offset
  offsetRotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
  explosionStage: z.number().int().min(1).max(10), // scroll progress stage (1 to 10)
  hotspotAnnotation: z.object({
    title: z.string(),
    content: z.string(),
    specBadge: z.string().optional(),
    position: z.tuple([z.number(), z.number(), z.number()]),
  }).optional(),
});

export type ExplodedComponent = z.infer<typeof ExplodedComponentSchema>;

export const CameraPathKeyframeSchema = z.object({
  scrollProgress: z.number().min(0).max(1), // 0.0 to 1.0
  cameraPosition: z.tuple([z.number(), z.number(), z.number()]),
  targetLookAt: z.tuple([z.number(), z.number(), z.number()]),
  fov: z.number().default(45),
  lightingIntensity: z.number().default(1.0),
  activeCallout: z.string().optional(),
});

export type CameraPathKeyframe = z.infer<typeof CameraPathKeyframeSchema>;

export const AnimationPackageSchema = z.object({
  id: z.string(),
  brand: z.string(),
  exactModel: z.string(),
  hardwareRevision: z.string(),
  modelGlbUrl: z.string().url().or(z.string()),
  environmentHdrUrl: z.string().url().or(z.string()).optional(),
  components: z.array(ExplodedComponentSchema),
  cameraSequence: z.array(CameraPathKeyframeSchema),
  qualityProfiles: z.object({
    highPolyLOD: z.string().optional(),
    mediumPolyLOD: z.string().optional(),
    mobileOptimizedLOD: z.string().optional(),
  }).default({}),
  reviewStatus: z.enum([
    "DRAFT",
    "TECHNICAL_REVIEW",
    "VISUAL_REVIEW",
    "APPROVED",
    "PUBLISHED",
    "ARCHIVED",
  ]).default("DRAFT"),
  technicalReviewerNotes: z.string().optional(),
  visualReviewerNotes: z.string().optional(),
  publishedAt: z.string().or(z.date()).optional(),
});

export type AnimationPackage = z.infer<typeof AnimationPackageSchema>;
