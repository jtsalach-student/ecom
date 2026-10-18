"use client";

import React, { useState } from "react";
import { ProductListing } from "@gcp/contracts";
import { ShieldCheck, Info, CheckCircle2 } from "lucide-react";

export interface FallbackViewerProps {
  product: ProductListing;
  className?: string;
  onShopClick?: () => void;
}

export function FallbackViewer({ product, className, onShopClick }: FallbackViewerProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : ["/placeholder-device.jpg"];

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center ${
        className || ""
      }`}
    >
      {/* Product Image Gallery */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-4">
          <img
            src={images[activeImageIndex]}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? "border-blue-500 scale-105" : "border-slate-800 opacity-60"
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Verified Hardware Details */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          Verified Manufacturer Specifications
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {product.name}
        </h2>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          {product.description}
        </p>

        {/* Technical Specs Grid */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {product.specs.processor && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Processor</span>
              <p className="text-xs font-semibold text-white mt-0.5">{product.specs.processor}</p>
            </div>
          )}
          {product.specs.displaySizeInches && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Display</span>
              <p className="text-xs font-semibold text-white mt-0.5">
                {product.specs.displaySizeInches}&quot; {product.specs.displayType}
              </p>
            </div>
          )}
          {product.specs.batteryCapacityMah && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Battery</span>
              <p className="text-xs font-semibold text-white mt-0.5">
                {product.specs.batteryCapacityMah} mAh ({product.specs.chargingWattage}W Fast Charge)
              </p>
            </div>
          )}
          {product.specs.cameraSpecs && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500">Camera</span>
              <p className="text-xs font-semibold text-white mt-0.5 truncate">{product.specs.cameraSpecs}</p>
            </div>
          )}
        </div>

        {onShopClick && (
          <button
            onClick={onShopClick}
            className="mt-6 w-fit px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Explore Variants & Pricing
          </button>
        )}
      </div>
    </div>
  );
}
