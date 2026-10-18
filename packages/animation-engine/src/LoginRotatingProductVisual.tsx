"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Sparkles, RotateCw, ShieldCheck, Eye, Sliders } from "lucide-react";

export interface LoginRotatingProductVisualProps {
  className?: string;
  modelName?: string;
  fallbackImageUrl?: string;
  accentColor?: string;
}

export function LoginRotatingProductVisual({
  className = "",
  modelName = "Apple iPhone 16 Pro Max",
  fallbackImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
  accentColor = "#FF8A00",
}: LoginRotatingProductVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sliderAngle, setSliderAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  // Animation refs
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
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
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 3.4);

    // Studio Lighting for Intact Electronics
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const orangeRimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 1.6);
    orangeRimLight.position.set(-3, -2, -2);
    scene.add(orangeRimLight);

    // Build Intact Assembled Smartphone Model (NO dissection, fully assembled)
    const deviceGroup = new THREE.Group();

    // Grade 5 Titanium Chassis Frame
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x8a8e94,
      metalness: 0.9,
      roughness: 0.2,
    });
    const chassisGeo = new THREE.BoxGeometry(1.04, 2.12, 0.082);
    const chassis = new THREE.Mesh(chassisGeo, titaniumMat);
    deviceGroup.add(chassis);

    // Front Ceramic Shield OLED Screen (Deep glossy glass)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      metalness: 0.95,
      roughness: 0.05,
    });
    const screenGeo = new THREE.PlaneGeometry(0.98, 2.04);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.042;
    deviceGroup.add(screenMesh);

    // Rear Matte Glass Backplate
    const rearGlassMat = new THREE.MeshStandardMaterial({
      color: 0x24272c,
      metalness: 0.3,
      roughness: 0.45,
    });
    const rearGlassGeo = new THREE.PlaneGeometry(0.98, 2.04);
    const rearGlassMesh = new THREE.Mesh(rearGlassGeo, rearGlassMat);
    rearGlassMesh.rotation.y = Math.PI;
    rearGlassMesh.position.z = -0.042;
    deviceGroup.add(rearGlassMesh);

    // Triple Camera Island
    const bumpGeo = new THREE.BoxGeometry(0.44, 0.48, 0.038);
    const bumpMesh = new THREE.Mesh(bumpGeo, titaniumMat);
    bumpMesh.position.set(-0.25, 0.72, -0.058);
    deviceGroup.add(bumpMesh);

    // Camera Lens Elements
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.9,
      roughness: 0.1,
    });
    const lensGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
    const lens1 = new THREE.Mesh(lensGeo, lensMat);
    lens1.rotation.x = Math.PI / 2;
    lens1.position.set(-0.32, 0.82, -0.075);
    deviceGroup.add(lens1);

    const lens2 = new THREE.Mesh(lensGeo, lensMat);
    lens2.rotation.x = Math.PI / 2;
    lens2.position.set(-0.32, 0.62, -0.075);
    deviceGroup.add(lens2);

    const lens3 = new THREE.Mesh(lensGeo, lensMat);
    lens3.rotation.x = Math.PI / 2;
    lens3.position.set(-0.16, 0.72, -0.075);
    deviceGroup.add(lens3);

    scene.add(deviceGroup);

    // Resize handler
    const updateSize = () => {
      if (!containerRef.current || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    // Smooth render loop with damped interpolation
    const renderLoop = () => {
      // Damped interpolation to target rotation
      currentRotationRef.current.x +=
        (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y +=
        (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      deviceGroup.rotation.x = currentRotationRef.current.x;
      deviceGroup.rotation.y = currentRotationRef.current.y;

      // Subtle breathing float when resting
      if (
        Math.abs(currentRotationRef.current.x) < 0.01 &&
        Math.abs(currentRotationRef.current.y) < 0.01
      ) {
        deviceGroup.position.y = Math.sin(Date.now() * 0.0018) * 0.03;
      }

      renderer.render(scene, camera);
      reqIdRef.current = requestAnimationFrame(renderLoop);
    };

    reqIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener("resize", updateSize);
      renderer.dispose();
    };
  }, [prefersReducedMotion, accentColor]);

  // Handle pointer movements across visual container
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Bounded smooth rotation: ±30° yaw, ±15° pitch
    targetRotationRef.current = {
      x: -y * 0.5,
      y: x * 1.0,
    };
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    // Return gently to assembled front resting pose
    targetRotationRef.current = { x: 0, y: 0 };
    setSliderAngle(0);
  }, []);

  // Handle accessible manual rotation slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderAngle(val);
    targetRotationRef.current = {
      x: 0,
      y: (val / 100) * Math.PI,
    };
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between select-none ${className}`}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Visual Header */}
      <div className="z-10 p-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
          <span>Authentic Product Showcase</span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Assembled Form
        </span>
      </div>

      {/* 3D WebGL Canvas or High-Res Photographic Fallback */}
      <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
        {webGlAvailable && !prefersReducedMotion ? (
          <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
        ) : (
          <div className="p-6 flex flex-col items-center justify-center">
            <img
              src={fallbackImageUrl}
              alt={modelName}
              className="max-h-64 object-contain drop-shadow-2xl rounded-2xl"
            />
          </div>
        )}
      </div>

      {/* Visual Footer & Accessible Manual Rotation Slider */}
      <div className="z-10 p-5 space-y-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 rounded-b-3xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{modelName}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {isHovered ? "Interactive Tracking" : "Hover or drag to rotate"}
          </span>
        </div>

        {/* Accessible Manual Slider */}
        <div className="flex items-center gap-3">
          <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="range"
            min="-100"
            max="100"
            value={sliderAngle}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FF8A00]"
            aria-label="Inspect 3D Product Angle"
          />
          <button
            onClick={() => {
              targetRotationRef.current = { x: 0, y: 0 };
              setSliderAngle(0);
            }}
            className="text-[10px] font-semibold text-slate-500 hover:text-[#FF8A00] transition-colors shrink-0"
            title="Reset to Front Pose"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
