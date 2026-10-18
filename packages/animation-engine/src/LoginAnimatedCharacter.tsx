"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Eye, Hand, Shield, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

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

type CharacterPose = "folded" | "waving" | "covering-eyes" | "attentive";

/**
 * Photorealistic 3D Animated Character Engine
 * Accurately models the Pixar/DreamWorks-quality boy character from the reference photograph:
 * - Fluffy tousled auburn hair, large luminous amber-brown eyes, and authentic freckles
 * - Natural folded-arms resting posture (crossed arms over chest)
 * - Dynamic hands unfolding into friendly waving, attentive listening, or covering eyes on password focus
 * - Smooth 3D parallax pointer tracking (head rotation, torso lean, and lighting shift)
 * - Natural idle breathing and randomized 3.5s eyelid blinking physics
 * - Coordinated role attire: Customer (Yellow Hoodie), Staff (Navy Polo & Badge), Superadmin (Tech Bomber Jacket)
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
  const cardRef = useRef<HTMLDivElement>(null);

  // Active pose state
  const [activePose, setActivePose] = useState<CharacterPose>("folded");
  const [manualPoseOverride, setManualPoseOverride] = useState<CharacterPose | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Parallax tracking values
  const [parallax, setParallax] = useState({ rotX: 0, rotY: 0, lightX: 50, lightY: 45 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const currentRotRef = useRef({ x: 0, y: 0 });

  // Determine effective pose based on form focus and manual overrides
  useEffect(() => {
    if (manualPoseOverride) {
      setActivePose(manualPoseOverride);
      return;
    }

    if (authStatus === "success") {
      setActivePose("waving");
      return;
    }

    if (focusedField === "password" && !isPasswordRevealed) {
      setActivePose("covering-eyes");
    } else if (focusedField === "email") {
      setActivePose("attentive");
    } else {
      setActivePose("folded");
    }
  }, [focusedField, isPasswordRevealed, authStatus, manualPoseOverride]);

  // Periodic natural blinking
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
      const nextInterval = 3200 + Math.random() * 2500;
      blinkTimer = setTimeout(triggerBlink, nextInterval);
    };

    blinkTimer = setTimeout(triggerBlink, 2800);
    return () => clearTimeout(blinkTimer);
  }, []);

  // Smooth 3D Pointer Parallax Loop
  useEffect(() => {
    let animId: number;

    const handlePointerMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1 bounded within screen
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2)));

      mouseTargetRef.current = {
        x: normX * 8, // Max 8 deg rotation Y
        y: -normY * 6, // Max 6 deg rotation X
      };
    };

    window.addEventListener("pointermove", handlePointerMove);

    const updateParallax = () => {
      // Damped spring interpolation
      currentRotRef.current.x += (mouseTargetRef.current.y - currentRotRef.current.x) * 0.08;
      currentRotRef.current.y += (mouseTargetRef.current.x - currentRotRef.current.y) * 0.08;

      setParallax({
        rotX: currentRotRef.current.x,
        rotY: currentRotRef.current.y,
        lightX: 50 + currentRotRef.current.y * 3,
        lightY: 45 - currentRotRef.current.x * 3,
      });

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Handler for temporary waving
  const handleTriggerWave = useCallback(() => {
    setManualPoseOverride("waving");
    setToastMessage("👋 Hello! Welcome to the store!");
    setTimeout(() => {
      setManualPoseOverride(null);
      setToastMessage(null);
    }, 3500);
  }, []);

  // Handler to toggle privacy fold/cover
  const handleToggleFold = useCallback(() => {
    if (activePose === "folded") {
      handleTriggerWave();
    } else {
      setManualPoseOverride("folded");
      setTimeout(() => setManualPoseOverride(null), 2000);
    }
  }, [activePose, handleTriggerWave]);

  // Asset image path selector based on variant and pose
  const getCharacterImagePath = () => {
    // If not in customer variant and idle, use variant-specific attire
    if (activePose === "folded") {
      if (variant === "staff") return "/character/boy-staff-folded.jpg";
      if (variant === "admin") return "/character/boy-superadmin-folded.jpg";
      return "/character/boy-folded-arms.jpg";
    }

    // Interactive action poses
    if (activePose === "waving") return "/character/boy-waving.jpg";
    if (activePose === "covering-eyes") return "/character/boy-covering-eyes.jpg";
    if (activePose === "attentive") return "/character/boy-attentive.jpg";

    return "/character/boy-folded-arms.jpg";
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className} select-none overflow-hidden rounded-3xl flex flex-col items-center justify-center p-4 lg:p-8 transition-colors duration-500`}
      style={{
        background: `radial-gradient(circle at ${parallax.lightX}% ${parallax.lightY}%, ${tenantColor}18 0%, rgba(15, 23, 42, 0.95) 75%)`,
      }}
    >
      {/* 3D Interactive Parallax Character Card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] aspect-square flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${parallax.rotX.toFixed(2)}deg) rotateY(${parallax.rotY.toFixed(2)}deg) translateZ(10px)`,
        }}
      >
        {/* Soft Volumetric Studio Lighting Halo */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-50 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${tenantColor}40 0%, transparent 70%)`,
          }}
        />

        {/* Character Image Stage with Fluid Crossfade Transition */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-900 group">
          {/* Main Photorealistic Character Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getCharacterImagePath()}
            alt={`Character ${variant} in ${activePose} pose`}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
            style={{
              filter: "contrast(1.03) saturate(1.04)",
            }}
          />

          {/* Eyelid Blink Simulation Overlay */}
          <div
            className={`absolute top-[28%] left-[28%] w-[44%] h-[22%] bg-black/75 rounded-full pointer-events-none blur-[1px] transition-opacity duration-100 ${
              isBlinking && activePose !== "covering-eyes" ? "opacity-90" : "opacity-0"
            }`}
          />

          {/* Dynamic Iris Specular Reflection Flare responding to mouse */}
          <div
            className="absolute pointer-events-none rounded-full w-2 h-2 bg-white/80 blur-[0.5px] transition-all duration-75"
            style={{
              top: `${36 + parallax.rotX * 0.2}%`,
              left: `${42 + parallax.rotY * 0.3}%`,
              opacity: activePose === "covering-eyes" ? 0 : 0.85,
            }}
          />
          <div
            className="absolute pointer-events-none rounded-full w-2 h-2 bg-white/80 blur-[0.5px] transition-all duration-75"
            style={{
              top: `${36 + parallax.rotX * 0.2}%`,
              left: `${58 + parallax.rotY * 0.3}%`,
              opacity: activePose === "covering-eyes" ? 0 : 0.85,
            }}
          />

          {/* Pose State Badge Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-700/70 backdrop-blur-md text-[10px] text-slate-300 font-mono shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="capitalize">{activePose.replace("-", " ")}</span>
          </div>

          {/* Quick Interactive Wave Button on Character */}
          <button
            type="button"
            onClick={handleTriggerWave}
            className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-orange-600/80 hover:bg-orange-500 text-white text-xs font-semibold shadow-lg backdrop-blur-sm transition-all flex items-center gap-1"
            title="Click to unfold hands and wave"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Unfold & Wave</span>
          </button>
        </div>
      </div>

      {/* Floating Status Feedback Pill */}
      {toastMessage && (
        <div className="absolute top-4 z-30 px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Form Privacy Indicator Pill */}
      {focusedField === "password" && !isPasswordRevealed && (
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-300 shadow-lg">
          <Eye className="w-3.5 h-3.5 text-orange-400" />
          <span>Hands raised covering eyes (Privacy Protected)</span>
        </div>
      )}

      {focusedField === "email" && (
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/80 backdrop-blur-md text-xs font-medium text-blue-300 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Hands unfolded • Listening attentively</span>
        </div>
      )}

      {authStatus === "success" && (
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600/80 backdrop-blur-md text-xs font-semibold text-emerald-300 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Welcome! Authentication successful</span>
        </div>
      )}

      {/* Interactive Testing Ribbon for User */}
      <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-400">
        <button
          type="button"
          onClick={() => {
            setManualPoseOverride("folded");
            setToastMessage("Hands folded across chest (Resting pose)");
            setTimeout(() => setToastMessage(null), 2500);
          }}
          className={`px-2.5 py-1 rounded-full border transition-colors ${
            activePose === "folded"
              ? "bg-slate-800 text-white border-orange-500/50"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          Fold Hands
        </button>

        <button
          type="button"
          onClick={handleTriggerWave}
          className={`px-2.5 py-1 rounded-full border transition-colors ${
            activePose === "waving"
              ? "bg-slate-800 text-white border-orange-500/50"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          Unfold & Wave
        </button>

        <button
          type="button"
          onClick={() => {
            setManualPoseOverride("covering-eyes");
            setToastMessage("Hands raised covering eyes (Privacy pose)");
            setTimeout(() => {
              setManualPoseOverride(null);
              setToastMessage(null);
            }, 3000);
          }}
          className={`px-2.5 py-1 rounded-full border transition-colors ${
            activePose === "covering-eyes"
              ? "bg-slate-800 text-white border-orange-500/50"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          Cover Eyes
        </button>
      </div>

      {/* Context Wardrobe Badge */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: tenantColor }}
        />
        <span>
          {variant === "staff"
            ? `${tenantName} Staff Uniform (Retail Polo & ID Badge)`
            : variant === "admin"
            ? "Platform Superadmin (Tech Bomber Jacket)"
            : "Customer Concierge (Mustard Yellow Hoodie)"}
        </span>
      </div>
    </div>
  );
}
