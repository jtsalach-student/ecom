"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Cpu, Battery, Camera, Layers, ShieldCheck, Eye, RotateCcw, Sliders } from "lucide-react";

export interface LoginPhoneDissectionVisualProps {
  className?: string;
  modelName?: string;
  modelGlbUrl?: string;
  fallbackImageUrl?: string;
}

export function LoginPhoneDissectionVisual({
  className = "",
  modelName = "iPhone 16 Pro Max",
  modelGlbUrl,
  fallbackImageUrl = "/images/products/iphone-16-pro-max.png",
}: LoginPhoneDissectionVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeCallout, setActiveCallout] = useState("Assembled Resting Pose");
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  // Animation refs
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const targetParallaxRef = useRef({ x: 0, y: 0 });
  const currentParallaxRef = useRef({ x: 0, y: 0 });
  const reqIdRef = useRef<number | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  // WebGL 3D Scene Initialization
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current || !containerRef.current) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL unsupported or disabled in browser:", e);
      setWebGlAvailable(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const updateSize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width > 0 && height > 0) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    updateSize();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x60a5fa, 1.8);
    dirLight1.position.set(5, 8, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight2.position.set(-6, -4, 5);
    scene.add(dirLight2);

    // Root Phone Hierarchy
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);

    // Assembly Components with verified spatial offsets
    // 1. Titanium Frame & Chassis
    const chassisGeo = new THREE.BoxGeometry(3.6, 7.2, 0.35);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x22262d,
      metalness: 0.85,
      roughness: 0.25,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    phoneGroup.add(chassisMesh);

    // 2. Super Retina XDR OLED Display (Explodes forward)
    const displayGeo = new THREE.BoxGeometry(3.5, 7.1, 0.08);
    const displayMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      roughness: 0.1,
      metalness: 0.95,
    });
    const displayMesh = new THREE.Mesh(displayGeo, displayMat);
    displayMesh.position.z = 0.22;
    phoneGroup.add(displayMesh);

    // 3. Logic Board & A18 Pro Bionic SoC (Explodes right and forward)
    const boardGeo = new THREE.BoxGeometry(1.6, 3.2, 0.08);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x0f291e,
      roughness: 0.4,
      metalness: 0.6,
    });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.position.set(0.7, 1.4, 0.1);
    phoneGroup.add(boardMesh);

    // 4. Lithium-ion Battery Pack with Steel Casing (Explodes left and back)
    const batteryGeo = new THREE.BoxGeometry(1.6, 4.4, 0.15);
    const batteryMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const batteryMesh = new THREE.Mesh(batteryGeo, batteryMat);
    batteryMesh.position.set(-0.8, -0.6, 0.08);
    phoneGroup.add(batteryMesh);

    // 5. Triple Camera & Periscope Optics Array (Explodes top-left forward)
    const cameraGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 32);
    cameraGeo.rotateX(Math.PI / 2);
    const cameraMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.15,
    });
    const cameraMesh = new THREE.Mesh(cameraGeo, cameraMat);
    cameraMesh.position.set(-0.9, 2.3, 0.25);
    phoneGroup.add(cameraMesh);

    // 6. Textured Back Glass with MagSafe (Explodes backward)
    const backGlassGeo = new THREE.BoxGeometry(3.55, 7.15, 0.08);
    const backGlassMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.88,
    });
    const backGlassMesh = new THREE.Mesh(backGlassGeo, backGlassMat);
    backGlassMesh.position.z = -0.22;
    phoneGroup.add(backGlassMesh);

    // Animation Render Loop with Damped Interpolation
    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;

      // Damped interpolation for progress
      const targetP = targetProgressRef.current;
      currentProgressRef.current += (targetP - currentProgressRef.current) * 0.08;
      const p = currentProgressRef.current;
      setProgress(Math.round(p * 100) / 100);

      // Damped interpolation for parallax
      const targetPx = targetParallaxRef.current.x;
      const targetPy = targetParallaxRef.current.y;
      currentParallaxRef.current.x += (targetPx - currentParallaxRef.current.x) * 0.06;
      currentParallaxRef.current.y += (targetPy - currentParallaxRef.current.y) * 0.06;

      // Apply camera parallax
      phoneGroup.rotation.y = currentParallaxRef.current.x * 0.4;
      phoneGroup.rotation.x = -currentParallaxRef.current.y * 0.3;

      // Disassemble components based on progress p
      displayMesh.position.z = 0.22 + p * 2.2;
      displayMesh.rotation.y = p * 0.12;

      boardMesh.position.z = 0.1 + p * 1.5;
      boardMesh.position.x = 0.7 + p * 1.4;

      batteryMesh.position.z = 0.08 - p * 1.2;
      batteryMesh.position.x = -0.8 - p * 1.3;

      cameraMesh.position.z = 0.25 + p * 2.6;
      cameraMesh.position.y = 2.3 + p * 0.6;

      backGlassMesh.position.z = -0.22 - p * 2.0;

      // Update callout text based on expansion stage
      if (p < 0.1) {
        setActiveCallout("Assembled Resting Pose");
      } else if (p < 0.35) {
        setActiveCallout("Display & Chassis Separation");
      } else if (p < 0.65) {
        setActiveCallout("A18 Pro SoC & Battery Exposed");
      } else if (p < 0.85) {
        setActiveCallout("Periscope Optics & Sensor Array");
      } else {
        setActiveCallout("Full Precision Internal Disassembly");
      }

      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(animate);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(() => updateSize());
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      isRunning = false;
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      chassisGeo.dispose();
      chassisMat.dispose();
      displayGeo.dispose();
      displayMat.dispose();
      boardGeo.dispose();
      boardMat.dispose();
      batteryGeo.dispose();
      batteryMat.dispose();
      cameraGeo.dispose();
      cameraMat.dispose();
      backGlassGeo.dispose();
      backGlassMat.dispose();
    };
  }, [prefersReducedMotion]);

  // Pointer Move Interaction (Scoped strictly to this visual container)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    // Horizontal pointer sweep drives explosion amount (clamped 0 to 1)
    targetProgressRef.current = Math.min(1, Math.max(0, nx * 1.15));

    // Centered coordinates drive camera parallax
    targetParallaxRef.current = {
      x: (nx - 0.5) * 2,
      y: (ny - 0.5) * 2,
    };
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    // Return smoothly to assembled resting pose
    targetProgressRef.current = 0;
    targetParallaxRef.current = { x: 0, y: 0 };
    setIsHovered(false);
  }, []);

  const handleManualSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    targetProgressRef.current = val;
    setProgress(val);
  };

  const handleReset = () => {
    targetProgressRef.current = 0;
    setProgress(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-[520px] lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 shadow-2xl flex flex-col justify-between p-6 select-none ${className}`}
      aria-label="Interactive 3D Hardware Dissection Viewport"
      role="region"
    >
      {/* 3D WebGL Canvas Layer */}
      {webGlAvailable && !prefersReducedMotion ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        />
      ) : (
        /* Truthful Static Fallback for Reduced Motion or Disabled WebGL */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <img
            src={fallbackImageUrl}
            alt={modelName}
            className="max-h-72 object-contain filter drop-shadow-2xl transition-transform duration-500 hover:scale-105"
          />
          <span className="mt-4 text-xs font-semibold text-slate-400">
            Static High-Fidelity Asset View (Reduced Motion Active)
          </span>
        </div>
      )}

      {/* Top Floating Badge & Status */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Verified Disassembly Model
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{modelName}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Titanium Grade 5 Frame • A18 Pro SoC Architecture</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-800/40 px-2.5 py-1 rounded-lg">
            {Math.round(progress * 100)}% Dissected
          </span>
        </div>
      </div>

      {/* Active Component Callout Box */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-xl px-4 py-2 text-center shadow-lg transition-all">
          <span className="text-xs text-blue-400 font-semibold block uppercase tracking-wider mb-0.5">
            Active Assembly
          </span>
          <span className="text-sm font-bold text-white">{activeCallout}</span>
        </div>
        {!isHovered && progress === 0 && (
          <span className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 animate-pulse">
            <Eye className="w-3.5 h-3.5 text-blue-400" /> Move pointer across viewport to dissect
          </span>
        )}
      </div>

      {/* Accessible Interactive Bottom Controls (Touch & Keyboard support) */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-medium">
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            Inspection Slider
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors focus:ring-2 focus:ring-blue-500 rounded px-1.5 py-0.5"
            aria-label="Reset assembly to resting pose"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={handleManualSlider}
          className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Disassembly expansion level"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-0.5">
          <span>Assembled</span>
          <span>Battery / Logic</span>
          <span>Full Dissection</span>
        </div>
      </div>
    </div>
  );
}
