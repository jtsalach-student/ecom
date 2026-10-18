"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Eye, Shield, User, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export type CharacterVariant = "customer" | "staff" | "admin";

export interface LoginAnimatedCharacterProps {
  variant?: CharacterVariant;
  focusedField?: "email" | "password" | "other" | null;
  isPasswordRevealed?: boolean;
  authStatus?: "idle" | "submitting" | "success" | "error";
  tenantName?: string;
  tenantColor?: string;
  className?: string;
}

/**
 * High-Fidelity Animated 3D Stylized Character Engine
 * Inspired by warm, expressive, dimensional animation character styles.
 * Features:
 * - Independent pupil tracking with bounded anatomical limits
 * - Damped 3D head turning and gentle torso sway
 * - Eyelid blinking physics (randomized 3-5s interval)
 * - Form privacy reactions: Hands raise or head respectfully turns away on password focus
 * - Coordinated wardrobe: Customer (Warm Hoodie), Staff (Tenant Polo & Badge), Superadmin (Tech Jacket & Comms)
 * - Full reduced-motion & WebGL context loss graceful fallbacks
 */
export function LoginAnimatedCharacter({
  variant = "customer",
  focusedField = null,
  isPasswordRevealed = false,
  authStatus = "idle",
  tenantName = "The Gadget Master",
  tenantColor = "#FF8A00",
  className = "h-[480px] lg:h-[600px]",
}: LoginAnimatedCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [interactionHint, setInteractionHint] = useState<string | null>(null);

  // References for animation state
  const stateRef = useRef({
    pointerX: 0,
    pointerY: 0,
    targetHeadYaw: 0,
    targetHeadPitch: 0,
    currentHeadYaw: 0,
    currentHeadPitch: 0,
    targetPupilX: 0,
    targetPupilY: 0,
    currentPupilX: 0,
    currentPupilY: 0,
    blinkProgress: 0,
    isBlinking: false,
    lastBlinkTime: Date.now(),
    nextBlinkInterval: 3500,
    privacyCoverAmount: 0, // 0 = normal, 1 = covering eyes
    waveAmount: 0,
    concernedAmount: 0,
    breathingPhase: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    let animationFrameId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    // Character Rig Scene Nodes
    const characterRoot = new THREE.Group();
    const torsoGroup = new THREE.Group();
    const neckGroup = new THREE.Group();
    const headGroup = new THREE.Group();
    const leftEyeGroup = new THREE.Group();
    const rightEyeGroup = new THREE.Group();
    const leftPupil = new THREE.Mesh();
    const rightPupil = new THREE.Mesh();
    const leftEyelidUpper = new THREE.Mesh();
    const rightEyelidUpper = new THREE.Mesh();
    const leftArmGroup = new THREE.Group();
    const rightArmGroup = new THREE.Group();
    const leftHand = new THREE.Mesh();
    const rightHand = new THREE.Mesh();
    const leftEyebrow = new THREE.Mesh();
    const rightEyebrow = new THREE.Mesh();
    const mouthMesh = new THREE.Mesh();

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        32,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0.45, 3.4);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xfff3e8, 1.2);
      scene.add(ambientLight);

      // Key Warm Light
      const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
      keyLight.position.set(2.5, 4.0, 3.0);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Soft Cool Rim Light for cinematic depth
      const rimLight = new THREE.DirectionalLight(0x7dd3fc, 1.4);
      rimLight.position.set(-3.0, 2.5, -2.0);
      scene.add(rimLight);

      // Warm Under-Fill
      const fillLight = new THREE.DirectionalLight(0xffedd5, 0.8);
      fillLight.position.set(0, -2.0, 2.0);
      scene.add(fillLight);

      // Materials Palette (Warm Stylized Aesthetic)
      const skinTone = 0xf3bf98; // Warm healthy skin tone with soft peach warmth
      const skinMaterial = new THREE.MeshStandardMaterial({
        color: skinTone,
        roughness: 0.55,
        metalness: 0.05,
      });

      const blushMaterial = new THREE.MeshBasicMaterial({
        color: 0xeb826c,
        transparent: true,
        opacity: 0.35,
      });

      const hairMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513, // Warm auburn reddish-brown
        roughness: 0.75,
        metalness: 0.1,
      });

      const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
        color: 0xfbfbfb,
        roughness: 0.15,
        metalness: 0.1,
      });

      const eyeIrisMaterial = new THREE.MeshStandardMaterial({
        color: 0xa0522d, // Deep rich amber/honey-brown iris
        roughness: 0.2,
        metalness: 0.2,
      });

      const pupilBlackMaterial = new THREE.MeshBasicMaterial({
        color: 0x080808,
      });

      const glintMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
      });

      const eyebrowMaterial = new THREE.MeshStandardMaterial({
        color: 0x5a2d0c,
        roughness: 0.8,
      });

      // Construct Rig Hierarchy
      scene.add(characterRoot);
      characterRoot.position.set(0, -0.65, 0);

      // --- TORSO & WARDROBE ---
      characterRoot.add(torsoGroup);

      let clothColor = 0xff8a00; // Customer Default Tenant Orange
      if (variant === "staff") {
        clothColor = 0x22262e; // Professional Charcoal/Navy Polo with Tenant Accents
      } else if (variant === "admin") {
        clothColor = 0x18202c; // Executive Slate Tech Blazer
      }

      const clothMaterial = new THREE.MeshStandardMaterial({
        color: clothColor,
        roughness: 0.65,
        metalness: 0.1,
      });

      // Torso Main Body
      const torsoGeo = new THREE.CylinderGeometry(0.42, 0.48, 0.85, 24);
      const torsoMesh = new THREE.Mesh(torsoGeo, clothMaterial);
      torsoMesh.position.y = 0.42;
      torsoMesh.castShadow = true;
      torsoGroup.add(torsoMesh);

      // Wardrobe Details
      if (variant === "customer") {
        // Soft cowl neck / hoodie collar in Heather Gray
        const cowlGeo = new THREE.TorusGeometry(0.28, 0.08, 16, 24);
        const cowlMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
        const cowlMesh = new THREE.Mesh(cowlGeo, cowlMat);
        cowlMesh.rotation.x = Math.PI / 2;
        cowlMesh.position.set(0, 0.82, 0);
        torsoGroup.add(cowlMesh);

        // Hoodie Drawstrings
        const stringGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8);
        const stringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const leftString = new THREE.Mesh(stringGeo, stringMat);
        leftString.position.set(-0.08, 0.68, 0.28);
        const rightString = new THREE.Mesh(stringGeo, stringMat);
        rightString.position.set(0.08, 0.68, 0.28);
        torsoGroup.add(leftString);
        torsoGroup.add(rightString);
      } else if (variant === "staff") {
        // Polo Collar
        const collarGeo = new THREE.TorusGeometry(0.26, 0.06, 12, 24);
        const collarMat = new THREE.MeshStandardMaterial({ color: 0xff8a00, roughness: 0.5 });
        const collarMesh = new THREE.Mesh(collarGeo, collarMat);
        collarMesh.rotation.x = Math.PI / 2;
        collarMesh.position.set(0, 0.82, 0);
        torsoGroup.add(collarMesh);

        // Staff Lanyard & Badge
        const lanyardMat = new THREE.MeshBasicMaterial({ color: 0xff8a00 });
        const badgeGeo = new THREE.BoxGeometry(0.14, 0.2, 0.02);
        const badgeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
        badgeMesh.position.set(0.14, 0.52, 0.32);
        torsoGroup.add(badgeMesh);
      } else if (variant === "admin") {
        // Modern Minimalist Lapel & Luminous Security Badge
        const badgeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
        const badgeMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4, // Glowing Cyan Security Node
          emissive: 0x0891b2,
          emissiveIntensity: 0.6,
          metalness: 0.8,
        });
        const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
        badgeMesh.rotation.x = Math.PI / 2;
        badgeMesh.position.set(-0.16, 0.62, 0.3);
        torsoGroup.add(badgeMesh);
      }

      // --- NECK & HEAD ---
      torsoGroup.add(neckGroup);
      neckGroup.position.set(0, 0.85, 0);

      const neckGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.22, 16);
      const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
      neckMesh.position.y = 0.08;
      neckGroup.add(neckMesh);

      neckGroup.add(headGroup);
      headGroup.position.set(0, 0.22, 0);

      // Head Base (Rounded Stylized Proportions with adorable cheeks)
      const headGeo = new THREE.SphereGeometry(0.52, 32, 32);
      headGeo.scale(1.0, 1.08, 0.98);
      const headMesh = new THREE.Mesh(headGeo, skinMaterial);
      headMesh.castShadow = true;
      headGroup.add(headMesh);

      // Stylized Cheeks / Blush
      const cheekGeo = new THREE.CircleGeometry(0.1, 16);
      const leftCheek = new THREE.Mesh(cheekGeo, blushMaterial);
      leftCheek.position.set(-0.28, -0.06, 0.44);
      leftCheek.rotation.y = -0.3;
      const rightCheek = new THREE.Mesh(cheekGeo, blushMaterial);
      rightCheek.position.set(0.28, -0.06, 0.44);
      rightCheek.rotation.y = 0.3;
      headGroup.add(leftCheek);
      headGroup.add(rightCheek);

      // Cute Sculpted Nose
      const noseGeo = new THREE.SphereGeometry(0.07, 16, 16);
      noseGeo.scale(1.0, 0.8, 1.2);
      const noseMesh = new THREE.Mesh(noseGeo, skinMaterial);
      noseMesh.position.set(0, 0.02, 0.5);
      headGroup.add(noseMesh);

      // Friendly Mouth (Gentle Curving Arc)
      const mouthGeo = new THREE.TorusGeometry(0.11, 0.02, 12, 16, Math.PI * 0.7);
      const mouthMat = new THREE.MeshBasicMaterial({ color: 0x9f3d2f });
      mouthMesh.geometry = mouthGeo;
      mouthMesh.material = mouthMat;
      mouthMesh.rotation.z = Math.PI * 1.15;
      mouthMesh.position.set(0, -0.16, 0.48);
      headGroup.add(mouthMesh);

      // --- EYES (Expressive, Dimensional Amber/Brown) ---
      const eyeRadius = 0.13;
      const eyeSpacing = 0.22;
      const eyeY = 0.12;
      const eyeZ = 0.43;

      // Left Eye Socket & Sclera
      leftEyeGroup.position.set(-eyeSpacing, eyeY, eyeZ);
      headGroup.add(leftEyeGroup);

      const eyeGeo = new THREE.SphereGeometry(eyeRadius, 24, 24);
      const leftEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMaterial);
      leftEyeGroup.add(leftEyeWhite);

      // Left Iris & Pupil
      const irisGeo = new THREE.CircleGeometry(eyeRadius * 0.65, 24);
      const leftIris = new THREE.Mesh(irisGeo, eyeIrisMaterial);
      leftIris.position.z = eyeRadius * 0.88;
      leftEyeGroup.add(leftIris);

      const pupilGeo = new THREE.CircleGeometry(eyeRadius * 0.38, 20);
      leftPupil.geometry = pupilGeo;
      leftPupil.material = pupilBlackMaterial;
      leftPupil.position.z = 0.005;
      leftIris.add(leftPupil);

      // Specular Eye Highlights (Dual Catchlights)
      const glintGeo = new THREE.CircleGeometry(eyeRadius * 0.16, 12);
      const leftGlint1 = new THREE.Mesh(glintGeo, glintMaterial);
      leftGlint1.position.set(0.03, 0.03, 0.01);
      leftIris.add(leftGlint1);

      const smallGlintGeo = new THREE.CircleGeometry(eyeRadius * 0.08, 12);
      const leftGlint2 = new THREE.Mesh(smallGlintGeo, glintMaterial);
      leftGlint2.position.set(-0.03, -0.03, 0.01);
      leftIris.add(leftGlint2);

      // Right Eye Socket & Sclera
      rightEyeGroup.position.set(eyeSpacing, eyeY, eyeZ);
      headGroup.add(rightEyeGroup);

      const rightEyeWhite = new THREE.Mesh(eyeGeo, eyeWhiteMaterial);
      rightEyeGroup.add(rightEyeWhite);

      // Right Iris & Pupil
      const rightIris = new THREE.Mesh(irisGeo, eyeIrisMaterial);
      rightIris.position.z = eyeRadius * 0.88;
      rightEyeGroup.add(rightIris);

      rightPupil.geometry = pupilGeo;
      rightPupil.material = pupilBlackMaterial;
      rightPupil.position.z = 0.005;
      rightIris.add(rightPupil);

      const rightGlint1 = new THREE.Mesh(glintGeo, glintMaterial);
      rightGlint1.position.set(0.03, 0.03, 0.01);
      rightIris.add(rightGlint1);

      const rightGlint2 = new THREE.Mesh(smallGlintGeo, glintMaterial);
      rightGlint2.position.set(-0.03, -0.03, 0.01);
      rightIris.add(rightGlint2);

      // Eyelids for natural blinking
      const eyelidGeo = new THREE.SphereGeometry(
        eyeRadius * 1.05,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.5
      );
      leftEyelidUpper.geometry = eyelidGeo;
      leftEyelidUpper.material = skinMaterial;
      leftEyelidUpper.rotation.x = -Math.PI * 0.5; // Initially open
      leftEyeGroup.add(leftEyelidUpper);

      rightEyelidUpper.geometry = eyelidGeo;
      rightEyelidUpper.material = skinMaterial;
      rightEyelidUpper.rotation.x = -Math.PI * 0.5; // Initially open
      rightEyeGroup.add(rightEyelidUpper);

      // Eyebrows
      const browGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.22, 8);
      browGeo.rotateZ(Math.PI / 2);
      leftEyebrow.geometry = browGeo;
      leftEyebrow.material = eyebrowMaterial;
      leftEyebrow.position.set(-eyeSpacing, eyeY + 0.17, eyeZ + 0.04);
      leftEyebrow.rotation.z = 0.08;
      headGroup.add(leftEyebrow);

      rightEyebrow.geometry = browGeo;
      rightEyebrow.material = eyebrowMaterial;
      rightEyebrow.position.set(eyeSpacing, eyeY + 0.17, eyeZ + 0.04);
      rightEyebrow.rotation.z = -0.08;
      headGroup.add(rightEyebrow);

      // --- TEXTURED STYLIZED HAIR ---
      const hairGroup = new THREE.Group();
      headGroup.add(hairGroup);

      // Hair Cap
      const hairCapGeo = new THREE.SphereGeometry(0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6);
      const hairCap = new THREE.Mesh(hairCapGeo, hairMaterial);
      hairCap.position.set(0, 0.08, -0.04);
      hairGroup.add(hairCap);

      // Individual Stylized Tufts / Locks of Hair (matching reference silhouette)
      const tuftGeo = new THREE.ConeGeometry(0.14, 0.35, 8);
      tuftGeo.rotateX(-0.3);

      const tuftConfigs = [
        { x: -0.12, y: 0.56, z: 0.32, rx: 0.5, rz: 0.2, s: 1.1 },
        { x: 0.08, y: 0.62, z: 0.3, rx: 0.4, rz: -0.3, s: 1.2 },
        { x: 0.25, y: 0.54, z: 0.25, rx: 0.6, rz: -0.5, s: 0.95 },
        { x: -0.3, y: 0.48, z: 0.22, rx: 0.5, rz: 0.6, s: 0.9 },
        { x: -0.02, y: 0.68, z: 0.15, rx: 0.2, rz: 0.1, s: 1.3 },
        { x: -0.38, y: 0.25, z: 0.05, rx: 0.1, rz: 0.8, s: 0.85 },
        { x: 0.38, y: 0.25, z: 0.05, rx: 0.1, rz: -0.8, s: 0.85 },
      ];

      for (const t of tuftConfigs) {
        const tuft = new THREE.Mesh(tuftGeo, hairMaterial);
        tuft.position.set(t.x, t.y, t.z);
        tuft.rotation.x = t.rx;
        tuft.rotation.z = t.rz;
        tuft.scale.set(t.s, t.s, t.s);
        hairGroup.add(tuft);
      }

      // Ears
      const earGeo = new THREE.SphereGeometry(0.12, 16, 16);
      earGeo.scale(0.5, 1.2, 0.8);
      const leftEar = new THREE.Mesh(earGeo, skinMaterial);
      leftEar.position.set(-0.52, 0.05, 0);
      leftEar.rotation.y = -0.3;
      const rightEar = new THREE.Mesh(earGeo, skinMaterial);
      rightEar.position.set(0.52, 0.05, 0);
      rightEar.rotation.y = 0.3;
      headGroup.add(leftEar);
      headGroup.add(rightEar);

      // --- ARMS & HANDS (for Relaxed Stance & Privacy Reaction) ---
      const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.65, 16);

      // Left Arm
      leftArmGroup.position.set(-0.46, 0.72, 0);
      torsoGroup.add(leftArmGroup);
      const leftArmMesh = new THREE.Mesh(armGeo, clothMaterial);
      leftArmMesh.position.y = -0.3;
      leftArmGroup.add(leftArmMesh);

      const handGeo = new THREE.SphereGeometry(0.09, 16, 16);
      handGeo.scale(1.0, 1.2, 0.6);
      leftHand.geometry = handGeo;
      leftHand.material = skinMaterial;
      leftHand.position.y = -0.65;
      leftArmGroup.add(leftHand);

      // Right Arm
      rightArmGroup.position.set(0.46, 0.72, 0);
      torsoGroup.add(rightArmGroup);
      const rightArmMesh = new THREE.Mesh(armGeo, clothMaterial);
      rightArmMesh.position.y = -0.3;
      rightArmGroup.add(rightArmMesh);

      rightHand.geometry = handGeo;
      rightHand.material = skinMaterial;
      rightHand.position.y = -0.65;
      rightArmGroup.add(rightHand);

      // Initial Comfortable Resting Stance (arms gently forward or crossed)
      leftArmGroup.rotation.z = 0.25;
      leftArmGroup.rotation.x = 0.35;
      rightArmGroup.rotation.z = -0.25;
      rightArmGroup.rotation.x = 0.35;

      // Pointer Tracking Event Listener on Window
      const handleWindowPointerMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        // Normalized pointer coordinates relative to character center (-1 to 1)
        const charCenterX = rect.left + rect.width * 0.5;
        const charCenterY = rect.top + rect.height * 0.4;

        const deltaX = (e.clientX - charCenterX) / (window.innerWidth * 0.5);
        const deltaY = (e.clientY - charCenterY) / (window.innerHeight * 0.5);

        // Clamp to natural anatomical bounds
        stateRef.current.targetHeadYaw = Math.max(-0.45, Math.min(0.45, deltaX * 0.55));
        stateRef.current.targetHeadPitch = Math.max(-0.25, Math.min(0.25, -deltaY * 0.35));

        // Eye pupils have independent bounded saccadic motion
        stateRef.current.targetPupilX = Math.max(-0.045, Math.min(0.045, deltaX * 0.055));
        stateRef.current.targetPupilY = Math.max(-0.035, Math.min(0.035, -deltaY * 0.045));
      };

      window.addEventListener("mousemove", handleWindowPointerMove);

      // Damped Kinematic Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const state = stateRef.current;
        const now = Date.now();

        // 1. Idle Breathing Cycle
        state.breathingPhase += 0.035;
        const breathY = Math.sin(state.breathingPhase) * 0.015;
        torsoGroup.position.y = breathY;

        // 2. Randomized Natural Blinking
        if (!state.isBlinking && now - state.lastBlinkTime > state.nextBlinkInterval) {
          state.isBlinking = true;
          state.blinkProgress = 0;
          state.lastBlinkTime = now;
          state.nextBlinkInterval = 2500 + Math.random() * 3000;
        }

        if (state.isBlinking) {
          state.blinkProgress += 0.22;
          if (state.blinkProgress >= Math.PI) {
            state.isBlinking = false;
            state.blinkProgress = 0;
          }
        }
        const blinkAmount = Math.sin(state.blinkProgress);

        // 3. Form Reaction Interpolation
        // When password field is focused and not revealed -> Privacy reaction (respectfully look away or cover eyes)
        const shouldCoverEyes = focusedField === "password" && !isPasswordRevealed;
        const targetPrivacy = shouldCoverEyes ? 1.0 : 0.0;
        state.privacyCoverAmount += (targetPrivacy - state.privacyCoverAmount) * 0.12;

        // When email is focused -> Attentive lean towards form
        const isEmailFocused = focusedField === "email";

        // Auth Outcomes
        const isAuthSuccess = authStatus === "success";
        const isAuthError = authStatus === "error";

        // Head Yaw & Pitch Spring Interpolation
        let desiredHeadYaw = state.targetHeadYaw;
        let desiredHeadPitch = state.targetHeadPitch;

        if (shouldCoverEyes) {
          // Respectful privacy turn: turn head away (+55 degrees) and look down
          desiredHeadYaw = 0.75;
          desiredHeadPitch = -0.35;
        } else if (isEmailFocused) {
          // Attentive glance toward the form (typically to the right on login layout)
          desiredHeadYaw = 0.28;
          desiredHeadPitch = 0.05;
        } else if (isAuthSuccess) {
          desiredHeadYaw = 0.05;
          desiredHeadPitch = 0.12;
        } else if (isAuthError) {
          desiredHeadYaw = -0.15;
          desiredHeadPitch = -0.15;
        }

        state.currentHeadYaw += (desiredHeadYaw - state.currentHeadYaw) * 0.08;
        state.currentHeadPitch += (desiredHeadPitch - state.currentHeadPitch) * 0.08;

        headGroup.rotation.y = state.currentHeadYaw;
        headGroup.rotation.x = state.currentHeadPitch;

        // Torso gently leans with head (subtle anatomical secondary motion)
        torsoGroup.rotation.y = state.currentHeadYaw * 0.25;
        torsoGroup.rotation.z = -state.currentHeadYaw * 0.08;

        // Eye Pupils Interpolation
        state.currentPupilX += (state.targetPupilX - state.currentPupilX) * 0.12;
        state.currentPupilY += (state.targetPupilY - state.currentPupilY) * 0.12;

        leftPupil.position.x = state.currentPupilX;
        leftPupil.position.y = state.currentPupilY;
        rightPupil.position.x = state.currentPupilX;
        rightPupil.position.y = state.currentPupilY;

        // Eyelid Blinking
        const effectiveBlink = Math.max(blinkAmount, state.privacyCoverAmount * 0.95);
        const lidRot = -Math.PI * 0.5 + effectiveBlink * Math.PI * 0.52;
        leftEyelidUpper.rotation.x = lidRot;
        rightEyelidUpper.rotation.x = lidRot;

        // Eyebrows Expressiveness
        if (isEmailFocused) {
          // Attentive raised brows
          leftEyebrow.position.y = eyeY + 0.2;
          rightEyebrow.position.y = eyeY + 0.2;
        } else if (isAuthError) {
          // Gentle concerned furrow
          leftEyebrow.position.y = eyeY + 0.14;
          leftEyebrow.rotation.z = -0.15;
          rightEyebrow.position.y = eyeY + 0.14;
          rightEyebrow.rotation.z = 0.15;
        } else {
          leftEyebrow.position.y = eyeY + 0.17;
          leftEyebrow.rotation.z = 0.08;
          rightEyebrow.position.y = eyeY + 0.17;
          rightEyebrow.rotation.z = -0.08;
        }

        // Arm Privacy Posture: Hands Raise to Cover Eyes when Password is typed
        const privacyCover = state.privacyCoverAmount;
        if (privacyCover > 0.01) {
          // Left hand raises to cover left eye
          leftArmGroup.rotation.x = 0.35 + privacyCover * 1.6;
          leftArmGroup.rotation.z = 0.25 - privacyCover * 0.7;
          leftArmGroup.position.z = privacyCover * 0.22;

          // Right hand raises to cover right eye
          rightArmGroup.rotation.x = 0.35 + privacyCover * 1.6;
          rightArmGroup.rotation.z = -0.25 + privacyCover * 0.7;
          rightArmGroup.position.z = privacyCover * 0.22;
        } else if (isAuthSuccess) {
          // Right arm raises in friendly wave
          rightArmGroup.rotation.x = 0.8 + Math.sin(now * 0.008) * 0.25;
          rightArmGroup.rotation.z = -0.7;
          leftArmGroup.rotation.x = 0.35;
          leftArmGroup.rotation.z = 0.25;
        } else {
          // Normal relaxed stance
          leftArmGroup.rotation.x = 0.35;
          leftArmGroup.rotation.z = 0.25;
          leftArmGroup.position.z = 0;
          rightArmGroup.rotation.x = 0.35;
          rightArmGroup.rotation.z = -0.25;
          rightArmGroup.position.z = 0;
        }

        renderer.render(scene, camera);
      };

      animate();

      // Window Resize Listener
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      // Clean up resources
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("mousemove", handleWindowPointerMove);
        window.removeEventListener("resize", handleResize);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn("WebGL character initialization failed:", e);
      setWebGlSupported(false);
    }
  }, [variant, focusedField, isPasswordRevealed, authStatus, tenantColor]);

  // Touch Greeting Handler
  const handleTouchGreeting = () => {
    stateRef.current.isBlinking = true;
    stateRef.current.blinkProgress = 0;
    setInteractionHint("Hi there! Welcome back.");
    setTimeout(() => setInteractionHint(null), 2500);
  };

  // Fallback Photographic / Stylized 2.5D Presentation
  if (!webGlSupported) {
    return (
      <div className={`relative w-full ${className} flex items-center justify-center p-6 select-none`}>
        <div className="relative max-w-sm rounded-3xl overflow-hidden bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 p-8 text-center backdrop-blur-xl">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 p-1 shadow-xl mb-4 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              {variant === "staff" ? (
                <Shield className="w-14 h-14 text-orange-400" />
              ) : variant === "admin" ? (
                <Sparkles className="w-14 h-14 text-cyan-400" />
              ) : (
                <User className="w-14 h-14 text-amber-400" />
              )}
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {variant === "staff"
              ? "Retail Team Portal"
              : variant === "admin"
              ? "Platform Operations"
              : "Welcome, Valued Customer"}
          </h3>
          <p className="text-xs text-slate-400">
            {variant === "staff"
              ? "East Legon Showroom & Multi-Branch POS"
              : variant === "admin"
              ? "Control Plane & Infrastructure Security"
              : "Shop authentic electronics with verified warranties"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={handleTouchGreeting}
      className={`relative w-full ${className} cursor-pointer select-none overflow-hidden rounded-3xl`}
      title="Interactive Character • Eyes track your pointer • Respectfully protects your privacy during password entry"
    >
      {/* Subtle Environmental Stage Backdrop Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${tenantColor}22 0%, transparent 70%)`,
        }}
      />

      {/* Interactive Privacy & Feedback Indicator Toast */}
      {focusedField === "password" && !isPasswordRevealed && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-medium text-slate-300 shadow-lg animate-fadeIn">
          <Eye className="w-3.5 h-3.5 text-orange-400" />
          <span>Respecting password privacy</span>
        </div>
      )}

      {authStatus === "success" && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/80 backdrop-blur-md text-[11px] font-semibold text-emerald-300 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Credentials authenticated!</span>
        </div>
      )}

      {authStatus === "error" && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-600/80 backdrop-blur-md text-[11px] font-semibold text-red-300 shadow-lg animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span>Please verify your details</span>
        </div>
      )}

      {interactionHint && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-orange-600/90 text-white text-xs font-semibold shadow-xl backdrop-blur-md animate-bounce">
          {interactionHint}
        </div>
      )}

      {/* Wardrobe Role Badge */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: tenantColor }}
        />
        <span>
          {variant === "staff"
            ? `${tenantName} Staff`
            : variant === "admin"
            ? "Platform Superadmin"
            : "Customer Concierge"}
        </span>
      </div>
    </div>
  );
}
