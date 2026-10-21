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
  headlinePrefix: string;
  headlineAccent: string;
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
      headlinePrefix: "Ultra-slim engineering.",
      headlineAccent: "Unfolds infinite possibility.",
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
      headlinePrefix: "Grade 5 Titanium.",
      headlineAccent: "Pro power in your palm.",
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
      headlinePrefix: "Copilot+ PC speed.",
      headlineAccent: "Intelligence that never sleeps.",
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
      headlinePrefix: "True Dolby Atmos 3D.",
      headlineAccent: "Cinema that surrounds you.",
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
      headlinePrefix: "4.5K Retina brilliance.",
      headlineAccent: "Apple M4 in vibrant color.",
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
      headlinePrefix: "Quantum Dot cinema.",
      headlineAccent: "Every single frame alive.",
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
      headlinePrefix: "Smart AI Inverter.",
      headlineAccent: "Pure cool comfort in 30 seconds.",
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
        {/* Main Carousel Hero Card - Gadget Master Signature Theme */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-gradient-to-br from-white via-slate-50 to-[#FFF7EE] dark:from-[#111827] dark:via-[#0F172A] dark:to-[#17120C] shadow-card dark:shadow-cardDark hover:border-[#FF8A00]/30 transition-all duration-300">
          {/* Subtle Dynamic Ambient Glow */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 dark:opacity-20 transition-all duration-700"
            style={{ backgroundColor: activeSlide.accentColor || "#FF8A00" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[560px] lg:min-h-[620px]">
            {/* Left Column: Stable Content & Product Information */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 z-10 flex flex-col justify-between h-full">
              <div>
                {/* Category & Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase orange-gradient-badge shadow-sm">
                    <Sparkles className="w-3 h-3 inline mr-1 text-[#FF8A00]" />
                    {activeSlide.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {activeSlide.category}
                  </span>
                </div>

                {/* Product Title & Subtitle with Gadget Master Electric Orange Accent */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {activeSlide.headlinePrefix}{" "}
                  <span className="text-[#FF8A00] dark:text-[#FFA336]">
                    {activeSlide.headlineAccent}
                  </span>
                </h1>
                <p className="text-sm sm:text-base font-semibold text-[#FF8A00] dark:text-[#FFA336] mt-1">
                  {activeSlide.title} &bull; {activeSlide.subtitle}
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
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 backdrop-blur-sm hover:border-[#FF8A00]/40 transition-colors"
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

                {/* CTAs: Signature Gadget Master Electric Orange Button */}
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
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#FF8A00] hover:bg-[#EA580C] text-white shadow-md hover:shadow-orangeGlow transition-all active:scale-95 cursor-pointer"
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
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-[#FF8A00]"
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
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                title={isPaused ? "Resume Autoplay" : "Pause Autoplay"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00] dark:hover:border-[#FF8A00] shadow-sm transition-all active:scale-95 cursor-pointer"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00] dark:hover:border-[#FF8A00] shadow-sm transition-all active:scale-95 cursor-pointer"
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

// Procedural High-Dynamic-Range Studio Lighting Environment Map (Softbox reflections for metals and lenses)
function createStudioEnvironment(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep neutral studio void with gentle horizon gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, "#080b10");
  bgGrad.addColorStop(0.5, "#141a24");
  bgGrad.addColorStop(1, "#05070a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Softbox Light 1 (Main Key Softbox on Left)
  const grad1 = ctx.createLinearGradient(120, 0, 320, 0);
  grad1.addColorStop(0, "rgba(255, 255, 255, 0)");
  grad1.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
  grad1.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad1;
  ctx.fillRect(120, 40, 200, 380);

  // Softbox Light 2 (Right Fill Softbox with subtle warm tint)
  const grad2 = ctx.createLinearGradient(700, 0, 900, 0);
  grad2.addColorStop(0, "rgba(255, 248, 235, 0)");
  grad2.addColorStop(0.5, "rgba(255, 248, 235, 0.92)");
  grad2.addColorStop(1, "rgba(255, 248, 235, 0)");
  ctx.fillStyle = grad2;
  ctx.fillRect(700, 40, 200, 380);

  // Overhead Linear Ceiling Strip Light
  const grad3 = ctx.createLinearGradient(0, 0, 0, 120);
  grad3.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  grad3.addColorStop(0.6, "rgba(255, 255, 255, 0.4)");
  grad3.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = grad3;
  ctx.fillRect(0, 0, 1024, 120);

  // Horizon Floor Rim Bounce
  const grad4 = ctx.createLinearGradient(0, 400, 0, 512);
  grad4.addColorStop(0, "rgba(255, 138, 0, 0)");
  grad4.addColorStop(1, "rgba(255, 138, 0, 0.18)"); // Gadget Master warm orange horizon reflection
  ctx.fillStyle = grad4;
  ctx.fillRect(0, 400, 1024, 112);

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

      // AUTOMATIC BOUNDING-BOX NORMALIZATION & ELEVATED ZERO-GRAVITY HOVERING:
      // Suspends the CAD model higher above the showroom turntable disc,
      // creating an elevated, floating showcase with the illuminated halo ring rotating below.
      modelRoot.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(modelRoot);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const targetScale = 1.95 / (maxDim || 1);

      uniformWrapper = new THREE.Group();
      // Center horizontally on (X, Z) and ground vertically with an elevated floating hover
      modelRoot.position.set(-center.x, -box.min.y, -center.z);
      uniformWrapper.scale.setScalar(targetScale);
      
      // Floats gracefully ~30cm above the turntable surface (-1.08)
      const FLOAT_ELEVATION_Y = -0.74;
      uniformWrapper.position.set(0, FLOAT_ELEVATION_Y, 0);
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

          uniformWrapper.position.y = -0.74 + Math.sin(Date.now() * 0.0016) * 0.028;

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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
            <button
              type="button"
              onClick={handleFocusMacroOptics}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FF8A00] hover:text-white transition-all cursor-pointer"
              title="Zoom to sapphire camera optics"
            >
              Optics
            </button>
            <button
              type="button"
              onClick={handleFocusHingeOrProfile}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-[#FF8A00] hover:text-white transition-all cursor-pointer"
              title="Zoom to hinge and profile"
            >
              Hinge
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
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
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer ${
                    isAutoSpinning
                      ? "bg-[#FF8A00] text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00]/50"
                  }`}
                  title="360 Continuous Auto-Spin"
                >
                  <RotateCw className={`w-3 h-3 ${isAutoSpinning ? "animate-spin" : "text-[#FF8A00]"}`} />
                  <span>{isAutoSpinning ? "Pause 360°" : "Auto 360°"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(35)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00]/50 transition-all shadow-sm cursor-pointer"
                >
                  Hero 45°
                </button>
                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(0)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00]/50 transition-all shadow-sm cursor-pointer"
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(90)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00]/50 transition-all shadow-sm cursor-pointer"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => resetAngleRef.current?.(180)}
                  className="px-2 py-1 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-[#FF8A00]/50 transition-all shadow-sm cursor-pointer"
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
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                    className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                    className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                    className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                    className={`px-2.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  activeHotspotId === hs.id
                    ? "bg-[#FF8A00] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-[#FF8A00]"
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
                    className="text-[10px] font-bold text-[#FF8A00] hover:underline shrink-0 cursor-pointer"
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

  // Pure AMOLED Deep Black Base
  ctx.fillStyle = "#020306";
  ctx.fillRect(0, 0, 1024, 1024);

  // AUTHENTIC GALAXY Z FOLD6 ORIGAMI BUTTERFLY WINGS WALLPAPER (From Reference Photo)
  ctx.save();
  // Left Wing: Golden Amber Core fanning into Radiant Sapphire Blue
  const leftGrad = ctx.createRadialGradient(480, 512, 20, 320, 480, 420);
  leftGrad.addColorStop(0, "rgba(251, 191, 36, 1.0)"); // Radiant Golden Amber
  leftGrad.addColorStop(0.22, "rgba(245, 158, 11, 0.95)"); // Deep Gold
  leftGrad.addColorStop(0.48, "rgba(37, 99, 235, 0.9)"); // Cobalt Blue
  leftGrad.addColorStop(0.72, "rgba(30, 58, 138, 0.7)"); // Sapphire
  leftGrad.addColorStop(1, "rgba(2, 6, 23, 0)");

  ctx.beginPath();
  ctx.moveTo(512, 512);
  ctx.bezierCurveTo(440, 240, 220, 180, 140, 320);
  ctx.bezierCurveTo(80, 460, 220, 720, 512, 512);
  ctx.fillStyle = leftGrad;
  ctx.fill();

  // Right Wing: Mirror Silk Folds with Glowing Iridescent Violet & Electric Blue
  const rightGrad = ctx.createRadialGradient(544, 512, 20, 700, 480, 420);
  rightGrad.addColorStop(0, "rgba(251, 191, 36, 0.9)"); // Warm Amber Accent
  rightGrad.addColorStop(0.25, "rgba(124, 58, 237, 0.85)"); // Vibrant Violet
  rightGrad.addColorStop(0.55, "rgba(59, 130, 246, 0.85)"); // Electric Cyan/Blue
  rightGrad.addColorStop(0.80, "rgba(29, 78, 216, 0.65)"); // Deep Blue
  rightGrad.addColorStop(1, "rgba(2, 6, 23, 0)");

  ctx.beginPath();
  ctx.moveTo(512, 512);
  ctx.bezierCurveTo(584, 240, 804, 180, 884, 320);
  ctx.bezierCurveTo(944, 460, 804, 720, 512, 512);
  ctx.fillStyle = rightGrad;
  ctx.fill();

  // Core Iridescent Fold Highlight
  const coreGrad = ctx.createRadialGradient(512, 512, 10, 512, 512, 240);
  coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  coreGrad.addColorStop(0.2, "rgba(254, 240, 138, 0.85)");
  coreGrad.addColorStop(0.5, "rgba(96, 165, 250, 0.5)");
  coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(512, 512, 240, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Subtle Center Hinge Crease Shadow & Reflection
  const creaseGrad = ctx.createLinearGradient(506, 0, 518, 0);
  creaseGrad.addColorStop(0, "rgba(0, 0, 0, 0.35)");
  creaseGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.12)");
  creaseGrad.addColorStop(1, "rgba(0, 0, 0, 0.35)");
  ctx.fillStyle = creaseGrad;
  ctx.fillRect(506, 0, 12, 1024);

  // Top Status Bar (Matching reference photo: 10:09 left, 72% battery right)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("10:09", 48, 48);

  ctx.textAlign = "right";
  ctx.fillText("72%", 976, 48);
  // Battery outline
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(912, 32, 24, 14);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(914, 34, 16, 10);

  // Authentic One UI 6 App Dock at Bottom (6 Icons exactly from reference photo)
  // 1: Phone (green), 2: Messages (blue/white), 3: Chrome (multi), 4: Notes (orange), 5: Gallery (pink flower), 6: Camera (red/magenta)
  const dockIcons = [
    { bg: "#22c55e", glyph: "📞" },
    { bg: "#3b82f6", glyph: "💬" },
    { bg: "#ea580c", glyph: "🌐" },
    { bg: "#f59e0b", glyph: "📝" },
    { bg: "#ec4899", glyph: "🌸" },
    { bg: "#ef4444", glyph: "📷" },
  ];
  const dockStartX = 256;
  const iconSize = 72;
  const iconSpacing = 88;

  dockIcons.forEach((icon, i) => {
    const x = dockStartX + i * iconSpacing;
    const y = 880;
    ctx.beginPath();
    ctx.roundRect(x, y, iconSize, iconSize, 22);
    ctx.fillStyle = icon.bg;
    ctx.fill();

    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(icon.glyph, x + iconSize / 2, y + iconSize / 2);
  });

  // Samsung 3-Button Navigation Bar at very bottom (||| , ◻ , <)
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("|||", 420, 995);
  ctx.fillText("◻", 512, 995);
  ctx.fillText("<", 604, 995);

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

  // Deep Navy/Black AMOLED base
  ctx.fillStyle = "#040711";
  ctx.fillRect(0, 0, 512, 1024);

  // AUTHENTIC GALAXY Z FOLD6 COVER WALLPAPER: Giant Glowing Amber/Gold and Blue Numeral "6"
  ctx.save();
  // Sweeping outer blue ribbon
  const ribbonBlue = ctx.createLinearGradient(60, 300, 450, 850);
  ribbonBlue.addColorStop(0, "rgba(59, 130, 246, 0.95)");
  ribbonBlue.addColorStop(0.5, "rgba(37, 99, 235, 0.85)");
  ribbonBlue.addColorStop(1, "rgba(29, 78, 216, 0.4)");

  ctx.beginPath();
  ctx.arc(256, 580, 190, 0, Math.PI * 2);
  ctx.lineWidth = 55;
  ctx.strokeStyle = ribbonBlue;
  ctx.stroke();

  // Curving upward stem of the "6"
  ctx.beginPath();
  ctx.moveTo(110, 520);
  ctx.bezierCurveTo(110, 340, 260, 220, 420, 240);
  ctx.lineWidth = 52;
  ctx.strokeStyle = ribbonBlue;
  ctx.stroke();

  // Glowing Amber/Gold Inner Curve (matching reference photo)
  const ribbonGold = ctx.createLinearGradient(120, 680, 360, 480);
  ribbonGold.addColorStop(0, "rgba(245, 158, 11, 0.95)");
  ribbonGold.addColorStop(0.5, "rgba(251, 191, 36, 0.85)");
  ribbonGold.addColorStop(1, "rgba(59, 130, 246, 0)");

  ctx.beginPath();
  ctx.arc(256, 580, 160, Math.PI * 0.6, Math.PI * 1.5);
  ctx.lineWidth = 36;
  ctx.strokeStyle = ribbonGold;
  ctx.stroke();
  ctx.restore();

  // Top Status Bar (10:09, 72%)
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("72%", 472, 48);

  // Center Digital Clock & Date (Matching reference photo)
  ctx.textAlign = "center";
  ctx.font = "300 78px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("10:09", 256, 340);

  ctx.font = "400 18px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText("Wed, October 17", 256, 380);

  // Notification icons row
  ctx.font = "16px sans-serif";
  ctx.fillText("💬 ✉️ 🌐 ⚙️", 256, 412);

  // Bottom Lockscreen Shortcuts: Phone on left, Camera on right
  ctx.beginPath();
  ctx.arc(64, 940, 26, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fill();
  ctx.font = "24px sans-serif";
  ctx.fillText("📞", 64, 948);

  ctx.beginPath();
  ctx.arc(448, 940, 26, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fill();
  ctx.fillText("📷", 448, 948);

  // Bottom swipe bar
  ctx.beginPath();
  ctx.roundRect(196, 990, 120, 4, 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
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

  // True Desert Titanium Wallpaper: Flowing Champagne & Golden Sand Dunes
  ctx.fillStyle = "#0b0a08";
  ctx.fillRect(0, 0, 512, 1024);

  // Nested ambient golden curves
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 1024);
  bgGrad.addColorStop(0, "#2c2317");
  bgGrad.addColorStop(0.4, "#634e32");
  bgGrad.addColorStop(0.7, "#9c7c50");
  bgGrad.addColorStop(1, "#18140e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 1024);

  // Flowing Dune Arch 1 (Upper)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(256, 380, 220, 310, Math.PI / 8, 0, Math.PI * 2);
  const arch1Grad = ctx.createLinearGradient(120, 200, 400, 550);
  arch1Grad.addColorStop(0, "rgba(240, 215, 175, 0.85)");
  arch1Grad.addColorStop(0.5, "rgba(180, 140, 95, 0.65)");
  arch1Grad.addColorStop(1, "rgba(35, 25, 15, 0)");
  ctx.fillStyle = arch1Grad;
  ctx.fill();

  // Flowing Dune Arch 2 (Lower)
  ctx.beginPath();
  ctx.ellipse(280, 720, 260, 240, -Math.PI / 6, 0, Math.PI * 2);
  const arch2Grad = ctx.createLinearGradient(150, 600, 420, 850);
  arch2Grad.addColorStop(0, "rgba(250, 230, 195, 0.9)");
  arch2Grad.addColorStop(0.5, "rgba(160, 120, 75, 0.7)");
  arch2Grad.addColorStop(1, "rgba(15, 10, 5, 0)");
  ctx.fillStyle = arch2Grad;
  ctx.fill();
  ctx.restore();

  // Dynamic Island Pill at Top (with Apple Music icon & Live Waveform)
  ctx.beginPath();
  ctx.roundRect(172, 34, 168, 38, 19);
  ctx.fillStyle = "#000000";
  ctx.fill();

  // Red Music App Square inside Dynamic Island
  ctx.beginPath();
  ctx.roundRect(180, 42, 22, 22, 6);
  ctx.fillStyle = "#fa2d48";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("♫", 191, 58);

  // Green Audio Spectrum Waveform
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(302, 46, 3, 14);
  ctx.fillRect(308, 41, 3, 24);
  ctx.fillRect(314, 48, 3, 10);
  ctx.fillRect(320, 43, 3, 20);

  // Status Bar
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("10:09", 48, 58);
  ctx.textAlign = "right";
  ctx.fillText("5G 100%", 464, 58);

  // iOS Home Bar at Bottom
  ctx.beginPath();
  ctx.roundRect(176, 990, 160, 5, 2.5);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
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

  // AUTHENTIC WINDOWS 11 COPILOT+ MOUNTAIN LAKE WALLPAPER (From Reference Photo)
  // Radiant Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
  skyGrad.addColorStop(0, "#3a86c8");
  skyGrad.addColorStop(0.5, "#7eb4e2");
  skyGrad.addColorStop(0.85, "#cde4f7");
  skyGrad.addColorStop(1, "#f0f7fd");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 420);

  // Distant Snow-Capped Mountain Ridge (Matching reference photo)
  ctx.fillStyle = "#335574";
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.lineTo(80, 360);
  ctx.lineTo(190, 310);
  ctx.lineTo(310, 380);
  ctx.lineTo(460, 260);
  ctx.lineTo(580, 340);
  ctx.lineTo(720, 280);
  ctx.lineTo(880, 390);
  ctx.lineTo(1024, 320);
  ctx.lineTo(1024, 420);
  ctx.closePath();
  ctx.fill();

  // White Snow Caps on Mountain Peaks
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.moveTo(190, 310);
  ctx.lineTo(210, 335);
  ctx.lineTo(170, 335);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(460, 260);
  ctx.lineTo(495, 305);
  ctx.lineTo(430, 305);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(720, 280);
  ctx.lineTo(755, 325);
  ctx.lineTo(690, 325);
  ctx.closePath();
  ctx.fill();

  // Pristine Turquoise Mountain Lake Reflection
  const lakeGrad = ctx.createLinearGradient(0, 420, 0, 680);
  lakeGrad.addColorStop(0, "#10689b");
  lakeGrad.addColorStop(0.4, "#198bb4");
  lakeGrad.addColorStop(0.7, "#2aa8c8");
  lakeGrad.addColorStop(1, "#4ac4dc");
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, 420, 1024, 260);

  // Grassy Shoreline on Lower Right (Matching photo)
  ctx.fillStyle = "#4d7c0f";
  ctx.beginPath();
  ctx.moveTo(680, 520);
  ctx.bezierCurveTo(780, 480, 920, 500, 1024, 480);
  ctx.lineTo(1024, 630);
  ctx.lineTo(680, 630);
  ctx.closePath();
  ctx.fill();

  // Desktop Icons on Upper Left (Recycle Bin, Microsoft Edge)
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.font = "24px sans-serif";
  ctx.fillText("🗑️", 36, 52);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Recycle Bin", 24, 72);

  ctx.font = "24px sans-serif";
  ctx.fillText("🌐", 36, 112);
  ctx.font = "11px system-ui, sans-serif";
  ctx.fillText("Microsoft Edge", 18, 132);

  // Centered Floating Acrylic Windows 11 Start Menu Window
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;

  ctx.beginPath();
  ctx.roundRect(324, 210, 376, 390, 18);
  ctx.fillStyle = "rgba(244, 248, 252, 0.94)";
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Start Menu Search Bar ("Type here to search")
  ctx.beginPath();
  ctx.roundRect(344, 228, 336, 36, 18);
  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
  ctx.fill();
  ctx.strokeStyle = "rgba(100, 116, 139, 0.2)";
  ctx.stroke();

  ctx.fillStyle = "#64748b";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("🔍  Type here to search...", 364, 251);

  // "Pinned" Header
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillText("Pinned", 348, 286);
  ctx.fillStyle = "#0284c7";
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("All apps >", 670, 286);

  // Microsoft 365 Pinned App Grid (Edge, Word, Excel, PowerPoint, Mail, Settings, Xbox, Store)
  const officeApps = [
    { name: "Edge", icon: "🌐", bg: "#0284c7" },
    { name: "Word", icon: "📄", bg: "#2563eb" },
    { name: "Excel", icon: "📊", bg: "#16a34a" },
    { name: "PowerPoint", icon: "📈", bg: "#ea580c" },
    { name: "Mail", icon: "✉️", bg: "#0284c7" },
    { name: "Settings", icon: "⚙️", bg: "#475569" },
    { name: "Xbox", icon: "🎮", bg: "#16a34a" },
    { name: "Store", icon: "🛍️", bg: "#0284c7" },
  ];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const x = 352 + c * 82;
      const y = 300 + r * 60;
      ctx.beginPath();
      ctx.roundRect(x, y, 36, 36, 9);
      ctx.fillStyle = officeApps[idx].bg;
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(officeApps[idx].icon, x + 18, y + 24);

      ctx.fillStyle = "#334155";
      ctx.font = "10px system-ui, sans-serif";
      ctx.fillText(officeApps[idx].name, x + 18, y + 49);
    }
  }

  // "Recommended" Section
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Recommended", 348, 442);

  const recFiles = ["Gadget Master Accra.docx", "Surface Laptop 7 Specs.xlsx"];
  recFiles.forEach((file, fi) => {
    ctx.fillStyle = "#64748b";
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText("📁  " + file, 352, 468 + fi * 22);
  });

  // Windows 11 Centered Taskbar at Bottom
  ctx.fillStyle = "rgba(240, 245, 252, 0.90)";
  ctx.fillRect(0, 626, 1024, 54);
  ctx.strokeStyle = "rgba(226, 232, 240, 0.8)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 626, 1024, 1);

  // Centered Taskbar Icons (Windows logo, Search, Copilot, Task View, Explorer, Edge, Store)
  const taskbarIcons = ["⊞", "🔍", "AI", "📁", "🌐", "🛍️"];
  const tbStartX = 412;
  taskbarIcons.forEach((icon, i) => {
    const x = tbStartX + i * 36;
    ctx.beginPath();
    ctx.roundRect(x, 634, 32, 32, 8);
    ctx.fillStyle = i === 2 ? "#0284c7" : "rgba(100, 116, 139, 0.12)";
    ctx.fill();

    ctx.fillStyle = i === 2 ? "#ffffff" : "#1e293b";
    ctx.font = "bold 13px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(icon, x + 16, 655);
  });

  // System Tray at Bottom Right: Wi-Fi, Sound, Battery, 9:36 AM
  ctx.fillStyle = "#475569";
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("📶 🔊 🔋  9:36 AM", 1000, 656);

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

  // macOS Sonoma / Sequoia Rolling Hills Wallpaper (Emerald Green & Teal Curves)
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, "#0284c7");
  grad.addColorStop(0.35, "#0d9488");
  grad.addColorStop(0.7, "#16a34a");
  grad.addColorStop(1, "#064e3b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Flowing Top Light Crest
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(512, 180, 520, 260, 0, 0, Math.PI * 2);
  const crest = ctx.createRadialGradient(512, 180, 30, 512, 180, 480);
  crest.addColorStop(0, "rgba(56, 189, 248, 0.75)");
  crest.addColorStop(0.5, "rgba(45, 212, 191, 0.5)");
  crest.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = crest;
  ctx.fill();
  ctx.restore();

  // Top macOS Menu Bar
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(0, 0, 1024, 28);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("  Finder  File  Edit  View  Go  Window  Help", 20, 19);

  // Floating Glass App Dock at Bottom
  ctx.beginPath();
  ctx.roundRect(292, 574, 440, 56, 18);
  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const dockColors = ["#38bdf8", "#10b981", "#6366f1", "#ec4899", "#f59e0b", "#ef4444", "#8b5cf6"];
  for (let i = 0; i < 7; i++) {
    const x = 312 + i * 60;
    ctx.beginPath();
    ctx.roundRect(x, 582, 40, 40, 10);
    ctx.fillStyle = dockColors[i];
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLGTVDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Breathtaking 4K HDR Vivid Fjord Landscape (as seen on official LG demo screen)
  // Sky Gradient: Golden sunrise to azure blue
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 360);
  skyGrad.addColorStop(0, "#1e3a8a");
  skyGrad.addColorStop(0.4, "#38bdf8");
  skyGrad.addColorStop(0.7, "#fed7aa");
  skyGrad.addColorStop(1, "#fdba74");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 360);

  // Azure Deep Fjord Water
  const waterGrad = ctx.createLinearGradient(0, 360, 0, 576);
  waterGrad.addColorStop(0, "#0284c7");
  waterGrad.addColorStop(0.5, "#0369a1");
  waterGrad.addColorStop(1, "#082f49");
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, 360, 1024, 216);

  // Dramatic Sunlit Mountain Ridge
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.moveTo(0, 360);
  ctx.lineTo(160, 210);
  ctx.lineTo(340, 310);
  ctx.lineTo(520, 170);
  ctx.lineTo(740, 300);
  ctx.lineTo(890, 220);
  ctx.lineTo(1024, 290);
  ctx.lineTo(1024, 360);
  ctx.closePath();
  ctx.fill();

  // Emerald Green Foreground Fjord Peninsula
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.moveTo(0, 576);
  ctx.lineTo(0, 460);
  ctx.lineTo(240, 410);
  ctx.lineTo(460, 480);
  ctx.lineTo(720, 430);
  ctx.lineTo(1024, 510);
  ctx.lineTo(1024, 576);
  ctx.closePath();
  ctx.fill();

  // Subtle webOS Bottom Navigation Bar
  ctx.beginPath();
  ctx.roundRect(142, 490, 740, 60, 18);
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.fill();

  const tvAppNames = ["Home", "Live TV", "Netflix", "Prime", "Disney+", "YouTube", "Apple TV"];
  const tvAppColors = ["#ff8a00", "#3b82f6", "#e50914", "#00a8e1", "#113ccf", "#ff0000", "#000000"];
  for (let i = 0; i < 7; i++) {
    const x = 168 + i * 102;
    ctx.beginPath();
    ctx.roundRect(x, 498, 82, 44, 12);
    ctx.fillStyle = tvAppColors[i];
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(tvAppNames[i], x + 41, 525);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createTCLACDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pure High-Gloss Enamel White
  ctx.fillStyle = "#fcfdfd";
  ctx.fillRect(0, 0, 1024, 300);

  // Soft Horizon Specular Curve
  const specGrad = ctx.createLinearGradient(0, 0, 0, 120);
  specGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  specGrad.addColorStop(1, "rgba(240, 244, 248, 0.1)");
  ctx.fillStyle = specGrad;
  ctx.fillRect(0, 0, 1024, 120);

  // Centered TCL Brand Logo
  ctx.fillStyle = "#1e293b";
  ctx.font = "900 48px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TCL", 512, 138);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SMART INVERTER • 1.5HP", 512, 172);

  // Right Side: Glowing Ice-White 7-Segment Digital LED Readout "21°C"
  ctx.fillStyle = "rgba(14, 165, 233, 0.95)";
  ctx.font = "bold 64px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("21°C", 880, 155);

  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("🍃 ECO COOL", 880, 185);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}


function createSamsungSpineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Brushed satin metallic spine background
  const grad = ctx.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, "#7a889b");
  grad.addColorStop(0.3, "#94a3b8");
  grad.addColorStop(0.5, "#cbd5e1");
  grad.addColorStop(0.7, "#94a3b8");
  grad.addColorStop(1, "#64748b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);

  // Vertical laser-etched SAMSUNG logo
  ctx.save();
  ctx.translate(64, 256);
  ctx.rotate(-Math.PI / 2);
  ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#334155";
  ctx.fillText("S A M S U N G", 0, 0);
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("S A M S U N G", 0, 1);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function createAppleLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 256, 256);

  // Mirrored chrome Apple silhouette
  ctx.fillStyle = "#ffffff";
  
  // Apple leaf
  ctx.beginPath();
  ctx.moveTo(136, 44);
  ctx.bezierCurveTo(154, 44, 168, 62, 164, 82);
  ctx.bezierCurveTo(146, 82, 132, 64, 136, 44);
  ctx.fill();

  // Apple body
  ctx.beginPath();
  ctx.arc(104, 150, 48, 0, Math.PI * 2);
  ctx.arc(152, 150, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(104, 126, 44, 0, Math.PI * 2);
  ctx.arc(152, 126, 44, 0, Math.PI * 2);
  ctx.fill();

  // Bite cutout on right
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(188, 138, 30, 0, Math.PI * 2);
  ctx.fill();

  // Top notch cutout
  ctx.beginPath();
  ctx.arc(128, 86, 14, 0, Math.PI * 2);
  ctx.fill();

  // Bottom indent cutout
  ctx.beginPath();
  ctx.arc(128, 198, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function createJblDisplayTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Smoked acrylic display face
  ctx.fillStyle = "#0b0e14";
  ctx.fillRect(0, 0, 512, 128);

  // Digital LED dot-matrix readout
  ctx.font = "bold 38px 'SF Mono', 'Courier New', monospace";
  ctx.fillStyle = "#ff8a00";
  ctx.shadowColor = "#ff8a00";
  ctx.shadowBlur = 12;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("DOLBY ATMOS", 256, 48);

  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.fillStyle = "#38bdf8";
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 8;
  ctx.fillText("720W TOTAL  •  WIRELESS SUB  •  DETACHABLE REARS", 256, 94);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

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


function createPhoneShowroomStand(accentHex: string): THREE.Group {
  const standGroup = new THREE.Group();

  // 1. Precision Machined Circular Base Plinth resting on turntable
  const baseGeo = new THREE.CylinderGeometry(0.36, 0.40, 0.024, 32);
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x181c22,
    metalness: 0.94,
    roughness: 0.20,
    clearcoat: 0.6,
  });
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.y = 0.012;
  baseMesh.castShadow = true;
  standGroup.add(baseMesh);

  // Concentric LED Halo Groove on Plinth
  const ringGeo = new THREE.TorusGeometry(0.32, 0.005, 16, 48);
  const ringMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentHex),
    emissive: new THREE.Color(accentHex),
    emissiveIntensity: 0.8,
    metalness: 0.8,
    roughness: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.025;
  standGroup.add(ring);

  // 2. Slender Angled Satin Titanium Support Stem
  const stemGeo = new THREE.CylinderGeometry(0.028, 0.034, 0.62, 24);
  const stemMat = new THREE.MeshPhysicalMaterial({
    color: 0x272d37,
    metalness: 0.95,
    roughness: 0.16,
    clearcoat: 0.5,
  });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.31, -0.06);
  stem.rotation.x = 0.22; // ~12.5 deg lean
  standGroup.add(stem);

  // 3. Magnetic Showroom Mounting Cradle Puck
  const puckGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.022, 32);
  const puckMat = new THREE.MeshPhysicalMaterial({
    color: 0x1f242c,
    metalness: 0.88,
    roughness: 0.3,
  });
  const puck = new THREE.Mesh(puckGeo, puckMat);
  puck.position.set(0, 0.60, -0.13);
  puck.rotation.x = 0.22 + Math.PI / 2;
  standGroup.add(puck);

  const padGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.004, 32);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x0c0f14,
    roughness: 0.95,
  });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.y = 0.012;
  puck.add(pad);

  return standGroup;
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
      // Silver Shadow Armor Aluminum Material (Matching authentic reference photo)
      const armorAluminumMat = new THREE.MeshPhysicalMaterial({
        color: 0xc4cdd6, // Satin Silver Shadow
        metalness: 0.94,
        roughness: 0.18,
        clearcoat: 0.45,
        clearcoatRoughness: 0.12,
      });

      // Frosted Silk Matte Glass Rear Panel Material
      const frostedGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xd6dde4,
        metalness: 0.20,
        roughness: 0.32,
        clearcoat: 0.55,
        clearcoatRoughness: 0.15,
      });

      // Polished Bright Aluminum Camera Bezel Rings
      const camRingMat = new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        metalness: 0.96,
        roughness: 0.10,
        clearcoat: 0.8,
      });

      // Deep Sapphire Optical Camera Glass with Anti-Reflective Sheen
      const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x02050e,
        metalness: 0.98,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        reflectivity: 0.98,
      });

      // Stepped Dark Titanium Lens Barrel & Port Cavity Material
      const darkInteriorMat = new THREE.MeshStandardMaterial({
        color: 0x090b10,
        roughness: 0.92,
      });

      // Antenna Isolation Polymer Bands (Grey lines on frame)
      const antennaMat = new THREE.MeshStandardMaterial({
        color: 0x6e7784,
        roughness: 0.75,
      });

      // Emissive Fold 6 Displays
      const innerScreenTex = createFold6InnerScreenTexture();
      const innerScreenMat = new THREE.MeshPhysicalMaterial({
        map: innerScreenTex,
        roughness: 0.03,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: innerScreenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.42,
      });

      const coverScreenTex = createFold6CoverScreenTexture();
      const coverScreenMat = new THREE.MeshPhysicalMaterial({
        map: coverScreenTex,
        roughness: 0.03,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: coverScreenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.42,
      });

      // Phone Root Group (Positioned in Flex Mode standing on turntable at y = 0)
      const phoneRoot = new THREE.Group();
      phoneRoot.position.set(0, 0.88, 0);
      root.add(phoneRoot);

      // FOLD 6 SIGNATURE CRISP BOX-CUT CORNERS (Micro corner radius = 0.008)
      // Width = 0.76 (per wing), Height = 1.76, Corner Radius = 0.008
      const wingShape = createRoundedRectShape(0.76, 1.76, 0.008);

      // Wing Extrusion: Depth = 0.022, bevel = 0.003 -> Total thickness = 0.028 (5.6mm ultra-thin)
      const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.003,
        bevelThickness: 0.003,
      });
      wingGeo.center();

      // Dual-Rail Flex Hinge Spine at Center Junction (x = 0)
      const spineTex = createSamsungSpineTexture();
      const spineMat = new THREE.MeshPhysicalMaterial({
        map: spineTex,
        color: 0xffffff,
        metalness: 0.95,
        roughness: 0.16,
        clearcoat: 0.5,
      });
      // Flat-backed architectural hinge cylinder matching reference photo
      const hingeMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 1.76, 32),
        spineMat
      );
      hingeMesh.position.set(0, 0, -0.014);
      hingeMesh.castShadow = true;
      phoneRoot.add(hingeMesh);

      // Top and Bottom Flush Hinge End Caps
      [-0.88, 0.88].forEach((yPos) => {
        const cap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.018, 0.018, 0.012, 32),
          armorAluminumMat
        );
        cap.position.set(0, yPos, -0.014);
        phoneRoot.add(cap);
      });

      // -----------------------------------------------------------------------
      // LEFT WING (Pivots at x = 0; Holds Left Inner Screen + Rear Triple Camera)
      // -----------------------------------------------------------------------
      const leftWing = new THREE.Group();
      phoneRoot.add(leftWing);

      const leftSlab = new THREE.Mesh(wingGeo, armorAluminumMat);
      leftSlab.position.set(-0.38, 0, 0);
      leftSlab.castShadow = true;
      leftWing.add(leftSlab);

      // Antenna Bands on Left Frame (Thin grey polymer isolation cuts)
      [-0.22, -0.62].forEach((xPos) => {
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.020, 0.030), antennaMat);
        band.position.set(xPos, 0.882, 0);
        leftWing.add(band);

        const botBand = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.020, 0.030), antennaMat);
        botBand.position.set(xPos, -0.882, 0);
        leftWing.add(botBand);
      });

      // Top & Bottom CNC Speaker Grille Slits on Left Slab
      for (let i = 0; i < 5; i++) {
        const tSlot = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.016), darkInteriorMat);
        tSlot.position.set(-0.48 + i * 0.032, 0.882, 0);
        leftWing.add(tSlot);

        const bSlot = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.016), darkInteriorMat);
        bSlot.position.set(-0.48 + i * 0.032, -0.882, 0);
        leftWing.add(bSlot);
      }

      // Left Half of Inner 7.6" AMOLED Display (UV mapped strictly to left [0.0, 0.5])
      const innerLeftScreenGeo = new THREE.PlaneGeometry(0.75, 1.745);
      const leftUvs = innerLeftScreenGeo.attributes.uv;
      for (let i = 0; i < leftUvs.count; i++) {
        leftUvs.setX(i, leftUvs.getX(i) * 0.5);
      }
      leftUvs.needsUpdate = true;

      const innerLeftScreen = new THREE.Mesh(innerLeftScreenGeo, innerScreenMat);
      innerLeftScreen.position.set(-0.375, 0, 0.0142);
      leftWing.add(innerLeftScreen);

      // Raised Protective Screen Bumper Rim (0.8mm Black TPU Bezel)
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0x14181f, roughness: 0.8 });
      const topBumperL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.010, 0.003), bumperMat);
      topBumperL.position.set(-0.375, 0.875, 0.0146);
      leftWing.add(topBumperL);

      const botBumperL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.010, 0.003), bumperMat);
      botBumperL.position.set(-0.375, -0.875, 0.0146);
      leftWing.add(botBumperL);

      const sideBumperL = new THREE.Mesh(new THREE.BoxGeometry(0.010, 1.75, 0.003), bumperMat);
      sideBumperL.position.set(-0.755, 0, 0.0146);
      leftWing.add(sideBumperL);

      // Rear Frosted Silk Matte Glass Panel on Left Slab (Back Face at z = -0.0142)
      const leftRearGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.745), frostedGlassMat);
      leftRearGlass.position.set(-0.38, 0, -0.0142);
      leftRearGlass.rotation.y = Math.PI;
      leftWing.add(leftRearGlass);

      // Subtle Laser-Etched "SAMSUNG" Logo at Lower Rear Back
      const rearLogo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.24, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x8a94a2, roughness: 0.4 })
      );
      rearLogo.position.set(-0.38, -0.62, -0.0145);
      rearLogo.rotation.y = Math.PI;
      leftWing.add(rearLogo);

      // -----------------------------------------------------------------------
      // AUTHENTIC FOLD 6 REAR CAMERA ISLAND (From Reference Photo)
      // -----------------------------------------------------------------------
      // Elongated Satin Silver Pill Plateau in Top-Left Corner
      const camPlateauShape = createRoundedRectShape(0.22, 0.74, 0.10);
      const camPlateauGeo = new THREE.ExtrudeGeometry(camPlateauShape, {
        depth: 0.010,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.004,
        bevelThickness: 0.004,
      });
      camPlateauGeo.center();

      const camPlateau = new THREE.Mesh(camPlateauGeo, armorAluminumMat);
      camPlateau.position.set(-0.52, 0.44, -0.0215);
      camPlateau.rotation.y = Math.PI;
      leftWing.add(camPlateau);

      // 3 Giant Raised Beveled Camera Rings Stacked Vertically
      const camYPositions = [0.66, 0.44, 0.22];
      camYPositions.forEach((yPos) => {
        const ringGroup = new THREE.Group();
        ringGroup.position.set(-0.52, yPos, -0.027);
        ringGroup.rotation.x = Math.PI / 2;

        // 1. Outer Polished Silver Aluminum Beveled Ring
        const outerBezel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.065, 0.065, 0.022, 32),
          camRingMat
        );
        ringGroup.add(outerBezel);

        // 2. Stepped Inner Dark Titanium Barrel
        const innerBarrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.054, 0.054, 0.023, 32),
          darkInteriorMat
        );
        ringGroup.add(innerBarrel);

        // 3. Deep Sapphire Optical Glass Lens with Anti-Reflective Coating
        const lensElement = new THREE.Mesh(
          new THREE.CylinderGeometry(0.046, 0.046, 0.024, 32),
          lensGlassMat
        );
        ringGroup.add(lensElement);

        // 4. Concentric Aperture Diaphragm Iris
        const iris = new THREE.Mesh(
          new THREE.RingGeometry(0.018, 0.040, 32),
          new THREE.MeshBasicMaterial({ color: 0x010306, side: THREE.DoubleSide })
        );
        iris.position.y = 0.0125;
        iris.rotation.x = -Math.PI / 2;
        ringGroup.add(iris);

        leftWing.add(ringGroup);
      });

      // True Tone Dual-LED Flash with Concentric Silver Ring (To the right of the top lens)
      const flashRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.006, 24),
        camRingMat
      );
      flashRing.rotation.x = Math.PI / 2;
      flashRing.position.set(-0.36, 0.66, -0.016);
      leftWing.add(flashRing);

      const flashCore = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.007, 16),
        new THREE.MeshStandardMaterial({ color: 0xfff3d6, emissive: 0xffe6a3, emissiveIntensity: 1.2 })
      );
      flashRing.add(flashCore);

      // Rear Studio Microphone Pinhole
      const camMic = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.006, 16),
        darkInteriorMat
      );
      camMic.rotation.x = Math.PI / 2;
      camMic.position.set(-0.36, 0.34, -0.016);
      leftWing.add(camMic);

      // -----------------------------------------------------------------------
      // RIGHT WING (Pivots at x = 0; Holds Right Inner Screen + Outer Cover Display)
      // -----------------------------------------------------------------------
      const rightWing = new THREE.Group();
      phoneRoot.add(rightWing);

      const rightSlab = new THREE.Mesh(wingGeo, armorAluminumMat);
      rightSlab.position.set(0.38, 0, 0);
      rightSlab.castShadow = true;
      rightWing.add(rightSlab);

      // Antenna Bands on Right Frame
      [0.22, 0.62].forEach((xPos) => {
        const band = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.020, 0.030), antennaMat);
        band.position.set(xPos, 0.882, 0);
        rightWing.add(band);

        const botBand = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.020, 0.030), antennaMat);
        botBand.position.set(xPos, -0.882, 0);
        rightWing.add(botBand);
      });

      // Right Half of Inner 7.6" AMOLED Display (UV mapped strictly to right [0.5, 1.0])
      const innerRightScreenGeo = new THREE.PlaneGeometry(0.75, 1.745);
      const rightUvs = innerRightScreenGeo.attributes.uv;
      for (let i = 0; i < rightUvs.count; i++) {
        rightUvs.setX(i, 0.5 + rightUvs.getX(i) * 0.5);
      }
      rightUvs.needsUpdate = true;

      const innerRightScreen = new THREE.Mesh(innerRightScreenGeo, innerScreenMat);
      innerRightScreen.position.set(0.375, 0, 0.0142);
      rightWing.add(innerRightScreen);

      // Under-Display Selfie Camera Aperture on Right Half (Subtle UDC circle)
      const udcDot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.007, 0.007, 0.003, 16),
        new THREE.MeshStandardMaterial({ color: 0x090c12, roughness: 0.6 })
      );
      udcDot.rotation.x = Math.PI / 2;
      udcDot.position.set(0.56, 0.74, 0.0145);
      rightWing.add(udcDot);

      // Protective Bumper Rim on Right Wing
      const topBumperR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.010, 0.003), bumperMat);
      topBumperR.position.set(0.375, 0.875, 0.0146);
      rightWing.add(topBumperR);

      const botBumperR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.010, 0.003), bumperMat);
      botBumperR.position.set(0.375, -0.875, 0.0146);
      rightWing.add(botBumperR);

      const sideBumperR = new THREE.Mesh(new THREE.BoxGeometry(0.010, 1.75, 0.003), bumperMat);
      sideBumperR.position.set(0.755, 0, 0.0146);
      rightWing.add(sideBumperR);

      // Outer 6.3" Dynamic AMOLED Cover Screen on Rear of Right Slab (at z = -0.0142)
      const rightCoverScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.745), coverScreenMat);
      rightCoverScreen.position.set(0.38, 0, -0.0142);
      rightCoverScreen.rotation.y = Math.PI;
      rightWing.add(rightCoverScreen);

      // Cover Screen Punch-Hole Selfie Camera
      const coverPunch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.011, 0.011, 0.005, 16),
        darkInteriorMat
      );
      coverPunch.rotation.x = Math.PI / 2;
      coverPunch.position.set(0.38, 0.74, -0.0146);
      rightWing.add(coverPunch);

      // Top Earpiece Speaker Slit on Cover Glass Edge
      const earpiece = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.005, 0.004),
        darkInteriorMat
      );
      earpiece.position.set(0.38, 0.865, -0.0146);
      rightWing.add(earpiece);

      // Right Frame Controls: Recessed Fingerprint Power Key & Volume Rocker
      const buttonMat = new THREE.MeshPhysicalMaterial({ color: 0x8e9aa8, metalness: 0.95, roughness: 0.15 });

      // Recessed Power / Fingerprint Key Well
      const pwrWell = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.22, 0.016), darkInteriorMat);
      pwrWell.position.set(0.762, 0.15, 0);
      rightWing.add(pwrWell);

      const pwrKey = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.20, 0.014), buttonMat);
      pwrKey.position.set(0.763, 0.15, 0);
      rightWing.add(pwrKey);

      // Raised Volume Rocker
      const volKey = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.26, 0.018), buttonMat);
      volKey.position.set(0.764, 0.46, 0);
      rightWing.add(volKey);

      // SIM Tray Slot on Right Rail
      const simSlot = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.20, 0.008), darkInteriorMat);
      simSlot.position.set(0.762, -0.32, 0);
      rightWing.add(simSlot);

      // Bottom USB-C Port Receptacle & Metallic Tongue
      const usbcHousing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.016, 0.022), darkInteriorMat);
      usbcHousing.position.set(0.38, -0.882, 0);
      rightWing.add(usbcHousing);

      const usbcTongue = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.004, 0.010), armorAluminumMat);
      usbcTongue.position.set(0.38, -0.882, 0);
      rightWing.add(usbcTongue);

      // Primary Microphone Hole at Bottom
      const botMic = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.010, 16), darkInteriorMat);
      botMic.position.set(0.24, -0.882, 0);
      rightWing.add(botMic);

      // Interactive Dynamic Folding Angle Controller
      controllers.setFoldAngle = (deg: number) => {
        const rad = (deg * Math.PI) / 180;
        const foldOffset = (Math.PI - rad) / 2;
        leftWing.rotation.y = foldOffset;
        rightWing.rotation.y = -foldOffset;
      };

      // Default Showcase Hero Angle: Open in majestic Flex Mode (155°)
      controllers.setFoldAngle(155);

      break;
    }

    case "iphone16": {
      // Satin Brushed Grade 5 Titanium Frame Material (Desert Titanium)
      const titaniumMat = new THREE.MeshPhysicalMaterial({
        color: 0x9e9589,
        metalness: 0.94,
        roughness: 0.22,
        clearcoat: 0.35,
        clearcoatRoughness: 0.16,
      });

      // Frosted Matte Glass Back with Silky Sheen
      const rearGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xb5afa5,
        metalness: 0.14,
        roughness: 0.38,
        clearcoat: 0.42,
        clearcoatRoughness: 0.22,
      });

      // Antenna Isolation Polymer Bands
      const antennaMat = new THREE.MeshStandardMaterial({
        color: 0x5e5850,
        roughness: 0.75,
      });

      // Interior Port Cavity Material
      const interiorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        roughness: 0.9,
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

      // Ergonomically Filleted Titanium Perimeter Unibody (77.6mm x 163.0mm true proportions)
      const bodyShape = createRoundedRectShape(0.895, 1.88, 0.12);
      const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.064,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });
      bodyGeo.center();

      const phoneBody = new THREE.Mesh(bodyGeo, titaniumMat);
      phoneBody.castShadow = true;
      root.add(phoneBody);

      // Antenna Isolation Cuts around Titanium Frame
      [-0.460, 0.460].forEach((x) => {
        [0.65, -0.65].forEach((y) => {
          const ant = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.016, 0.068), antennaMat);
          ant.position.set(x, y, 0);
          root.add(ant);
        });
      });

      // Front OLED Glass Screen (Razor-Thin 1.15mm Uniform Borders, Ceramic Shield)
      const frontScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.87, 1.85), screenMat);
      frontScreen.position.z = 0.033;
      root.add(frontScreen);

      // Micro Earpiece Speaker Slit at Top Glass Edge
      const earpiece = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.006, 0.004), interiorMat);
      earpiece.position.set(0, 0.925, 0.0335);
      root.add(earpiece);

      // Rear Frosted Glass Back with Silky Sheen (Back Face at z = -0.033)
      const rearGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.87, 1.85), rearGlassMat);
      rearGlass.position.z = -0.033;
      rearGlass.rotation.y = Math.PI;
      root.add(rearGlass);

      // Mirror Chrome Apple Logo on Rear Back
      const appleLogoTex = createAppleLogoTexture();
      const appleLogoMat = new THREE.MeshPhysicalMaterial({
        map: appleLogoTex,
        transparent: true,
        metalness: 0.98,
        roughness: 0.05,
        clearcoat: 1.0,
      });
      const appleLogoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), appleLogoMat);
      appleLogoMesh.position.set(0, 0.06, -0.0335);
      appleLogoMesh.rotation.y = Math.PI;
      root.add(appleLogoMesh);

      // Sculpted Camera Plateau: Seamless Organic Glass Squircle in Top-Left Quadrant
      // Corrected Proportions: width 0.36, height 0.38, depth 0.016
      const plateauShape = createRoundedRectShape(0.36, 0.38, 0.09);
      const plateauGeo = new THREE.ExtrudeGeometry(plateauShape, {
        depth: 0.016,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      });
      plateauGeo.center();

      const plateau = new THREE.Mesh(plateauGeo, rearGlassMat);
      plateau.position.set(-0.22, 0.58, -0.041);
      plateau.rotation.y = Math.PI;
      root.add(plateau);

      // Plateau outer face is at z = -0.049
      // 3 Pro Optical Sapphire Lens Systems (Protruding cleanly outward)
      const lensRingMat = new THREE.MeshPhysicalMaterial({
        color: 0x6b6660,
        metalness: 0.96,
        roughness: 0.14,
        clearcoat: 0.55,
      });
      const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x050711,
        metalness: 0.96,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 0.98,
      });

      const lensCoords = [
        [-0.29, 0.68],
        [-0.29, 0.48],
        [-0.15, 0.58],
      ];
      lensCoords.forEach(([x, y]) => {
        // Outer knurled titanium bezel ring
        const ringGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.022, 32);
        const ring = new THREE.Mesh(ringGeo, lensRingMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, y, -0.057);

        // Stepped inner dark lens barrel
        const innerRingGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.023, 32);
        const innerRing = new THREE.Mesh(innerRingGeo, interiorMat);
        ring.add(innerRing);

        // Deep sapphire optical lens with AR reflection
        const lensGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.024, 32);
        const lens = new THREE.Mesh(lensGeo, lensGlassMat);
        ring.add(lens);

        // Aperture diaphragm iris
        const irisGeo = new THREE.RingGeometry(0.015, 0.036, 32);
        const irisMat = new THREE.MeshBasicMaterial({ color: 0x020306, side: THREE.DoubleSide });
        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.z = 0.0125;
        ring.add(iris);

        root.add(ring);
      });

      // True Tone Dual-LED Flash
      const flashRing = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.008, 24), lensRingMat);
      flashRing.rotation.x = Math.PI / 2;
      flashRing.position.set(-0.15, 0.70, -0.051);
      const flash = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.009, 24),
        new THREE.MeshStandardMaterial({ color: 0xfff6dd, emissive: 0xffeab3, emissiveIntensity: 0.85 })
      );
      flashRing.add(flash);
      root.add(flashRing);

      // LiDAR Scanner Dark Optical Sensor
      const lidarRing = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.006, 24), lensRingMat);
      lidarRing.rotation.x = Math.PI / 2;
      lidarRing.position.set(-0.15, 0.46, -0.050);
      const lidar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.007, 24),
        new THREE.MeshStandardMaterial({ color: 0x0a0c10, metalness: 0.92, roughness: 0.08 })
      );
      lidarRing.add(lidar);
      root.add(lidarRing);

      // Rear Studio Microphone Pinhole
      const rearMic = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.008, 16), interiorMat);
      rearMic.rotation.x = Math.PI / 2;
      rearMic.position.set(-0.08, 0.54, -0.050);
      root.add(rearMic);

      // Tactile Buttons & Camera Control Button
      const buttonMat = new THREE.MeshPhysicalMaterial({ color: 0x7c756f, metalness: 0.94, roughness: 0.16 });

      // IPHONE 16 CAMERA CONTROL SENSOR: Flush Recessed Sapphire Strip with Titanium Bezel
      const camControlWell = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.20, 0.030), interiorMat);
      camControlWell.position.set(0.448, -0.25, 0);
      root.add(camControlWell);

      const camControlMat = new THREE.MeshPhysicalMaterial({ color: 0x2b323b, metalness: 0.85, roughness: 0.12, clearcoat: 0.9 });
      const camControl = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.18, 0.024), camControlMat);
      camControl.position.set(0.450, -0.25, 0);
      root.add(camControl);

      // Power / Siri Side Button on Right Rail
      const sideKey = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.24, 0.024), buttonMat);
      sideKey.position.set(0.450, 0.35, 0);
      root.add(sideKey);

      // Action Button on Upper Left Rail
      const actionKey = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.10, 0.024), buttonMat);
      actionKey.position.set(-0.450, 0.65, 0);
      root.add(actionKey);

      // Volume Up & Volume Down Buttons on Left Rail
      const volUpKey = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.18, 0.024), buttonMat);
      volUpKey.position.set(-0.450, 0.44, 0);
      root.add(volUpKey);

      const volDnKey = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.18, 0.024), buttonMat);
      volDnKey.position.set(-0.450, 0.21, 0);
      root.add(volDnKey);

      // Bottom USB-C Port Receptacle
      const usbcHousing = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.018, 0.032), interiorMat);
      usbcHousing.position.set(0, -0.942, 0);
      root.add(usbcHousing);

      const usbcTongue = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.004, 0.014), titaniumMat);
      usbcTongue.position.set(0, -0.942, 0);
      root.add(usbcTongue);

      // Bottom Speaker CNC Hole Array
      for (let i = 0; i < 5; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.014, 16), interiorMat);
        hole.position.set(0.12 + i * 0.030, -0.942, 0);
        root.add(hole);
      }

      // Bottom Microphone CNC Hole Array
      for (let i = 0; i < 3; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.014, 16), interiorMat);
        hole.position.set(-0.12 - i * 0.030, -0.942, 0);
        root.add(hole);
      }

      break;
    }

    // -------------------------------------------------------------------------
    // 3. MICROSOFT SURFACE LAPTOP 7 (CNC Aluminum Unibody with Copilot Key)
    // -------------------------------------------------------------------------
    case "surface7": {
      // Platinum Anodized Aircraft Aluminum (Matching authentic reference photo)
      const aluminumMat = new THREE.MeshPhysicalMaterial({
        color: 0xdee3e8, // Satin Platinum Aluminum
        metalness: 0.94,
        roughness: 0.16,
        clearcoat: 0.42,
        clearcoatRoughness: 0.12,
      });

      // Dark Matte PBT Keycap Material (Dark graphite chiclet keys)
      const darkKeyMat = new THREE.MeshStandardMaterial({
        color: 0x181c22,
        metalness: 0.22,
        roughness: 0.65,
      });

      // Precision Haptic Glass Trackpad Material (Silky matte platinum glass)
      const trackpadMat = new THREE.MeshPhysicalMaterial({
        color: 0xc8d0d8,
        metalness: 0.28,
        roughness: 0.12,
        clearcoat: 0.92,
        clearcoatRoughness: 0.08,
      });

      // Dark Cavity / Port Interior Material
      const interiorMat = new THREE.MeshStandardMaterial({
        color: 0x090b10,
        roughness: 0.92,
      });

      // Polished Metallic Contact Material
      const metalPinMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.96,
        roughness: 0.1,
      });

      // Dedicated Glowing Copilot Key Material (Electric Blue)
      const copilotKeyMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.95,
        metalness: 0.3,
        roughness: 0.35,
      });

      const screenTex = createSurfaceScreenTexture();
      const screenMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.03,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.42,
      });

      // 1. Base Assembly (Group positioned at base level, top surface flat at y = 0.0)
      const baseGroup = new THREE.Group();
      root.add(baseGroup);

      // Tapered Aerodynamic CNC Aluminum Base: width 2.12, depth (Z) 1.44, corner radius 0.045
      const baseShape = createRoundedRectShape(2.12, 1.44, 0.045);
      const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
        depth: 0.042,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      });
      baseGeo.center();

      const baseMesh = new THREE.Mesh(baseGeo, aluminumMat);
      baseMesh.rotation.x = Math.PI / 2;
      baseMesh.position.set(0, -0.029, 0); // Flat top surface at exactly y = 0.0
      baseMesh.castShadow = true;
      baseGroup.add(baseMesh);

      // Chamfered Front Lip Thumb Notch (Single-finger lid opener at front z = +0.72)
      const notchGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.016, 24, 1, false, 0, Math.PI);
      const notch = new THREE.Mesh(notchGeo, aluminumMat);
      notch.rotation.z = Math.PI;
      notch.position.set(0, -0.004, 0.72);
      baseGroup.add(notch);

      // Recessed Milled Keyboard Deck Well (recessed into base top at y = 0.001)
      const deckWell = new THREE.Mesh(
        new THREE.BoxGeometry(1.76, 0.004, 0.68),
        new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.85 })
      );
      deckWell.position.set(0, 0.001, -0.20);
      baseGroup.add(deckWell);

      // 6 Full Realistic Rows of Discrete Chiclet Keycaps (Protruding cleanly to y = 0.007)
      const rowConfigs = [
        { z: -0.48, count: 14, depth: 0.062, wRatio: 1.0 },  // Function Row (Esc, F1-F12, Del)
        { z: -0.38, count: 14, depth: 0.078, wRatio: 1.0 },  // Number Row
        { z: -0.28, count: 14, depth: 0.078, wRatio: 1.0 },  // QWERTY Row
        { z: -0.18, count: 13, depth: 0.078, wRatio: 1.08 }, // Home Row
        { z: -0.08, count: 12, depth: 0.078, wRatio: 1.16 }, // Bottom Alpha Row
      ];

      rowConfigs.forEach((row) => {
        const keyWidth = (1.68 / row.count) * 0.92;
        const startX = -0.79 + keyWidth / 2;
        for (let i = 0; i < row.count; i++) {
          const keyGeo = new THREE.BoxGeometry(keyWidth * row.wRatio, 0.009, row.depth * 0.92);
          const key = new THREE.Mesh(keyGeo, darkKeyMat);
          key.position.set(startX + i * (keyWidth * row.wRatio * 1.08), 0.007, row.z);
          baseGroup.add(key);
        }
      });

      // Bottom Row (Spacebar, Modifiers, and Dedicated Copilot Key at z = +0.02)
      const spacebar = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.009, 0.078), darkKeyMat);
      spacebar.position.set(-0.06, 0.007, 0.02);
      baseGroup.add(spacebar);

      // Dedicated Glowing Copilot Key (Between right Alt and arrow cluster)
      const copilotKey = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.009, 0.078), copilotKeyMat);
      copilotKey.position.set(0.32, 0.007, 0.02);
      baseGroup.add(copilotKey);

      // Modifier Keys
      [-0.72, -0.60, -0.48, -0.36, 0.20, 0.44, 0.56, 0.68].forEach((kx) => {
        const modKey = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.009, 0.078), darkKeyMat);
        modKey.position.set(kx, 0.007, 0.02);
        baseGroup.add(modKey);
      });

      // Precision Glass Haptic Trackpad at Front Palm Rest (Centered at z = +0.40)
      const trackpadBorder = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.002, 0.48), interiorMat);
      trackpadBorder.position.set(0, 0.001, 0.40);
      baseGroup.add(trackpadBorder);

      const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.005, 0.46), trackpadMat);
      trackpad.position.set(0, 0.003, 0.40);
      baseGroup.add(trackpad);

      // Left Rail Ports (2x USB-C USB4, 1x USB-A 3.1, 1x 3.5mm jack)
      [-0.30, -0.16].forEach((pz) => {
        const usbc = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.020, 0.072), interiorMat);
        usbc.position.set(-1.062, -0.012, pz);
        baseGroup.add(usbc);

        const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.005, 0.040), metalPinMat);
        tongue.position.set(-1.062, -0.012, pz);
        baseGroup.add(tongue);
      });

      // USB-A 3.1
      const usba = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.022, 0.105), interiorMat);
      usba.position.set(-1.062, -0.012, 0.02);
      baseGroup.add(usba);

      // 3.5mm Audio Jack
      const audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.016, 16), interiorMat);
      audioJack.rotation.z = Math.PI / 2;
      audioJack.position.set(-1.062, -0.012, 0.18);
      baseGroup.add(audioJack);

      // Right Rail: Surface Connect Magnetic Charging Strip
      const surfConnect = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.020, 0.20), interiorMat);
      surfConnect.position.set(1.062, -0.012, -0.20);
      baseGroup.add(surfConnect);

      // 4 Silicone Isolation Feet on Underside
      [-0.85, 0.85].forEach((fx) => {
        [-0.55, 0.55].forEach((fz) => {
          const foot = new THREE.Mesh(
            new THREE.CylinderGeometry(0.032, 0.032, 0.006, 16),
            new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
          );
          foot.position.set(fx, -0.061, fz);
          baseGroup.add(foot);
        });
      });

      // Continuous Piano Friction Hinge Barrel at Rear (y = 0.006, z = -0.71)
      const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 1.94, 32),
        aluminumMat
      );
      hinge.rotation.z = Math.PI / 2;
      hinge.position.set(0, 0.006, -0.71);
      root.add(hinge);

      // Display Lid Assembly (Pivots at Rear Hinge Barrel)
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, 0.006, -0.71);
      root.add(lidGroup);

      // 15" 3:2 PixelSense Flow Display Lid: width 2.12, height 1.44, depth 0.020
      const lidShape = createRoundedRectShape(2.12, 1.44, 0.045);
      const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
        depth: 0.020,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.005,
        bevelThickness: 0.005,
      });
      lidGeo.center();

      const lidMesh = new THREE.Mesh(lidGeo, aluminumMat);
      lidMesh.position.set(0, 0.72, 0);
      lidMesh.castShadow = true;
      lidGroup.add(lidMesh);

      // 3:2 Display Screen Plane on Front Face (z = +0.016)
      const lidScreen = new THREE.Mesh(new THREE.PlaneGeometry(2.04, 1.36), screenMat);
      lidScreen.position.set(0, 0.72, 0.016);
      lidGroup.add(lidScreen);

      // Top Bezel: FHD Studio Camera + Windows Hello IR Sensor + Dual Mics
      const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.004, 16), interiorMat);
      camLens.rotation.x = Math.PI / 2;
      camLens.position.set(0, 1.412, 0.017);
      lidGroup.add(camLens);

      const irSensor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.004, 16),
        new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.2 })
      );
      irSensor.rotation.x = Math.PI / 2;
      irSensor.position.set(0.04, 1.412, 0.017);
      lidGroup.add(irSensor);

      [-0.06, 0.08].forEach((mx) => {
        const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.004, 12), interiorMat);
        mic.rotation.x = Math.PI / 2;
        mic.position.set(mx, 1.412, 0.017);
        lidGroup.add(mic);
      });

      // 4-Square Mirror Chrome Microsoft Logo on Rear Face (z = -0.016)
      const chromeSquareMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.04,
        clearcoat: 1.0,
      });
      const sqSize = 0.075;
      const sqOffset = 0.042;
      [
        [-sqOffset, sqOffset],
        [sqOffset, sqOffset],
        [-sqOffset, -sqOffset],
        [sqOffset, -sqOffset],
      ].forEach(([sx, sy]) => {
        const sq = new THREE.Mesh(new THREE.PlaneGeometry(sqSize, sqSize), chromeSquareMat);
        sq.position.set(sx, 0.72 + sy, -0.016);
        sq.rotation.y = Math.PI;
        lidGroup.add(sq);
      });

      // Interactive Lid Angle Controller
      controllers.setLidAngle = (deg: number) => {
        lidGroup.rotation.x = -((180 - deg) * Math.PI) / 180;
      };
      controllers.setLidAngle(115); // Signature 115° open hero angle

      break;
    }

    case "jbl800": {
      // Acoustic Perforated Micro-Mesh Titanium Grille
      const meshMat = new THREE.MeshPhysicalMaterial({
        color: 0x22262d,
        metalness: 0.88,
        roughness: 0.32,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
      });

      // Heavy MDF Subwoofer Body
      const subMat = new THREE.MeshPhysicalMaterial({
        color: 0x14171a,
        metalness: 0.22,
        roughness: 0.55,
        clearcoat: 0.15,
      });

      // Smoked Gloss Display Window
      const displayTex = createJblDisplayTexture();
      const displayMat = new THREE.MeshPhysicalMaterial({
        map: displayTex,
        roughness: 0.08,
        metalness: 0.1,
        clearcoat: 1.0,
        emissiveMap: displayTex,
        emissive: new THREE.Color(0xff8a00),
        emissiveIntensity: 0.55,
      });

      const darkMat = new THREE.MeshStandardMaterial({ color: 0x07080a, roughness: 0.95 });
      const goldPogoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.98, roughness: 0.08 });

      // Main Soundbar Bar (Racetrack Aerofoil Curved Unibody): width 1.64, height 0.18, depth 0.22
      const mainBarShape = createRoundedRectShape(1.64, 0.18, 0.06);
      const mainBarGeo = new THREE.ExtrudeGeometry(mainBarShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.010,
        bevelThickness: 0.010,
      });
      mainBarGeo.center();

      const mainBar = new THREE.Mesh(mainBarGeo, meshMat);
      mainBar.position.set(-0.25, -0.35, 0.10);
      mainBar.castShadow = true;
      root.add(mainBar);

      // Front face is at z = +0.12. Smoked Glass Pill Front Display
      const displayShape = createRoundedRectShape(0.64, 0.10, 0.035);
      const displayGeo = new THREE.ExtrudeGeometry(displayShape, {
        depth: 0.006,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.003,
        bevelThickness: 0.003,
      });
      displayGeo.center();

      const displayPlane = new THREE.Mesh(displayGeo, displayMat);
      displayPlane.position.set(0, 0, 0.123);
      mainBar.add(displayPlane);

      // Top Control Strip on Main Bar (at y = +0.092)
      const topStrip = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.004, 0.07), new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.8 }));
      topStrip.position.set(0, 0.093, 0);
      mainBar.add(topStrip);

      [-0.12, -0.04, 0.04, 0.12].forEach((bx) => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.006, 16), new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.3 }));
        btn.position.set(bx, 0.096, 0);
        mainBar.add(btn);
      });

      // Dual Top Dolby Atmos Up-Firing Speaker Driver Grilles
      [-0.48, 0.48].forEach((hx) => {
        const heightGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.060, 0.060, 0.004, 24), darkMat);
        heightGrille.position.set(hx, 0.092, 0);
        mainBar.add(heightGrille);
      });

      // Detachable Surround Pods: width 0.30, height 0.18, depth 0.22
      const surroundShape = createRoundedRectShape(0.30, 0.18, 0.06);
      const surroundGeo = new THREE.ExtrudeGeometry(surroundShape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.010,
        bevelThickness: 0.010,
      });
      surroundGeo.center();

      const leftPod = new THREE.Mesh(surroundGeo, meshMat);
      leftPod.position.set(-0.25 - 0.98, -0.35, 0.10);
      leftPod.castShadow = true;
      root.add(leftPod);

      const rightPod = new THREE.Mesh(surroundGeo, meshMat);
      rightPod.position.set(-0.25 + 0.98, -0.35, 0.10);
      rightPod.castShadow = true;
      root.add(rightPod);

      // Gold Pogo Pins on Mating Faces
      [0.03, -0.03].forEach((py) => {
        [-0.04, 0.04].forEach((pz) => {
          const pogoL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.008, 16), goldPogoMat);
          pogoL.rotation.z = Math.PI / 2;
          pogoL.position.set(0.152, py, pz);
          leftPod.add(pogoL);

          const pogoR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.008, 16), goldPogoMat);
          pogoR.rotation.z = Math.PI / 2;
          pogoR.position.set(-0.152, py, pz);
          rightPod.add(pogoR);
        });
      });

      // 10-Inch Wireless Subwoofer Cube (Grounded on pedestal beside soundbar)
      const subShape = createRoundedRectShape(0.66, 0.72, 0.06);
      const subGeo = new THREE.ExtrudeGeometry(subShape, {
        depth: 0.66,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });
      subGeo.center();

      const sub = new THREE.Mesh(subGeo, subMat);
      sub.position.set(1.05, -0.15, -0.15);
      sub.castShadow = true;
      root.add(sub);

      // Down-Firing 10-Inch Driver Cone (at bottom y = -0.36)
      const driverWell = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32), darkMat);
      driverWell.position.set(0, -0.362, 0);
      sub.add(driverWell);

      const surroundRoll = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.020, 16, 32), new THREE.MeshStandardMaterial({ color: 0x1e2228, roughness: 0.85 }));
      surroundRoll.rotation.x = Math.PI / 2;
      surroundRoll.position.set(0, -0.365, 0);
      sub.add(surroundRoll);

      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.04, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x181c22, roughness: 0.7 }));
      cone.position.set(0, -0.360, 0);
      sub.add(cone);

      // 4 Heavy Vibration-Isolation Rubber Feet on Subwoofer Bottom
      [-0.26, 0.26].forEach((x) => {
        [-0.26, 0.26].forEach((z) => {
          const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.05, 20), darkMat);
          foot.position.set(x, -0.385, z);
          sub.add(foot);
        });
      });

      // Rear Bass Reflex Port
      const reflexPort = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.10, 24), darkMat);
      reflexPort.rotation.x = Math.PI / 2;
      reflexPort.position.set(0, 0.15, -0.34);
      sub.add(reflexPort);

      // Rear Amp Plate & Green Pairing LED
      const ampPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.36), new THREE.MeshStandardMaterial({ color: 0x1f242c, metalness: 0.7, roughness: 0.4 }));
      ampPlate.position.set(0, -0.10, -0.332);
      ampPlate.rotation.y = Math.PI;
      sub.add(ampPlate);

      const subLed = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.004, 12), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.9 }));
      subLed.rotation.x = Math.PI / 2;
      subLed.position.set(0.08, -0.22, -0.334);
      sub.add(subLed);

      // Controller: Detachable Surrounds
      controllers.setSurroundsDocked = (docked: boolean) => {
        if (docked) {
          leftPod.position.set(-0.25 - 0.98, -0.35, 0.10);
          rightPod.position.set(-0.25 + 0.98, -0.35, 0.10);
          leftPod.rotation.y = 0;
          rightPod.rotation.y = 0;
        } else {
          leftPod.position.set(-1.35, -0.20, -0.45);
          rightPod.position.set(-0.25, 0.15, -0.55);
          leftPod.rotation.y = 0.35;
          rightPod.rotation.y = -0.35;
        }
      };

      break;
    }

    // -------------------------------------------------------------------------
    // 5. APPLE IMAC 24" M4 (11.5mm Ultra-Thin with Cantilever Stand)
    // -------------------------------------------------------------------------
    case "imac24": {
      // Silver Anodized CNC Aerospace Aluminum
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0xd8dde4,
        metalness: 0.94,
        roughness: 0.15,
        clearcoat: 0.35,
        clearcoatRoughness: 0.12,
      });

      const standMat = new THREE.MeshPhysicalMaterial({
        color: 0xcfd5dc,
        metalness: 0.95,
        roughness: 0.14,
        clearcoat: 0.25,
      });

      const darkInteriorMat = new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.9 });

      const screenTex = createIMacScreenTexture();
      const screenMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.03,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.38,
      });

      // 1. 11.5mm Razor-Thin Screen Chassis: width 2.24, height 1.44, depth 0.022
      const screenShape = createRoundedRectShape(2.24, 1.44, 0.06);
      const screenGeo = new THREE.ExtrudeGeometry(screenShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.006,
        bevelThickness: 0.006,
      });
      screenGeo.center();

      const screen = new THREE.Mesh(screenGeo, chassisMat);
      screen.position.set(0, 0.20, 0);
      screen.castShadow = true;
      root.add(screen);

      // Chassis front face is at z = +0.014. Chassis back is at z = -0.014.

      // 2. Front 4.5K Retina Display Glass with Iconic White Border Bezel
      const displayPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 1.18), screenMat);
      displayPlane.position.set(0, 0.09, 0.015);
      screen.add(displayPlane);

      // 3. Front Color-Matched Satin Aluminum Chin
      const chin = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 0.21), chassisMat);
      chin.position.set(0, -0.58, 0.015);
      screen.add(chin);

      // 4. Center Stage Camera with Green Indicator LED
      const camHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.004, 20), darkInteriorMat);
      camHousing.rotation.x = Math.PI / 2;
      camHousing.position.set(0, 0.695, 0.0155);
      screen.add(camHousing);

      const camLed = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.004, 12), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8 }));
      camLed.rotation.x = Math.PI / 2;
      camLed.position.set(0.025, 0.695, 0.0155);
      screen.add(camLed);

      // 5. Mirror High-Gloss Apple Logo on Rear Face (z = -0.014)
      const appleLogoTex = createAppleLogoTexture();
      const appleLogoMat = new THREE.MeshPhysicalMaterial({
        map: appleLogoTex,
        transparent: true,
        metalness: 0.98,
        roughness: 0.04,
        clearcoat: 1.0,
      });
      const appleLogoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.32), appleLogoMat);
      appleLogoMesh.position.set(0, 0.14, -0.015);
      appleLogoMesh.rotation.y = Math.PI;
      screen.add(appleLogoMesh);

      // 6. Rear I/O: 4x Thunderbolt 4 / USB-C Ports + Magnetic Power Socket
      [-0.14, -0.05, 0.05, 0.14].forEach((px) => {
        const portWell = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.050, 0.006), darkInteriorMat);
        portWell.position.set(0.68 + px, -0.38, -0.015);
        screen.add(portWell);
      });

      // Magnetic Circular MagSafe Power Port
      const pwrRing = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.006, 24), standMat);
      pwrRing.rotation.x = Math.PI / 2;
      pwrRing.position.set(0, -0.22, -0.015);
      screen.add(pwrRing);

      // 7. Cantilevered Forged Aluminum Stand
      const standPole = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.74, 0.034), standMat);
      standPole.position.set(0, -0.48, -0.12);
      standPole.rotation.x = 0.20;
      root.add(standPole);

      // Stand Base Foot resting solidly on pedestal at y = -0.52
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.020, 0.60), standMat);
      standBase.position.set(0, -0.52, 0.16);
      standBase.castShadow = true;
      root.add(standBase);

      break;
    }

    // -------------------------------------------------------------------------
    // 6. 75" QNED 4K SMART TV (Vivid 4K HDR Panel with webOS 23 Dock)
    // -------------------------------------------------------------------------
    case "tv75": {
      // Gunmetal Anodized Aluminum Outer Bezel Trim
      const tvFrameMat = new THREE.MeshPhysicalMaterial({
        color: 0x181c22,
        metalness: 0.92,
        roughness: 0.18,
        clearcoat: 0.4,
      });

      const rearBoxMat = new THREE.MeshStandardMaterial({
        color: 0x101318,
        roughness: 0.65,
        metalness: 0.2,
      });

      const darkCavityMat = new THREE.MeshStandardMaterial({
        color: 0x06070a,
        roughness: 0.95,
      });

      // 1. Cinema Screen 3-Sided Bezel-Less Frame: width 2.62, height 1.50, depth 0.024
      const tvScreenGeo = new THREE.BoxGeometry(2.62, 1.50, 0.024);
      const tv = new THREE.Mesh(tvScreenGeo, tvFrameMat);
      tv.position.set(0, 0.05, 0);
      tv.castShadow = true;
      root.add(tv);

      // 2. Glowing Quantum Dot 4K QNED Screen Face (at z = +0.013)
      const tvTex = createLGTVDisplayTexture();
      const screenFace = new THREE.Mesh(
        new THREE.PlaneGeometry(2.58, 1.46),
        new THREE.MeshPhysicalMaterial({
          map: tvTex,
          emissiveMap: tvTex,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.42,
          roughness: 0.05,
          metalness: 0.06,
          clearcoat: 1.0,
        })
      );
      screenFace.position.z = 0.013;
      tv.add(screenFace);

      // 3. Lower Center LG Brand Island & Standby Micro-LED
      const lgChin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.038, 0.030), tvFrameMat);
      lgChin.position.set(0, -0.756, 0.008);
      tv.add(lgChin);

      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.004, 0.004, 0.006, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.8 })
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(0, -0.012, 0.016);
      lgChin.add(led);

      // 4. Dual Cast-Metal Boomerang Tabletop Stand Feet (grounded at y = -0.76)
      [-0.94, 0.94].forEach((x) => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.12, 0.44), tvFrameMat);
        foot.position.set(x, -0.78, 0);
        tv.add(foot);
      });

      // 5. Rear Electronics Housing Box with Sculpted Heat Louvers & VESA 400x400
      const rearBox = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.88, 0.050), rearBoxMat);
      rearBox.position.set(0, -0.08, -0.038);
      tv.add(rearBox);

      // VESA 400x400 M6 Threaded Bolt Inserts
      const vesaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      [-0.30, 0.30].forEach((vx) => {
        [-0.30, 0.30].forEach((vy) => {
          const boltHole = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.006, 16), vesaMat);
          boltHole.rotation.x = Math.PI / 2;
          boltHole.position.set(vx, vy, -0.026);
          rearBox.add(boltHole);
        });
      });

      // Horizontal Ventilation Louver Slats along Top
      for (let i = 0; i < 6; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.005, 0.006), darkCavityMat);
        louver.position.set(0, 0.34 - i * 0.022, -0.026);
        rearBox.add(louver);
      }

      // Recessed Side HDMI Bay
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.34, 0.14), darkCavityMat);
      bay.position.set(0.855, -0.10, 0);
      rearBox.add(bay);

      break;
    }

    // -------------------------------------------------------------------------
    // 7. TCL 1.5HP SMART INVERTER AC (High-Gloss Aerofoil with Glowing LED)
    // -------------------------------------------------------------------------
    case "ac15": {
      // High-Gloss Pure Pearl White Enamel Chassis
      const acChassisMat = new THREE.MeshPhysicalMaterial({
        color: 0xfcfdfd,
        metalness: 0.08,
        roughness: 0.09,
        clearcoat: 0.98,
        clearcoatRoughness: 0.05,
      });

      const darkCavityMat = new THREE.MeshStandardMaterial({ color: 0x12151c, roughness: 0.85 });
      const chromeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.98, roughness: 0.05, clearcoat: 1.0 });

      // Architectural Showroom Exhibition Pylon (Matte dark charcoal back-panel on turntable)
      const pylonGroup = new THREE.Group();
      root.add(pylonGroup);

      // Heavy Exhibition Base Plinth (rests on turntable at y = 0)
      const plinthMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.30, 0.030, 0.60),
        new THREE.MeshPhysicalMaterial({ color: 0x1c212a, metalness: 0.92, roughness: 0.25 })
      );
      plinthMesh.position.set(0, 0.015, -0.08);
      plinthMesh.castShadow = true;
      pylonGroup.add(plinthMesh);

      // Slim Architectural Exhibition Backboard rising from plinth
      const backboardMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.36, 1.48, 0.040),
        new THREE.MeshStandardMaterial({ color: 0x12161f, roughness: 0.65, metalness: 0.3 })
      );
      backboardMesh.position.set(0, 0.77, -0.22);
      backboardMesh.castShadow = true;
      pylonGroup.add(backboardMesh);

      // Exhibition Plaque Accent Trim
      const plaqueMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1.20, 0.08),
        new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.4 })
      );
      plaqueMesh.position.set(0, 0.14, -0.198);
      pylonGroup.add(plaqueMesh);

      // AC Indoor Unit Mounted on Backboard at y = 0.82
      const acUnit = new THREE.Group();
      acUnit.position.set(0, 0.82, 0);
      root.add(acUnit);

      // Aerodynamic Curved Unibody Chassis: width 2.24, height 0.68, depth 0.34
      const acShape = createRoundedRectShape(2.24, 0.68, 0.12);
      const acGeo = new THREE.ExtrudeGeometry(acShape, {
        depth: 0.34,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });
      acGeo.center();

      const ac = new THREE.Mesh(acGeo, acChassisMat);
      ac.castShadow = true;
      acUnit.add(ac);

      // Front face is at z = +0.182. Back is at z = -0.182.

      // Front Panel Fascia with Digital LED 21°C Readout (Cleanly on front face)
      const acTex = createTCLACDisplayTexture();
      const frontPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(2.20, 0.64),
        new THREE.MeshPhysicalMaterial({
          map: acTex,
          roughness: 0.06,
          metalness: 0.04,
          clearcoat: 1.0,
          emissiveMap: acTex,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.38,
        })
      );
      frontPlane.position.set(0, 0, 0.184);
      acUnit.add(frontPlane);

      // Brushed Chrome Trim Accent Bar along lower fascia
      const chromeStrip = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.008, 0.006), chromeMat);
      chromeStrip.position.set(0, -0.18, 0.185);
      acUnit.add(chromeStrip);

      // Top Air Intake Grille Louvers
      const intakeChamber = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 0.26), darkCavityMat);
      intakeChamber.rotation.x = -Math.PI / 2;
      intakeChamber.position.set(0, 0.342, 0);
      acUnit.add(intakeChamber);

      for (let i = 0; i < 8; i++) {
        const louverBlade = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.006, 0.022), acChassisMat);
        louverBlade.position.set(0, 0.345, -0.11 + i * 0.034);
        acUnit.add(louverBlade);
      }

      // Motorized Directional Airflow Discharge Chute
      const ventChute = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.12, 0.10), darkCavityMat);
      ventChute.position.set(0, -0.26, 0.14);
      acUnit.add(ventChute);

      // Primary Motorized Airflow Guide Louver Blade
      const primaryLouver = new THREE.Mesh(new THREE.BoxGeometry(2.10, 0.018, 0.08), acChassisMat);
      primaryLouver.position.set(0, 0, 0.03);
      primaryLouver.rotation.x = -0.38;
      ventChute.add(primaryLouver);

      // Rear Wall Bracket & Insulated Copper Piping Stub
      const backplate = new THREE.Mesh(
        new THREE.PlaneGeometry(2.18, 0.64),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.35 })
      );
      backplate.position.set(0, 0, -0.183);
      backplate.rotation.y = Math.PI;
      acUnit.add(backplate);

      // Insulated Copper Line Pair
      const suctionPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.14, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 }));
      suctionPipe.position.set(0.85, -0.28, -0.22);
      suctionPipe.rotation.x = 0.5;
      acUnit.add(suctionPipe);

      const drainPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 16), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 }));
      drainPipe.position.set(0.80, -0.30, -0.22);
      drainPipe.rotation.x = 0.6;
      acUnit.add(drainPipe);

      break;
    }
  }

  return controllers;
}
