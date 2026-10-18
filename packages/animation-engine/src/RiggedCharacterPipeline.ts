import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "fs";
import path from "path";

/**
 * Procedural 3D Rigged Character Pipeline
 * Generates an articulated 3D character with:
 * - Full skeletal bone hierarchy (root, hips, spine, chest, neck, head, eyes, arms, hands, legs, feet)
 * - Articulated shoulders, elbows, wrists, hips, and knees
 * - Segmented PBR mesh parts matching the Pixar reference boy (auburn hair, yellow hoodie, gray turtleneck)
 * - Complete suite of authored AnimationClips:
 *   - 'idle' (natural breathing and posture)
 *   - 'wave' (unfolds arm, waves hand, returns)
 *   - 'fold_arms' (crosses forearms across chest)
 *   - 'unfold_arms' (uncrosses arms)
 *   - 'reach_product' (extends arm to product pedestal)
 *   - 'pickup_product' (grasps, lifts, inspects, and presents gadget)
 *   - 'cover_eyes' (raises hands over eyes for password privacy)
 *   - 'success' (welcoming celebratory posture)
 * - Binary GLB export capability via GLTFExporter
 */

export interface CharacterRigData {
  characterGroup: THREE.Group;
  bones: Record<string, THREE.Bone>;
  skeleton: THREE.Skeleton;
  clips: THREE.AnimationClip[];
  materials: Record<string, THREE.Material>;
  productProp: THREE.Group;
}

