"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ShieldCheck, Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { ProductListing } from "@gcp/contracts";

interface FloatingProductsConstellationProps {
  products: ProductListing[];
  onSelectProduct?: (product: ProductListing) => void;
  onOpenProductModal?: (product: ProductListing) => void;
}

interface FloatingItem {
  id: string;
  name: string;
  category: string;
  price: string;
  rating: number;
  reviewsCount: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  // Positioning in the constellation (percentages of container)
  left: number; // percentage (0 - 100)
  top: number; // percentage (0 - 100)
  depth: number; // parallax multiplier (0.5 to 1.5)
  animDuration: number; // seconds
  animDelay: number; // seconds
  rotationDeg: number; // resting tilt
  scale: number; // size scaling
  matchedSlug?: string;
}

const FLOATING_ITEMS: FloatingItem[] = [
  // 1. Far Left: Samsung Galaxy Z Fold6 Card (Pill Card like Shop Jo Shirt)
  {
    id: "float-fold6",
    name: "Galaxy Z Fold6 512GB",
    category: "Smartphones",
    price: "GH₵ 24,900",
    rating: 4.9,
    reviewsCount: 38,
    image: "/products/samsung-z-fold6-front.jpg",
    badge: "Galaxy AI",
    badgeColor: "#3B82F6",
    left: 4,
    top: 22,
    depth: 0.9,
    animDuration: 4.4,
    animDelay: 0.2,
    rotationDeg: -3,
    scale: 0.92,
    matchedSlug: "samsung-galaxy-z-fold6-512gb",
  },
  // 2. Left Middle-High: Surface Laptop 7 Floating Spotlight
  {
    id: "float-surface7",
    name: "Surface Laptop 7 15\"",
    category: "Copilot+ PC",
    price: "GH₵ 18,500",
    rating: 4.8,
    reviewsCount: 24,
    image: "/products/surface-laptop-7.jpg",
    badge: "Snapdragon X Elite",
    badgeColor: "#0284C7",
    left: 20,
    top: 6,
    depth: 1.2,
    animDuration: 3.8,
    animDelay: 0.8,
    rotationDeg: 2,
    scale: 1.02,
    matchedSlug: "microsoft-surface-laptop-7-15",
  },
  // 3. Center Left Cut-out Hero Gadget: iPhone 16 Pro Max
  {
    id: "float-iphone16",
    name: "iPhone 16 Pro Max",
    category: "Desert Titanium",
    price: "GH₵ 15,900",
    rating: 5.0,
    reviewsCount: 86,
    image: "/products/iphone-16-pro-max-front.jpg",
    badge: "A18 Pro • 48MP",
    badgeColor: "#FF8A00",
    left: 36,
    top: 28,
    depth: 1.4,
    animDuration: 4.8,
    animDelay: 0,
    rotationDeg: -2,
    scale: 1.08,
    matchedSlug: "apple-iphone-16-pro-max-256gb",
  },
  // 4. Center Right Cut-out Hero Gadget: Apple iMac 24" M4
  {
    id: "float-imac24",
    name: "iMac 24\" M4 Retina",
    category: "All-in-One",
    price: "GH₵ 19,200",
    rating: 5.0,
    reviewsCount: 19,
    image: "/products/apple-imac-24-front.jpg",
    badge: "Apple M4 • 4.5K",
    badgeColor: "#8B5CF6",
    left: 56,
    top: 10,
    depth: 1.1,
    animDuration: 4.0,
    animDelay: 1.2,
    rotationDeg: 3,
    scale: 1.04,
    matchedSlug: "apple-imac-24-m4-2024",
  },
  // 5. Right Middle: JBL Bar 800 MK2
  {
    id: "float-jbl800",
    name: "JBL Bar 800 MK2",
    category: "Soundbar & Sub",
    price: "GH₵ 12,800",
    rating: 4.9,
    reviewsCount: 31,
    image: "/products/jbl-bar-800-mk2.jpg",
    badge: "Dolby Atmos 5.1.2",
    badgeColor: "#EA580C",
    left: 72,
    top: 32,
    depth: 1.3,
    animDuration: 3.5,
    animDelay: 0.5,
    rotationDeg: -1.5,
    scale: 0.98,
    matchedSlug: "jbl-bar-800-mk2-soundbar",
  },
  // 6. Far Right: TCL 1.5HP Smart Inverter AC
  {
    id: "float-ac15",
    name: "TCL 1.5HP Smart Inverter",
    category: "GentleCool AC",
    price: "GH₵ 6,400",
    rating: 4.7,
    reviewsCount: 42,
    image: "/products/tcl-inverter-ac.jpg",
    badge: "Energy Saver A+++",
    badgeColor: "#10B981",
    left: 86,
    top: 16,
    depth: 0.85,
    animDuration: 4.6,
    animDelay: 1.5,
    rotationDeg: 2.5,
    scale: 0.94,
    matchedSlug: "tcl-15hp-smart-inverter-ac",
  },
];

