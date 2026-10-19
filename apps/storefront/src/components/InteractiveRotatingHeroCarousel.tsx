"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Pause,
  Play,
  RotateCw,
  ShieldCheck,
  Zap,
  Box,
  Compass,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { ProductListing } from "@gcp/contracts";

export interface CarouselSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  benefit: string;
  category: string;
  priceGhs?: number;
  isConfirmedPrice: boolean;
  status: "IN_STOCK" | "CALL_FOR_STOCK";
  ctaUrl?: string;
  imageUrl: string;
  backImageUrl?: string;
  deviceType: "imac" | "laptop" | "soundbar" | "phone" | "tv" | "ac";
  accentColor: string;
  specs: { label: string; value: string }[];
  matchedProduct?: any;
}

interface HeroCarouselProps {
  products: ProductListing[];
  onOpenProductModal?: (product: ProductListing) => void;
}

export function InteractiveRotatingHeroCarousel({
  products,
  onOpenProductModal,
}: HeroCarouselProps) {
  const { addItem, setIsCartOpen } = useCart();

  // Find matching researched products from props
  // Find matching catalogue products strictly from props
  const imacProduct = products.find((p) => p.slug.includes("imac") || p.id === "prod-apple-imac-24-m4") || products[0];
  const surfaceProduct = products.find((p) => p.slug.includes("surface") || p.id === "prod-surface-laptop-15-snapdragon");
  const jblBarProduct = products.find((p) => p.slug.includes("jbl-bar") || p.id === "prod-jbl-bar-800-mk2");
  const iphoneProduct = products.find((p) => p.slug.includes("16-pro-max") || p.id === "prod-iphone-16-pro-max");
  const foldProduct = products.find((p) => p.slug.includes("fold") || p.id === "prod-samsung-z-fold6");
  const tvProduct = products.find((p) => p.slug.includes("qned") || p.id === "prod-lg-qned70-75");
  const acProduct = products.find((p) => p.slug.includes("tcl") || p.id === "prod-tcl-ac-12csd");

  // Visual display mode: "photo3d" (Photorealistic 3D Float) vs "cad3d" (Interactive 3D CAD Mesh)
  const [stageMode, setStageMode] = useState<"photo3d" | "cad3d">("photo3d");

  const slides: CarouselSlide[] = [
    {
      id: "slide-fold6",
      badge: "Galaxy AI & Dual AMOLED",
      title: foldProduct?.name || "Samsung Galaxy Z Fold6",
      subtitle: foldProduct?.shortDescription || "7.6\" Foldable 120Hz Dynamic AMOLED & Snapdragon 8 Gen 3",
      benefit: foldProduct?.description || "Ultra-slim foldable engineering with dual displays, Armor Aluminum hinge, and Galaxy AI multi-window productivity.",
      category: "Foldable Flagships",
      priceGhs: foldProduct?.variants[0]?.retailPrice || 14800,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "/products/samsung-z-fold6-front.jpg",
      backImageUrl: "/products/samsung-z-fold6-back.jpg",
      deviceType: "phone",
      accentColor: "#3B82F6",
      specs: [
        { label: "Main Screen", value: "7.6\" 120Hz AMOLED" },
        { label: "Cover Screen", value: "6.3\" Dynamic AMOLED" },
        { label: "Processor", value: "Snapdragon 8 Gen 3" },
        { label: "Durability", value: "Armor Aluminum Hinge" },
      ],
      matchedProduct: foldProduct,
    },
    {
      id: "slide-imac",
      badge: "Apple M4 Silicon",
      title: imacProduct?.name || "Apple iMac 24-inch M4",
      subtitle: imacProduct?.shortDescription || "All-in-One Power with 4.5K Retina Brilliance",
      benefit: imacProduct?.description || "The ultimate desktop centerpiece. 16GB unified memory, 12MP Center Stage camera with Desk View, and Studio-quality acoustics.",
      category: "Desktop Computing",
      priceGhs: imacProduct?.variants[0]?.retailPrice || 24500,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: imacProduct?.featuredImage || imacProduct?.images[0] || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
      backImageUrl: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=1200&q=80",
      deviceType: "imac",
      accentColor: "#FF8A00",
      specs: [
        { label: "Display", value: "24\" 4.5K Retina" },
        { label: "Processor", value: "Apple M4 (8-Core)" },
        { label: "Memory", value: "16GB Unified" },
        { label: "Storage", value: "256GB SSD" },
      ],
      matchedProduct: imacProduct,
    },
    {
      id: "slide-surface",
      badge: "Copilot+ PC Intelligence",
      title: surfaceProduct?.name || "Surface Laptop 7th Edition 15\"",
      subtitle: surfaceProduct?.shortDescription || "Snapdragon X Elite 12-Core Ultrabook",
      benefit: surfaceProduct?.description || "Ultra-fast on-device AI acceleration, 120Hz PixelSense Flow Touchscreen, 1TB Gen 4 SSD, and unprecedented 22-hour battery life.",
      category: "Pro Laptops",
      priceGhs: surfaceProduct?.variants[0]?.retailPrice || 22000,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "/products/surface-laptop-7.jpg",
      backImageUrl: "/products/surface-laptop-7.jpg",
      deviceType: "laptop",
      accentColor: "#0284C7",
      specs: [
        { label: "Screen", value: "15.0\" 120Hz Touch" },
        { label: "Chipset", value: "Snapdragon X Elite" },
        { label: "RAM / SSD", value: "16GB / 1TB" },
        { label: "Battery", value: "Up to 22 Hours" },
      ],
      matchedProduct: surfaceProduct,
    },
    {
      id: "slide-jbl-bar",
      badge: "True Dolby Atmos 3D",
      title: jblBarProduct?.name || "JBL Bar 800 MK2 Surround",
      subtitle: jblBarProduct?.shortDescription || "720W 5.1.2-Channel Cinema System",
      benefit: jblBarProduct?.description || "Pure cinema immersion with detachable wireless battery-powered rear surround speakers and massive 10-inch down-firing wireless subwoofer.",
      category: "Home Theatre & Audio",
      priceGhs: jblBarProduct?.variants[0]?.retailPrice || 12500,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "/products/jbl-bar-800-mk2.jpg",
      backImageUrl: "/products/jbl-bar-800-mk2.jpg",
      deviceType: "soundbar",
      accentColor: "#F59E0B",
      specs: [
        { label: "Power", value: "720W RMS" },
        { label: "Channels", value: "5.1.2 Atmos" },
        { label: "Surrounds", value: "Detachable Wireless" },
        { label: "Subwoofer", value: "10\" Wireless Bass" },
      ],
      matchedProduct: jblBarProduct,
    },
    {
      id: "slide-iphone",
      badge: "Aerospace Grade 5 Titanium",
      title: iphoneProduct?.name || "Apple iPhone 16 Pro Max",
      subtitle: iphoneProduct?.shortDescription || "A18 Pro 3nm Silicon & 5x Optical Periscope",
      benefit: iphoneProduct?.description || "Lightweight titanium construction, 6.9\" Super Retina XDR ProMotion, Camera Control sensor button, and 48MP Fusion imaging.",
      category: "Flagship Smartphones",
      // Accurately synchronized with catalogue variant price
      priceGhs: iphoneProduct?.variants[0]?.retailPrice || 15900,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: iphoneProduct?.featuredImage || iphoneProduct?.images[0] || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
      backImageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80",
      deviceType: "phone",
      accentColor: "#10B981",
      specs: [
        { label: "Frame", value: "Grade 5 Titanium" },
        { label: "Chip", value: "A18 Pro (3nm)" },
        { label: "Camera", value: "48MP + 5x Tetraprism" },
        { label: "Display", value: "6.9\" LTPO 120Hz" },
      ],
      matchedProduct: iphoneProduct,
    },
    {
      id: "slide-lg-qned",
      badge: "Quantum Dot NanoCell",
      title: tvProduct?.name || "LG 75\" QNED70 4K Smart TV",
      subtitle: tvProduct?.shortDescription || "α5 Gen6 AI Processor & webOS 23",
      benefit: tvProduct?.description || "Expansive 75-inch living room theatre with richer, deeper colors, Game Optimizer, Active HDR10 Pro, and Magic Remote voice control.",
      category: "4K Televisions",
      priceGhs: tvProduct?.variants[0]?.retailPrice || 16800,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: tvProduct?.featuredImage || tvProduct?.images[0] || "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
      backImageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
      deviceType: "tv",
      accentColor: "#8B5CF6",
      specs: [
        { label: "Size", value: "75\" 4K UHD" },
        { label: "Panel", value: "Quantum Dot QNED" },
        { label: "Processor", value: "α5 Gen6 AI 4K" },
        { label: "OS", value: "webOS 23 ThinQ" },
      ],
      matchedProduct: tvProduct,
    },
    {
      id: "slide-tcl-ac",
      badge: "Smart Inverter Energy Saving",
      title: acProduct?.name || "TCL 1.5HP Smart Inverter AC",
      subtitle: acProduct?.shortDescription || "Fast 30-Second Cooling & TitanGold Protection",
      benefit: acProduct?.description || "12,000 BTU cooling efficiency with AI inverter energy savings up to 60%, TitanGold anti-corrosion condenser fins, and quiet operation.",
      category: "Climate & Appliances",
      priceGhs: acProduct?.variants[0]?.retailPrice || 4200,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: acProduct?.featuredImage || acProduct?.images[0] || "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
      backImageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
      deviceType: "ac",
      accentColor: "#06B6D4",
      specs: [
        { label: "Capacity", value: "12,000 BTU (1.5HP)" },
        { label: "Technology", value: "AI Smart Inverter" },
        { label: "Cooling", value: "Fast in 30 Seconds" },
        { label: "Protection", value: "TitanGold Condenser" },
      ],
      matchedProduct: acProduct,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const activeSlide = slides[currentIndex];

  // Carousel Next/Prev Controls
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay effect (6 seconds per slide, comfortably pauses on hover or interaction)
  useEffect(() => {
    if (isPaused || isInteracting) return;
    const timer = setInterval(nextSlide, 6500);
    return () => clearInterval(timer);
  }, [isPaused, isInteracting, nextSlide]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <section
      className="relative overflow-hidden pt-4 pb-8 md:pt-6 md:pb-12"
      aria-roledescription="carousel"
      aria-label="Featured Gadgets Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Carousel Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50 to-[#FFF7EE] dark:from-[#111827] dark:via-[#0F172A] dark:to-[#17120C] shadow-card dark:shadow-cardDark transition-colors duration-300">
          {/* Subtle Accent Glow */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 dark:opacity-20 transition-all duration-700"
            style={{ backgroundColor: activeSlide.accentColor }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[520px] lg:min-h-[580px]">
            {/* Left Column: Stable Content & Product Information */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 z-10 flex flex-col justify-between h-full">
              <div>
                {/* Category & Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase orange-gradient-badge">
                    <Sparkles className="w-3 h-3 inline mr-1 text-[#FF8A00]" />
                    {activeSlide.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {activeSlide.category}
                  </span>
                </div>

                {/* Product Title & Subtitle */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {activeSlide.title}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#FF8A00] dark:text-[#FFA336] mt-1">
                  {activeSlide.subtitle}
                </p>

                {/* Verified Benefit Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-xl">
                  {activeSlide.benefit}
                </p>

                {/* Specification Highlights Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-6 max-w-lg">
                  {activeSlide.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-sm"
                    >
                      <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {spec.label}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action CTAs */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Showroom Price
                  </div>
                  <div className="flex items-baseline gap-2">
                    {activeSlide.priceGhs ? (
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                        GHS {activeSlide.priceGhs.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Call for Pricing
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      East Legon Stock
                    </span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  {activeSlide.matchedProduct?.variants?.[0] && (
                    <button
                      onClick={() => {
                        addItem(
                          activeSlide.matchedProduct,
                          activeSlide.matchedProduct.variants[0],
                          1
                        );
                        setIsCartOpen(true);
                      }}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FF8A00] hover:bg-[#EA580C] text-white shadow-md hover:shadow-orangeGlow transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  )}

                  {/* WhatsApp Enquiry Link with prefilled text */}
                  <a
                    href={`https://wa.me/233200147950?text=${encodeURIComponent(
                      `Hello Gadget Master, I am interested in ${activeSlide.title}. Please provide current stock and delivery details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white border border-slate-700 transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Intact 3D Product Interactive Stage */}
            <div className="lg:col-span-6 p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center relative min-h-[360px] sm:min-h-[440px] lg:min-h-[540px]">
              {/* Visual Mode Comparison Switcher */}
              <div className="absolute top-4 right-4 z-20 flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-md">
                <button
                  type="button"
                  onClick={() => setStageMode("photo3d")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    stageMode === "photo3d"
                      ? "bg-[#FF8A00] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Photorealistic authentic hardware studio photography with reactive 3D tilt & glare physics"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Photorealistic 3D Float</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageMode("cad3d")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    stageMode === "cad3d"
                      ? "bg-[#FF8A00] text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Interactive WebGL 3D CAD model with textured hardware face and 360° rotation"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Interactive 3D CAD</span>
                </button>
              </div>

              {/* Product 3D Interactive Canvas */}
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center">
                {stageMode === "photo3d" ? (
                  <PhotorealisticFloatingProduct
                    key={`photo-${activeSlide.id}`}
                    imageUrl={activeSlide.imageUrl}
                    backImageUrl={activeSlide.backImageUrl}
                    title={activeSlide.title}
                    accentColor={activeSlide.accentColor}
                    specs={activeSlide.specs}
                    onInteractionChange={setIsInteracting}
                  />
                ) : (
                  <RotatingProduct3DStage
                    key={`cad-${activeSlide.id}`}
                    deviceType={activeSlide.deviceType}
                    imageUrl={activeSlide.imageUrl}
                    backImageUrl={activeSlide.backImageUrl}
                    title={activeSlide.title}
                    accentColor={activeSlide.accentColor}
                    onInteractionChange={setIsInteracting}
                  />
                )}
              </div>

              {/* Interactive Hint Indicator */}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 pointer-events-none">
                <RotateCw className="w-3 h-3 text-[#FF8A00] animate-spin-slow" />
                <span>
                  {stageMode === "photo3d"
                    ? "Photorealistic 3D Float • Hover or drag for 3D tilt • Click 'Turn Around' for rear hardware"
                    : "Interactive 3D CAD Mesh • Drag horizontally to turn real product 360° on all sides"}
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Toolbar */}
          <div className="px-6 py-3.5 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all rounded-full ${
                    idx === currentIndex
                      ? "w-7 bg-[#FF8A00]"
                      : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                  aria-current={idx === currentIndex ? "true" : undefined}
                />
              ))}
            </div>

            {/* Arrow Controls & Pause/Play */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
                title={isPaused ? "Resume Autoplay" : "Pause Autoplay"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00] dark:hover:border-[#FF8A00] shadow-sm transition-all active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00] dark:hover:border-[#FF8A00] shadow-sm transition-all active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// 1. PHOTOREALISTIC FLOATING PRODUCT STAGE
// True-to-life authentic hardware photography with interactive 3D perspective
// tilt, dynamic studio specular reflection glare, and reactive levitation shadow.
// Supports flipping 180° to inspect authentic rear camera & chassis photography.
// =============================================================================
interface PhotorealisticFloatingProductProps {
  imageUrl: string;
  backImageUrl?: string;
  title: string;
  accentColor: string;
  specs: { label: string; value: string }[];
  onInteractionChange?: (active: boolean) => void;
}

function PhotorealisticFloatingProduct({
  imageUrl,
  backImageUrl,
  title,
  accentColor,
  specs,
  onInteractionChange,
}: PhotorealisticFloatingProductProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRearView, setIsRearView] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });

  const activePhoto = isRearView ? (backImageUrl || imageUrl) : imageUrl;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;

    if (isDragging) {
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      setRotation({
        x: Math.max(-28, Math.min(28, dragStartRef.current.rotX - deltaY * 0.2)),
        y: Math.max(-36, Math.min(36, dragStartRef.current.rotY + deltaX * 0.25)),
      });
    } else {
      setRotation({
        x: -normY * 18,
        y: normX * 24,
      });
    }

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.4,
    });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rotX: rotation.x,
      rotY: rotation.y,
    };
    onInteractionChange?.(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    onInteractionChange?.(isHovered);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    onInteractionChange?.(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setIsDragging(false);
    setRotation({ x: 0, y: 0 });
    setGlarePos((p) => ({ ...p, opacity: 0 }));
    onInteractionChange?.(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1200px" }}
    >
      {/* View Orientation Badge */}
      <div className="absolute top-2 left-2 z-30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-md border border-slate-700/60 shadow-sm">
        {isRearView ? "Viewing Rear Hardware" : "Viewing Front Display"}
      </div>

      {/* Flip Between Front & Back Real Photo Button */}
      {backImageUrl && (
        <button
          type="button"
          onClick={() => setIsRearView(!isRearView)}
          className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#FF8A00] transition-all shadow-md active:scale-95"
          title="Flip between front screen and rear camera hardware photography"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#FF8A00]" />
          <span>{isRearView ? "Show Front Display" : "Turn Around (Rear Hardware)"}</span>
        </button>
      )}

      {/* 3D Floating Stage with Multi-Axis Perspective */}
      <div
        className="relative flex items-center justify-center transition-transform duration-150 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Foreground Depth Spec Badge 1 */}
        {specs[0] && (
          <div
            className="hidden sm:flex absolute -top-4 -left-6 z-30 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl pointer-events-none transition-transform duration-200"
            style={{
              transform: `translateZ(45px) translateX(${rotation.y * 0.4}px)`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
              {specs[0].label}: {specs[0].value}
            </span>
          </div>
        )}

        {/* Foreground Depth Spec Badge 2 */}
        {specs[1] && (
          <div
            className="hidden sm:flex absolute -bottom-3 -right-6 z-30 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl pointer-events-none transition-transform duration-200"
            style={{
              transform: `translateZ(35px) translateX(${rotation.y * -0.4}px)`,
            }}
          >
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
              {specs[1].label}: {specs[1].value}
            </span>
          </div>
        )}

        {/* Authentic Product Photography Card with Specular Glare */}
        <div
          className="relative max-w-[280px] sm:max-w-[380px] lg:max-w-[440px] max-h-[340px] sm:max-h-[380px] rounded-2xl overflow-hidden group/product transition-transform duration-300"
          style={{
            transform: "translateZ(20px)",
            filter: "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.35))",
          }}
        >
          <img
            src={activePhoto}
            alt={title}
            className="w-full h-auto max-h-[320px] sm:max-h-[360px] object-contain transition-transform duration-300 pointer-events-none"
            loading="eager"
          />

          {/* Dynamic Specular Studio Lighting Reflection */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-300"
            style={{
              opacity: glarePos.opacity,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)`,
            }}
          />
        </div>
      </div>

      {/* Reactive Ground Shadow Plane */}
      <div
        className="mt-4 w-48 sm:w-64 h-5 rounded-[50%] blur-md transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 75%)`,
          transform: `scale(${isHovered ? 1.15 : 1}) translateX(${rotation.y * 0.8}px)`,
        }}
      />
    </div>
  );
}

// =============================================================================
// 2. INTERACTIVE 3D CAD STAGE (Three.js WebGL with 360° Real Turnaround)
// Fully assembled double-sided 3D CAD chassis: front display screen, metallic
// side profiles with buttons and ports, and authentic rear hardware with camera
// modules. Continuous 360° horizontal drag with live degree orientation dial.
// =============================================================================
interface RotatingProduct3DStageProps {
  deviceType: "imac" | "laptop" | "soundbar" | "phone" | "tv" | "ac";
  imageUrl: string;
  backImageUrl?: string;
  title: string;
  accentColor: string;
  onInteractionChange?: (active: boolean) => void;
}

function getAngleDescription(deg: number): string {
  if (deg >= 315 || deg < 45) return "Front Display View";
  if (deg >= 45 && deg < 135) return "Right Profile & Frame";
  if (deg >= 135 && deg < 225) return "Rear Hardware & Camera Module";
  return "Left Profile & Buttons";
}

function RotatingProduct3DStage({
  deviceType,
  imageUrl,
  backImageUrl,
  title,
  accentColor,
  onInteractionChange,
}: RotatingProduct3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);
  const [viewAngleDeg, setViewAngleDeg] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const autoSpinRef = useRef(false);
  const resetAngleRef = useRef<((targetDeg?: number) => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWebGlFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let productGroup: THREE.Group | null = null;
    let animationFrameId: number;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        42,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 3.2);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(renderer.domElement);

      // Studio Lighting for Double-Sided Hardware Inspection
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
      scene.add(ambientLight);

      // Front Key Light
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
      keyLight.position.set(2, 3, 3);
      keyLight.castShadow = true;
      scene.add(keyLight);

      // Rear Fill Light to illuminate back hardware and cameras when turned around
      const rearLight = new THREE.DirectionalLight(0xffffff, 1.8);
      rearLight.position.set(-2, 2, -3);
      scene.add(rearLight);

      // Rim Light matching device accent color
      const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 1.6);
      rimLight.position.set(3, -2, -2);
      scene.add(rimLight);

      // Floor Shadow Plane
      const shadowPlaneGeo = new THREE.PlaneGeometry(4, 4);
      const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.18 });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -1.1;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // Build Intact Double-Sided Device Geometry
      productGroup = new THREE.Group();
      buildIntactDeviceModel(productGroup, deviceType, accentColor, imageUrl, backImageUrl);
      scene.add(productGroup);

      // 360° Interactive Drag State
      let isDragging = false;
      let prevPointerPos = { x: 0, y: 0 };
      let velocity = { x: 0, y: 0 };

      const handlePointerDown = (e: PointerEvent) => {
        isDragging = true;
        autoSpinRef.current = false;
        setIsAutoSpinning(false);
        prevPointerPos = { x: e.clientX, y: e.clientY };
        velocity = { x: 0, y: 0 };
        onInteractionChange?.(true);
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging || !productGroup) return;
        const deltaX = e.clientX - prevPointerPos.x;
        const deltaY = e.clientY - prevPointerPos.y;

        productGroup.rotation.y += deltaX * 0.012;
        productGroup.rotation.x = Math.max(-0.4, Math.min(0.4, productGroup.rotation.x + deltaY * 0.008));
        velocity = { x: deltaY * 0.004, y: deltaX * 0.008 };

        prevPointerPos = { x: e.clientX, y: e.clientY };
      };

      const handlePointerUp = () => {
        isDragging = false;
        onInteractionChange?.(false);
      };

      resetAngleRef.current = (targetDeg: number = 0) => {
        if (productGroup) {
          autoSpinRef.current = false;
          setIsAutoSpinning(false);
          productGroup.rotation.y = (targetDeg * Math.PI) / 180;
          productGroup.rotation.x = 0;
          velocity = { x: 0, y: 0 };
        }
      };

      container.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);

      // Rendering Loop with smooth inertia & gentle idle floating
      const render = () => {
        animationFrameId = requestAnimationFrame(render);

        if (productGroup) {
          if (autoSpinRef.current) {
            productGroup.rotation.y += 0.015;
          } else if (!isDragging) {
            productGroup.rotation.y += velocity.y;
            productGroup.rotation.x += velocity.x;
            velocity.x *= 0.92;
            velocity.y *= 0.92;

            // Subtle continuous idle rotation when pointer is released
            if (Math.abs(velocity.y) < 0.0005) {
              productGroup.rotation.y += 0.002;
            }
          }

          productGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.035;

          // Compute normalized degrees 0-360
          const rawDeg = Math.round((((productGroup.rotation.y % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2)) * (180 / Math.PI));
          setViewAngleDeg(rawDeg);
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      render();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("pointerdown", handlePointerDown);
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      setWebGlFailed(true);
    }
  }, [deviceType, accentColor, imageUrl, backImageUrl, onInteractionChange]);

  if (webGlFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <img
          src={imageUrl}
          alt={title}
          className="w-full max-h-[360px] object-contain drop-shadow-2xl rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* 360° Orientation Dial Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-900/85 text-white backdrop-blur-md border border-slate-700/60 shadow-lg pointer-events-none">
        <Compass className="w-3 h-3 text-[#FF8A00] animate-spin-slow" />
        <span>{viewAngleDeg}° &bull; {getAngleDescription(viewAngleDeg)}</span>
      </div>

      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 360° Quick Action Toolbar */}
      <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const next = !isAutoSpinning;
              setIsAutoSpinning(next);
              autoSpinRef.current = next;
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-md border transition-all shadow-sm ${
              isAutoSpinning
                ? "bg-[#FF8A00] text-white border-orange-500 shadow-orange-500/20"
                : "bg-white/85 dark:bg-slate-900/85 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Auto spin real product 360 degrees"
          >
            <RotateCw className={`w-3 h-3 ${isAutoSpinning ? "animate-spin" : "text-[#FF8A00]"}`} />
            <span>{isAutoSpinning ? "Pause 360°" : "Auto 360° Spin"}</span>
          </button>

          <button
            type="button"
            onClick={() => resetAngleRef.current?.(180)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
            title="Rotate directly to rear hardware view"
          >
            <span>Rear (180°)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => resetAngleRef.current?.(0)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
          title="Reset to front display view"
        >
          <span>Front (0°)</span>
        </button>
      </div>
    </div>
  );
}

// Helper: Build True Double-Sided 3D Intact Electronics Geometries
function buildIntactDeviceModel(
  group: THREE.Group,
  deviceType: "imac" | "laptop" | "soundbar" | "phone" | "tv" | "ac",
  accentHex: string,
  imageUrl: string,
  backImageUrl?: string
) {
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.85,
    roughness: 0.25,
  });

  const darkPolymerMat = new THREE.MeshStandardMaterial({
    color: 0x181818,
    metalness: 0.3,
    roughness: 0.5,
  });

  // Texture loader for authentic double-sided mapping
  const textureLoader = new THREE.TextureLoader();

  // Front Screen Texture
  const frontTexture = textureLoader.load(imageUrl, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
  });
  const frontPhotoMat = new THREE.MeshStandardMaterial({
    map: frontTexture,
    metalness: 0.1,
    roughness: 0.2,
  });

  // Rear Hardware Texture
  const rearTexture = textureLoader.load(backImageUrl || imageUrl, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
  });
  const rearPhotoMat = new THREE.MeshStandardMaterial({
    map: rearTexture,
    metalness: 0.2,
    roughness: 0.35,
  });

  switch (deviceType) {
    case "phone": {
      // Grade 5 Titanium Frame
      const titaniumMat = new THREE.MeshStandardMaterial({
        color: 0xc4b7a6,
        metalness: 0.9,
        roughness: 0.25,
      });

      const bodyGeo = new THREE.BoxGeometry(1.0, 1.95, 0.08);
      const body = new THREE.Mesh(bodyGeo, titaniumMat);
      body.castShadow = true;

      // Front OLED Glass Screen
      const frontGlassGeo = new THREE.PlaneGeometry(0.94, 1.88);
      const frontGlass = new THREE.Mesh(frontGlassGeo, frontPhotoMat);
      frontGlass.position.z = 0.041;
      body.add(frontGlass);

      // Rear Authentic Frosted Matte Titanium Glass Back
      const rearGlassGeo = new THREE.PlaneGeometry(0.94, 1.88);
      const rearGlass = new THREE.Mesh(rearGlassGeo, rearPhotoMat);
      rearGlass.position.z = -0.041;
      rearGlass.rotation.y = Math.PI; // Correctly faces rearward
      body.add(rearGlass);

      // Raised Triple Camera Island on Back
      const cameraIslandGeo = new THREE.BoxGeometry(0.44, 0.46, 0.035);
      const cameraIsland = new THREE.Mesh(cameraIslandGeo, titaniumMat);
      cameraIsland.position.set(-0.22, 0.62, -0.052);
      cameraIsland.rotation.y = Math.PI;

      // 3 Sapphire Camera Lenses with Metallic Rings
      const lensGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.025, 24);
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        metalness: 0.95,
        roughness: 0.05,
      });

      const lens1 = new THREE.Mesh(lensGeo, lensMat);
      lens1.rotation.x = Math.PI / 2;
      lens1.position.set(-0.1, 0.1, 0.02);
      cameraIsland.add(lens1);

      const lens2 = new THREE.Mesh(lensGeo, lensMat);
      lens2.rotation.x = Math.PI / 2;
      lens2.position.set(-0.1, -0.1, 0.02);
      cameraIsland.add(lens2);

      const lens3 = new THREE.Mesh(lensGeo, lensMat);
      lens3.rotation.x = Math.PI / 2;
      lens3.position.set(0.1, 0.0, 0.02);
      cameraIsland.add(lens3);

      body.add(cameraIsland);
      group.add(body);
      break;
    }

    case "imac": {
      const screenGeo = new THREE.BoxGeometry(2.2, 1.4, 0.05);
      const screen = new THREE.Mesh(screenGeo, aluminumMat);
      screen.castShadow = true;

      // Front Display
      const glassGeo = new THREE.PlaneGeometry(2.1, 1.25);
      const glass = new THREE.Mesh(glassGeo, frontPhotoMat);
      glass.position.z = 0.026;
      screen.add(glass);

      // Front Chin
      const chinGeo = new THREE.BoxGeometry(2.1, 0.25, 0.052);
      const chin = new THREE.Mesh(chinGeo, aluminumMat);
      chin.position.y = -0.55;
      screen.add(chin);

      // Rear Anodized Aluminum Housing with Rear Image Mapping
      const rearGeo = new THREE.PlaneGeometry(2.1, 1.35);
      const rear = new THREE.Mesh(rearGeo, rearPhotoMat);
      rear.position.z = -0.026;
      rear.rotation.y = Math.PI;
      screen.add(rear);

      // Stand
      const standPoleGeo = new THREE.BoxGeometry(0.35, 0.7, 0.04);
      const standPole = new THREE.Mesh(standPoleGeo, aluminumMat);
      standPole.position.set(0, -0.75, -0.15);
      standPole.rotation.x = 0.2;
      screen.add(standPole);

      const standBaseGeo = new THREE.BoxGeometry(0.7, 0.03, 0.6);
      const standBase = new THREE.Mesh(standBaseGeo, aluminumMat);
      standBase.position.set(0, -1.05, 0);
      screen.add(standBase);

      screen.position.y = 0.2;
      group.add(screen);
      break;
    }

    case "laptop": {
      const baseGeo = new THREE.BoxGeometry(2.0, 0.04, 1.4);
      const base = new THREE.Mesh(baseGeo, aluminumMat);
      base.position.set(0, -0.4, 0);
      base.castShadow = true;

      const trackpadGeo = new THREE.PlaneGeometry(0.65, 0.45);
      const trackpad = new THREE.Mesh(trackpadGeo, darkPolymerMat);
      trackpad.rotation.x = -Math.PI / 2;
      trackpad.position.set(0, 0.021, 0.35);
      base.add(trackpad);

      const keyboardGeo = new THREE.PlaneGeometry(1.7, 0.65);
      const keyboard = new THREE.Mesh(keyboardGeo, darkPolymerMat);
      keyboard.rotation.x = -Math.PI / 2;
      keyboard.position.set(0, 0.021, -0.25);
      base.add(keyboard);

      const lidGeo = new THREE.BoxGeometry(2.0, 1.35, 0.03);
      const lid = new THREE.Mesh(lidGeo, aluminumMat);
      lid.position.set(0, 0.25, -0.65);
      lid.rotation.x = -0.35;
      lid.castShadow = true;

      // Open Display Screen Face
      const lidScreenGeo = new THREE.PlaneGeometry(1.9, 1.25);
      const lidScreen = new THREE.Mesh(lidScreenGeo, frontPhotoMat);
      lidScreen.position.z = 0.016;
      lid.add(lidScreen);

      // Rear Exterior Lid
      const lidRearGeo = new THREE.PlaneGeometry(1.9, 1.25);
      const lidRear = new THREE.Mesh(lidRearGeo, rearPhotoMat);
      lidRear.position.z = -0.016;
      lidRear.rotation.y = Math.PI;
      lid.add(lidRear);

      group.add(base);
      group.add(lid);
      break;
    }

    case "soundbar": {
      const barGeo = new THREE.BoxGeometry(2.4, 0.2, 0.3);
      const bar = new THREE.Mesh(barGeo, darkPolymerMat);
      bar.castShadow = true;

      const grillGeo = new THREE.BoxGeometry(2.35, 0.18, 0.02);
      const grill = new THREE.Mesh(grillGeo, frontPhotoMat);
      grill.position.z = 0.15;
      bar.add(grill);

      const subGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
      const sub = new THREE.Mesh(subGeo, darkPolymerMat);
      sub.position.set(1.4, 0.3, -0.2);
      sub.castShadow = true;

      group.add(bar);
      group.add(sub);
      break;
    }

    case "tv": {
      const tvGeo = new THREE.BoxGeometry(2.6, 1.5, 0.04);
      const tv = new THREE.Mesh(tvGeo, darkPolymerMat);
      tv.castShadow = true;

      // Screen with authentic display
      const tvScreenGeo = new THREE.PlaneGeometry(2.54, 1.44);
      const tvScreen = new THREE.Mesh(tvScreenGeo, frontPhotoMat);
      tvScreen.position.z = 0.021;
      tv.add(tvScreen);

      // Rear Panel Housing
      const tvRearGeo = new THREE.PlaneGeometry(2.54, 1.44);
      const tvRear = new THREE.Mesh(tvRearGeo, rearPhotoMat);
      tvRear.position.z = -0.021;
      tvRear.rotation.y = Math.PI;
      tv.add(tvRear);

      const footGeo = new THREE.BoxGeometry(0.04, 0.2, 0.4);
      const leftFoot = new THREE.Mesh(footGeo, darkPolymerMat);
      leftFoot.position.set(-0.9, -0.85, 0);
      tv.add(leftFoot);

      const rightFoot = new THREE.Mesh(footGeo, darkPolymerMat);
      rightFoot.position.set(0.9, -0.85, 0);
      tv.add(rightFoot);

      group.add(tv);
      break;
    }

    case "ac": {
      const acGeo = new THREE.BoxGeometry(2.2, 0.6, 0.4);
      const acMat = new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        metalness: 0.1,
        roughness: 0.3,
      });
      const ac = new THREE.Mesh(acGeo, acMat);
      ac.castShadow = true;

      const frontFaceGeo = new THREE.PlaneGeometry(2.1, 0.5);
      const frontFace = new THREE.Mesh(frontFaceGeo, frontPhotoMat);
      frontFace.position.set(0, 0, 0.201);
      ac.add(frontFace);

      const ventGeo = new THREE.BoxGeometry(2.1, 0.1, 0.05);
      const ventMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.set(0, -0.22, 0.18);
      ac.add(vent);

      group.add(ac);
      break;
    }
  }
}


