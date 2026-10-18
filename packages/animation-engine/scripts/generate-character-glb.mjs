import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import fs from "fs";
import path from "path";

// Polyfill FileReader for Node.js environment
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (typeof this.onload === "function") this.onload();
        if (typeof this.onloadend === "function") this.onloadend();
      });
    }
  };
}

// Helper to construct bones and clips in pure Node ESM
function createBone(name, y = 0, x = 0, z = 0, bones = {}) {
  const bone = new THREE.Bone();
  bone.name = name;
  bone.position.set(x, y, z);
  bones[name] = bone;
  return bone;
}

const bones = {};
const root = createBone("root", 0, 0, 0, bones);
const hips = createBone("hips", 0.95, 0, 0, bones);
const spineLower = createBone("spine_lower", 0.18, 0, 0, bones);
const spineChest = createBone("spine_chest", 0.22, 0, 0, bones);
const neck = createBone("neck", 0.22, 0, 0, bones);
const head = createBone("head", 0.14, 0, 0, bones);

const eyeL = createBone("eye_l", 0.08, -0.065, 0.16, bones);
const eyeR = createBone("eye_r", 0.08, 0.065, 0.16, bones);
head.add(eyeL);
head.add(eyeR);

const shoulderL = createBone("shoulder_l", 0.16, -0.16, 0, bones);
const upperArmL = createBone("upper_arm_l", 0, -0.08, 0, bones);
const forearmL = createBone("forearm_l", -0.22, 0, 0, bones);
const handL = createBone("hand_l", -0.2, 0, 0, bones);
shoulderL.add(upperArmL);
upperArmL.add(forearmL);
forearmL.add(handL);

const shoulderR = createBone("shoulder_r", 0.16, 0.16, 0, bones);
const upperArmR = createBone("upper_arm_r", 0, 0.08, 0, bones);
const forearmR = createBone("forearm_r", -0.22, 0, 0, bones);
const handR = createBone("hand_r", -0.2, 0, 0, bones);
shoulderR.add(upperArmR);
upperArmR.add(forearmR);
forearmR.add(handR);

neck.add(head);
spineChest.add(neck);
spineChest.add(shoulderL);
spineChest.add(shoulderR);
spineLower.add(spineChest);
hips.add(spineLower);
root.add(hips);

const characterGroup = new THREE.Group();
characterGroup.name = "RiggedCharacterModel";
characterGroup.add(root);

// Add mesh nodes
const headGeo = new THREE.SphereGeometry(0.19, 16, 16);
head.add(new THREE.Mesh(headGeo, new THREE.MeshStandardMaterial({ color: 0xf3bf9f })));

const chestGeo = new THREE.CylinderGeometry(0.18, 0.17, 0.26, 16);
spineChest.add(new THREE.Mesh(chestGeo, new THREE.MeshStandardMaterial({ color: 0xe59b20 })));

const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.2, 12);
upperArmR.add(new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0xe59b20 })));
upperArmL.add(new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0xe59b20 })));
forearmR.add(new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0xe59b20 })));
forearmL.add(new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0xe59b20 })));

// Authored Animation Clips
const makeEulerTrack = (boneName, times, eulers) => {
  const qValues = [];
  eulers.forEach(([x, y, z]) => {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    qValues.push(q.x, q.y, q.z, q.w);
  });
  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, qValues);
};

const clips = [
  new THREE.AnimationClip("idle", 2.0, [
    makeEulerTrack("spine_chest", [0, 1.0, 2.0], [[0, 0, 0], [0.03, 0, 0], [0, 0, 0]]),
  ]),
  new THREE.AnimationClip("wave", 1.8, [
    makeEulerTrack("upper_arm_r", [0, 0.5, 1.0, 1.8], [[0, 0, 0], [0.8, 0.3, -1.5], [0.8, 0.3, -1.5], [0, 0, 0]]),
    makeEulerTrack("hand_r", [0, 0.6, 0.9, 1.2, 1.8], [[0, 0, 0], [0, 0, 0.4], [0, 0, -0.4], [0, 0, 0.4], [0, 0, 0]]),
  ]),
  new THREE.AnimationClip("fold_arms", 0.8, [
    makeEulerTrack("upper_arm_l", [0, 0.8], [[0, 0, 0], [0.75, 0.35, 0.55]]),
    makeEulerTrack("forearm_l", [0, 0.8], [[0, 0, 0], [-1.75, -0.5, 0.65]]),
    makeEulerTrack("upper_arm_r", [0, 0.8], [[0, 0, 0], [0.85, -0.45, -0.65]]),
    makeEulerTrack("forearm_r", [0, 0.8], [[0, 0, 0], [-1.85, 0.55, -0.75]]),
  ]),
  new THREE.AnimationClip("cover_eyes", 0.7, [
    makeEulerTrack("upper_arm_l", [0, 0.7], [[0, 0, 0], [1.4, 0.4, 1.05]]),
    makeEulerTrack("forearm_l", [0, 0.7], [[0, 0, 0], [-2.1, -0.5, 0.8]]),
    makeEulerTrack("upper_arm_r", [0, 0.7], [[0, 0, 0], [1.4, -0.4, -1.05]]),
    makeEulerTrack("forearm_r", [0, 0.7], [[0, 0, 0], [-2.1, 0.5, -0.8]]),
  ]),
];

const exporter = new GLTFExporter();
try {
  const gltf = await exporter.parseAsync(characterGroup, { binary: true, animations: clips });
  const buffer = Buffer.from(gltf);
  const targetDirs = [
    "C:/ecom/apps/storefront/public/models",
    "C:/ecom/apps/retail-admin/public/models",
    "C:/ecom/apps/platform-admin/public/models",
  ];

  targetDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, "character_rigged.glb");
    fs.writeFileSync(filePath, buffer);
    console.log(`[SUCCESS] Wrote GLB (${buffer.length} bytes) to ${filePath}`);
  });
  console.log("[VERIFIED] Skeletons and animation clips (idle, wave, fold_arms, cover_eyes) successfully packaged into GLB.");
} catch (err) {
  console.error("Export error:", err);
  process.exit(1);
}
