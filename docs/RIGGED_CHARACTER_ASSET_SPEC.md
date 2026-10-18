# 3D Rigged Character Technical Asset Specification
## Google Antigravity & Gadget Commerce Platform (GCP)
### Version 2.0 — October 2026

This specification defines the exact 3D modeling, skeletal rigging, animation clips, and PBR material requirements for 3D Technical Artists (Blender / Maya / 3ds Max / Cinema 4D) producing production-ready GLB assets for the Gadget Commerce Platform authentication and concierge stages.

---

## 1. Technical Deliverable Summary
- **Format**: Binary glTF 2.0 (`.glb`)
- **Target Size**: Under 5.0 MB (compressed / Draco optional)
- **Target Polycount**: 18,000 – 28,000 triangles (LOD0)
- **Target Platform**: Real-time WebGL via Three.js (r174+)
- **Output File**: `character_rigged.glb` placed in:
  - `apps/storefront/public/models/character_rigged.glb`
  - `apps/retail-admin/public/models/character_rigged.glb`
  - `apps/platform-admin/public/models/character_rigged.glb`

---

## 2. Skeletal Rig Hierarchy & Bone Naming Standard
The Three.js animation controller binds strictly to the following standard bone naming conventions (case-sensitive, underscore-separated):

```text
root (0, 0, 0)
 └── hips (0, 0.95, 0)
      ├── spine_lower (0, 0.18, 0)
      │    └── spine_chest (0, 0.22, 0)
      │         ├── neck (0, 0.22, 0)
      │         │    └── head (0, 0.14, 0)
      │         │         ├── eye_l (-0.065, 0.08, 0.16)
      │         │         ├── eye_r (0.065, 0.08, 0.16)
      │         │         ├── eyelid_l (-0.065, 0.11, 0.16)
      │         │         └── eyelid_r (0.065, 0.11, 0.16)
      │         ├── shoulder_l (-0.16, 0.16, 0)
      │         │    └── upper_arm_l (-0.08, 0, 0)
      │         │         └── forearm_l (0, -0.22, 0)
      │         │              └── hand_l (0, -0.20, 0)
      │         └── shoulder_r (0.16, 0.16, 0)
      │              └── upper_arm_r (0.08, 0, 0)
      │                   └── forearm_r (0, -0.22, 0)
      │                        └── hand_r (0, -0.20, 0)
      ├── hip_l (-0.10, -0.05, 0)
      │    └── thigh_l (0, -0.05, 0)
      │         └── shin_l (0, -0.38, 0)
      │              └── foot_l (0, -0.38, 0.08)
      └── hip_r (0.10, -0.05, 0)
           └── thigh_r (0, -0.05, 0)
                └── shin_r (0, -0.38, 0)
                     └── foot_r (0, -0.38, 0.08)
```

---

## 3. Required Canonical Animation Clips
The GLB must embed the following 6 canonical `AnimationClip` tracks:

| Clip Name | Duration | Description | Key Tracks |
| :--- | :--- | :--- | :--- |
| `idle` | 3.0s (Loop) | Natural subtle breathing, chest expansion, weight shift, soft head tilt. | `hips.position`, `spine_chest.quaternion`, `head.quaternion` |
| `fold_arms` | 0.8s (Clamp) | Articulates shoulders and elbows inward, forearms cross securely across chest. | `shoulder_l/r`, `upper_arm_l/r`, `forearm_l/r`, `head` |
| `unfold_arms` | 0.6s (Clamp) | Uncrosses forearms back to relaxed neutral posture. | `upper_arm_l/r`, `forearm_l/r` |
| `wave` | 1.8s (Clamp) | Right arm uncrosses, lifts up to shoulder level, hand oscillates $\pm 18^\circ$ in 3 wave cycles, arm lowers. | `upper_arm_r`, `forearm_r`, `hand_r`, `head` |
| `cover_eyes` | 0.7s (Clamp) | Arms raise up, forearms cross upward in front of face, hands cup over eyes, head turns slightly away. | `upper_arm_l/r`, `forearm_l/r`, `head` |
| `pickup_product` | 3.2s (Clamp) | Reaches to right pedestal, grasps Sony WH-1000XM6 gadget, lifts to eye level, inspects, presents to viewer, lowers back. | `spine_chest`, `upper_arm_r`, `forearm_r`, `hand_r`, `head` |
| `success` | 1.2s (Clamp) | Warm welcoming open-arms celebratory posture with encouraging head nod. | `upper_arm_l/r`, `forearm_l/r`, `head` |

---

## 4. Visual Aesthetics & PBR Material Channels
The character must reproduce the warm dimensional quality of the reference photograph:
- **Hair**: Fluffy sculpted auburn clusters (`#9B4E28`), anisotropic roughness map.
- **Eyes**: Large expressive amber-hazel irises (`#C87018`) with dark limbal ring and dark pupil (`#090503`). Cornea roughness 0.05.
- **Skin**: Peach-toned complexion with subtle procedural freckle albedo across the nose bridge and upper cheeks. Subsurface scattering radius: `(0.15, 0.08, 0.04)`.
- **Hoodie Jacket (Customer)**: Warm mustard-yellow (`#E59B20`) heavy cotton weave with micro-stitched normal map, metallic zipper pull (`#D4AF37`), and hood collar.
- **Turtleneck Collar**: Heather-gray (`#71717A`) rib-knit texture.
- **Pants & Footwear**: Dark charcoal denim (`#27272A`) with off-white sneakers.

---

## 5. Scene Product Synchronization (Sony WH-1000XM6)
At timestamp `t = 0.5s` of `pickup_product`, the gadget is parented to `hand_r.matrixWorld`. At `t = 2.5s`, it is unparented and returned to the pedestal (`x: 0.42, y: 0.82, z: 0.35`).