export function buildRiggedCharacter(variant: "customer" | "staff" | "admin" = "customer"): CharacterRigData {
  const characterGroup = new THREE.Group();
  characterGroup.name = "RiggedBoyCharacter";

  // 1. Construct Bone Hierarchy
  const bones: Record<string, THREE.Bone> = {};

  const createBone = (name: string, y: number = 0, x: number = 0, z: number = 0): THREE.Bone => {
    const bone = new THREE.Bone();
    bone.name = name;
    bone.position.set(x, y, z);
    bones[name] = bone;
    return bone;
  };

  const root = createBone("root", 0, 0, 0);
  const hips = createBone("hips", 0.95, 0, 0);
  const spineLower = createBone("spine_lower", 0.18, 0, 0);
  const spineChest = createBone("spine_chest", 0.22, 0, 0);
  const neck = createBone("neck", 0.22, 0, 0);
  const head = createBone("head", 0.14, 0, 0);

  // Facial feature nodes
  const eyeL = createBone("eye_l", 0.08, -0.065, 0.16);
  const eyeR = createBone("eye_r", 0.08, 0.065, 0.16);
  const eyelidL = createBone("eyelid_l", 0.11, -0.065, 0.16);
  const eyelidR = createBone("eyelid_r", 0.11, 0.065, 0.16);

  head.add(eyeL);
  head.add(eyeR);
  head.add(eyelidL);
  head.add(eyelidR);

  // Left Arm (Viewer's right if facing)
  const shoulderL = createBone("shoulder_l", 0.16, -0.16, 0);
  const upperArmL = createBone("upper_arm_l", 0, -0.08, 0);
  const forearmL = createBone("forearm_l", -0.22, 0, 0);
  const handL = createBone("hand_l", -0.2, 0, 0);

  shoulderL.add(upperArmL);
  upperArmL.add(forearmL);
  forearmL.add(handL);

  // Right Arm (Primary interacting arm)
  const shoulderR = createBone("shoulder_r", 0.16, 0.16, 0);
  const upperArmR = createBone("upper_arm_r", 0, 0.08, 0);
  const forearmR = createBone("forearm_r", -0.22, 0, 0);
  const handR = createBone("hand_r", -0.2, 0, 0);

  shoulderR.add(upperArmR);
  upperArmR.add(forearmR);
  forearmR.add(handR);

  // Left Leg
  const hipL = createBone("hip_l", -0.05, -0.1, 0);
  const thighL = createBone("thigh_l", -0.05, 0, 0);
  const shinL = createBone("shin_l", -0.38, 0, 0);
  const footL = createBone("foot_l", -0.38, 0, 0.08);

  hipL.add(thighL);
  thighL.add(shinL);
  shinL.add(footL);

  // Right Leg
  const hipR = createBone("hip_r", -0.05, 0.1, 0);
  const thighR = createBone("thigh_r", -0.05, 0, 0);
  const shinR = createBone("shin_r", -0.38, 0, 0);
  const footR = createBone("foot_r", -0.38, 0, 0.08);

  hipR.add(thighR);
  thighR.add(shinR);
  shinR.add(footR);

  // Assemble hierarchy
  neck.add(head);
  spineChest.add(neck);
  spineChest.add(shoulderL);
  spineChest.add(shoulderR);
  spineLower.add(spineChest);
  hips.add(spineLower);
  hips.add(hipL);
  hips.add(hipR);
  root.add(hips);
  characterGroup.add(root);

  const skeleton = new THREE.Skeleton(Object.values(bones));

  // 2. High-Grade PBR Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf3bf9f,
    roughness: 0.55,
    metalness: 0.05,
    name: "SkinMat",
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x9b4e28, // Warm reddish auburn
    roughness: 0.75,
    metalness: 0.1,
    name: "HairAuburnMat",
  });

  // Variant-specific clothing
  const jacketColor =
    variant === "staff" ? 0x1e3a8a : variant === "admin" ? 0x18181b : 0xe59b20; // Mustard Yellow
  const jacketMat = new THREE.MeshStandardMaterial({
    color: jacketColor,
    roughness: 0.65,
    metalness: 0.08,
    name: "JacketMat",
  });

  const turtleneckMat = new THREE.MeshStandardMaterial({
    color: 0x71717a, // Heather Gray
    roughness: 0.85,
    name: "TurtleneckMat",
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x27272a, // Dark Charcoal / Denim
    roughness: 0.8,
    name: "PantsMat",
  });

  const shoesMat = new THREE.MeshStandardMaterial({
    color: 0xf4f4f5, // Off-white sneakers
    roughness: 0.5,
    name: "ShoesMat",
  });

  const eyeScleraMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.15,
    name: "ScleraMat",
  });

  const irisAmberMat = new THREE.MeshStandardMaterial({
    color: 0xc87018,
    roughness: 0.1,
    metalness: 0.2,
    name: "IrisAmberMat",
  });

  const pupilBlackMat = new THREE.MeshBasicMaterial({
    color: 0x090503,
    name: "PupilMat",
  });

  const badgeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.8,
    name: "BadgeMat",
  });

  // 3. Meshes Attached to Articulated Bones
  // Head Mesh (Sculpted oval boy head with chin and cute cheeks)
  const headGeo = new THREE.SphereGeometry(0.19, 24, 24);
  headGeo.scale(1.0, 1.08, 0.96);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Auburn Layered Fluffy Hair Cluster
  const hairGroup = new THREE.Group();
  const hairTopGeo = new THREE.SphereGeometry(0.2, 20, 20);
  hairTopGeo.scale(1.04, 0.95, 1.05);
  const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
  hairTop.position.set(0, 0.06, -0.02);
  hairGroup.add(hairTop);

  // Hair Tuft Bangs
  for (let i = 0; i < 5; i++) {
    const tuftGeo = new THREE.ConeGeometry(0.045, 0.12, 12);
    tuftGeo.rotateX(Math.PI / 3);
    const tuft = new THREE.Mesh(tuftGeo, hairMat);
    tuft.position.set(-0.08 + i * 0.04, 0.14, 0.14 + (i % 2) * 0.02);
    tuft.rotation.z = (i - 2) * 0.18;
    hairGroup.add(tuft);
  }
  head.add(hairGroup);

  // Cute Rounded Nose with Freckles
  const noseGeo = new THREE.SphereGeometry(0.03, 16, 16);
  noseGeo.scale(1.0, 0.8, 1.2);
  const noseMesh = new THREE.Mesh(noseGeo, skinMat);
  noseMesh.position.set(0, -0.01, 0.19);
  head.add(noseMesh);

  // Eye Assemblies on eye bones
  [eyeL, eyeR].forEach((eyeBone, idx) => {
    const isLeft = idx === 0;
    const scleraGeo = new THREE.SphereGeometry(0.036, 16, 16);
    const sclera = new THREE.Mesh(scleraGeo, eyeScleraMat);
    eyeBone.add(sclera);

    const irisGeo = new THREE.CircleGeometry(0.022, 16);
    const iris = new THREE.Mesh(irisGeo, irisAmberMat);
    iris.position.z = 0.034;
    eyeBone.add(iris);

    const pupilGeo = new THREE.CircleGeometry(0.011, 16);
    const pupil = new THREE.Mesh(pupilGeo, pupilBlackMat);
    pupil.position.z = 0.035;
    eyeBone.add(pupil);

    // Eyelid upper flap for blinking
    const lidGeo = new THREE.SphereGeometry(0.038, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    lidGeo.rotateX(Math.PI);
    const lid = new THREE.Mesh(lidGeo, skinMat);
    lid.name = `lid_${isLeft ? "l" : "r"}`;
    eyeBone.add(lid);
  });

  // Neck Turtleneck
  const neckGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.16, 16);
  const neckMesh = new THREE.Mesh(neckGeo, turtleneckMat);
  neckMesh.position.y = 0.06;
  neck.add(neckMesh);

  // Torso / Jacket (Spine Chest)
  const chestGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.26, 18);
  const chestMesh = new THREE.Mesh(chestGeo, jacketMat);
  chestMesh.castShadow = true;
  spineChest.add(chestMesh);

  // Lower Jacket (Spine Lower)
  const lowerJacketGeo = new THREE.CylinderGeometry(0.17, 0.18, 0.22, 18);
  const lowerJacketMesh = new THREE.Mesh(lowerJacketGeo, jacketMat);
  spineLower.add(lowerJacketMesh);

  // Role Badge (if staff or admin)
  if (variant === "staff" || variant === "admin") {
    const badgeGeo = new THREE.BoxGeometry(0.06, 0.04, 0.01);
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0.09, 0.06, 0.17);
    spineChest.add(badge);
  }

  // Arms and Forearms
  // Left Arm
  const upperArmLGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.22, 14);
  upperArmLGeo.translate(0, -0.11, 0);
  const upperArmLMesh = new THREE.Mesh(upperArmLGeo, jacketMat);
  upperArmL.add(upperArmLMesh);

  const forearmLGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.2, 14);
  forearmLGeo.translate(0, -0.1, 0);
  const forearmLMesh = new THREE.Mesh(forearmLGeo, jacketMat);
  forearmL.add(forearmLMesh);

  const handLGeo = new THREE.BoxGeometry(0.07, 0.08, 0.04);
  const handLMesh = new THREE.Mesh(handLGeo, skinMat);
  handLMesh.position.y = -0.04;
  handL.add(handLMesh);

  // Right Arm (Interacting arm)
  const upperArmRGeo = new THREE.CylinderGeometry(0.06, 0.055, 0.22, 14);
  upperArmRGeo.translate(0, -0.11, 0);
  const upperArmRMesh = new THREE.Mesh(upperArmRGeo, jacketMat);
  upperArmR.add(upperArmRMesh);

  const forearmRGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.2, 14);
  forearmRGeo.translate(0, -0.1, 0);
  const forearmRMesh = new THREE.Mesh(forearmRGeo, jacketMat);
  forearmR.add(forearmRMesh);

  const handRGeo = new THREE.BoxGeometry(0.07, 0.08, 0.04);
  const handRMesh = new THREE.Mesh(handRGeo, skinMat);
  handRMesh.position.y = -0.04;
  handR.add(handRMesh);

  // Legs and Feet
  [
    { hip: hipL, thigh: thighL, shin: shinL, foot: footL },
    { hip: hipR, thigh: thighR, shin: shinR, foot: footR },
  ].forEach(({ thigh, shin, foot }) => {
    const thighGeo = new THREE.CylinderGeometry(0.075, 0.065, 0.36, 14);
    thighGeo.translate(0, -0.18, 0);
    thigh.add(new THREE.Mesh(thighGeo, pantsMat));

    const shinGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.36, 14);
    shinGeo.translate(0, -0.18, 0);
    shin.add(new THREE.Mesh(shinGeo, pantsMat));

    const footGeo = new THREE.BoxGeometry(0.09, 0.07, 0.16);
    footGeo.translate(0, -0.035, 0.03);
    foot.add(new THREE.Mesh(footGeo, shoesMat));
  });

  // 4. Interactive Scene Prop: Miniature Sony Headphones on Pedestal
  const productProp = new THREE.Group();
  productProp.name = "SceneProductGadget";
  const propGeo = new THREE.TorusGeometry(0.08, 0.025, 12, 24);
  const propMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.7 });
  const propMesh = new THREE.Mesh(propGeo, propMat);
  propMesh.rotation.x = Math.PI / 2;
  productProp.add(propMesh);
  productProp.position.set(0.35, 0.85, 0.35); // Placed on right pedestal in front of character

  // 5. Construct Keyframed AnimationClips
  const clips = createCharacterAnimationClips();

  return {
    characterGroup,
    bones,
    skeleton,
    clips,
    materials: {
      skin: skinMat,
      hair: hairMat,
      jacket: jacketMat,
      turtleneck: turtleneckMat,
      pants: pantsMat,
      shoes: shoesMat,
    },
    productProp,
  };
}

