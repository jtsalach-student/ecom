"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Eye, Hand, Shield, Sparkles, CheckCircle2, AlertCircle, Play, Undo2 } from "lucide-react";

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

type PoseStage = "folded" | "unfolding-mid" | "waving" | "covering-eyes" | "attentive";

/**
 * Truly Animated Photorealistic Character Engine
 * Features:
 * - Exact Pixar/DreamWorks character matching the reference photo (auburn hair, freckles, yellow hoodie)
 * - Rest position: Hands folded across chest (crossed arms)
 * - Dynamic Arm Unfolding: Arms actively uncross, raise up to wave, wave side-to-side, and fold back
 * - Form Privacy: Hands unfold and raise to cover eyes during password entry, folding back on blur
 * - Independent Real-Time Eye & Pupil Tracking: Pupils actively follow the mouse pointer in real-time
 * - Natural Blinking: Eyelids close and open every 3-5 seconds
 * - Organic Idle Breathing: Subtle chest and shoulder motion prevents stiffness
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
  const eyeCanvasRef = useRef<HTMLCanvasElement>(null);

  // Active pose stage
  const [currentStage, setCurrentStage] = useState<PoseStage>("folded");
  const [isAnimatingArms, setIsAnimatingArms] = useState(false);
  const [wavingHandAngle, setWavingHandAngle] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mouse & Eye tracking coordinates
  const pointerPos = useRef({ x: 0, y: 0, normX: 0, normY: 0 });
  const currentPupilPos = useRef({ x: 0, y: 0 });
  const blinkState = useRef({ isBlinking: false, progress: 0 });
  const breathingTime = useRef(0);

  // 3D parallax orientation for head and torso
  const [parallax, setParallax] = useState({ rotX: 0, rotY: 0, breatheY: 0 });

  // 1. Unfold arms -> Wave -> Fold arms back sequence
  const executeWaveSequence = useCallback(() => {
    if (isAnimatingArms) return;
    setIsAnimatingArms(true);
    setToastMessage("Unfolding arms to wave...");

    // Stage 1: Arms begin uncrossing
    setCurrentStage("unfolding-mid");

    // Stage 2: Hand reaches full wave position
    const waveTimer1 = setTimeout(() => {
      setCurrentStage("waving");
      setToastMessage("👋 Waving hello!");
    }, 250);

    // Stage 3: After waving, begin folding arms back
    const waveTimer2 = setTimeout(() => {
      setCurrentStage("unfolding-mid");
      setToastMessage("Folding arms back...");
    }, 2800);

    // Stage 4: Restored to folded arms crossed over chest
    const waveTimer3 = setTimeout(() => {
      setCurrentStage("folded");
      setIsAnimatingArms(false);
      setToastMessage(null);
    }, 3100);

    return () => {
      clearTimeout(waveTimer1);
      clearTimeout(waveTimer2);
      clearTimeout(waveTimer3);
    };
  }, [isAnimatingArms]);

  // Form field state triggers
  useEffect(() => {
    if (isAnimatingArms) return;

    if (authStatus === "success") {
      executeWaveSequence();
      return;
    }

    if (focusedField === "password" && !isPasswordRevealed) {
      setCurrentStage("covering-eyes");
    } else if (focusedField === "email") {
      setCurrentStage("attentive");
    } else {
      setCurrentStage("folded");
    }
  }, [focusedField, isPasswordRevealed, authStatus, isAnimatingArms, executeWaveSequence]);

  // 2. High-Precision Eye Tracking & Natural Blinking Canvas Engine
  useEffect(() => {
    const canvas = eyeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nextBlinkTime = Date.now() + 2500 + Math.random() * 2000;

    const renderEyes = () => {
      const now = Date.now();

      // Handle Blinking Physics
      if (now > nextBlinkTime && !blinkState.current.isBlinking) {
        blinkState.current.isBlinking = true;
        blinkState.current.progress = 0;
      }

      if (blinkState.current.isBlinking) {
        blinkState.current.progress += 0.18;
        if (blinkState.current.progress >= Math.PI) {
          blinkState.current.isBlinking = false;
          blinkState.current.progress = 0;
          nextBlinkTime = now + 3000 + Math.random() * 2500;
        }
      }

      const blinkClosure = blinkState.current.isBlinking
        ? Math.sin(blinkState.current.progress)
        : 0;

      // Smooth damped pupil interpolation towards mouse pointer
      const targetPupilX = pointerPos.current.normX * 14; // Max 14px horizontal gaze
      const targetPupilY = pointerPos.current.normY * 10; // Max 10px vertical gaze

      currentPupilPos.current.x += (targetPupilX - currentPupilPos.current.x) * 0.12;
      currentPupilPos.current.y += (targetPupilY - currentPupilPos.current.y) * 0.12;

      // Update idle breathing
      breathingTime.current += 0.04;
      const breatheOffset = Math.sin(breathingTime.current) * 3;

      setParallax((prev) => ({
        ...prev,
        rotY: pointerPos.current.normX * 7,
        rotX: -pointerPos.current.normY * 5,
        breatheY: breatheOffset,
      }));

      // If waving, animate hand waving oscillation
      if (currentStage === "waving") {
        setWavingHandAngle(Math.sin(now * 0.012) * 12); // Wave tilt +-12 deg
      } else {
        setWavingHandAngle(0);
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Don't render eyes if hands are covering them
      if (currentStage === "covering-eyes") {
        animId = requestAnimationFrame(renderEyes);
        return;
      }

      // Eye definitions corresponding to high-res face coordinates
      // Canvas is 1024x1024
      const eyes = [
        { cx: 422, cy: 396, rx: 42, ry: 38 }, // Left Eye (viewer left)
        { cx: 574, cy: 396, rx: 42, ry: 38 }, // Right Eye (viewer right)
      ];

      eyes.forEach(({ cx, cy, rx, ry }) => {
        ctx.save();

        // 1. Clip to almond/oval eye socket
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.clip();

        // 2. Translucent Sclera shading (depth shadow under upper lid)
        const scleraGrad = ctx.createRadialGradient(cx, cy - 8, 5, cx, cy, rx);
        scleraGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        scleraGrad.addColorStop(0.85, "rgba(240, 235, 230, 0.9)");
        scleraGrad.addColorStop(1, "rgba(210, 195, 185, 0.85)");
        ctx.fillStyle = scleraGrad;
        ctx.fill();

        // 3. Pupil & Amber Iris (Translates with mouse tracking)
        const pupilX = cx + currentPupilPos.current.x;
        const pupilY = cy + currentPupilPos.current.y;
        const irisRadius = 25;

        // Outer Iris Ring (Warm amber-brown gradient)
        const irisGrad = ctx.createRadialGradient(pupilX, pupilY, 3, pupilX, pupilY, irisRadius);
        irisGrad.addColorStop(0, "#1F120A"); // Dark pupil center
        irisGrad.addColorStop(0.35, "#3D1E0C");
        irisGrad.addColorStop(0.65, "#C87018"); // Amber midtone
        irisGrad.addColorStop(0.92, "#F29829"); // Luminous amber fringe
        irisGrad.addColorStop(1, "#2B160A"); // Dark limbal ring

        ctx.beginPath();
        ctx.arc(pupilX, pupilY, irisRadius, 0, Math.PI * 2);
        ctx.fillStyle = irisGrad;
        ctx.fill();

        // Deep Black Central Pupil
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, 11, 0, Math.PI * 2);
        ctx.fillStyle = "#0A0503";
        ctx.fill();

        // Primary Glossy Catchlight Reflection
        ctx.beginPath();
        ctx.arc(pupilX - 6, pupilY - 6, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();

        // Secondary Soft Catchlight
        ctx.beginPath();
        ctx.arc(pupilX + 6, pupilY + 5, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();

        // 4. Upper Eyelash Cast Shadow
        ctx.beginPath();
        ctx.ellipse(cx, cy - ry + 4, rx, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(40, 20, 10, 0.4)";
        ctx.fill();

        // 5. Dynamic Eyelid Blinking Shutter
        if (blinkClosure > 0.01) {
          const eyelidDrop = ry * 2 * blinkClosure;
          ctx.beginPath();
          ctx.rect(cx - rx - 5, cy - ry - 5, rx * 2 + 10, eyelidDrop);
          // Skin tone matching the boy's warm peachy complexion
          const skinGrad = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
          skinGrad.addColorStop(0, "#EAB89A");
          skinGrad.addColorStop(0.7, "#DE9D7C");
          skinGrad.addColorStop(1, "#C27857");
          ctx.fillStyle = skinGrad;
          ctx.fill();

          // Eyelid crease line
          ctx.strokeStyle = "#9E5638";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx - rx, cy - ry + eyelidDrop);
          ctx.quadraticCurveTo(cx, cy - ry + eyelidDrop + 6, cx + rx, cy - ry + eyelidDrop);
          ctx.stroke();
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(renderEyes);
    };

    animId = requestAnimationFrame(renderEyes);
    return () => cancelAnimationFrame(animId);
  }, [currentStage]);

  // Pointer movement tracking across window
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Bound between -1 and 1
      const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth / 2.5)));
      const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight / 2.5)));

      pointerPos.current = {
        x: e.clientX,
        y: e.clientY,
        normX,
        normY,
      };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  // Resolve base image for current pose stage
  const getBaseImage = () => {
    if (currentStage === "covering-eyes") return "/character/boy-covering-eyes.jpg";
    if (currentStage === "attentive") return "/character/boy-attentive.jpg";
    if (currentStage === "unfolding-mid") return "/character/boy-unfolding-mid.jpg";
    if (currentStage === "waving") return "/character/boy-waving.jpg";

    // Folded stage
    if (variant === "staff") return "/character/boy-staff-folded.jpg";
    if (variant === "admin") return "/character/boy-superadmin-folded.jpg";
    return "/character/boy-folded-arms.jpg";
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className} select-none overflow-hidden rounded-3xl flex flex-col items-center justify-center p-4 lg:p-8 transition-colors duration-500`}
      style={{
        background: `radial-gradient(circle at 50% 45%, ${tenantColor}18 0%, rgba(15, 23, 42, 0.96) 75%)`,
      }}
    >
      {/* Interactive 3D Parallax Character Rig */}
      <div
        className="relative w-full max-w-[440px] aspect-square flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${parallax.rotX.toFixed(2)}deg) rotateY(${parallax.rotY.toFixed(2)}deg) translateY(${parallax.breatheY.toFixed(2)}px)`,
        }}
      >
        {/* Soft Volumetric Studio Lighting Halo */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-50 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${tenantColor}44 0%, transparent 70%)`,
          }}
        />

        {/* Character Stage Container */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-900 group">
          {/* Base Photorealistic Character Layer */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getBaseImage()}
            alt={`Character ${variant} in ${currentStage} pose`}
            className={`w-full h-full object-cover object-top transition-transform duration-300 ease-out ${
              currentStage === "waving" ? "origin-bottom-right" : ""
            }`}
            style={{
              transform: currentStage === "waving" ? `rotate(${wavingHandAngle}deg)` : "none",
              filter: "contrast(1.02) saturate(1.03)",
            }}
          />

          {/* Real-Time Eye & Pupil Tracking Canvas Overlay */}
          <canvas
            ref={eyeCanvasRef}
            width={1024}
            height={1024}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              mixBlendMode: "normal",
            }}
          />

          {/* Real-time Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 backdrop-blur-md text-[10px] text-slate-300 font-mono shadow">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentStage === "folded"
                  ? "bg-amber-400"
                  : currentStage === "waving"
                  ? "bg-emerald-400 animate-ping"
                  : "bg-blue-400 animate-pulse"
              }`}
            />
            <span className="capitalize">
              {currentStage === "folded"
                ? "Arms Folded (Idle)"
                : currentStage === "unfolding-mid"
                ? "Uncrossing Arms..."
                : currentStage === "waving"
                ? "Waving Hand"
                : currentStage === "covering-eyes"
                ? "Covering Eyes (Privacy)"
                : "Attentive"}
            </span>
          </div>

          {/* Quick Trigger Button Directly on Stage */}
          <button
            type="button"
            onClick={executeWaveSequence}
            disabled={isAnimatingArms}
            className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold shadow-xl backdrop-blur-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            title="Trigger arms to unfold, wave, and fold back"
          >
            <Hand className="w-3.5 h-3.5" />
            <span>{isAnimatingArms ? "Moving..." : "Unfold & Wave"}</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification */}
      {toastMessage && (
        <div className="absolute top-4 z-30 px-4 py-1.5 rounded-full bg-orange-600 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Form Privacy Indicator Pill */}
      {focusedField === "password" && !isPasswordRevealed && (
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-300 shadow-lg animate-fadeIn">
          <Eye className="w-3.5 h-3.5 text-orange-400" />
          <span>Hands raised covering eyes (Password Privacy)</span>
        </div>
      )}

      {focusedField === "email" && (
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/80 backdrop-blur-md text-xs font-medium text-blue-300 shadow-lg animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Hands unfolded • Listening attentively</span>
        </div>
      )}

      {authStatus === "success" && (
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600/80 backdrop-blur-md text-xs font-semibold text-emerald-300 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Welcome! Authentication successful</span>
        </div>
      )}

      {/* Interactive Testing Controls */}
      <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-400">
        <button
          type="button"
          onClick={() => {
            setCurrentStage("folded");
            setToastMessage("Arms crossed across chest (Resting pose)");
            setTimeout(() => setToastMessage(null), 2000);
          }}
          className={`px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
            currentStage === "folded"
              ? "bg-slate-800 text-white border-orange-500/60 font-semibold"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Undo2 className="w-3 h-3" />
          <span>Fold Arms</span>
        </button>

        <button
          type="button"
          onClick={executeWaveSequence}
          disabled={isAnimatingArms}
          className={`px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
            currentStage === "waving" || currentStage === "unfolding-mid"
              ? "bg-orange-600 text-white border-orange-500 font-semibold"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Hand className="w-3 h-3" />
          <span>Unfold & Wave</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCurrentStage("covering-eyes");
            setToastMessage("Hands raised covering eyes (Privacy)");
            setTimeout(() => {
              setCurrentStage("folded");
              setToastMessage(null);
            }, 3000);
          }}
          className={`px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
            currentStage === "covering-eyes"
              ? "bg-slate-800 text-white border-orange-500/60 font-semibold"
              : "bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white"
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Cover Eyes</span>
        </button>
      </div>

      {/* Role & Attire Legend */}
      <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/60 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400 font-mono">
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