export function FloatingProductsConstellation({
  products,
  onSelectProduct,
  onOpenProductModal,
}: FloatingProductsConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Smooth mouse move parallax handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = relX;
      targetY = relY;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setMousePos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClickItem = (item: FloatingItem) => {
    if (!item.matchedSlug) return;
    const found = products.find((p) => p.slug === item.matchedSlug);
    if (found) {
      if (onOpenProductModal) {
        onOpenProductModal(found);
      } else if (onSelectProduct) {
        onSelectProduct(found);
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 select-none"
      aria-label="Floating Products Showcase"
    >
      {/* Background Ambient Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[360px] bg-gradient-to-r from-[#FF8A00]/10 via-[#3B82F6]/5 to-[#FF8A00]/10 blur-[90px] rounded-full opacity-60 dark:opacity-40" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Tag */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Next-Gen Flagships in Motion
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#FF8A00] text-white tracking-wider">
              INTERACTIVE
            </span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover What Moves Technology Forward
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Hover and explore our authentic premium electronics collection &bull; East Legon showroom warranty included
          </p>
        </div>

        {/* Floating Constellation Stage (Desktop/Tablet interactive canvas) */}
        <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] hidden md:block">
          {FLOATING_ITEMS.map((item) => {
            const isHovered = hoveredId === item.id;
            // Differential parallax offsets
            const offsetX = mousePos.x * item.depth * 45;
            const offsetY = mousePos.y * item.depth * 35;

            return (
              <div
                key={item.id}
                onClick={() => handleClickItem(item)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  left: `${item.left}%`,
                  top: `${item.top}%`,
                  transform: `translate(${offsetX}px, ${offsetY}px) rotate(${
                    isHovered ? 0 : item.rotationDeg
                  }deg) scale(${isHovered ? item.scale * 1.08 : item.scale})`,
                  transition: isHovered
                    ? "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease"
                    : "transform 0.15s ease-out, box-shadow 0.25s ease",
                  zIndex: isHovered ? 40 : Math.round(item.depth * 10),
                }}
                className="absolute cursor-pointer group"
              >
                {/* Floating Bobbing Wrapper (Sinusoidal CSS Animation) */}
                <div
                  style={{
                    animation: `floatingConstellationBob ${item.animDuration}s ease-in-out ${item.animDelay}s infinite alternate`,
                  }}
                  className="relative p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-[#161D2A]/95 border border-slate-200/90 dark:border-slate-700/80 shadow-lg group-hover:shadow-2xl group-hover:border-[#FF8A00] dark:group-hover:border-[#FF8A00] backdrop-blur-xl transition-all duration-300 w-[185px] sm:w-[210px]"
                >
                  {/* Subtle Top Badge */}
                  {item.badge && (
                    <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white shadow-sm flex items-center gap-1"
                      style={{ backgroundColor: item.badgeColor || "#FF8A00" }}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{item.badge}</span>
                    </div>
                  )}

                  {/* Product Image Window */}
                  <div className="relative w-full h-24 sm:h-28 rounded-xl bg-slate-50 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center p-2 mb-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 160px, 200px"
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#FF8A00] transition-colors">
                      {item.name}
                    </h3>

                    {/* Star Rating & Price */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {item.rating.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({item.reviewsCount})
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#FF8A00]">
                        {item.price}
                      </span>
                    </div>
                  </div>

                  {/* Hover Quick View Pill Indicator */}
                  <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle2 className="w-3 h-3" /> In Stock
                    </span>
                    <span className="flex items-center gap-0.5 text-[#FF8A00]">
                      View <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Horizontal Fluid Scroll Carousel for smaller screens */}
        <div className="md:hidden flex items-center gap-3 overflow-x-auto pb-4 pt-2 scrollbar-none px-2 snap-x snap-mandatory">
          {FLOATING_ITEMS.map((item) => (
            <div
              key={`mob-${item.id}`}
              onClick={() => handleClickItem(item)}
              className="shrink-0 w-[180px] p-2.5 rounded-2xl bg-white dark:bg-[#161D2A] border border-slate-200 dark:border-slate-800 shadow-md snap-center"
            >
              <div className="relative w-full h-24 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden p-2 mb-2 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                {item.category}
              </span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.name}
              </h3>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                  ★ {item.rating}
                </span>
                <span className="text-xs font-extrabold text-[#FF8A00]">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Scoped Floating Keyframes */}
      <style jsx global>{`
        @keyframes floatingConstellationBob {
          0% {
            transform: translateY(-8px);
          }
          50% {
            transform: translateY(10px);
          }
          100% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
}