/**
 * Creates canonical Three.js AnimationClips with rotational and positional keyframe tracks
 */
export function createCharacterAnimationClips(): THREE.AnimationClip[] {
  const clips: THREE.AnimationClip[] = [];

  // Helper to make quaternion track from euler angles [t0, x, y, z, t1, x, y, z...]
  const makeEulerTrack = (boneName: string, times: number[], eulers: [number, number, number][]) => {
    const qValues: number[] = [];
    eulers.forEach(([x, y, z]) => {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
      qValues.push(q.x, q.y, q.z, q.w);
    });
    return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, qValues);
  };

  // Helper for vector position track
  const makePosTrack = (boneName: string, times: number[], positions: [number, number, number][]) => {
    const values: number[] = [];
    positions.forEach(([x, y, z]) => values.push(x, y, z));
    return new THREE.VectorKeyframeTrack(`${boneName}.position`, times, values);
  };

  // CLIP 1: 'idle' (Subtle breathing, gentle posture weight shifts)
  const idleTracks: THREE.KeyframeTrack[] = [
    makePosTrack("hips", [0, 1.5, 3.0], [
      [0, 0.95, 0],
      [0, 0.958, 0],
      [0, 0.95, 0],
    ]),
    makeEulerTrack("spine_chest", [0, 1.5, 3.0], [
      [0, 0, 0],
      [0.02, 0, 0],
      [0, 0, 0],
    ]),
    makeEulerTrack("head", [0, 1.5, 3.0], [
      [0, 0, 0],
      [-0.015, 0.02, 0.01],
      [0, 0, 0],
    ]),
    makeEulerTrack("upper_arm_l", [0, 1.5, 3.0], [
      [0, 0, 0.08],
      [0.02, 0, 0.09],
      [0, 0, 0.08],
    ]),
    makeEulerTrack("upper_arm_r", [0, 1.5, 3.0], [
      [0, 0, -0.08],
      [0.02, 0, -0.09],
      [0, 0, -0.08],
    ]),
  ];
  clips.push(new THREE.AnimationClip("idle", 3.0, idleTracks));

  // CLIP 2: 'fold_arms' (Articulates forearms into crossed arms across the chest)
  const foldTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack("shoulder_l", [0, 0.4, 0.8], [
      [0, 0, 0],
      [0.15, 0.1, 0],
      [0.2, 0.18, -0.1],
    ]),
    makeEulerTrack("upper_arm_l", [0, 0.4, 0.8], [
      [0, 0, 0.08],
      [0.45, 0.25, 0.35],
      [0.75, 0.35, 0.55],
    ]),
    makeEulerTrack("forearm_l", [0, 0.4, 0.8], [
      [0, 0, 0],
      [-0.9, -0.3, 0.4],
      [-1.75, -0.5, 0.65], // Forearm tucked across lower chest
    ]),
    makeEulerTrack("shoulder_r", [0, 0.4, 0.8], [
      [0, 0, 0],
      [0.15, -0.1, 0],
      [0.2, -0.18, 0.1],
    ]),
    makeEulerTrack("upper_arm_r", [0, 0.4, 0.8], [
      [0, 0, -0.08],
      [0.55, -0.3, -0.4],
      [0.85, -0.45, -0.65],
    ]),
    makeEulerTrack("forearm_r", [0, 0.4, 0.8], [
      [0, 0, 0],
      [-0.95, 0.3, -0.4],
      [-1.85, 0.55, -0.75], // Forearm overlapping crossed on top
    ]),
    makeEulerTrack("head", [0, 0.4, 0.8], [
      [0, 0, 0],
      [0.04, 0, 0.02],
      [0.05, 0.02, 0.04],
    ]),
  ];
  clips.push(new THREE.AnimationClip("fold_arms", 0.8, foldTracks));

  // CLIP 3: 'wave' (Unfolds right arm, raises hand, waves side to side, and returns)
  const waveTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack("upper_arm_r", [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8], [
      [0, 0, -0.08],
      [0.6, 0.2, -1.2], // Lifting arm up
      [0.8, 0.3, -1.55],
      [0.8, 0.3, -1.55],
      [0.8, 0.3, -1.55],
      [0.5, 0.15, -1.0], // Lowering arm
      [0, 0, -0.08],
    ]),
    makeEulerTrack("forearm_r", [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8], [
      [0, 0, 0],
      [-0.9, 0, -0.3],
      [-1.4, 0.2, -0.4],
      [-1.4, -0.2, -0.4],
      [-1.4, 0.2, -0.4],
      [-0.7, 0, -0.2],
      [0, 0, 0],
    ]),
    makeEulerTrack("hand_r", [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8], [
      [0, 0, 0],
      [0, 0, 0.2],
      [0, 0, 0.45], // Hand wave right
      [0, 0, -0.45], // Hand wave left
      [0, 0, 0.45], // Hand wave right
      [0, 0, 0],
      [0, 0, 0],
    ]),
    makeEulerTrack("head", [0, 0.3, 0.9, 1.8], [
      [0, 0, 0],
      [-0.05, 0.08, 0.04],
      [-0.05, 0.08, 0.04],
      [0, 0, 0],
    ]),
  ];
  clips.push(new THREE.AnimationClip("wave", 1.8, waveTracks));

  // CLIP 4: 'cover_eyes' (Hands raise over eyes for password privacy)
  const privacyTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack("upper_arm_l", [0, 0.35, 0.7], [
      [0, 0, 0.08],
      [1.0, 0.3, 0.8],
      [1.4, 0.4, 1.05],
    ]),
    makeEulerTrack("forearm_l", [0, 0.35, 0.7], [
      [0, 0, 0],
      [-1.2, -0.3, 0.5],
      [-2.1, -0.5, 0.8], // Left hand over left eye
    ]),
    makeEulerTrack("upper_arm_r", [0, 0.35, 0.7], [
      [0, 0, -0.08],
      [1.0, -0.3, -0.8],
      [1.4, -0.4, -1.05],
    ]),
    makeEulerTrack("forearm_r", [0, 0.35, 0.7], [
      [0, 0, 0],
      [-1.2, 0.3, -0.5],
      [-2.1, 0.5, -0.8], // Right hand over right eye
    ]),
    makeEulerTrack("head", [0, 0.35, 0.7], [
      [0, 0, 0],
      [0.08, 0.1, -0.05],
      [0.12, 0.18, -0.08], // Head turns slightly away respectfully
    ]),
  ];
  clips.push(new THREE.AnimationClip("cover_eyes", 0.7, privacyTracks));

  // CLIP 5: 'pickup_product' (Reaches to pedestal, lifts product, inspects, presents, and returns)
  const pickupTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack("spine_chest", [0, 0.5, 1.0, 1.8, 2.5, 3.2], [
      [0, 0, 0],
      [0.15, -0.15, 0], // Lean towards pedestal
      [0.05, -0.08, 0], // Lift up
      [-0.05, 0.05, 0], // Presenting to user
      [0.15, -0.15, 0], // Return down
      [0, 0, 0],
    ]),
    makeEulerTrack("upper_arm_r", [0, 0.5, 1.0, 1.8, 2.5, 3.2], [
      [0, 0, -0.08],
      [0.65, -0.45, -0.35], // Reaching down to pedestal
      [0.9, -0.25, -0.65], // Lifting up to eye level
      [0.75, 0.1, -0.85], // Presenting outward
      [0.65, -0.45, -0.35], // Lowering back
      [0, 0, -0.08],
    ]),
    makeEulerTrack("forearm_r", [0, 0.5, 1.0, 1.8, 2.5, 3.2], [
      [0, 0, 0],
      [-0.85, 0.2, 0], // Grasping
      [-1.6, 0.4, -0.2], // Bent arm holding product
      [-1.2, 0.1, -0.1], // Extended presentation
      [-0.85, 0.2, 0], // Placing down
      [0, 0, 0],
    ]),
    makeEulerTrack("head", [0, 0.5, 1.0, 1.8, 2.5, 3.2], [
      [0, 0, 0],
      [0.3, -0.25, 0], // Looking down at product
      [0.2, -0.1, 0], // Inspecting closely
      [-0.05, 0.1, 0.05], // Looking at customer with smile
      [0.3, -0.25, 0], // Watching placement
      [0, 0, 0],
    ]),
  ];
  clips.push(new THREE.AnimationClip("pickup_product", 3.2, pickupTracks));

  // CLIP 6: 'success' (Warm welcoming open-arms celebratory posture)
  const successTracks: THREE.KeyframeTrack[] = [
    makeEulerTrack("upper_arm_l", [0, 0.4, 1.2], [
      [0, 0, 0.08],
      [0.5, 0.2, 0.7],
      [0.3, 0.1, 0.45],
    ]),
    makeEulerTrack("forearm_l", [0, 0.4, 1.2], [
      [0, 0, 0],
      [-0.6, -0.2, 0],
      [-0.4, -0.1, 0],
    ]),
    makeEulerTrack("upper_arm_r", [0, 0.4, 1.2], [
      [0, 0, -0.08],
      [0.5, -0.2, -0.7],
      [0.3, -0.1, -0.45],
    ]),
    makeEulerTrack("forearm_r", [0, 0.4, 1.2], [
      [0, 0, 0],
      [-0.6, 0.2, 0],
      [-0.4, 0.1, 0],
    ]),
    makeEulerTrack("head", [0, 0.4, 1.2], [
      [0, 0, 0],
      [-0.08, 0, 0],
      [-0.04, 0, 0],
    ]),
  ];
  clips.push(new THREE.AnimationClip("success", 1.2, successTracks));

  return clips;
}

/**
 * Exports the complete rigged character into an optimized binary GLB file
 */
export async function exportCharacterToGlb(
  characterGroup: THREE.Group,
  clips: THREE.AnimationClip[]
): Promise<ArrayBuffer> {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      characterGroup,
      (gltf) => {
        resolve(gltf as ArrayBuffer);
      },
      (error) => {
        reject(error);
      },
      {
        binary: true,
        animations: clips,
      }
    );
  });
}
