"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RotateCw, RefreshCw, Sparkles, Volume2, ShieldCheck, Eye } from "lucide-react";

export interface SonyHeadphonesViewerProps {
  className?: string;
  onInteractionChange?: (isInteracting: boolean) => void;
  colorVariant?: "black" | "silver";
}

/**
 * High-Precision Interactive 3D Model of Sony WH-1000XM6 Flagship Noise-Cancelling Headphones.
 * Features:
 * - Exact anatomical headband arch with soft leatherette padding and telescoping slider arms
 * - Angled ergonomic earcups with plush memory foam ear cushions and acoustic driver cavity
 * - Signature Sony copper microphone grilles, touch capacitive surface, Power & NC/Ambient buttons, USB-C and 3.5mm ports
 * - Smooth damped pointer rotation (horizontal yaw reveal, restrained vertical tilt)
 * - Touch inspection, keyboard navigation (Arrow keys + R to reset), and explicit reset button
 * - Preserves intact assembled construction with zero teardown or exploded components
 */
export function SonyHeadphonesInteractiveViewer({
  className = "h-[450px] lg:h-[550px]",
  onInteractionChange,
  colorVariant = "black",
}: SonyHeadphonesViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const stateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    targetRotY: 0.45, // Initial 3/4 beauty resting pose
    targetRotX: 0.1,
    currentRotY: 0.45,
    currentRotX: 0.1,
    autoRotateSpeed: 0.008,
  });

  const resetOrientation = useCallback(() => {
    stateRef.current.targetRotY = 0.45;
    stateRef.current.targetRotX = 0.1;
    setAutoRotate(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let headphonesGroup: THREE.Group;

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0.1, 4.2);

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

      // Studio Lighting for Satin Matte Headphones
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      // Main Key Light
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(3, 4, 3.5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Cool Rim Light for silhouette edge definition
      const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.6);
      rimLight.position.set(-3, 2, -2.5);
      scene.add(rimLight);

      // Subtle warm bounce light from below
      const bounceLight = new THREE.DirectionalLight(0xffedd5, 0.9);
      bounceLight.position.set(0, -2, 2);
      scene.add(bounceLight);

      // Materials Palette (Sony Signature Matte Finish)
      const isBlack = colorVariant === "black";
      const bodyColor = isBlack ? 0x1a1a1a : 0xe5e7eb; // Deep satin black or silver
      const copperAccent = 0xd4af37; // Sony iconic metallic copper/gold accent

      const satinPlasticMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.45,
        metalness: 0.25,
      });

      const leatheretteMat = new THREE.MeshStandardMaterial({
        color: isBlack ? 0x111111 : 0xd1d5db,
        roughness: 0.7,
        metalness: 0.05,
      });

      const copperMat = new THREE.MeshStandardMaterial({
        color: copperAccent,
        roughness: 0.2,
        metalness: 0.9,
      });

      const aluminumSliderMat = new THREE.MeshStandardMaterial({
        color: isBlack ? 0x2a2a2a : 0xf3f4f6,
        roughness: 0.3,
        metalness: 0.85,
      });

      const acousticMeshMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.9,
        metalness: 0.1,
      });

      // Construct Complete Assembled Sony WH-1000XM6 Geometry
      headphonesGroup = new THREE.Group();
      scene.add(headphonesGroup);

      // 1. HEADBAND ARCH (Ergonomic curved band with leatherette cushion)
      const headbandCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.85, 0.25, 0),
        new THREE.Vector3(-0.65, 0.85, 0),
        new THREE.Vector3(0, 1.05, 0),
        new THREE.Vector3(0.65, 0.85, 0),
        new THREE.Vector3(0.85, 0.25, 0),
      ]);

      const headbandGeo = new THREE.TubeGeometry(headbandCurve, 40, 0.08, 16, false);
      const headbandMesh = new THREE.Mesh(headbandGeo, satinPlasticMat);
      headbandMesh.castShadow = true;
      headphonesGroup.add(headbandMesh);

      // Inner Soft Headband Cushion
      const cushionCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.55, 0.75, 0),
        new THREE.Vector3(0, 0.95, 0),
        new THREE.Vector3(0.55, 0.75, 0),
      ]);
      const cushionGeo = new THREE.TubeGeometry(cushionCurve, 24, 0.065, 12, false);
      const cushionMesh = new THREE.Mesh(cushionGeo, leatheretteMat);
      headphonesGroup.add(cushionMesh);

      // 2. SLIDERS & HINGES (Telescoping stepped arms & articulated swivels)
      const sliderGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16);

      // Left Slider
      const leftSlider = new THREE.Mesh(sliderGeo, aluminumSliderMat);
      leftSlider.position.set(-0.88, 0.15, 0);
      leftSlider.rotation.z = -0.15;
      headphonesGroup.add(leftSlider);

      // Right Slider
      const rightSlider = new THREE.Mesh(sliderGeo, aluminumSliderMat);
      rightSlider.position.set(0.88, 0.15, 0);
      rightSlider.rotation.z = 0.15;
      headphonesGroup.add(rightSlider);

      // 3. EARCUPS & EAR PADS (Left and Right Ergonomic Angled Units)
      const earcupWidth = 0.52;
      const earcupHeight = 0.68;
      const earcupDepth = 0.32;

      function createEarcup(isLeft: boolean): THREE.Group {
        const cupGroup = new THREE.Group();

        // Swivel Yoke Attachment
        const yokeGeo = new THREE.TorusGeometry(0.24, 0.035, 12, 16, Math.PI);
        const yokeMesh = new THREE.Mesh(yokeGeo, satinPlasticMat);
        yokeMesh.rotation.x = Math.PI / 2;
        yokeMesh.position.y = 0.28;
        cupGroup.add(yokeMesh);

        // Main Earcup Shell (Beveled rounded oval capsule)
        const shellGeo = new THREE.CylinderGeometry(0.32, 0.34, earcupDepth, 32);
        shellGeo.scale(1.0, 1.0, 1.25);
        const shellMesh = new THREE.Mesh(shellGeo, satinPlasticMat);
        shellMesh.rotation.z = Math.PI / 2;
        shellMesh.castShadow = true;
        cupGroup.add(shellMesh);

        // Plush Memory Foam Ear Cushion (Soft oval torus)
        const padGeo = new THREE.TorusGeometry(0.28, 0.09, 16, 32);
        padGeo.scale(0.9, 1.25, 1.0);
        const padMesh = new THREE.Mesh(padGeo, leatheretteMat);
        padMesh.position.x = isLeft ? 0.16 : -0.16;
        padMesh.rotation.y = Math.PI / 2;
        cupGroup.add(padMesh);

        // Acoustic Inner Chamber Mesh Cloth
        const meshGeo = new THREE.CircleGeometry(0.26, 24);
        meshGeo.scale(0.9, 1.25, 1.0);
        const innerMesh = new THREE.Mesh(meshGeo, acousticMeshMat);
        innerMesh.position.x = isLeft ? 0.14 : -0.14;
        innerMesh.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
        cupGroup.add(innerMesh);

        // Signature Sony Copper Microphone Grille (Dual feedforward NC sensors)
        const micGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.015, 16);
        const topMic = new THREE.Mesh(micGeo, copperMat);
        topMic.position.set(0, 0.32, 0.15);
        cupGroup.add(topMic);

        const bottomMic = new THREE.Mesh(micGeo, copperMat);
        bottomMic.position.set(0, -0.32, 0.15);
        cupGroup.add(bottomMic);

        // Buttons & Ports
        if (isLeft) {
          // 3.5mm Audio Jack & Power/Bluetooth Button on Left Cup
          const jackGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.02, 12);
          const jackMesh = new THREE.Mesh(jackGeo, aluminumSliderMat);
          jackMesh.position.set(0, -0.34, 0);
          cupGroup.add(jackMesh);

          const powerBtnGeo = new THREE.BoxGeometry(0.025, 0.05, 0.015);
          const powerBtn = new THREE.Mesh(powerBtnGeo, satinPlasticMat);
          powerBtn.position.set(-0.16, -0.22, -0.18);
          cupGroup.add(powerBtn);
        } else {
          // USB-C Charging Port on Right Cup
          const usbcGeo = new THREE.BoxGeometry(0.02, 0.06, 0.02);
          const usbcMesh = new THREE.Mesh(usbcGeo, aluminumSliderMat);
          usbcMesh.position.set(0, -0.34, 0);
          cupGroup.add(usbcMesh);

          // Touch Sensor Plate Accent Ring (Gold/Copper trim)
          const ringGeo = new THREE.RingGeometry(0.22, 0.23, 32);
          ringGeo.scale(0.9, 1.2, 1.0);
          const touchRing = new THREE.Mesh(ringGeo, copperMat);
          touchRing.position.set(0.17, 0, 0);
          touchRing.rotation.y = Math.PI / 2;
          cupGroup.add(touchRing);
        }

        // Discrete Sony Engraved Logo Badge Accent
        const logoBadgeGeo = new THREE.BoxGeometry(0.01, 0.04, 0.12);
        const logoBadge = new THREE.Mesh(logoBadgeGeo, copperMat);
        logoBadge.position.set(isLeft ? -0.18 : 0.18, 0.28, 0);
        cupGroup.add(logoBadge);

        return cupGroup;
      }

      // Add Left Earcup (Angled slightly inward for realistic posture)
      const leftCup = createEarcup(true);
      leftCup.position.set(-0.95, -0.15, 0);
      leftCup.rotation.y = 0.12;
      headphonesGroup.add(leftCup);

      // Add Right Earcup (Angled slightly inward)
      const rightCup = createEarcup(false);
      rightCup.position.set(0.95, -0.15, 0);
      rightCup.rotation.y = -0.12;
      headphonesGroup.add(rightCup);

      // Center the whole headphones ensemble
      headphonesGroup.position.y = -0.1;

      // Pointer & Drag Interaction Handlers
      const handlePointerDown = (e: PointerEvent) => {
        stateRef.current.isDragging = true;
        stateRef.current.startX = e.clientX;
        stateRef.current.startY = e.clientY;
        onInteractionChange?.(true);
      };

      const handlePointerMove = (e: PointerEvent) => {
        const state = stateRef.current;
        if (state.isDragging) {
          const deltaX = (e.clientX - state.startX) * 0.008;
          const deltaY = (e.clientY - state.startY) * 0.005;

          // Free 360 yaw rotation
          state.targetRotY += deltaX;

          // Restrained vertical tilt (±20 degrees max)
          state.targetRotX = Math.max(-0.35, Math.min(0.35, state.targetRotX + deltaY));

          state.startX = e.clientX;
          state.startY = e.clientY;
        } else {
          // Gentle hover parallax when not dragging
          const rect = container.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          state.targetRotY = 0.45 + normX * 0.7;
          state.targetRotX = 0.1 + normY * 0.35;
        }
      };

      const handlePointerUp = () => {
        stateRef.current.isDragging = false;
        onInteractionChange?.(false);
      };

      const handlePointerLeave = () => {
        stateRef.current.isDragging = false;
        // Return gently to resting 3/4 beauty pose
        stateRef.current.targetRotY = 0.45;
        stateRef.current.targetRotX = 0.1;
        onInteractionChange?.(false);
      };

      // Keyboard Controls (Arrow keys to rotate, 'R' to reset)
      const handleKeyDown = (e: KeyboardEvent) => {
        const state = stateRef.current;
        if (e.key === "ArrowLeft") {
          state.targetRotY -= 0.25;
        } else if (e.key === "ArrowRight") {
          state.targetRotY += 0.25;
        } else if (e.key === "ArrowUp") {
          state.targetRotX = Math.max(-0.35, state.targetRotX - 0.15);
        } else if (e.key === "ArrowDown") {
          state.targetRotX = Math.min(0.35, state.targetRotX + 0.15);
        } else if (e.key.toLowerCase() === "r" || e.key === " ") {
          resetOrientation();
        }
      };

      container.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      container.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("keydown", handleKeyDown);

      // Damped Kinematic Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const state = stateRef.current;

        // Auto-rotate mode if toggled
        if (autoRotate) {
          state.targetRotY += state.autoRotateSpeed;
        }

        // Spring Damped Interpolation (Smooth physical rotation with zero sudden jumps)
        state.currentRotY += (state.targetRotY - state.currentRotY) * 0.08;
        state.currentRotX += (state.targetRotX - state.currentRotX) * 0.08;

        if (headphonesGroup) {
          headphonesGroup.rotation.y = state.currentRotY;
          headphonesGroup.rotation.x = state.currentRotX;

          // Subtle floating idle oscillation
          headphonesGroup.position.y = -0.1 + Math.sin(Date.now() * 0.0018) * 0.035;
        }

        // Update rotation degrees counter for display
        const normalizedDeg = Math.round(((state.currentRotY * (180 / Math.PI)) % 360 + 360) % 360);
        setRotationDegrees(normalizedDeg);

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        container.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (e) {
      console.warn("WebGL initialization failed for Sony WH-1000XM6:", e);
      setWebGlSupported(false);
    }
  }, [colorVariant, autoRotate, onInteractionChange, resetOrientation]);

  if (!webGlSupported) {
    return (
      <div className={`w-full ${className} flex items-center justify-center p-6 bg-slate-900/60 rounded-3xl border border-slate-800`}>
        <div className="text-center max-w-sm">
          <Volume2 className="w-12 h-12 text-[#FF8A00] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">Sony WH-1000XM6 Wireless NC</h4>
          <p className="text-xs text-slate-400 mt-1">
            Over-ear flagship audio with custom HD Noise Cancelling Processor QN3 and Dual Sensor acoustics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className} cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/40 via-slate-950/70 to-slate-950 border border-slate-800/80 shadow-2xl`}
      tabIndex={0}
      role="region"
      aria-label="Sony WH-1000XM6 3D Product Interactive Stage"
    >
      {/* Top Controls & Telemetry Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-[11px] font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
          <span>Sony WH-1000XM6 • 360° Inspection</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md text-[10px] font-mono text-slate-400">
          {rotationDegrees}°
        </div>
      </div>

      {/* Interactive Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl border backdrop-blur-md text-xs font-medium transition-all ${
            autoRotate
              ? "bg-[#FF8A00] border-[#FF8A00] text-white shadow-md shadow-orange-500/20"
              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
          title={autoRotate ? "Pause Turntable" : "Start 360° Turntable"}
          aria-label="Toggle 360 turntable"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
        </button>

        <button
          type="button"
          onClick={resetOrientation}
          className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md text-xs transition-all"
          title="Reset to 3/4 Resting Pose (Press R)"
          aria-label="Reset viewing angle"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Hardware Feature Callouts */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 backdrop-blur-md">
            Custom QN3 HD ANC Processor
          </span>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 backdrop-blur-md">
            Multi-Mic Noise Sensors
          </span>
          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 backdrop-blur-md">
            Seamless Leatherette Comfort
          </span>
        </div>

        <div className="text-[10px] text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800/60 backdrop-blur-sm">
          Drag to rotate • Arrow keys to inspect • R to reset
        </div>
      </div>
    </div>
  );
}
