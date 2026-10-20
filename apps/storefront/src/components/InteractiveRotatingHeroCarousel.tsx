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
  Box,
  Compass,
  Layers,
  Camera,
  Maximize2,
  CheckCircle2,
  Info,
  Sliders,
  ZoomIn,
  ZoomOut,
  Target,
  Focus,
  RotateCcw,
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
  deviceType: "phone" | "laptop" | "soundbar" | "imac" | "tv" | "ac";
  deviceModel: "fold6" | "iphone16" | "surface7" | "jbl800" | "imac24" | "tv75" | "ac15";
  accentColor: string;
  specs: { label: string; value: string }[];
  matchedProduct?: any;
  hotspots: {
    id: string;
    title: string;
    description: string;
    badge: string;
  }[];
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

  // Find matching researched products strictly from props
  const foldProduct = products.find((p) => p.slug.includes("fold") || p.id === "prod-samsung-z-fold6");
  const iphoneProduct = products.find((p) => p.slug.includes("16-pro-max") || p.id === "prod-iphone-16-pro-max");
  const surfaceProduct = products.find((p) => p.slug.includes("surface") || p.id === "prod-surface-laptop-15-snapdragon");
  const jblBarProduct = products.find((p) => p.slug.includes("jbl-bar") || p.id === "prod-jbl-bar-800-mk2");
  const imacProduct = products.find((p) => p.slug.includes("imac") || p.id === "prod-apple-imac-24-m4") || products[0];
  const tvProduct = products.find((p) => p.slug.includes("qned") || p.id === "prod-lg-qned70-75");
  const acProduct = products.find((p) => p.slug.includes("tcl") || p.id === "prod-tcl-ac-12csd");

  // Display mode: "cad3d" (Genuine 3D CAD Hardware Model) vs "gallery" (Official 4K Studio Photography)
  const [stageMode, setStageMode] = useState<"cad3d" | "gallery">("cad3d");

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
      deviceModel: "fold6",
      accentColor: "#3B82F6",
      specs: [
        { label: "Main Screen", value: "7.6\" 120Hz AMOLED" },
        { label: "Cover Screen", value: "6.3\" Dynamic AMOLED" },
        { label: "Processor", value: "Snapdragon 8 Gen 3" },
        { label: "Durability", value: "Armor Aluminum Hinge" },
      ],
      matchedProduct: foldProduct,
      hotspots: [
        {
          id: "hinge",
          title: "Dual-Rail Armor Aluminum Hinge",
          description: "Precision-engineered slim folding spine rated for 200,000+ folds with zero gap.",
          badge: "Aero Durability",
        },
        {
          id: "screen",
          title: "7.6\" Dynamic AMOLED 2X Display",
          description: "2,600 nits peak outdoor brightness with adaptive 1-120Hz refresh rate and S-Pen support.",
          badge: "2,600 Nits",
        },
        {
          id: "camera",
          title: "Triple 50MP ProVisual Camera Island",
          description: "50MP Wide with OIS, 12MP Ultra-Wide, and 10MP 3x Optical Telephoto.",
          badge: "8K ProVisual",
        },
        {
          id: "cover",
          title: "6.3\" One-Handed Cover Screen",
          description: "Corning Gorilla Glass Victus 2 with 22:9 aspect ratio for instant access.",
          badge: "Victus 2",
        },
      ],
    },
    {
      id: "slide-iphone",
      badge: "Aerospace Grade 5 Titanium",
      title: iphoneProduct?.name || "Apple iPhone 16 Pro Max",
      subtitle: iphoneProduct?.shortDescription || "A18 Pro 3nm Silicon & 5x Optical Periscope",
      benefit: iphoneProduct?.description || "Lightweight titanium construction, 6.9\" Super Retina XDR ProMotion, Camera Control sensor button, and 48MP Fusion imaging.",
      category: "Flagship Smartphones",
      priceGhs: iphoneProduct?.variants[0]?.retailPrice || 15900,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "/products/iphone-16-pro-max-front.jpg",
      backImageUrl: "/products/iphone-16-pro-max-back.jpg",
      deviceType: "phone",
      deviceModel: "iphone16",
      accentColor: "#10B981",
      specs: [
        { label: "Frame", value: "Grade 5 Titanium" },
        { label: "Chip", value: "A18 Pro (3nm)" },
        { label: "Camera", value: "48MP + 5x Tetraprism" },
        { label: "Display", value: "6.9\" LTPO 120Hz" },
      ],
      matchedProduct: iphoneProduct,
      hotspots: [
        {
          id: "titanium",
          title: "Grade 5 Titanium Frame",
          description: "Satin brushed aerospace titanium with contoured edges and extreme rigidity.",
          badge: "Titanium",
        },
        {
          id: "control",
          title: "Camera Control Sapphire Button",
          description: "Force-sensing capacitive button with haptic feedback for slide-to-zoom and instant capture.",
          badge: "Haptic Sensor",
        },
        {
          id: "island",
          title: "Dynamic Island Display",
          description: "Super Retina XDR with razor-thin 1.15mm uniform borders and 2,000 nits peak.",
          badge: "Dynamic Island",
        },
      ],
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
      deviceModel: "surface7",
      accentColor: "#0284C7",
      specs: [
        { label: "Screen", value: "15.0\" 120Hz Touch" },
        { label: "Chipset", value: "Snapdragon X Elite" },
        { label: "RAM / SSD", value: "16GB / 1TB" },
        { label: "Battery", value: "Up to 22 Hours" },
      ],
      matchedProduct: surfaceProduct,
      hotspots: [
        {
          id: "npu",
          title: "45 TOPS Hexagon NPU",
          description: "Dedicated Copilot+ AI engine running local neural models with instant responsiveness.",
          badge: "Copilot+ PC",
        },
        {
          id: "pixelsense",
          title: "15.0\" PixelSense Flow Touch",
          description: "3:2 productivity aspect ratio, ultra-crisp 2496x1664 resolution with 120Hz VRR.",
          badge: "PixelSense 120Hz",
        },
        {
          id: "trackpad",
          title: "Precision Haptic Glass Trackpad",
          description: "Expansive tactile glass touchpad with zero physical dead zones.",
          badge: "Haptic Glass",
        },
      ],
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
      deviceModel: "jbl800",
      accentColor: "#F59E0B",
      specs: [
        { label: "Power", value: "720W RMS" },
        { label: "Channels", value: "5.1.2 Atmos" },
        { label: "Surrounds", value: "Detachable Wireless" },
        { label: "Subwoofer", value: "10\" Wireless Bass" },
      ],
      matchedProduct: jblBarProduct,
      hotspots: [
        {
          id: "surrounds",
          title: "Detachable Wireless Surrounds",
          description: "Battery-powered pods detach magnetically to form true wireless rear channels.",
          badge: "Magnetic Detach",
        },
        {
          id: "subwoofer",
          title: "10-Inch Wireless Down-Firing Sub",
          description: "Room-shaking acoustic cabinet delivering chest-thumping low frequencies down to 35Hz.",
          badge: "10\" Subwoofer",
        },
        {
          id: "atmos",
          title: "Up-Firing Dolby Atmos Drivers",
          description: "Multi-angle ceiling bounce audio for authentic three-dimensional height channels.",
          badge: "Dolby Atmos 3D",
        },
      ],
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
      imageUrl: "/products/apple-imac-24-front.jpg",
      backImageUrl: "/products/apple-imac-24-back.jpg",
      deviceType: "imac",
      deviceModel: "imac24",
      accentColor: "#FF8A00",
      specs: [
        { label: "Display", value: "24\" 4.5K Retina" },
        { label: "Processor", value: "Apple M4 (8-Core)" },
        { label: "Memory", value: "16GB Unified" },
        { label: "Storage", value: "256GB SSD" },
      ],
      matchedProduct: imacProduct,
      hotspots: [
        {
          id: "retina",
          title: "24-Inch 4.5K Retina Brilliance",
          description: "11.3 million pixels with 500 nits brightness and P3 wide color gamut.",
          badge: "4.5K Retina",
        },
        {
          id: "slim",
          title: "11.5mm Razor-Thin Unibody",
          description: "Engineered around high-efficiency Apple Silicon with color-matched anodized aluminum.",
          badge: "11.5mm Thin",
        },
      ],
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
      imageUrl: "/products/lg-qned-75-tv.jpg",
      backImageUrl: "/products/lg-qned-75-tv.jpg",
      deviceType: "tv",
      deviceModel: "tv75",
      accentColor: "#8B5CF6",
      specs: [
        { label: "Size", value: "75\" 4K UHD" },
        { label: "Panel", value: "Quantum Dot QNED" },
        { label: "Processor", value: "α5 Gen6 AI 4K" },
        { label: "OS", value: "webOS 23 ThinQ" },
      ],
      matchedProduct: tvProduct,
      hotspots: [
        {
          id: "qned",
          title: "Quantum Dot + NanoCell Color",
          description: "Dual-layer color filtering delivers richer, richer primaries with local dimming.",
          badge: "Quantum Dot",
        },
      ],
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
      imageUrl: "/products/tcl-inverter-ac.jpg",
      backImageUrl: "/products/tcl-inverter-ac.jpg",
      deviceType: "ac",
      deviceModel: "ac15",
      accentColor: "#06B6D4",
      specs: [
        { label: "Capacity", value: "12,000 BTU (1.5HP)" },
        { label: "Technology", value: "AI Smart Inverter" },
        { label: "Cooling", value: "Fast in 30 Seconds" },
        { label: "Protection", value: "TitanGold Condenser" },
      ],
      matchedProduct: acProduct,
      hotspots: [
        {
          id: "inverter",
          title: "AI Smart Inverter Compressor",
          description: "Continuous variable-speed operation saves up to 60% power consumption.",
          badge: "60% Eco Saver",
        },
      ],
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

  // Autoplay effect (pauses on interaction or hover)
  useEffect(() => {
    if (isPaused || isInteracting) return;
    const timer = setInterval(nextSlide, 7500);
    return () => clearInterval(timer);
  }, [isPaused, isInteracting, nextSlide]);

  // Keyboard navigation
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
          {/* Subtle Dynamic Ambient Glow */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 dark:opacity-20 transition-all duration-700"
            style={{ backgroundColor: activeSlide.accentColor }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[560px] lg:min-h-[620px]">
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
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-5 max-w-lg">
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

                {/* Verified Hardware Details Callout List */}
                <div className="hidden sm:flex flex-col gap-1.5 mb-5 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-[#FF8A00]" />
                    <span>Engineered Details</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {activeSlide.hotspots.map((hs) => (
                      <span
                        key={hs.id}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {hs.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action CTAs */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Official Showroom Price
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

            {/* Right Column: Uniform Interactive 3D Showcase & Responsive Studio Gallery */}
            <div className="lg:col-span-6 p-2 sm:p-4 lg:p-6 flex flex-col justify-between relative min-h-[480px] sm:min-h-[540px] lg:min-h-[620px]">
              <RefinedProduct3DStage
                key={`stage-${activeSlide.id}`}
                slide={activeSlide}
                stageMode={stageMode}
                onSetStageMode={setStageMode}
                onInteractionChange={setIsInteracting}
              />
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
// REFINED 3D CAD HARDWARE STAGE (Genuine 3D Geometry with Refined Details)
// No flat images pasted onto blocks! Custom 3D extruded shapes with beveled
// metallic rails, authentic sapphire camera lenses, tactile buttons, moving
// hinges/lids, and high-resolution procedural OLED screen canvases.
// =============================================================================

interface RefinedProduct3DStageProps {
  slide: CarouselSlide;
  stageMode: "cad3d" | "gallery";
  onSetStageMode: (mode: "cad3d" | "gallery") => void;
  onInteractionChange?: (active: boolean) => void;
}

// Procedural Studio Lighting Environment Map (Softbox reflections for metals and lenses)
function createStudioEnvironment(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0a0d12";
  ctx.fillRect(0, 0, 512, 256);

  // Softbox Light 1 (Left Key Softbox)
  const grad1 = ctx.createLinearGradient(70, 0, 170, 0);
  grad1.addColorStop(0, "rgba(255, 255, 255, 0)");
  grad1.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
  grad1.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad1;
  ctx.fillRect(70, 20, 100, 200);

  // Softbox Light 2 (Right Fill Softbox)
  const grad2 = ctx.createLinearGradient(340, 0, 440, 0);
  grad2.addColorStop(0, "rgba(255, 255, 255, 0)");
  grad2.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
  grad2.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad2;
  ctx.fillRect(340, 20, 100, 200);

  // Overhead Strip Light
  const grad3 = ctx.createLinearGradient(0, 0, 0, 60);
  grad3.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  grad3.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad3;
  ctx.fillRect(0, 0, 512, 60);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

// Showroom Exhibition Turntable Pedestal
function createShowroomPedestal(accentHex: string): {
  group: THREE.Group;
  updateTurntableRotation: (rotY: number) => void;
} {
  const group = new THREE.Group();
  group.position.y = -1.14;

  // 1. Lower Plinth Base
  const baseGeo = new THREE.CylinderGeometry(1.58, 1.66, 0.08, 64);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0c0e12,
    metalness: 0.8,
    roughness: 0.4,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.04;
  base.receiveShadow = true;
  group.add(base);

  // 2. Rotating Machined Turntable Disc
  const discGeo = new THREE.CylinderGeometry(1.48, 1.55, 0.06, 64);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x161a22,
    metalness: 0.92,
    roughness: 0.24,
  });
  const turntableDisc = new THREE.Mesh(discGeo, discMat);
  turntableDisc.position.y = 0.03;
  turntableDisc.receiveShadow = true;
  group.add(turntableDisc);

  // 3. Concentric Machined Circular Grooves on Turntable Top
  [0.55, 0.95, 1.28].forEach((r) => {
    const ringGeo = new THREE.RingGeometry(r - 0.006, r + 0.006, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x272e3b,
      metalness: 0.95,
      roughness: 0.15,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.061;
    turntableDisc.add(ring);
  });

  // 4. Perimeter Glowing LED Halo Ring
  const haloGeo = new THREE.TorusGeometry(1.47, 0.013, 16, 64);
  const haloMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentHex),
    emissive: new THREE.Color(accentHex),
    emissiveIntensity: 3.0,
    roughness: 0.2,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.062;
  group.add(halo);

  // 5. Ambient Occlusion Ground Contact Shadow
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shadowCtx = shadowCanvas.getContext("2d");
  if (shadowCtx) {
    const sGrad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
    sGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.35)");
    sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    shadowCtx.fillStyle = sGrad;
    shadowCtx.fillRect(0, 0, 256, 256);
  }
  const contactTex = new THREE.CanvasTexture(shadowCanvas);
  const contactMat = new THREE.MeshBasicMaterial({
    map: contactTex,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), contactMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.063;
  turntableDisc.add(contactShadow);

  return {
    group,
    updateTurntableRotation: (rotY: number) => {
      turntableDisc.rotation.y = rotY;
    },
  };
}

function RefinedProduct3DStage({
  slide,
  stageMode,
  onSetStageMode,
  onInteractionChange,
}: RefinedProduct3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);
  const [viewAngleDeg, setViewAngleDeg] = useState(35);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [foldAngleState, setFoldAngleState] = useState<number>(152); // degrees for Fold6
  const [lidAngleState, setLidAngleState] = useState<number>(115); // degrees for Surface Laptop
  const [surroundDocked, setSurroundDocked] = useState<boolean>(true); // for JBL Bar 800
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [isRearView, setIsRearView] = useState(false);

  const autoSpinRef = useRef(false);
  const resetAngleRef = useRef<((targetDeg?: number) => void) | null>(null);
  const updateFoldingRef = useRef<((deg: number) => void) | null>(null);
  const updateLidRef = useRef<((deg: number) => void) | null>(null);
  const updateSurroundsRef = useRef<((docked: boolean) => void) | null>(null);

  // Zoom & Camera Target References
  const targetDistRef = useRef(3.4);
  const targetYRef = useRef(0);

  useEffect(() => {
    if (stageMode !== "cad3d") return;

    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWebGlFailed(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let uniformWrapper: THREE.Group | null = null;
    let animationFrameId: number;
    let pedestalControls: { group: THREE.Group; updateTurntableRotation: (r: number) => void } | null = null;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        40,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 3.4);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Studio Environment Reflections
      const studioEnv = createStudioEnvironment();
      scene.environment = studioEnv;

      container.appendChild(renderer.domElement);

      // Studio Lighting System
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
      scene.add(ambientLight);

      // Main Softbox Key Light
      const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
      keyLight.position.set(3, 4, 4);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Accent Rim Light
      const rimLight = new THREE.DirectionalLight(new THREE.Color(slide.accentColor), 2.4);
      rimLight.position.set(-3.5, 2.5, -3.5);
      scene.add(rimLight);

      // Under-Fill Light for ports and grilles
      const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.0);
      fillLight.position.set(0, -3, 2);
      scene.add(fillLight);

      // Showroom Exhibition Pedestal with LED Halo
      pedestalControls = createShowroomPedestal(slide.accentColor);
      scene.add(pedestalControls.group);

      // Construct High-Precision 3D CAD Model
      const modelRoot = new THREE.Group();
      const deviceControllers = buildRefinedHardwareCAD(modelRoot, slide.deviceModel, slide.accentColor);

      // AUTOMATIC BOUNDING-BOX NORMALIZATION:
      // Guarantees every single product CAD model (Fold6, iPhone, Surface, JBL Bar, iMac, TV, AC)
      // is scaled to the EXACT SAME UNIFORM SIZE (1.90 max visual dimension) and perfectly centered!
      modelRoot.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(modelRoot);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const targetScale = 1.90 / (maxDim || 1);

      uniformWrapper = new THREE.Group();
      // Center modelRoot so its centroid sits at (0, 0, 0)
      modelRoot.position.set(-center.x, -center.y, -center.z);
      uniformWrapper.scale.setScalar(targetScale);
      // Place slightly elevated above the showroom turntable disc
      uniformWrapper.position.set(0, 0.12, 0);
      uniformWrapper.add(modelRoot);

      // Initial 35° Hero Angle
      uniformWrapper.rotation.y = (35 * Math.PI) / 180;
      uniformWrapper.rotation.x = 0.08;
      scene.add(uniformWrapper);

      // Bind dynamic animation controllers
      if (deviceControllers.setFoldAngle) {
        updateFoldingRef.current = deviceControllers.setFoldAngle;
        deviceControllers.setFoldAngle(foldAngleState);
      }
      if (deviceControllers.setLidAngle) {
        updateLidRef.current = deviceControllers.setLidAngle;
        deviceControllers.setLidAngle(lidAngleState);
      }
      if (deviceControllers.setSurroundsDocked) {
        updateSurroundsRef.current = deviceControllers.setSurroundsDocked;
        deviceControllers.setSurroundsDocked(surroundDocked);
      }

      // Drag Orbit Interaction
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
        if (!isDragging || !uniformWrapper) return;
        const deltaX = e.clientX - prevPointerPos.x;
        const deltaY = e.clientY - prevPointerPos.y;

        uniformWrapper.rotation.y += deltaX * 0.012;
        uniformWrapper.rotation.x = Math.max(-0.45, Math.min(0.45, uniformWrapper.rotation.x + deltaY * 0.008));
        velocity = { x: deltaY * 0.003, y: deltaX * 0.006 };

        prevPointerPos = { x: e.clientX, y: e.clientY };
      };

      const handlePointerUp = () => {
        isDragging = false;
        onInteractionChange?.(false);
      };

      // Mouse Wheel / Trackpad Scroll Zoom
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * 0.0028;
        targetDistRef.current = Math.max(1.3, Math.min(4.5, targetDistRef.current + delta));
        setZoomLevel(Number((3.4 / targetDistRef.current).toFixed(1)));
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      resetAngleRef.current = (targetDeg: number = 0) => {
        if (uniformWrapper) {
          autoSpinRef.current = false;
          setIsAutoSpinning(false);
          uniformWrapper.rotation.y = (targetDeg * Math.PI) / 180;
          uniformWrapper.rotation.x = targetDeg === 0 ? 0 : 0.08;
          velocity = { x: 0, y: 0 };
        }
      };

      container.addEventListener("pointerdown", handlePointerDown);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);

      // Render Loop with smooth zoom lerp, momentum & subtle floating
      const render = () => {
        animationFrameId = requestAnimationFrame(render);

        if (uniformWrapper) {
          if (autoSpinRef.current) {
            uniformWrapper.rotation.y += 0.012;
          } else if (!isDragging) {
            uniformWrapper.rotation.y += velocity.y;
            uniformWrapper.rotation.x += velocity.x;
            velocity.x *= 0.92;
            velocity.y *= 0.92;

            if (Math.abs(velocity.y) < 0.0004) {
              uniformWrapper.rotation.y += 0.0015;
            }
          }

          uniformWrapper.position.y = 0.12 + Math.sin(Date.now() * 0.0016) * 0.035;

          // Synchronize Showroom Turntable Disc with Product Orbit
          if (pedestalControls) {
            pedestalControls.updateTurntableRotation(uniformWrapper.rotation.y);
          }

          const rawDeg = Math.round(
            ((((uniformWrapper.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) *
              180) /
              Math.PI
          );
          setViewAngleDeg(rawDeg);
        }

        // Smooth Camera Distance & Target Lerping (Zoom & Macro Focus)
        if (camera) {
          camera.position.z += (targetDistRef.current - camera.position.z) * 0.12;
          camera.position.y += (targetYRef.current - camera.position.y) * 0.12;
          camera.lookAt(0, targetYRef.current * 0.5, 0);
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
        container.removeEventListener("wheel", handleWheel);
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
  }, [slide, stageMode, onInteractionChange]);

  const handleSetFoldAngle = (deg: number) => {
    setFoldAngleState(deg);
    updateFoldingRef.current?.(deg);
  };

  const handleSetLidAngle = (deg: number) => {
    setLidAngleState(deg);
    updateLidRef.current?.(deg);
  };

  const handleToggleSurrounds = () => {
    const next = !surroundDocked;
    setSurroundDocked(next);
    updateSurroundsRef.current?.(next);
  };

  // Zoom Controls Handlers
  const handleZoomIn = () => {
    targetDistRef.current = Math.max(1.3, targetDistRef.current - 0.5);
    setZoomLevel(Number((3.4 / targetDistRef.current).toFixed(1)));
  };

  const handleZoomOut = () => {
    targetDistRef.current = Math.min(4.5, targetDistRef.current + 0.5);
    setZoomLevel(Number((3.4 / targetDistRef.current).toFixed(1)));
  };

  const handleResetZoom = () => {
    targetDistRef.current = 3.4;
    targetYRef.current = 0;
    setZoomLevel(1.0);
    resetAngleRef.current?.(35);
  };

  const handleFocusMacroOptics = () => {
    targetDistRef.current = 1.6;
    targetYRef.current = 0.35;
    setZoomLevel(2.1);
    resetAngleRef.current?.(180);
  };

  const handleFocusHingeOrProfile = () => {
    targetDistRef.current = 1.65;
    targetYRef.current = 0.05;
    setZoomLevel(2.0);
    resetAngleRef.current?.(90);
  };

  const activePhoto = isRearView && slide.backImageUrl ? slide.backImageUrl : slide.imageUrl;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* 1. HEADER RIBBON: Placed strictly ABOVE the viewport (Zero text over product) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
        {/* Left: Live Status Pill */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-900/90 dark:bg-slate-800/90 text-white shadow-sm border border-slate-700/60">
            <Compass className="w-3.5 h-3.5 text-[#FF8A00] animate-spin-slow" />
            <span>
              {stageMode === "cad3d"
                ? `${viewAngleDeg}° • ${
                    viewAngleDeg >= 315 || viewAngleDeg < 45
                      ? "Front Display"
                      : viewAngleDeg >= 45 && viewAngleDeg < 135
                      ? "Right Profile"
                      : viewAngleDeg >= 135 && viewAngleDeg < 225
                      ? "Rear Optics"
                      : "Left Profile"
                  }`
                : isRearView
                ? "Rear Hardware View"
                : "Front Display View"}
            </span>
          </div>
        </div>

        {/* Center: Clean Inspection Mode Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <button
            type="button"
            onClick={() => onSetStageMode("cad3d")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              stageMode === "cad3d"
                ? "bg-[#FF8A00] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D CAD Model</span>
          </button>
          <button
            type="button"
            onClick={() => onSetStageMode("gallery")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              stageMode === "gallery"
                ? "bg-[#FF8A00] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Studio Gallery</span>
          </button>
        </div>

        {/* Right: Zoom / View Toolbar */}
        {stageMode === "cad3d" ? (
          <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono font-bold text-slate-800 dark:text-slate-200 min-w-[34px] text-center">
              {zoomLevel}x
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
            <button
              type="button"
              onClick={handleFocusMacroOptics}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FF8A00] hover:text-white transition-all"
              title="Zoom to sapphire camera optics"
            >
              Optics
            </button>
            <button
              type="button"
              onClick={handleFocusHingeOrProfile}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FF8A00] hover:text-white transition-all"
              title="Zoom to hinge and ports"
            >
              Hinge
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              title="Reset View to 1.0x"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        ) : (
          /* Gallery Mode View Switcher */
          <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={() => setIsRearView(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                !isRearView
                  ? "bg-[#FF8A00] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Front Screen
            </button>
            {slide.backImageUrl && (
              <button
                type="button"
                onClick={() => setIsRearView(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isRearView
                    ? "bg-[#FF8A00] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Rear Hardware
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. MAIN PRODUCT VIEWPORT (100% UNIMPEDED & UNIFORM DIMENSION) */}
      {/* Zero text, zero badges, zero buttons float over the product or image! */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] my-2.5 rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-100/40 via-white/20 to-slate-200/40 dark:from-[#0d131f]/70 dark:via-[#111827]/40 dark:to-[#090d15]/80 border border-slate-200/70 dark:border-slate-800/70 shadow-inner">
        {stageMode === "cad3d" ? (
          webGlFailed ? (
            <div className="w-full h-full max-w-[340px] sm:max-w-[400px] flex items-center justify-center p-3">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-2xl"
              />
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            />
          )
        ) : (
          /* RESPONSIVE & UNIFORMLY SIZED STUDIO PHOTOGRAPHY */
          <div className="w-full h-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center p-3">
            <img
              src={activePhoto}
              alt={slide.title}
              className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-2xl transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* 3. FOOTER CONTROLS DOCK: Placed strictly BELOW the viewport */}
      <div className="w-full flex flex-col gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        {/* Row 1: Camera Angle Presets & Interactive Moving Hardware Controls */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
          {stageMode === "cad3d" ? (
            <>
              {/* Auto Spin & Angle Presets */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    const next = !isAutoSpinning;
                    setIsAutoSpinning(next);
                    autoSpinRef.current = next;
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm ${
                    isAutoSpinning
                      ? "bg-[#FF8A00] text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                  }`}
                  title="360 Continuous Auto-Spin"
                >
                  <RotateCw className={`w-3 h-3 ${isAutoSpinning ? "animate-spin" : "text-[#FF8A00]"}`} />
                  <span>{isAutoSpinning ? "Pause 360°" : "Auto 360°"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(35)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                >
                  Hero 45°
                </button>
                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(0)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(90)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(180)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
                >
                  Rear
                </button>
              </div>

              {/* Device-Specific Moving Hardware Controls */}
              {slide.deviceModel === "fold6" && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#FF8A00]" /> Hinge:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetFoldAngle(25)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      foldAngleState <= 35
                        ? "bg-[#FF8A00] text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    Closed
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetFoldAngle(90)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      foldAngleState > 70 && foldAngleState < 120
                        ? "bg-[#FF8A00] text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    90° Flex
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetFoldAngle(152)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      foldAngleState > 140 && foldAngleState < 170
                        ? "bg-[#FF8A00] text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    150° Hero
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetFoldAngle(180)}
                    className={`px-2 py-0.5 rounded font-bold transition-all ${
                      foldAngleState >= 175
                        ? "bg-[#FF8A00] text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    180° Flat
                  </button>
                </div>
              )}

              {slide.deviceModel === "surface7" && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#FF8A00]" /> Lid:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSetLidAngle(115)}
                    className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                      lidAngleState === 115
                        ? "bg-[#FF8A00] text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    115° Work View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetLidAngle(140)}
                    className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                      lidAngleState === 140
                        ? "bg-[#FF8A00] text-white"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    140° Wide
                  </button>
                </div>
              )}

              {slide.deviceModel === "jbl800" && (
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="font-bold text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#FF8A00]" /> Surrounds:
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleSurrounds}
                    className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                      !surroundDocked
                        ? "bg-[#FF8A00] text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {surroundDocked ? "Detach Surrounds (5.1.2 Setup)" : "Dock to Soundbar"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold">
                Official manufacturer studio catalog photograph &bull; Accra East Legon Stock
              </span>
              <span className="font-bold text-[#FF8A00]">Authentic 1:1 Scale</span>
            </div>
          )}
        </div>

        {/* Row 2: Engineered Feature Hotspot Badges */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-2">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
              Inspect:
            </span>
            {slide.hotspots.map((hs) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => setActiveHotspotId(activeHotspotId === hs.id ? null : hs.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  activeHotspotId === hs.id
                    ? "bg-[#FF8A00] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {hs.badge}
              </button>
            ))}
          </div>

          <span className="text-[10px] font-semibold text-slate-400">
            Scroll to zoom &bull; Drag to rotate
          </span>
        </div>

        {/* Row 3: Hotspot Info Drawer (Renders cleanly underneath dock, NEVER over product) */}
        {activeHotspotId && (
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md animate-fadeIn text-left">
            {(() => {
              const hs = slide.hotspots.find((h) => h.id === activeHotspotId);
              if (!hs) return null;
              return (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {hs.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FF8A00]/10 text-[#FF8A00]">
                        {hs.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {hs.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHotspotId(null)}
                    className="text-[10px] font-bold text-[#FF8A00] hover:underline shrink-0"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// PROCEDURAL CANVAS TEXTURE BUILDERS
// High-DPI authentic screen textures generated procedurally to guarantee
// crystal clear typography, realistic UI elements, and zero JPEG compression.
// =============================================================================

function createFold6InnerScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep AMOLED pure black
  ctx.fillStyle = "#06080e";
  ctx.fillRect(0, 0, 1024, 1024);

  // Samsung Galaxy AI Iridescent Ribbon Wallpaper
  const grad = ctx.createLinearGradient(120, 150, 900, 850);
  grad.addColorStop(0, "rgba(59, 130, 246, 0.75)"); // Electric Blue
  grad.addColorStop(0.35, "rgba(139, 92, 246, 0.85)"); // Violet
  grad.addColorStop(0.7, "rgba(236, 72, 153, 0.8)"); // Pink
  grad.addColorStop(1, "rgba(245, 158, 11, 0.7)"); // Amber

  ctx.save();
  ctx.filter = "blur(70px)";
  ctx.beginPath();
  ctx.ellipse(512, 512, 420, 280, Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Subtle Hinge Crease Guide down center
  const creaseGrad = ctx.createLinearGradient(506, 0, 518, 0);
  creaseGrad.addColorStop(0, "rgba(255,255,255,0)");
  creaseGrad.addColorStop(0.5, "rgba(255,255,255,0.06)");
  creaseGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = creaseGrad;
  ctx.fillRect(506, 0, 12, 1024);

  // Status Bar at Top
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("10:24", 50, 60);

  ctx.textAlign = "right";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("5G • 100%", 974, 60);

  // Under-display Camera Dot Indicator at top inner right
  ctx.beginPath();
  ctx.arc(768, 60, 6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(10, 12, 18, 0.65)";
  ctx.fill();

  // Minimalist Clock & Galaxy AI Date
  ctx.textAlign = "center";
  ctx.font = "200 96px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("10:24", 512, 360);

  ctx.font = "500 24px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("Monday, October 19 • Accra 29°C", 512, 410);

  // Galaxy AI Search Bar Pill
  ctx.beginPath();
  ctx.roundRect(262, 460, 500, 64, 32);
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("Ask Galaxy AI or search...", 310, 500);

  // Multi-Window Multitasking Split Tiles
  ctx.beginPath();
  ctx.roundRect(140, 560, 744, 280, 24);
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.stroke();

  // Left Tile: Samsung Notes AI
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.roundRect(160, 580, 340, 240, 16);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Samsung Notes AI", 185, 625);
  ctx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("• Live Audio Translation", 185, 665);
  ctx.fillText("• Note Assist: Auto-Format", 185, 695);
  ctx.fillText("• S-Pen Stylus Detection", 185, 725);
  ctx.fillText("• 7.6\" Dynamic AMOLED 2X", 185, 755);

  // Right Tile: Workspace Analytics
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.roundRect(524, 580, 340, 240, 16);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Snapdragon 8 Gen 3", 549, 625);
  ctx.font = "16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("• 1-120Hz Adaptive Refresh", 549, 665);
  ctx.fillText("• 2,600 Nits Peak Outdoor", 549, 695);
  ctx.fillText("• Dual Armor Aluminum Rail", 549, 725);
  ctx.fillText("• Accra Stock Confirmed", 549, 755);

  // App Dock at Bottom (5 rounded squares)
  const appColors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
  const appIcons = ["Call", "Chat", "Web", "Cam", "AI"];
  const startX = 312;
  for (let i = 0; i < 5; i++) {
    const x = startX + i * 85;
    ctx.beginPath();
    ctx.roundRect(x, 890, 64, 64, 18);
    ctx.fillStyle = appColors[i];
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(appIcons[i], x + 32, 928);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createFold6CoverScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#07090e";
  ctx.fillRect(0, 0, 512, 1024);

  // Sleek dark gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, "rgba(59, 130, 246, 0.5)");
  grad.addColorStop(1, "rgba(139, 92, 246, 0.4)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Punch-hole Camera Cutout at top
  ctx.beginPath();
  ctx.arc(256, 45, 12, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(256, 45, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#1e293b";
  ctx.fill();

  // Status Bar
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("10:24", 40, 52);
  ctx.textAlign = "right";
  ctx.fillText("5G 100%", 472, 52);

  // Large Lockscreen Clock
  ctx.textAlign = "center";
  ctx.font = "300 90px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("10:24", 256, 320);

  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("Mon, Oct 19 • 29°C", 256, 370);

  // Notification Pill
  ctx.beginPath();
  ctx.roundRect(56, 460, 400, 72, 20);
  ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("WhatsApp • Gadget Master", 84, 495);
  ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("Your Z Fold6 order is confirmed for delivery", 84, 518);

  // Swipe to unlock bar
  ctx.beginPath();
  ctx.roundRect(176, 960, 160, 6, 3);
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createIPhoneScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#050608";
  ctx.fillRect(0, 0, 512, 1024);

  // iOS 18 Titanium radial glow
  const grad = ctx.createRadialGradient(256, 512, 50, 256, 512, 400);
  grad.addColorStop(0, "rgba(147, 140, 130, 0.4)");
  grad.addColorStop(1, "rgba(5, 6, 8, 1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Dynamic Island Pill at Top
  ctx.beginPath();
  ctx.roundRect(176, 32, 160, 36, 18);
  ctx.fillStyle = "#000000";
  ctx.fill();

  // Dynamic Island subtle waveform
  ctx.fillStyle = "#10b981";
  ctx.fillRect(300, 44, 4, 12);
  ctx.fillRect(308, 40, 4, 20);
  ctx.fillRect(316, 46, 4, 8);

  // Status Bar
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("9:41", 45, 56);
  ctx.textAlign = "right";
  ctx.fillText("5G 100%", 467, 56);

  // Lockscreen Clock
  ctx.textAlign = "center";
  ctx.font = "200 96px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("9:41", 256, 280);

  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("Monday, October 19", 256, 330);

  // Lockscreen Quick Action Buttons (Flashlight & Camera)
  ctx.beginPath();
  ctx.arc(70, 920, 28, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(442, 920, 28, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fill();

  // Home Bar
  ctx.beginPath();
  ctx.roundRect(176, 980, 160, 6, 3);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createSurfaceScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#031428";
  ctx.fillRect(0, 0, 1024, 680);

  // Windows 11 Copilot+ PC Bloom Artwork
  const grad = ctx.createLinearGradient(200, 100, 800, 600);
  grad.addColorStop(0, "rgba(2, 132, 199, 0.85)");
  grad.addColorStop(0.5, "rgba(99, 102, 241, 0.8)");
  grad.addColorStop(1, "rgba(14, 165, 233, 0.7)");

  ctx.save();
  ctx.filter = "blur(50px)";
  ctx.beginPath();
  ctx.ellipse(512, 300, 320, 220, Math.PI / 6, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Windows 11 Centered Taskbar
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillRect(0, 624, 1024, 56);

  // Centered Icons (Windows Logo, Copilot, Search, Explorer, Edge)
  const icons = ["Win", "AI", "🔍", "📁", "🌐"];
  const startX = 420;
  for (let i = 0; i < icons.length; i++) {
    const x = startX + i * 42;
    ctx.beginPath();
    ctx.roundRect(x, 632, 34, 34, 8);
    ctx.fillStyle = i === 1 ? "#0284c7" : "rgba(255, 255, 255, 0.15)";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(icons[i], x + 17, 654);
  }

  // Right Tray Clock
  ctx.textAlign = "right";
  ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("10:24 AM • 10/19/2026", 990, 656);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createJblDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#121417";
  ctx.fillRect(0, 0, 512, 128);

  // Dot Matrix Acoustic Grille Texture
  ctx.fillStyle = "#1a1d22";
  for (let x = 0; x < 512; x += 6) {
    for (let y = 0; y < 128; y += 6) {
      ctx.fillRect(x, y, 2, 2);
    }
  }

  // Glowing Amber/Cyan Dot-Matrix LED Readout
  ctx.fillStyle = "#ff8a00";
  ctx.font = "bold 32px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("DOLBY ATMOS 5.1.2", 256, 72);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createIMacScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // macOS Sequoia Landscape
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, "#ff7b00");
  grad.addColorStop(0.5, "#802090");
  grad.addColorStop(1, "#1c224a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Top macOS Menu Bar
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, 1024, 30);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("  Finder  File  Edit  View  Go  Window  Help", 20, 20);

  // Floating Glass Dock at Bottom
  ctx.beginPath();
  ctx.roundRect(312, 575, 400, 55, 18);
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.stroke();

  const dockIcons = ["Finder", "Safari", "Mail", "Music", "Notes", "Xcode"];
  for (let i = 0; i < dockIcons.length; i++) {
    const x = 335 + i * 62;
    ctx.beginPath();
    ctx.roundRect(x, 584, 38, 38, 10);
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// -----------------------------------------------------------------------------
// Mirror Chrome Apple Logo Texture (iPhone & iMac rear)
// -----------------------------------------------------------------------------
function createAppleLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 256);
  ctx.fillStyle = "#ffffff";

  // Leaf
  ctx.beginPath();
  ctx.moveTo(136, 42);
  ctx.quadraticCurveTo(165, 24, 165, 58);
  ctx.quadraticCurveTo(138, 76, 136, 42);
  ctx.fill();

  // Apple Body with Bite
  ctx.beginPath();
  ctx.arc(104, 138, 56, 0, Math.PI * 2);
  ctx.arc(152, 138, 56, 0, Math.PI * 2);
  ctx.fill();

  // Bottom indent
  ctx.beginPath();
  ctx.arc(128, 192, 16, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  ctx.globalCompositeOperation = "destination-out";
  ctx.fill();

  // Bite cutout on right
  ctx.beginPath();
  ctx.arc(196, 134, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// -----------------------------------------------------------------------------
// Samsung Armor Aluminum Spine Texture
// -----------------------------------------------------------------------------
function createSamsungSpineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed aluminum metallic background
  ctx.fillStyle = "#949ea8";
  ctx.fillRect(0, 0, 128, 512);

  // Subtle brushed longitudinal grain
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let y = 0; y < 512; y += 4) {
    ctx.fillRect(0, y, 128, 1.5);
  }

  // Laser-etched SAMSUNG branding along center
  ctx.save();
  ctx.translate(64, 256);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "6px";
  ctx.fillText("SAMSUNG", 0, 7);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// -----------------------------------------------------------------------------
// LG 75" 4K QNED TV Vivid Display Texture
// -----------------------------------------------------------------------------
function createLGTVDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Cinematic Quantum Dot Aurora Sky
  const grad = ctx.createLinearGradient(0, 0, 1024, 576);
  grad.addColorStop(0, "#050b18");
  grad.addColorStop(0.35, "#0b2545");
  grad.addColorStop(0.65, "#134e5e");
  grad.addColorStop(0.85, "#71b280");
  grad.addColorStop(1, "#071e22");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 576);

  // Glowing Aurora Light Ribbon
  ctx.save();
  ctx.filter = "blur(40px)";
  const aurora = ctx.createRadialGradient(512, 220, 60, 512, 220, 420);
  aurora.addColorStop(0, "rgba(52, 211, 153, 0.85)");
  aurora.addColorStop(0.4, "rgba(14, 165, 233, 0.7)");
  aurora.addColorStop(0.7, "rgba(168, 85, 247, 0.5)");
  aurora.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = aurora;
  ctx.beginPath();
  ctx.ellipse(512, 200, 460, 160, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Mountain Silhouettes in Foreground
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.moveTo(0, 576);
  ctx.lineTo(0, 390);
  ctx.lineTo(160, 310);
  ctx.lineTo(340, 410);
  ctx.lineTo(512, 260);
  ctx.lineTo(720, 430);
  ctx.lineTo(890, 330);
  ctx.lineTo(1024, 420);
  ctx.lineTo(1024, 576);
  ctx.closePath();
  ctx.fill();

  // Header Badge Info (Top Left & Top Right)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("LG webOS 23", 40, 52);
  ctx.textAlign = "right";
  ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("4K HDR10 Pro • Quantum Dot QNED • 120Hz", 984, 52);

  // webOS Translucent App Dock at Bottom
  ctx.beginPath();
  ctx.roundRect(142, 470, 740, 74, 22);
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const tvApps = [
    { name: "Live TV", color: "#3b82f6" },
    { name: "Netflix", color: "#e50914" },
    { name: "Prime", color: "#00a8e1" },
    { name: "Disney+", color: "#113ccf" },
    { name: "YouTube", color: "#ff0000" },
    { name: "Apple TV", color: "#000000" },
    { name: "Spotify", color: "#1db954" },
  ];
  for (let i = 0; i < tvApps.length; i++) {
    const x = 168 + i * 102;
    ctx.beginPath();
    ctx.roundRect(x, 482, 82, 50, 14);
    ctx.fillStyle = tvApps[i].color;
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tvApps[i].name, x + 41, 513);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// -----------------------------------------------------------------------------
// TCL 1.5HP Smart Inverter AC Front Panel Texture
// -----------------------------------------------------------------------------
function createTCLACDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pure White Gloss Finish
  ctx.fillStyle = "#fcfdfd";
  ctx.fillRect(0, 0, 1024, 300);

  // Subtle Pearl Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, "rgba(240, 244, 248, 0.6)");
  grad.addColorStop(0.4, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.85, "rgba(235, 240, 245, 0.7)");
  grad.addColorStop(1, "rgba(215, 222, 230, 0.9)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 300);

  // Chrome Accent Stripe in Lower Third
  const chromeGrad = ctx.createLinearGradient(0, 240, 1024, 240);
  chromeGrad.addColorStop(0, "#cbd5e1");
  chromeGrad.addColorStop(0.5, "#ffffff");
  chromeGrad.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = chromeGrad;
  ctx.fillRect(40, 240, 944, 4);

  // Centered TCL Brand Logo
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 34px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TCL", 512, 115);

  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("SMART INVERTER • 1.5HP", 512, 145);

  // Glowing Digital LED Temperature Display on Right Fascia
  ctx.save();
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#0284c7";
  ctx.font = "bold 58px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("21°C", 820, 120);

  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#0369a1";
  ctx.fillText("ECO COOL • AUTO", 820, 148);
  ctx.restore();

  // TitanGold Protection Badge on Left Fascia
  ctx.beginPath();
  ctx.roundRect(80, 85, 150, 48, 12);
  ctx.fillStyle = "rgba(217, 119, 6, 0.1)";
  ctx.fill();
  ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#d97706";
  ctx.textAlign = "center";
  ctx.fillText("TITANGOLD", 155, 105);
  ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "#b45309";
  ctx.fillText("Anti-Corrosion Fin", 155, 122);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// =============================================================================
// THREE.JS ROUNDED RECTANGLE EXTRUSION HELPER
// Produces real filleted corners and chamfered edges that catch studio light.
// =============================================================================

function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

// =============================================================================
// REFINED 3D HARDWARE MODEL BUILDER
// Constructs museum-grade CAD geometry for each specific device model.
// =============================================================================

interface DeviceCADControllers {
  setFoldAngle?: (deg: number) => void;
  setLidAngle?: (deg: number) => void;
  setSurroundsDocked?: (docked: boolean) => void;
}

function buildRefinedHardwareCAD(
  root: THREE.Group,
  deviceModel: "fold6" | "iphone16" | "surface7" | "jbl800" | "imac24" | "tv75" | "ac15",
  accentHex: string
): DeviceCADControllers {
  const controllers: DeviceCADControllers = {};

  switch (deviceModel) {
    // -------------------------------------------------------------------------
    // 1. SAMSUNG GALAXY Z FOLD6 (Dual Folding Armor Aluminum Chassis)
    // -------------------------------------------------------------------------
    case "fold6": {
      // Armor Aluminum Frame Material (Silver Shadow with Physical Clearcoat)
      const armorAluminumMat = new THREE.MeshPhysicalMaterial({
        color: 0x949ea8,
        metalness: 0.94,
        roughness: 0.16,
        clearcoat: 0.25,
        clearcoatRoughness: 0.15,
      });

      // Frosted Silk Glass Rear Material
      const frostedGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xb0b8c2,
        metalness: 0.18,
        roughness: 0.35,
        clearcoat: 0.35,
      });

      // Emissive OLED Gloss Display Materials
      const innerScreenTex = createFold6InnerScreenTexture();
      const innerScreenMat = new THREE.MeshPhysicalMaterial({
        map: innerScreenTex,
        roughness: 0.04,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: innerScreenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.38,
      });

      const coverScreenTex = createFold6CoverScreenTexture();
      const coverScreenMat = new THREE.MeshPhysicalMaterial({
        map: coverScreenTex,
        roughness: 0.04,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: coverScreenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.38,
      });

      // Deep Sapphire Optical Camera Lenses with AR coating
      const lensRingMat = new THREE.MeshPhysicalMaterial({
        color: 0xa8b2bd,
        metalness: 0.96,
        roughness: 0.12,
        clearcoat: 0.4,
      });
      const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x070914,
        metalness: 0.95,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 0.95,
      });

      // Center Polished Hinge Spine with Samsung Laser Engraving
      const spineTex = createSamsungSpineTexture();
      const spineMat = new THREE.MeshPhysicalMaterial({
        map: spineTex,
        color: 0xffffff,
        metalness: 0.92,
        roughness: 0.2,
      });
      const hingeGeo = new THREE.CylinderGeometry(0.024, 0.024, 1.84, 32);
      const hingeMesh = new THREE.Mesh(hingeGeo, spineMat);
      hingeMesh.position.set(0, 0, -0.018);
      hingeMesh.castShadow = true;
      root.add(hingeMesh);

      // LEFT WING (Pivots at x = 0)
      const leftWing = new THREE.Group();
      root.add(leftWing);

      // Left Slab Body (w = 0.52, h = 1.82, thickness = 0.038)
      const slabShape = createRoundedRectShape(0.52, 1.82, 0.035);
      const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
        depth: 0.036,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });

      const leftSlab = new THREE.Mesh(slabGeo, armorAluminumMat);
      leftSlab.position.set(-0.27, 0, -0.018);
      leftSlab.castShadow = true;
      leftWing.add(leftSlab);

      // Rear Frosted Glass on Left Slab
      const rearGlassGeo = new THREE.PlaneGeometry(0.50, 1.80);
      const leftRearGlass = new THREE.Mesh(rearGlassGeo, frostedGlassMat);
      leftRearGlass.position.set(-0.27, 0, -0.032);
      leftRearGlass.rotation.y = Math.PI;
      leftWing.add(leftRearGlass);

      // Triple Vertically Stacked Camera Rings on Left Rear
      const cameraY = [0.55, 0.32, 0.09];
      cameraY.forEach((yPos) => {
        // Outer beveled ring
        const ringGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.022, 32);
        const ring = new THREE.Mesh(ringGeo, lensRingMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(-0.35, yPos, -0.045);

        // Sapphire lens element
        const lensGeo = new THREE.CylinderGeometry(0.044, 0.044, 0.024, 32);
        const lens = new THREE.Mesh(lensGeo, lensGlassMat);
        ring.add(lens);

        leftWing.add(ring);
      });

      // Dual LED Flash next to middle camera
      const flashGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.01, 16);
      const flashMat = new THREE.MeshStandardMaterial({
        color: 0xfff6dd,
        emissive: 0xffeab3,
        emissiveIntensity: 0.8,
      });
      const flash = new THREE.Mesh(flashGeo, flashMat);
      flash.rotation.x = Math.PI / 2;
      flash.position.set(-0.25, 0.32, -0.036);
      leftWing.add(flash);

      // Left Half of Inner Display
      const innerLeftScreenGeo = new THREE.PlaneGeometry(0.51, 1.80);
      const innerLeftScreen = new THREE.Mesh(innerLeftScreenGeo, innerScreenMat);
      innerLeftScreen.position.set(-0.265, 0, 0.021);
      leftWing.add(innerLeftScreen);

      // RIGHT WING (Pivots at x = 0)
      const rightWing = new THREE.Group();
      root.add(rightWing);

      const rightSlab = new THREE.Mesh(slabGeo, armorAluminumMat);
      rightSlab.position.set(0.27, 0, -0.018);
      rightSlab.castShadow = true;
      rightWing.add(rightSlab);

      // Rear 6.3" Outer Cover Screen on Right Slab
      const coverScreenGeo = new THREE.PlaneGeometry(0.50, 1.80);
      const rightCoverScreen = new THREE.Mesh(coverScreenGeo, coverScreenMat);
      rightCoverScreen.position.set(0.27, 0, -0.032);
      rightCoverScreen.rotation.y = Math.PI;
      rightWing.add(rightCoverScreen);

      // Right Half of Inner Display
      const innerRightScreenGeo = new THREE.PlaneGeometry(0.51, 1.80);
      const innerRightScreen = new THREE.Mesh(innerRightScreenGeo, innerScreenMat);
      innerRightScreen.position.set(0.265, 0, 0.021);
      rightWing.add(innerRightScreen);

      // Right Frame Buttons (Fingerprint Key & Volume Rocker)
      const buttonMat = new THREE.MeshPhysicalMaterial({
        color: 0x7c8691,
        metalness: 0.95,
        roughness: 0.15,
      });
      const pwrKeyGeo = new THREE.BoxGeometry(0.01, 0.16, 0.025);
      const pwrKey = new THREE.Mesh(pwrKeyGeo, buttonMat);
      pwrKey.position.set(0.54, 0.12, 0);
      rightWing.add(pwrKey);

      const volKeyGeo = new THREE.BoxGeometry(0.01, 0.28, 0.025);
      const volKey = new THREE.Mesh(volKeyGeo, buttonMat);
      volKey.position.set(0.54, 0.42, 0);
      rightWing.add(volKey);

      // Bottom USB-C Port & Speaker Slots
      const usbcGeo = new THREE.BoxGeometry(0.12, 0.01, 0.03);
      const usbcMat = new THREE.MeshStandardMaterial({ color: 0x111317 });
      const usbc = new THREE.Mesh(usbcGeo, usbcMat);
      usbc.position.set(0.27, -0.92, 0);
      rightWing.add(usbc);

      // Controller: Interactive Folding Angle
      controllers.setFoldAngle = (deg: number) => {
        const rad = (deg * Math.PI) / 180;
        const foldOffset = (Math.PI - rad) / 2;
        leftWing.rotation.y = foldOffset;
        rightWing.rotation.y = -foldOffset;
      };

      break;
    }

    // -------------------------------------------------------------------------
    // 2. APPLE IPHONE 16 PRO MAX (Grade 5 Titanium & Camera Control Button)
    // -------------------------------------------------------------------------
    case "iphone16": {
      // Satin Brushed Grade 5 Titanium Frame
      const titaniumMat = new THREE.MeshPhysicalMaterial({
        color: 0x9b948a, // Desert Titanium warm tint
        metalness: 0.92,
        roughness: 0.24,
        clearcoat: 0.28,
        clearcoatRoughness: 0.18,
      });

      // Frosted Matte Glass Back with Silky Sheen
      const rearGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xb5afa6,
        metalness: 0.12,
        roughness: 0.42,
        clearcoat: 0.32,
        clearcoatRoughness: 0.25,
      });

      // Glowing Super Retina XDR OLED Display
      const screenTex = createIPhoneScreenTexture();
      const screenMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.04,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.38,
      });

      // Extruded Rounded Rectangle Body (Filleted corners)
      const bodyShape = createRoundedRectShape(0.96, 1.96, 0.12);
      const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.058,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });

      const phoneBody = new THREE.Mesh(bodyGeo, titaniumMat);
      phoneBody.position.z = -0.029;
      phoneBody.castShadow = true;
      root.add(phoneBody);

      // Front OLED Glass Screen
      const frontScreenGeo = new THREE.PlaneGeometry(0.92, 1.92);
      const frontScreen = new THREE.Mesh(frontScreenGeo, screenMat);
      frontScreen.position.z = 0.031;
      root.add(frontScreen);

      // Rear Frosted Glass Back
      const rearGlassGeo = new THREE.PlaneGeometry(0.92, 1.92);
      const rearGlass = new THREE.Mesh(rearGlassGeo, rearGlassMat);
      rearGlass.position.z = -0.031;
      rearGlass.rotation.y = Math.PI;
      root.add(rearGlass);

      // Mirror Chrome Apple Logo on Rear Back
      const appleLogoTex = createAppleLogoTexture();
      const appleLogoMat = new THREE.MeshPhysicalMaterial({
        map: appleLogoTex,
        transparent: true,
        metalness: 0.98,
        roughness: 0.06,
        clearcoat: 1.0,
      });
      const appleLogoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), appleLogoMat);
      appleLogoMesh.position.set(0, 0.08, -0.032);
      appleLogoMesh.rotation.y = Math.PI;
      root.add(appleLogoMesh);

      // Rear Raised Camera Plateau (Sculpted Squircle Glass Island)
      const plateauShape = createRoundedRectShape(0.48, 0.50, 0.09);
      const plateauGeo = new THREE.ExtrudeGeometry(plateauShape, {
        depth: 0.025,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      });
      const plateau = new THREE.Mesh(plateauGeo, rearGlassMat);
      plateau.position.set(-0.21, 0.65, -0.056);
      plateau.rotation.y = Math.PI;
      root.add(plateau);

      // 3 Pro Sapphire Lens Cylinders with Anti-Reflective Optical Coating
      const lensRingMat = new THREE.MeshPhysicalMaterial({
        color: 0x989289,
        metalness: 0.95,
        roughness: 0.15,
        clearcoat: 0.5,
      });
      const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x050711,
        metalness: 0.96,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 0.96,
      });

      const lensCoords = [
        [-0.31, 0.77],
        [-0.31, 0.53],
        [-0.11, 0.65],
      ];
      lensCoords.forEach(([x, y]) => {
        // Outer beveled ring
        const ringGeo = new THREE.CylinderGeometry(0.088, 0.088, 0.025, 32);
        const ring = new THREE.Mesh(ringGeo, lensRingMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, y, -0.068);

        // Chamfered inner lens barrel
        const innerRingGeo = new THREE.CylinderGeometry(0.078, 0.078, 0.026, 32);
        const innerRingMat = new THREE.MeshStandardMaterial({ color: 0x111317 });
        const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
        ring.add(innerRing);

        // Sapphire lens glass with AR highlight
        const lensGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.028, 32);
        const lens = new THREE.Mesh(lensGeo, lensGlassMat);
        ring.add(lens);

        root.add(ring);
      });

      // True Tone Dual-LED Flash next to cameras
      const flashGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.012, 24);
      const flashMat = new THREE.MeshStandardMaterial({
        color: 0xfff6dd,
        emissive: 0xffeab3,
        emissiveIntensity: 0.8,
      });
      const flash = new THREE.Mesh(flashGeo, flashMat);
      flash.rotation.x = Math.PI / 2;
      flash.position.set(-0.11, 0.81, -0.06);
      root.add(flash);

      // LiDAR Scanner Dark Sensor
      const lidarGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.01, 24);
      const lidarMat = new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        metalness: 0.9,
        roughness: 0.1,
      });
      const lidar = new THREE.Mesh(lidarGeo, lidarMat);
      lidar.rotation.x = Math.PI / 2;
      lidar.position.set(-0.11, 0.49, -0.06);
      root.add(lidar);

      // Camera Control Sapphire Touch Sensor Button on Right Rail
      const camControlGeo = new THREE.BoxGeometry(0.015, 0.18, 0.028);
      const camControlMat = new THREE.MeshPhysicalMaterial({
        color: 0x334155,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 0.8,
      });
      const camControl = new THREE.Mesh(camControlGeo, camControlMat);
      camControl.position.set(0.49, -0.22, 0);
      root.add(camControl);

      // Volume & Action buttons on Left Rail
      const buttonMat = new THREE.MeshPhysicalMaterial({
        color: 0x78716c,
        metalness: 0.92,
        roughness: 0.18,
      });
      const actionKey = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.10, 0.025), buttonMat);
      actionKey.position.set(-0.49, 0.65, 0);
      root.add(actionKey);

      const volUpKey = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.025), buttonMat);
      volUpKey.position.set(-0.49, 0.45, 0);
      root.add(volUpKey);

      const volDnKey = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.025), buttonMat);
      volDnKey.position.set(-0.49, 0.22, 0);
      root.add(volDnKey);

      // Bottom USB-C Port
      const usbcGeo = new THREE.BoxGeometry(0.12, 0.015, 0.028);
      const usbcMat = new THREE.MeshStandardMaterial({ color: 0x090b0e });
      const usbc = new THREE.Mesh(usbcGeo, usbcMat);
      usbc.position.set(0, -0.99, 0);
      root.add(usbc);

      break;
    }

    // -------------------------------------------------------------------------
    // 3. MICROSOFT SURFACE LAPTOP 7 (CNC Aluminum Unibody with Copilot Key)
    // -------------------------------------------------------------------------
    case "surface7": {
      const aluminumMat = new THREE.MeshPhysicalMaterial({
        color: 0xd4d8dc,
        metalness: 0.92,
        roughness: 0.18,
        clearcoat: 0.25,
      });
      const darkKeyMat = new THREE.MeshStandardMaterial({
        color: 0x242830,
        metalness: 0.2,
        roughness: 0.6,
      });
      const trackpadMat = new THREE.MeshPhysicalMaterial({
        color: 0xc4c9ce,
        metalness: 0.3,
        roughness: 0.12,
        clearcoat: 0.6,
      });

      const screenTex = createSurfaceScreenTexture();
      const screenMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.05,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.35,
      });

      // Tapered Aluminum Base
      const baseGeo = new THREE.BoxGeometry(2.1, 0.045, 1.45);
      const base = new THREE.Mesh(baseGeo, aluminumMat);
      base.position.set(0, -0.4, 0);
      base.castShadow = true;
      root.add(base);

      // Recessed Keyboard Well
      const keyboardGeo = new THREE.PlaneGeometry(1.75, 0.68);
      const keyboard = new THREE.Mesh(keyboardGeo, darkKeyMat);
      keyboard.rotation.x = -Math.PI / 2;
      keyboard.position.set(0, 0.024, -0.22);
      base.add(keyboard);

      // Glowing Copilot Key Highlight
      const copilotKeyGeo = new THREE.PlaneGeometry(0.12, 0.08);
      const copilotKeyMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.7,
      });
      const copilotKey = new THREE.Mesh(copilotKeyGeo, copilotKeyMat);
      copilotKey.rotation.x = -Math.PI / 2;
      copilotKey.position.set(0.44, 0.025, 0.08);
      base.add(copilotKey);

      // Glass Precision Trackpad
      const trackpadGeo = new THREE.PlaneGeometry(0.72, 0.48);
      const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
      trackpad.rotation.x = -Math.PI / 2;
      trackpad.position.set(0, 0.024, 0.38);
      base.add(trackpad);

      // Display Lid (Pivots at rear of base)
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, -0.38, -0.72);
      root.add(lidGroup);

      const lidShape = createRoundedRectShape(2.1, 1.42, 0.05);
      const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
        depth: 0.028,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      });
      const lidMesh = new THREE.Mesh(lidGeo, aluminumMat);
      lidMesh.position.set(0, 0.71, 0);
      lidMesh.castShadow = true;
      lidGroup.add(lidMesh);

      // 3:2 PixelSense Display Screen
      const lidScreenGeo = new THREE.PlaneGeometry(2.0, 1.34);
      const lidScreen = new THREE.Mesh(lidScreenGeo, screenMat);
      lidScreen.position.set(0, 0.71, 0.016);
      lidGroup.add(lidScreen);

      // Mirror 4-Square Microsoft Logo on Rear of Lid
      const logoMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.05,
        clearcoat: 1.0,
      });
      const logoGeo = new THREE.PlaneGeometry(0.18, 0.18);
      const logo = new THREE.Mesh(logoGeo, logoMat);
      logo.position.set(0, 0.71, -0.016);
      logo.rotation.y = Math.PI;
      lidGroup.add(logo);

      // Controller: Lid Angle
      controllers.setLidAngle = (deg: number) => {
        lidGroup.rotation.x = -((180 - deg) * Math.PI) / 180;
      };
      controllers.setLidAngle(115);

      break;
    }

    // -------------------------------------------------------------------------
    // 4. JBL BAR 800 MK2 (Soundbar with Detachable Wireless Surrounds & 10" Sub)
    // -------------------------------------------------------------------------
    case "jbl800": {
      const meshMat = new THREE.MeshPhysicalMaterial({
        color: 0x282c32,
        metalness: 0.75,
        roughness: 0.35,
        clearcoat: 0.3,
      });
      const subMat = new THREE.MeshPhysicalMaterial({
        color: 0x181a1e,
        metalness: 0.3,
        roughness: 0.45,
      });

      const displayTex = createJblDisplayTexture();
      const displayMat = new THREE.MeshPhysicalMaterial({
        map: displayTex,
        roughness: 0.15,
        emissiveMap: displayTex,
        emissive: new THREE.Color(0xff8a00),
        emissiveIntensity: 0.5,
      });

      // Main Center Soundbar Bar
      const mainBarGeo = new THREE.BoxGeometry(1.65, 0.18, 0.28);
      const mainBar = new THREE.Mesh(mainBarGeo, meshMat);
      mainBar.position.set(0, -0.25, 0);
      mainBar.castShadow = true;
      root.add(mainBar);

      // Center LED Readout
      const displayPlaneGeo = new THREE.PlaneGeometry(0.7, 0.14);
      const displayPlane = new THREE.Mesh(displayPlaneGeo, displayMat);
      displayPlane.position.set(0, 0, 0.142);
      mainBar.add(displayPlane);

      // Left Detachable Surround Pod
      const surroundGeo = new THREE.BoxGeometry(0.32, 0.18, 0.28);
      const leftPod = new THREE.Mesh(surroundGeo, meshMat);
      leftPod.position.set(-0.99, -0.25, 0);
      leftPod.castShadow = true;
      root.add(leftPod);

      // Right Detachable Surround Pod
      const rightPod = new THREE.Mesh(surroundGeo, meshMat);
      rightPod.position.set(0.99, -0.25, 0);
      rightPod.castShadow = true;
      root.add(rightPod);

      // Gold Magnetic Pogo Contacts on mating faces
      const pogoMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.1,
      });
      [-0.82, 0.82].forEach((x) => {
        const pogo = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16), pogoMat);
        pogo.rotation.z = Math.PI / 2;
        pogo.position.set(x, -0.25, 0);
        root.add(pogo);
      });

      // 10-Inch Wireless Subwoofer Cube
      const subGeo = new THREE.BoxGeometry(0.72, 0.78, 0.72);
      const sub = new THREE.Mesh(subGeo, subMat);
      sub.position.set(1.45, 0.12, -0.25);
      sub.castShadow = true;
      root.add(sub);

      // Subwoofer Down-Firing Bass Reflex Port Flare
      const portGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.16, 24);
      const portMat = new THREE.MeshStandardMaterial({ color: 0x090b0e });
      const port = new THREE.Mesh(portGeo, portMat);
      port.position.set(0, -0.35, 0);
      sub.add(port);

      // Subwoofer Elevated Rubber Isolation Feet
      [-0.28, 0.28].forEach((x) => {
        [-0.28, 0.28].forEach((z) => {
          const footGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 16);
          const foot = new THREE.Mesh(footGeo, portMat);
          foot.position.set(x, -0.42, z);
          sub.add(foot);
        });
      });

      // Controller: Detachable Surrounds
      controllers.setSurroundsDocked = (docked: boolean) => {
        if (docked) {
          leftPod.position.set(-0.99, -0.25, 0);
          rightPod.position.set(0.99, -0.25, 0);
        } else {
          leftPod.position.set(-1.45, 0.1, -0.6);
          rightPod.position.set(-0.25, 0.45, -0.6);
        }
      };

      break;
    }

    // -------------------------------------------------------------------------
    // 5. APPLE IMAC 24" M4 (11.5mm Ultra-Thin with Cantilever Stand)
    // -------------------------------------------------------------------------
    case "imac24": {
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0xd8dde2, // Silver anodized aluminum
        metalness: 0.94,
        roughness: 0.16,
        clearcoat: 0.25,
      });
      const standMat = new THREE.MeshPhysicalMaterial({
        color: 0xcfd4da,
        metalness: 0.95,
        roughness: 0.14,
        clearcoat: 0.2,
      });

      const screenTex = createIMacScreenTexture();
      const screenMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.04,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.38,
      });

      // 11.5mm Razor Thin Screen Chassis
      const screenGeo = new THREE.BoxGeometry(2.2, 1.4, 0.035);
      const screen = new THREE.Mesh(screenGeo, chassisMat);
      screen.position.y = 0.25;
      screen.castShadow = true;
      root.add(screen);

      // Front 4.5K Retina Display with White Border Bezel
      const displayPlaneGeo = new THREE.PlaneGeometry(2.1, 1.15);
      const displayPlane = new THREE.Mesh(displayPlaneGeo, screenMat);
      displayPlane.position.set(0, 0.08, 0.019);
      screen.add(displayPlane);

      // Front Center Stage Camera Dot at top bezel
      const camPinholeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.005, 16);
      const camPinholeMat = new THREE.MeshStandardMaterial({ color: 0x0b0d11 });
      const camPinhole = new THREE.Mesh(camPinholeGeo, camPinholeMat);
      camPinhole.rotation.x = Math.PI / 2;
      camPinhole.position.set(0, 0.67, 0.019);
      screen.add(camPinhole);

      // Front Color Chin
      const chinGeo = new THREE.BoxGeometry(2.1, 0.22, 0.038);
      const chin = new THREE.Mesh(chinGeo, chassisMat);
      chin.position.set(0, -0.58, 0);
      screen.add(chin);

      // Mirror Apple Logo on Back of iMac
      const appleLogoTex = createAppleLogoTexture();
      const appleLogoMat = new THREE.MeshPhysicalMaterial({
        map: appleLogoTex,
        transparent: true,
        metalness: 0.98,
        roughness: 0.05,
        clearcoat: 1.0,
      });
      const appleLogoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), appleLogoMat);
      appleLogoMesh.position.set(0, 0.12, -0.019);
      appleLogoMesh.rotation.y = Math.PI;
      screen.add(appleLogoMesh);

      // Cantilever L-Stand with Cable Pass-Through Hole
      const standPoleGeo = new THREE.BoxGeometry(0.38, 0.72, 0.035);
      const standPole = new THREE.Mesh(standPoleGeo, standMat);
      standPole.position.set(0, -0.72, -0.16);
      standPole.rotation.x = 0.22;
      screen.add(standPole);

      // Circular Cable Hole in stand
      const holeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 24);
      const holeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.rotation.x = Math.PI / 2;
      hole.position.set(0, 0, 0);
      standPole.add(hole);

      const standBaseGeo = new THREE.BoxGeometry(0.72, 0.025, 0.62);
      const standBase = new THREE.Mesh(standBaseGeo, standMat);
      standBase.position.set(0, -1.04, 0);
      screen.add(standBase);

      // Rear Thunderbolt Ports (4 USB-C oval cutouts)
      const portMat = new THREE.MeshStandardMaterial({ color: 0x111317 });
      [-0.12, -0.04, 0.04, 0.12].forEach((x) => {
        const portMesh = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.06, 0.01), portMat);
        portMesh.position.set(0.65 + x, -0.35, -0.019);
        screen.add(portMesh);
      });

      break;
    }

    // -------------------------------------------------------------------------
    // 6. 75" QNED 4K SMART TV (Vivid 4K HDR Panel with webOS 23 Dock)
    // -------------------------------------------------------------------------
    case "tv75": {
      const tvFrameMat = new THREE.MeshPhysicalMaterial({
        color: 0x1c2026,
        metalness: 0.9,
        roughness: 0.22,
        clearcoat: 0.3,
      });

      // Ultra-Slim Main Display Panel
      const tvScreenGeo = new THREE.BoxGeometry(2.6, 1.48, 0.035);
      const tv = new THREE.Mesh(tvScreenGeo, tvFrameMat);
      tv.castShadow = true;
      root.add(tv);

      // Glowing Quantum Dot 4K QNED Screen Face
      const tvTex = createLGTVDisplayTexture();
      const screenFaceGeo = new THREE.PlaneGeometry(2.54, 1.42);
      const screenFace = new THREE.Mesh(
        screenFaceGeo,
        new THREE.MeshPhysicalMaterial({
          map: tvTex,
          emissiveMap: tvTex,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.42,
          roughness: 0.06,
          metalness: 0.08,
          clearcoat: 1.0,
        })
      );
      screenFace.position.z = 0.019;
      tv.add(screenFace);

      // LG Center Chin Logo Tab with White Standby LED
      const lgChinGeo = new THREE.BoxGeometry(0.14, 0.035, 0.04);
      const lgChin = new THREE.Mesh(lgChinGeo, tvFrameMat);
      lgChin.position.set(0, -0.75, 0);
      tv.add(lgChin);

      const ledGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.005, 16);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1.5,
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.rotation.x = Math.PI / 2;
      led.position.set(0, -0.012, 0.021);
      lgChin.add(led);

      // Dual Boomerang Tabletop Stand Feet
      [-0.92, 0.92].forEach((x) => {
        const footGeo = new THREE.BoxGeometry(0.035, 0.16, 0.45);
        const foot = new THREE.Mesh(footGeo, tvFrameMat);
        foot.position.set(x, -0.82, 0);
        tv.add(foot);
      });

      // Rear Electronics Housing Box with VESA pattern
      const rearBoxGeo = new THREE.BoxGeometry(1.6, 0.85, 0.05);
      const rearBoxMat = new THREE.MeshStandardMaterial({
        color: 0x14171d,
        roughness: 0.6,
      });
      const rearBox = new THREE.Mesh(rearBoxGeo, rearBoxMat);
      rearBox.position.set(0, -0.08, -0.042);
      tv.add(rearBox);

      break;
    }

    // -------------------------------------------------------------------------
    // 7. TCL 1.5HP SMART INVERTER AC (High-Gloss Aerofoil with Glowing LED)
    // -------------------------------------------------------------------------
    case "ac15": {
      // High-Gloss Pearl White Chassis
      const acChassisMat = new THREE.MeshPhysicalMaterial({
        color: 0xfcfdfd,
        metalness: 0.1,
        roughness: 0.12,
        clearcoat: 0.95,
        clearcoatRoughness: 0.08,
      });

      // Aerodynamic Curved Unibody
      const acGeo = new THREE.BoxGeometry(2.2, 0.66, 0.38);
      const ac = new THREE.Mesh(acGeo, acChassisMat);
      ac.castShadow = true;
      root.add(ac);

      // Front Fascia with Digital LED 21°C Temperature Readout
      const acTex = createTCLACDisplayTexture();
      const frontPlaneGeo = new THREE.PlaneGeometry(2.18, 0.64);
      const frontPlaneMat = new THREE.MeshPhysicalMaterial({
        map: acTex,
        roughness: 0.08,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: acTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.3,
      });
      const frontPlane = new THREE.Mesh(frontPlaneGeo, frontPlaneMat);
      frontPlane.position.set(0, 0, 0.191);
      ac.add(frontPlane);

      // Motorized Directional Airflow Louver Slot
      const ventGeo = new THREE.BoxGeometry(2.12, 0.12, 0.06);
      const ventMat = new THREE.MeshStandardMaterial({ color: 0x181b22, roughness: 0.4 });
      const vent = new THREE.Mesh(ventGeo, ventMat);
      vent.position.set(0, -0.24, 0.17);
      ac.add(vent);

      // Motorized Airflow Guide Louver Blade
      const louverGeo = new THREE.BoxGeometry(2.08, 0.02, 0.08);
      const louverMat = new THREE.MeshPhysicalMaterial({
        color: 0xf4f6f8,
        metalness: 0.15,
        roughness: 0.15,
      });
      const louver = new THREE.Mesh(louverGeo, louverMat);
      louver.position.set(0, 0, 0.02);
      louver.rotation.x = -0.3; // Open 20-degree cooling airflow angle
      vent.add(louver);

      // Top Air Intake Grille Louvers
      const intakeGeo = new THREE.PlaneGeometry(2.1, 0.28);
      const intakeMat = new THREE.MeshStandardMaterial({
        color: 0x242830,
        roughness: 0.7,
      });
      const intake = new THREE.Mesh(intakeGeo, intakeMat);
      intake.rotation.x = -Math.PI / 2;
      intake.position.set(0, 0.331, 0);
      ac.add(intake);

      break;
    }
  }

  return controllers;
}
