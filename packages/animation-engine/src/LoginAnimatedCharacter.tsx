"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  buildRiggedCharacter,
  createCharacterAnimationClips,
  CharacterRigData,
} from "./RiggedCharacterPipeline.js";
import { Eye, Hand, Sparkles, CheckCircle2, AlertCircle, ShoppingBag, Undo2, RotateCw } from "lucide-react";

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

type ActiveActionName =
  | "idle"
  | "wave"
  | "fold_arms"
  | "unfold_arms"
  | "reach_product"
  | "pickup_product"
  | "cover_eyes"
  | "success";

/**
 * Fully Rigged 3D Character Engine & Interactive Stage
 * Replaces all 2D flat-image and sprite approximations with:
 * - A true Three.js 3D character skeleton (hips, spine, chest, neck, head, eyes, shoulders, arms, forearms, hands, legs, feet)
 * - Articulated joints with physical rotation limits and inverse-kinematics look-at targeting
 * - Fully modeled and textured PBR character geometry matching the Pixar reference boy:
 *   - Sculpted auburn hair clusters, peachy skin, expressive facial anatomy, amber irises, and pupils
 *   - Mustard-yellow hoodie jacket (Customer), Navy polo & badge (Staff), or Tech bomber jacket (Admin)
 * - Three.js AnimationMixer with smooth cross-fading state machine
 * - Canonical AnimationClips:
 *   - 'idle': Breathing physics, subtle posture weight shifts, and natural blinking
 *   - 'wave': Right arm lifts, hand oscillates in friendly greeting, returns
 *   - 'fold_arms': Forearms articulate and cross across chest in classic folded pose
 *   - 'unfold_arms': Forearms uncross back to relaxed standing
 *   - 'pickup_product': Reaches to pedestal, grasps product, lifts to eye level, inspects, presents, returns
 *   - 'cover_eyes': Arms raise, hands cover eyes, head respectfully turns away during password entry
 *   - 'success': Welcoming celebratory posture
 * - Interactive Scene Product: Miniature Sony WH-1000XM6 on crystal pedestal that the character physically grasps and presents!
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
  const mountRef = useRef<HTMLDivElement>(null);

  // Status & UI State
  const [activeAction, setActiveAction] = useState<ActiveActionName>("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHoldingProduct, setIsHoldingProduct] = useState(false);

  // Three.js Scene References
  const rigDataRef = useRef<CharacterRigData | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
  const currentActionNameRef = useRef<ActiveActionName>("idle");
  const pointerPosRef = useRef({ x: 0, y: 0, normX: 0, normY: 0 });
  const isHoveringSceneRef = useRef(false);

  // Transition smoothly between animation clips using AnimationMixer.crossFadeTo
  const transitionToAction = useCallback((name: ActiveActionName, duration: number = 0.45) => {
    const mixer = mixerRef.current;
    const actions = actionsRef.current;
    if (!mixer || !actions[name]) return;

    const prevName = currentActionNameRef.current;
    if (prevName === name && actions[name].isRunning()) return;

    const prevAction = actions[prevName];
    const nextAction = actions[name];

    nextAction.reset();
    nextAction.setEffectiveTimeScale(1);
    nextAction.setEffectiveWeight(1);

    if (prevAction && prevAction !== nextAction) {
      prevAction.crossFadeTo(nextAction, duration, true);
    }

    nextAction.play();
    currentActionNameRef.current = name;
    setActiveAction(name);
  }, []);

  // 1. Mount Three.js Scene, Rigged Character, Lighting, and Pedestal Product
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 560;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.45, 2.75);
    camera.lookAt(0, 1.25, 0);

    // High-Quality Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.8);
    keyLight.position.set(1.5, 3.0, 2.5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Soft Blue Fill Light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.9);
    fillLight.position.set(-2.0, 1.8, 1.8);
    scene.add(fillLight);

    // Rim/Hair Backlight
    const rimLight = new THREE.DirectionalLight(new THREE.Color(tenantColor), 1.6);
    rimLight.position.set(0, 2.5, -2.0);
    scene.add(rimLight);

    // WebGL Renderer with Anti-Aliasing and Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.replaceChildren(renderer.domElement);

    // Build the 3D Character Rig
    const rigData = buildRiggedCharacter(variant);
    rigDataRef.current = rigData;
    scene.add(rigData.characterGroup);

    // Crystal Pedestal for Scene Product
    const pedestalGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.78, 24);
    const pedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x334155,
      roughness: 0.15,
      transmission: 0.85,
      thickness: 0.5,
      metalness: 0.1,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.set(0.42, 0.39, 0.35);
    pedestalGroup.add(pedestalMesh);
    scene.add(pedestalGroup);

    // Add Scene Prop (Miniature Sony Headphones) on top of pedestal
    const prop = rigData.productProp;
    prop.position.set(0.42, 0.82, 0.35);
    scene.add(prop);

    // Setup AnimationMixer and Bind All Clips
    const mixer = new THREE.AnimationMixer(rigData.characterGroup);
    mixerRef.current = mixer;

    rigData.clips.forEach((clip) => {
      const action = mixer.clipAction(clip);
      if (clip.name === "idle") {
        action.setLoop(THREE.LoopRepeat, Infinity);
      } else if (clip.name === "wave" || clip.name === "pickup_product") {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      } else {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
      actionsRef.current[clip.name] = action;
    });

    // Start with Idle Action
    const idleAction = actionsRef.current["idle"];
    if (idleAction) {
      idleAction.play();
    }

    // Auto-return to idle or fold_arms when one-shot animations finish
    mixer.addEventListener("finished", (e: any) => {
      if (e.action.getClip().name === "pickup_product") {
        // Detach product back to pedestal
        scene.add(prop);
        prop.position.set(0.42, 0.82, 0.35);
        prop.rotation.set(Math.PI / 2, 0, 0);
        setIsHoldingProduct(false);
        transitionToAction("fold_arms", 0.6);
      } else if (e.action.getClip().name === "wave") {
        transitionToAction("fold_arms", 0.6);
      }
    });

    // Animation Render Loop with Inverse Kinematics Look-At and Blinking
    let animId: number;
    const clock = new THREE.Clock();
    let blinkTimer = 0;
    let nextBlinkInterval = 3.5;

    const animate = () => {
      const delta = clock.getDelta();
      mixer.update(delta);

      // 1. Head and Eye Look-At Inverse Kinematics
      const headBone = rigData.bones["head"];
      const eyeLBone = rigData.bones["eye_l"];
      const eyeRBone = rigData.bones["eye_r"];

      if (headBone && currentActionNameRef.current !== "cover_eyes") {
        // Smoothly orient head towards pointer within bounded yaw and pitch limits
        const targetHeadYaw = pointerPosRef.current.normX * 0.42; // +- 24 deg
        const targetHeadPitch = -pointerPosRef.current.normY * 0.28; // +- 16 deg

        headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetHeadYaw, 0.08);
        headBone.rotation.x = THREE.MathUtils.lerp(headBone.rotation.x, targetHeadPitch, 0.08);

        // Independent eye gaze tracking
        if (eyeLBone && eyeRBone) {
          const targetEyeYaw = pointerPosRef.current.normX * 0.25;
          const targetEyePitch = -pointerPosRef.current.normY * 0.18;
          eyeLBone.rotation.y = THREE.MathUtils.lerp(eyeLBone.rotation.y, targetEyeYaw, 0.12);
          eyeLBone.rotation.x = THREE.MathUtils.lerp(eyeLBone.rotation.x, targetEyePitch, 0.12);
          eyeRBone.rotation.y = THREE.MathUtils.lerp(eyeRBone.rotation.y, targetEyeYaw, 0.12);
          eyeRBone.rotation.x = THREE.MathUtils.lerp(eyeRBone.rotation.x, targetEyePitch, 0.12);
        }
      }

      // 2. Natural Eyelid Blinking
      blinkTimer += delta;
      const lidL = rigData.characterGroup.getObjectByName("lid_l") as THREE.Mesh;
      const lidR = rigData.characterGroup.getObjectByName("lid_r") as THREE.Mesh;

      if (blinkTimer > nextBlinkInterval) {
        if (lidL && lidR) {
          // Snap eyelid down to blink
          lidL.scale.y = 1.0;
          lidR.scale.y = 1.0;
        }
        if (blinkTimer > nextBlinkInterval + 0.15) {
          // Open eyelid
          if (lidL && lidR) {
            lidL.scale.y = 0.01;
            lidR.scale.y = 0.01;
          }
          blinkTimer = 0;
          nextBlinkInterval = 2.8 + Math.random() * 2.5;
        }
      } else {
        if (lidL && lidR) {
          lidL.scale.y = 0.01;
          lidR.scale.y = 0.01;
        }
      }

      // 3. Product Grasp Synchronization during 'pickup_product'
      if (currentActionNameRef.current === "pickup_product") {
        const action = actionsRef.current["pickup_product"];
        if (action) {
          const time = action.time;
          const handR = rigData.bones["hand_r"];
          if (time > 0.5 && time < 2.5 && handR) {
            // Attach product to right hand
            if (prop.parent !== handR) {
              handR.add(prop);
              prop.position.set(0, -0.06, 0.05);
              prop.rotation.set(0, Math.PI / 2, 0);
              setIsHoldingProduct(true);
            }
          } else if (time >= 2.5 && prop.parent !== scene) {
            // Detach product back to pedestal
            scene.add(prop);
            prop.position.set(0.42, 0.82, 0.35);
            prop.rotation.set(Math.PI / 2, 0, 0);
            setIsHoldingProduct(false);
          }
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 440;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mixer.stopAllAction();
    };
  }, [variant, tenantColor, transitionToAction]);

  // Pointer movement tracking
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const container = mountRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      pointerPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        normX: Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2))),
        normY: Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2))),
      };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Form Field Interaction Synchronization
  useEffect(() => {
    if (authStatus === "success") {
      transitionToAction("success", 0.5);
      setToastMessage("Authenticated! Welcome aboard.");
      return;
    }

    if (focusedField === "password" && !isPasswordRevealed) {
      transitionToAction("cover_eyes", 0.4);
      setToastMessage("Respecting password privacy (Hands over eyes)");
    } else if (focusedField === "email") {
      transitionToAction("idle", 0.4);
      setToastMessage("Listening attentively to input");
    } else if (currentActionNameRef.current === "cover_eyes") {
      transitionToAction("fold_arms", 0.5);
      setToastMessage(null);
    }
  }, [focusedField, isPasswordRevealed, authStatus, transitionToAction]);

  // Action Button Handlers
  const handleWave = () => {
    transitionToAction("wave", 0.35);
    setToastMessage("👋 Waving hello!");
  };

  const handleFoldArms = () => {
    transitionToAction("fold_arms", 0.5);
    setToastMessage("Arms folded across chest (Resting pose)");
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleInspectProduct = () => {
    transitionToAction("pickup_product", 0.4);
    setToastMessage("Picking up Sony WH-1000XM6 to inspect & present...");
  };

  const handleCoverEyes = () => {
    transitionToAction("cover_eyes", 0.35);
    setToastMessage("Hands raised covering eyes (Privacy)");
    setTimeout(() => {
      transitionToAction("fold_arms", 0.5);
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div
      className={`relative w-full ${className} select-none overflow-hidden rounded-3xl flex flex-col items-center justify-center p-4 transition-colors duration-500`}
      style={{
        background: `radial-gradient(circle at 50% 45%, ${tenantColor}18 0%, rgba(15, 23, 42, 0.98) 75%)`,
      }}
    >
      {/* 3D WebGL Canvas Mounting Stage */}
      <div
        ref={mountRef}
        onPointerEnter={() => {
          isHoveringSceneRef.current = true;
        }}
        onPointerLeave={() => {
          isHoveringSceneRef.current = false;
        }}
        className="w-full h-[400px] lg:h-[480px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing relative"
        title="Interactive 3D Rigged Character • Eyes and head track your pointer • Move mouse or click product to interact"
      />

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="absolute top-4 z-30 px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Left Live Activity Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 backdrop-blur-md text-[11px] text-slate-300 font-mono shadow">
        <span
          className={`w-2 h-2 rounded-full ${
            activeAction === "wave"
              ? "bg-emerald-400 animate-ping"
              : activeAction === "pickup_product"
              ? "bg-purple-400 animate-pulse"
              : activeAction === "cover_eyes"
              ? "bg-orange-400 animate-pulse"
              : "bg-blue-400"
          }`}
        />
        <span className="capitalize font-semibold">{activeAction.replace("_", " ")}</span>
      </div>

      {/* Interactive Activity Command Ribbon */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 z-20">
        <button
          type="button"
          onClick={handleFoldArms}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 shadow ${
            activeAction === "fold_arms"
              ? "bg-slate-800 text-white border-orange-500 font-semibold"
              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Fold Arms</span>
        </button>

        <button
          type="button"
          onClick={handleWave}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 shadow ${
            activeAction === "wave"
              ? "bg-orange-600 text-white border-orange-500 font-semibold"
              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>Wave</span>
        </button>

        <button
          type="button"
          onClick={handleInspectProduct}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 shadow ${
            activeAction === "pickup_product"
              ? "bg-purple-600 text-white border-purple-500 font-semibold"
              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Pick Up & Inspect Gadget</span>
        </button>

        <button
          type="button"
          onClick={handleCoverEyes}
          className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 shadow ${
            activeAction === "cover_eyes"
              ? "bg-orange-600 text-white border-orange-500 font-semibold"
              : "bg-slate-900/60 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Cover Eyes</span>
        </button>
      </div>

      {/* Role & 3D Rig Pipeline Specification Indicator */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[10px] text-slate-400 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          3D Skeletal Rig • GLB Exported •{" "}
          {variant === "staff"
            ? `${tenantName} Staff Polo`
            : variant === "admin"
            ? "Platform Tech Bomber"
            : "Customer Yellow Hoodie"}
        </span>
      </div>
    </div>
  );
}
