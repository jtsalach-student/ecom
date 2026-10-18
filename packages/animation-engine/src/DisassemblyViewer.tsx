"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimationPackage, ExplodedComponent } from "@gcp/contracts";
import { DisassemblySceneController } from "./scene-controller.js";
import { Play, Pause, RotateCcw, Cpu, Layers, Battery, Eye, Sparkles } from "lucide-react";

export interface DisassemblyViewerProps {
  packageData: AnimationPackage;
  initialProgress?: number;
  className?: string;
  onExploreCtaClick?: () => void;
}

export function DisassemblyViewer({
  packageData,
  initialProgress = 0,
  className,
  onExploreCtaClick,
}: DisassemblyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<DisassemblySceneController | null>(null);
  const [progress, setProgress] = useState(initialProgress);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCallout, setActiveCallout] = useState<string>("Fully Assembled Flagship Device");
  const [currentStage, setCurrentStage] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState<ExplodedComponent | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const controller = new DisassemblySceneController(
        containerRef.current,
        packageData,
        (stage, callout) => {
          setCurrentStage(stage);
          if (callout) setActiveCallout(callout);
        }
      );
      controllerRef.current = controller;
      controller.updateProgress(progress);

      const handleResize = () => {
        if (containerRef.current && controllerRef.current) {
          controllerRef.current.resize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
          );
        }
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        controller.destroy();
        controllerRef.current = null;
      };
    } catch (err) {
      console.warn("WebGL initialization failed, falling back to static visual inspection:", err);
    }
  }, [packageData]);

  useEffect(() => {
    if (controllerRef.current) {
      controllerRef.current.updateProgress(progress);
    }
  }, [progress]);

  // Auto-play loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return Math.min(1, prev + 0.01);
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      className={`relative w-full h-[600px] md:h-[720px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col ${
        className || ""
      }`}
    >
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner / Device Identification */}
      <div className="relative z-10 p-6 flex items-start justify-between pointer-events-none">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              Verified Hardware Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Rev: {packageData.hardwareRevision}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {packageData.exactModel}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Cinematic Scroll-Linked Component Disassembly
          </p>
        </div>

        {/* Stage Indicator */}
        <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
          Stage {currentStage} / 10
        </div>
      </div>

      {/* Active Callout Overlay */}
      <div className="relative z-10 mt-auto px-6 pb-2 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-sm font-medium text-blue-400 shadow-lg">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>{activeCallout}</span>
        </div>
      </div>

      {/* Component Hotspot Drawer / Inspector */}
      {selectedComponent && (
        <div className="relative z-20 mx-6 mb-4 p-4 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {selectedComponent.category.replace(/_/g, " ")}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {selectedComponent.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {selectedComponent.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedComponent(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
            >
              Close
            </button>
          </div>
          {Object.keys(selectedComponent.verifiedSpecs).length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
              {Object.entries(selectedComponent.verifiedSpecs).map(([key, val]) => (
                <div key={key} className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono text-slate-400">{key}</div>
                  <div className="text-xs font-semibold text-slate-200">{val}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interactive Controls Bar */}
      <div className="relative z-10 p-6 pt-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex flex-col gap-3">
        {/* Progress Slider */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400 min-w-[36px]">
            {Math.round(progress * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Action Buttons & Component Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? "Pause" : "Play Sequence"}
            </button>
            <button
              onClick={() => {
                setProgress(0);
                setIsPlaying(false);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Component Inspect Chips */}
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
            {packageData.components.slice(0, 4).map((comp) => (
              <button
                key={comp.id}
                onClick={() => {
                  setSelectedComponent(comp);
                  setProgress(comp.explosionStage / 10);
                }}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors whitespace-nowrap"
              >
                {comp.name.split(" ")[0]}
              </button>
            ))}
          </div>

          {onExploreCtaClick && (
            <button
              onClick={onExploreCtaClick}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Shop This Model
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
