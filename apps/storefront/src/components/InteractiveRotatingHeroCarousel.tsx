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
        color: 0x98a2ad,
        metalness: 0.94,
        roughness: 0.16,
        clearcoat: 0.35,
        clearcoatRoughness: 0.12,
      });

      // Frosted Silk Glass Rear Material
      const frostedGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xb0b8c2,
        metalness: 0.18,
        roughness: 0.35,
        clearcoat: 0.45,
      });

      // Antenna Band Polymer Material
      const antennaMat = new THREE.MeshStandardMaterial({
        color: 0x5a636e,
        roughness: 0.8,
      });

      // Dark Interior Port & Speaker Slot Material
      const interiorMat = new THREE.MeshStandardMaterial({
        color: 0x0c0e12,
        roughness: 0.9,
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
        clearcoat: 0.5,
      });
      const lensGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x060814,
        metalness: 0.96,
        roughness: 0.02,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        reflectivity: 0.98,
      });

      // Center Polished Hinge Spine with Samsung Laser Engraving & End Caps
      const spineTex = createSamsungSpineTexture();
      const spineMat = new THREE.MeshPhysicalMaterial({
        map: spineTex,
        color: 0xffffff,
        metalness: 0.94,
        roughness: 0.18,
        clearcoat: 0.3,
      });
      const hingeGeo = new THREE.CylinderGeometry(0.026, 0.026, 1.84, 32);
      const hingeMesh = new THREE.Mesh(hingeGeo, spineMat);
      hingeMesh.position.set(0, 0, -0.018);
      hingeMesh.castShadow = true;
      root.add(hingeMesh);

      // Hinge End Caps (Top & Bottom)
      [-0.92, 0.92].forEach((y) => {
        const capGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.018, 32);
        const cap = new THREE.Mesh(capGeo, armorAluminumMat);
        cap.position.set(0, y, -0.018);
        root.add(cap);
      });

      // LEFT WING (Pivots at x = 0)
      const leftWing = new THREE.Group();
      root.add(leftWing);

      // Left Slab Body with Filleted Chamfer Contours
      const slabShape = createRoundedRectShape(0.52, 1.82, 0.038);
      const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
        depth: 0.036,
        bevelEnabled: true,
        bevelSegments: 6,
        steps: 1,
        bevelSize: 0.014,
        bevelThickness: 0.014,
      });

      const leftSlab = new THREE.Mesh(slabGeo, armorAluminumMat);
      leftSlab.position.set(-0.27, 0, -0.018);
      leftSlab.castShadow = true;
      leftWing.add(leftSlab);

      // Antenna Bands on Left Slab (Top and Bottom edges)
      [-0.14, -0.42].forEach((xPos) => {
        const bandGeo = new THREE.BoxGeometry(0.016, 0.038, 0.066);
        const topBand = new THREE.Mesh(bandGeo, antennaMat);
        topBand.position.set(xPos, 0.915, 0);
        leftWing.add(topBand);

        const botBand = new THREE.Mesh(bandGeo, antennaMat);
        botBand.position.set(xPos, -0.915, 0);
        leftWing.add(botBand);
      });

      // Top Speaker Grille on Left Slab (4 CNC Milled Micro Capsule Slots)
      for (let i = 0; i < 4; i++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.012, 0.028), interiorMat);
        slot.position.set(-0.34 + i * 0.035, 0.922, 0);
        leftWing.add(slot);
      }

      // Bottom Speaker Grille on Left Slab (4 CNC Milled Micro Capsule Slots)
      for (let i = 0; i < 4; i++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.012, 0.028), interiorMat);
        slot.position.set(-0.34 + i * 0.035, -0.922, 0);
        leftWing.add(slot);
      }

      // Top Microphone Pinhole
      const topMic = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.01, 16), interiorMat);
      topMic.position.set(-0.19, 0.922, 0);
      leftWing.add(topMic);

      // Rear Frosted Silk Glass on Left Slab
      const rearGlassGeo = new THREE.PlaneGeometry(0.50, 1.80);
      const leftRearGlass = new THREE.Mesh(rearGlassGeo, frostedGlassMat);
      leftRearGlass.position.set(-0.27, 0, -0.033);
      leftRearGlass.rotation.y = Math.PI;
      leftWing.add(leftRearGlass);

      // Raised Camera Island Base Plateau (Armor Aluminum Squircle)
      const camPlateauShape = createRoundedRectShape(0.18, 0.76, 0.07);
      const camPlateauGeo = new THREE.ExtrudeGeometry(camPlateauShape, {
        depth: 0.016,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      });
      const camPlateau = new THREE.Mesh(camPlateauGeo, armorAluminumMat);
      camPlateau.position.set(-0.35, 0.32, -0.033);
      camPlateau.rotation.y = Math.PI;
      leftWing.add(camPlateau);

      // Triple Vertically Stacked ProVisual Camera Island Rings
      const cameraY = [0.56, 0.32, 0.08];
      cameraY.forEach((yPos) => {
        // Outer knurled beveled metallic ring
        const outerRingGeo = new THREE.CylinderGeometry(0.058, 0.058, 0.026, 32);
        const ring = new THREE.Mesh(outerRingGeo, lensRingMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(-0.35, yPos, -0.056);

        // Stepped inner dark lens barrel
        const innerRingGeo = new THREE.CylinderGeometry(0.050, 0.050, 0.027, 32);
        const innerRing = new THREE.Mesh(innerRingGeo, interiorMat);
        ring.add(innerRing);

        // Deep optical sapphire lens glass with AR highlight
        const lensGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.029, 32);
        const lens = new THREE.Mesh(lensGeo, lensGlassMat);
        ring.add(lens);

        // Concentric aperture iris ring
        const irisGeo = new THREE.RingGeometry(0.015, 0.035, 32);
        const irisMat = new THREE.MeshBasicMaterial({ color: 0x020408, side: THREE.DoubleSide });
        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.z = 0.0145;
        ring.add(iris);

        leftWing.add(ring);
      });

      // True Tone Dual-LED Flash with concentric optic ring
      const flashRing = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 24), lensRingMat);
      flashRing.rotation.x = Math.PI / 2;
      flashRing.position.set(-0.21, 0.44, -0.042);
      const flashGeo = new THREE.CylinderGeometry(0.017, 0.017, 0.01, 16);
      const flashMat = new THREE.MeshStandardMaterial({
        color: 0xfff5df,
        emissive: 0xffeab3,
        emissiveIntensity: 0.9,
      });
      const flash = new THREE.Mesh(flashGeo, flashMat);
      flashRing.add(flash);
      leftWing.add(flashRing);

      // Camera Island Microphone Hole
      const camMic = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.01, 16), interiorMat);
      camMic.rotation.x = Math.PI / 2;
      camMic.position.set(-0.21, 0.22, -0.042);
      leftWing.add(camMic);

      // Left Half of Inner 7.6" OLED Display
      const innerLeftScreenGeo = new THREE.PlaneGeometry(0.51, 1.80);
      const innerLeftScreen = new THREE.Mesh(innerLeftScreenGeo, innerScreenMat);
      innerLeftScreen.position.set(-0.265, 0, 0.021);
      leftWing.add(innerLeftScreen);

      // Raised TPU Protective Perimeter Screen Bumper Lip (0.8mm impact rim)
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.7 });
      const topBumper = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.014, 0.006), bumperMat);
      topBumper.position.set(-0.265, 0.907, 0.022);
      leftWing.add(topBumper);

      const botBumper = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.014, 0.006), bumperMat);
      botBumper.position.set(-0.265, -0.907, 0.022);
      leftWing.add(botBumper);

      const sideBumper = new THREE.Mesh(new THREE.BoxGeometry(0.014, 1.82, 0.006), bumperMat);
      sideBumper.position.set(-0.525, 0, 0.022);
      leftWing.add(sideBumper);

      // RIGHT WING (Pivots at x = 0)
      const rightWing = new THREE.Group();
      root.add(rightWing);

      const rightSlab = new THREE.Mesh(slabGeo, armorAluminumMat);
      rightSlab.position.set(0.27, 0, -0.018);
      rightSlab.castShadow = true;
      rightWing.add(rightSlab);

      // Antenna Bands on Right Slab
      [0.14, 0.42].forEach((xPos) => {
        const bandGeo = new THREE.BoxGeometry(0.016, 0.038, 0.066);
        const topBand = new THREE.Mesh(bandGeo, antennaMat);
        topBand.position.set(xPos, 0.915, 0);
        rightWing.add(topBand);

        const botBand = new THREE.Mesh(bandGeo, antennaMat);
        botBand.position.set(xPos, -0.915, 0);
        rightWing.add(botBand);
      });

      // Rear 6.3" Outer Cover Screen on Right Slab
      const coverScreenGeo = new THREE.PlaneGeometry(0.50, 1.80);
      const rightCoverScreen = new THREE.Mesh(coverScreenGeo, coverScreenMat);
      rightCoverScreen.position.set(0.27, 0, -0.033);
      rightCoverScreen.rotation.y = Math.PI;
      rightWing.add(rightCoverScreen);

      // Cover Screen Punch-Hole Selfie Camera
      const coverPunchGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.008, 16);
      const coverPunch = new THREE.Mesh(coverPunchGeo, interiorMat);
      coverPunch.rotation.x = Math.PI / 2;
      coverPunch.position.set(0.27, 0.72, -0.034);
      rightWing.add(coverPunch);

      // Top Earpiece Speaker Slit on Cover Glass Edge
      const earpieceGeo = new THREE.BoxGeometry(0.12, 0.008, 0.006);
      const earpiece = new THREE.Mesh(earpieceGeo, interiorMat);
      earpiece.position.set(0.27, 0.895, -0.033);
      rightWing.add(earpiece);

      // Right Half of Inner Display
      const innerRightScreenGeo = new THREE.PlaneGeometry(0.51, 1.80);
      const innerRightScreen = new THREE.Mesh(innerRightScreenGeo, innerScreenMat);
      innerRightScreen.position.set(0.265, 0, 0.021);
      rightWing.add(innerRightScreen);

      // TPU Bumper Lip on Right Wing
      const rTopBumper = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.014, 0.006), bumperMat);
      rTopBumper.position.set(0.265, 0.907, 0.022);
      rightWing.add(rTopBumper);

      const rBotBumper = new THREE.Mesh(new THREE.BoxGeometry(0.51, 0.014, 0.006), bumperMat);
      rBotBumper.position.set(0.265, -0.907, 0.022);
      rightWing.add(rBotBumper);

      const rSideBumper = new THREE.Mesh(new THREE.BoxGeometry(0.014, 1.82, 0.006), bumperMat);
      rSideBumper.position.set(0.525, 0, 0.022);
      rightWing.add(rSideBumper);

      // Right Frame Controls: Recessed Fingerprint Power Key & Sculpted Volume Rocker
      const buttonMat = new THREE.MeshPhysicalMaterial({
        color: 0x828d99,
        metalness: 0.96,
        roughness: 0.14,
      });

      // Recessed Power Key Slot
      const pwrWellGeo = new THREE.BoxGeometry(0.006, 0.18, 0.032);
      const pwrWell = new THREE.Mesh(pwrWellGeo, interiorMat);
      pwrWell.position.set(0.537, 0.12, 0);
      rightWing.add(pwrWell);

      const pwrKeyGeo = new THREE.BoxGeometry(0.008, 0.16, 0.024);
      const pwrKey = new THREE.Mesh(pwrKeyGeo, buttonMat);
      pwrKey.position.set(0.539, 0.12, 0);
      rightWing.add(pwrKey);

      // Sculpted Volume Rocker with Tactile Center Indent
      const volKeyGeo = new THREE.BoxGeometry(0.014, 0.28, 0.024);
      const volKey = new THREE.Mesh(volKeyGeo, buttonMat);
      volKey.position.set(0.543, 0.44, 0);
      rightWing.add(volKey);

      // SIM Tray Slot with Ejector Pinhole on Right Frame
      const simSlotGeo = new THREE.BoxGeometry(0.004, 0.24, 0.012);
      const simSlot = new THREE.Mesh(simSlotGeo, interiorMat);
      simSlot.position.set(0.538, -0.35, 0);
      rightWing.add(simSlot);

      const simPinGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.008, 12);
      const simPin = new THREE.Mesh(simPinGeo, interiorMat);
      simPin.rotation.z = Math.PI / 2;
      simPin.position.set(0.54, -0.21, 0);
      rightWing.add(simPin);

      // Bottom USB-C Port Receptacle & Metallic Tongue
      const usbcHousingGeo = new THREE.BoxGeometry(0.14, 0.018, 0.038);
      const usbcHousing = new THREE.Mesh(usbcHousingGeo, interiorMat);
      usbcHousing.position.set(0.27, -0.925, 0);
      rightWing.add(usbcHousing);

      const usbcTongueGeo = new THREE.BoxGeometry(0.08, 0.005, 0.014);
      const usbcTongue = new THREE.Mesh(usbcTongueGeo, armorAluminumMat);
      usbcTongue.position.set(0.27, -0.925, 0);
      rightWing.add(usbcTongue);

      // Bottom Primary Mic Pinhole
      const botMic = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.01, 16), interiorMat);
      botMic.position.set(0.18, -0.925, 0);
      rightWing.add(botMic);

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
      // Satin Brushed Grade 5 Titanium Frame Material (Warm Desert Titanium)
      const titaniumMat = new THREE.MeshPhysicalMaterial({
        color: 0x9b948a,
        metalness: 0.94,
        roughness: 0.22,
        clearcoat: 0.35,
        clearcoatRoughness: 0.16,
      });

      // Frosted Matte Glass Back with Silky Sheen
      const rearGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xb5afa6,
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

      // Ergonomically Filleted Titanium Perimeter Unibody (Contoured edges)
      const bodyShape = createRoundedRectShape(0.96, 1.96, 0.13);
      const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: 0.058,
        bevelEnabled: true,
        bevelSegments: 7,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      });

      const phoneBody = new THREE.Mesh(bodyGeo, titaniumMat);
      phoneBody.position.z = -0.029;
      phoneBody.castShadow = true;
      root.add(phoneBody);

      // 6 Precision Antenna Isolation Cuts around Titanium Frame
      // Left and Right top/bottom antenna bands
      [-0.495, 0.495].forEach((x) => {
        [0.68, -0.68].forEach((y) => {
          const ant = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.018, 0.088), antennaMat);
          ant.position.set(x, y, 0);
          root.add(ant);
        });
      });
      // Top and Bottom antenna bands
      const topAnt = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, 0.088), antennaMat);
      topAnt.position.set(0.32, 0.995, 0);
      root.add(topAnt);

      const botAnt = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.022, 0.088), antennaMat);
      botAnt.position.set(-0.32, -0.995, 0);
      root.add(botAnt);

      // Front OLED Glass Screen (Razor-Thin 1.15mm Borders)
      const frontScreenGeo = new THREE.PlaneGeometry(0.93, 1.93);
      const frontScreen = new THREE.Mesh(frontScreenGeo, screenMat);
      frontScreen.position.z = 0.031;
      root.add(frontScreen);

      // Micro Earpiece Speaker Slit at Top Glass Edge
      const earpiece = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.008, 0.006), interiorMat);
      earpiece.position.set(0, 0.962, 0.0315);
      root.add(earpiece);

      // Rear Frosted Glass Back with Silky Sheen
      const rearGlassGeo = new THREE.PlaneGeometry(0.93, 1.93);
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
        roughness: 0.05,
        clearcoat: 1.0,
      });
      const appleLogoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), appleLogoMat);
      appleLogoMesh.position.set(0, 0.08, -0.0325);
      appleLogoMesh.rotation.y = Math.PI;
      root.add(appleLogoMesh);

      // Sculpted Camera Plateau (Seamless Organic Glass Island)
      const plateauShape = createRoundedRectShape(0.48, 0.50, 0.10);
      const plateauGeo = new THREE.ExtrudeGeometry(plateauShape, {
        depth: 0.026,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.010,
        bevelThickness: 0.010,
      });
      const plateau = new THREE.Mesh(plateauGeo, rearGlassMat);
      plateau.position.set(-0.21, 0.65, -0.057);
      plateau.rotation.y = Math.PI;
      root.add(plateau);

      // 3 Pro Optical Sapphire Lens Systems
      const lensRingMat = new THREE.MeshPhysicalMaterial({
        color: 0x989289,
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
        [-0.31, 0.77],
        [-0.31, 0.53],
        [-0.11, 0.65],
      ];
      lensCoords.forEach(([x, y]) => {
        // Outer knurled titanium bezel ring
        const ringGeo = new THREE.CylinderGeometry(0.092, 0.092, 0.028, 32);
        const ring = new THREE.Mesh(ringGeo, lensRingMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, y, -0.071);

        // Stepped inner dark lens barrel
        const innerRingGeo = new THREE.CylinderGeometry(0.080, 0.080, 0.029, 32);
        const innerRing = new THREE.Mesh(innerRingGeo, interiorMat);
        ring.add(innerRing);

        // Deep sapphire optical lens with AR reflection
        const lensGeo = new THREE.CylinderGeometry(0.070, 0.070, 0.031, 32);
        const lens = new THREE.Mesh(lensGeo, lensGlassMat);
        ring.add(lens);

        // Aperture diaphragm iris
        const irisGeo = new THREE.RingGeometry(0.024, 0.058, 32);
        const irisMat = new THREE.MeshBasicMaterial({ color: 0x020306, side: THREE.DoubleSide });
        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.z = 0.0156;
        ring.add(iris);

        root.add(ring);
      });

      // True Tone Dual-LED Flash with concentric fresnel ring
      const flashRing = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.01, 24), lensRingMat);
      flashRing.rotation.x = Math.PI / 2;
      flashRing.position.set(-0.11, 0.81, -0.062);
      const flashGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.012, 24);
      const flashMat = new THREE.MeshStandardMaterial({
        color: 0xfff6dd,
        emissive: 0xffeab3,
        emissiveIntensity: 0.85,
      });
      const flash = new THREE.Mesh(flashGeo, flashMat);
      flashRing.add(flash);
      root.add(flashRing);

      // LiDAR Scanner Dark Optical Sensor
      const lidarRing = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.008, 24), lensRingMat);
      lidarRing.rotation.x = Math.PI / 2;
      lidarRing.position.set(-0.11, 0.49, -0.062);
      const lidarGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.01, 24);
      const lidarMat = new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        metalness: 0.92,
        roughness: 0.08,
      });
      const lidar = new THREE.Mesh(lidarGeo, lidarMat);
      lidarRing.add(lidar);
      root.add(lidarRing);

      // Rear Studio Microphone Pinhole
      const rearMic = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.01, 16), interiorMat);
      rearMic.rotation.x = Math.PI / 2;
      rearMic.position.set(-0.21, 0.49, -0.062);
      root.add(rearMic);

      // Tactile Buttons & Camera Control Button
      const buttonMat = new THREE.MeshPhysicalMaterial({
        color: 0x7c756f,
        metalness: 0.94,
        roughness: 0.16,
      });

      // NEW IPHONE 16 CAMERA CONTROL SENSOR: Flush Recessed Sapphire Strip with Titanium Bezel
      const camControlWellGeo = new THREE.BoxGeometry(0.008, 0.22, 0.034);
      const camControlWell = new THREE.Mesh(camControlWellGeo, interiorMat);
      camControlWell.position.set(0.496, -0.22, 0);
      root.add(camControlWell);

      const camControlGeo = new THREE.BoxGeometry(0.008, 0.20, 0.028);
      const camControlMat = new THREE.MeshPhysicalMaterial({
        color: 0x2b323b,
        metalness: 0.85,
        roughness: 0.12,
        clearcoat: 0.9,
      });
      const camControl = new THREE.Mesh(camControlGeo, camControlMat);
      camControl.position.set(0.498, -0.22, 0);
      root.add(camControl);

      // Power / Siri Side Button on Right Rail
      const sideKey = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.26, 0.028), buttonMat);
      sideKey.position.set(0.498, 0.35, 0);
      root.add(sideKey);

      // Action Button on Upper Left Rail
      const actionKey = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.11, 0.028), buttonMat);
      actionKey.position.set(-0.498, 0.65, 0);
      root.add(actionKey);

      // Volume Up & Volume Down Buttons on Left Rail
      const volUpKey = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.19, 0.028), buttonMat);
      volUpKey.position.set(-0.498, 0.44, 0);
      root.add(volUpKey);

      const volDnKey = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.19, 0.028), buttonMat);
      volDnKey.position.set(-0.498, 0.21, 0);
      root.add(volDnKey);

      // Bottom USB-C Port Receptacle with Interior Contact Tongue
      const usbcHousingGeo = new THREE.BoxGeometry(0.14, 0.022, 0.038);
      const usbcHousing = new THREE.Mesh(usbcHousingGeo, interiorMat);
      usbcHousing.position.set(0, -0.995, 0);
      root.add(usbcHousing);

      const usbcTongue = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.006, 0.016), titaniumMat);
      usbcTongue.position.set(0, -0.995, 0);
      root.add(usbcTongue);

      // Bottom Speaker CNC Hole Array (5 holes on right)
      for (let i = 0; i < 5; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.02, 16), interiorMat);
        hole.position.set(0.14 + i * 0.034, -0.995, 0);
        root.add(hole);
      }

      // Bottom Microphone CNC Hole Array (3 holes on left)
      for (let i = 0; i < 3; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.02, 16), interiorMat);
        hole.position.set(-0.14 - i * 0.034, -0.995, 0);
        root.add(hole);
      }

      break;
    }

    // -------------------------------------------------------------------------
    // 3. MICROSOFT SURFACE LAPTOP 7 (CNC Aluminum Unibody with Copilot Key)
    // -------------------------------------------------------------------------
    case "surface7": {
      // Platinum Anodized Aircraft Aluminum
      const aluminumMat = new THREE.MeshPhysicalMaterial({
        color: 0xd6dade,
        metalness: 0.94,
        roughness: 0.16,
        clearcoat: 0.35,
        clearcoatRoughness: 0.15,
      });

      // Dark Matte PBT Keycap Material
      const darkKeyMat = new THREE.MeshStandardMaterial({
        color: 0x1c2026,
        metalness: 0.25,
        roughness: 0.65,
      });

      // Precision Haptic Glass Trackpad
      const trackpadMat = new THREE.MeshPhysicalMaterial({
        color: 0xc8ced4,
        metalness: 0.32,
        roughness: 0.1,
        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
      });

      // Dark Cavity / Port Interior Material
      const interiorMat = new THREE.MeshStandardMaterial({
        color: 0x080a0e,
        roughness: 0.92,
      });

      // Polished Metallic Contact Material
      const metalPinMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.96,
        roughness: 0.1,
      });

      const screenTex = createSurfaceScreenTexture();
      const screenMat = new THREE.MeshPhysicalMaterial({
        map: screenTex,
        roughness: 0.04,
        metalness: 0.05,
        clearcoat: 1.0,
        emissiveMap: screenTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.36,
      });

      // 1. Tapered Aerodynamic CNC Aluminum Base with Filleted Corners
      const baseShape = createRoundedRectShape(2.12, 1.44, 0.07);
      const baseGeo = new THREE.ExtrudeGeometry(baseShape, {
        depth: 0.048,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });
      const base = new THREE.Mesh(baseGeo, aluminumMat);
      base.rotation.x = Math.PI / 2;
      base.position.set(0, -0.4, 0);
      base.castShadow = true;
      root.add(base);

      // Chamfered Front Lip Thumb Notch (Single-finger lid opener)
      const notchGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.018, 24, 1, false, 0, Math.PI);
      const notch = new THREE.Mesh(notchGeo, aluminumMat);
      notch.rotation.x = -Math.PI / 2;
      notch.position.set(0, 0.725, 0.024);
      base.add(notch);

      // 2. Recessed Milled Keyboard Deck Well
      const deckWellGeo = new THREE.BoxGeometry(1.78, 0.72, 0.008);
      const deckWell = new THREE.Mesh(deckWellGeo, new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.8 }));
      deckWell.position.set(0, -0.21, 0.025);
      base.add(deckWell);

      // 3. Discrete Keycap Rows (6 Realistic Rows with Copilot Key)
      const rowConfigs = [
        { y: -0.52, count: 14, height: 0.07, wRatio: 1.0 },  // Function Row
        { y: -0.40, count: 14, height: 0.09, wRatio: 1.0 },  // Number Row
        { y: -0.28, count: 14, height: 0.09, wRatio: 1.0 },  // QWERTY Row
        { y: -0.16, count: 13, height: 0.09, wRatio: 1.08 }, // Home Row
        { y: -0.04, count: 12, height: 0.09, wRatio: 1.16 }, // Bottom Alpha Row
      ];

      rowConfigs.forEach((row) => {
        const keyWidth = (1.70 / row.count) * 0.92;
        const startX = -0.80 + keyWidth / 2;
        for (let i = 0; i < row.count; i++) {
          const keyGeo = new THREE.BoxGeometry(keyWidth * row.wRatio, row.height * 0.92, 0.009);
          const key = new THREE.Mesh(keyGeo, darkKeyMat);
          key.position.set(startX + i * (keyWidth * row.wRatio * 1.08), row.y, 0.03);
          base.add(key);
        }
      });

      // Bottom Row (Spacebar, Modifiers & Dedicated Copilot Key)
      // Spacebar
      const spaceGeo = new THREE.BoxGeometry(0.56, 0.09, 0.009);
      const spacebar = new THREE.Mesh(spaceGeo, darkKeyMat);
      spacebar.position.set(-0.06, 0.08, 0.03);
      base.add(spacebar);

      // Dedicated Glowing Copilot Key
      const copilotGeo = new THREE.BoxGeometry(0.11, 0.09, 0.009);
      const copilotMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.4,
      });
      const copilotKey = new THREE.Mesh(copilotGeo, copilotMat);
      copilotKey.position.set(0.32, 0.08, 0.03);
      base.add(copilotKey);

      // Remaining bottom modifier keys (Left Alt, Left Win, Left Fn, Left Ctrl, Right Alt, Right Ctrl)
      [-0.72, -0.60, -0.48, -0.36, 0.20, 0.44, 0.56, 0.68].forEach((kx) => {
        const modKey = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.09, 0.009), darkKeyMat);
        modKey.position.set(kx, 0.08, 0.03);
        base.add(modKey);
      });

      // 4. Precision Glass Haptic Trackpad with Milled Hairline Seam
      const trackpadBorderGeo = new THREE.BoxGeometry(0.76, 0.50, 0.004);
      const trackpadBorder = new THREE.Mesh(trackpadBorderGeo, interiorMat);
      trackpadBorder.position.set(0, 0.40, 0.024);
      base.add(trackpadBorder);

      const trackpadGeo = new THREE.BoxGeometry(0.74, 0.48, 0.006);
      const trackpad = new THREE.Mesh(trackpadGeo, trackpadMat);
      trackpad.position.set(0, 0.40, 0.026);
      base.add(trackpad);

      // 5. Left Rail Ports: 2x USB-C (USB4), 1x USB-A 3.1, 1x 3.5mm Headphone Jack
      // USB-C 1
      const usbc1 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.08, 0.024), interiorMat);
      usbc1.position.set(-1.065, -0.30, 0.012);
      base.add(usbc1);
      const usbc1Tongue = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.045, 0.006), metalPinMat);
      usbc1Tongue.position.set(-1.065, -0.30, 0.012);
      base.add(usbc1Tongue);

      // USB-C 2
      const usbc2 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.08, 0.024), interiorMat);
      usbc2.position.set(-1.065, -0.16, 0.012);
      base.add(usbc2);
      const usbc2Tongue = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.045, 0.006), metalPinMat);
      usbc2Tongue.position.set(-1.065, -0.16, 0.012);
      base.add(usbc2Tongue);

      // USB-A 3.1
      const usba = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.12, 0.028), interiorMat);
      usba.position.set(-1.065, 0.02, 0.012);
      base.add(usba);
      const usbaInsert = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.012), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      usbaInsert.position.set(-1.065, 0.02, 0.017);
      base.add(usbaInsert);

      // 3.5mm Audio Jack
      const audioJack = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.018, 16), interiorMat);
      audioJack.rotation.z = Math.PI / 2;
      audioJack.position.set(-1.065, 0.20, 0.012);
      base.add(audioJack);

      // 6. Right Rail Port: Surface Connect Magnetic Charging Pill Port
      const surfConnectGeo = new THREE.BoxGeometry(0.018, 0.22, 0.026);
      const surfConnect = new THREE.Mesh(surfConnectGeo, interiorMat);
      surfConnect.position.set(1.065, -0.22, 0.012);
      base.add(surfConnect);

      const surfPinStrip = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.15, 0.008), metalPinMat);
      surfPinStrip.position.set(1.065, -0.22, 0.012);
      base.add(surfPinStrip);

      // 7. Base Underside: 4 Silicone Isolation Pill Feet
      [-0.85, 0.85].forEach((fx) => {
        [-0.55, 0.55].forEach((fy) => {
          const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.008, 16), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 }));
          foot.position.set(fx, fy, -0.049);
          base.add(foot);
        });
      });

      // 8. Continuous Friction Piano Hinge Barrel
      const hingeGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.94, 32);
      const hinge = new THREE.Mesh(hingeGeo, aluminumMat);
      hinge.rotation.z = Math.PI / 2;
      hinge.position.set(0, -0.38, -0.71);
      root.add(hinge);

      // 9. Display Lid (Pivots at rear of base)
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, -0.38, -0.71);
      root.add(lidGroup);

      const lidShape = createRoundedRectShape(2.12, 1.44, 0.07);
      const lidGeo = new THREE.ExtrudeGeometry(lidShape, {
        depth: 0.032,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.010,
        bevelThickness: 0.010,
      });
      const lidMesh = new THREE.Mesh(lidGeo, aluminumMat);
      lidMesh.position.set(0, 0.72, 0);
      lidMesh.castShadow = true;
      lidGroup.add(lidMesh);

      // Edge-to-edge Glass Front with 3:2 PixelSense Display Screen
      const lidScreenGeo = new THREE.PlaneGeometry(2.04, 1.36);
      const lidScreen = new THREE.Mesh(lidScreenGeo, screenMat);
      lidScreen.position.set(0, 0.72, 0.018);
      lidGroup.add(lidScreen);

      // Top Bezel Studio Camera & Windows Hello IR Sensors
      // 1080p Web Camera
      const camLens = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.006, 16), interiorMat);
      camLens.rotation.x = Math.PI / 2;
      camLens.position.set(0, 1.412, 0.019);
      lidGroup.add(camLens);

      // Dual Studio Mics
      [-0.08, 0.08].forEach((mx) => {
        const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.006, 12), interiorMat);
        mic.rotation.x = Math.PI / 2;
        mic.position.set(mx, 1.412, 0.019);
        lidGroup.add(mic);
      });

      // Windows Hello IR Sensor
      const irSensor = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.006, 16), new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.2 }));
      irSensor.rotation.x = Math.PI / 2;
      irSensor.position.set(0.04, 1.412, 0.019);
      lidGroup.add(irSensor);

      // Mirror 4-Square Microsoft Logo on Rear of Lid (4 distinct laser-cut chrome squares)
      const chromeSquareMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.04,
        clearcoat: 1.0,
      });
      const sqSize = 0.078;
      const sqOffset = 0.044;
      [
        [-sqOffset, sqOffset],
        [sqOffset, sqOffset],
        [-sqOffset, -sqOffset],
        [sqOffset, -sqOffset],
      ].forEach(([sx, sy]) => {
        const sq = new THREE.Mesh(new THREE.PlaneGeometry(sqSize, sqSize), chromeSquareMat);
        sq.position.set(sx, 0.72 + sy, -0.018);
        sq.rotation.y = Math.PI;
        lidGroup.add(sq);
      });

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
      // Acoustic Perforated Micro-Mesh Titanium Grille
      const meshMat = new THREE.MeshPhysicalMaterial({
        color: 0x22262d,
        metalness: 0.88,
        roughness: 0.32,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
      });

      // Heavy MDF Subwoofer Body with Matte Textured Polyurea Finish
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

      // Dark Port & Interior Cavity Material
      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x07080a,
        roughness: 0.95,
      });

      // Gold Spring-Loaded Pogo Contact Pin Material
      const goldPogoMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.98,
        roughness: 0.08,
      });

      // 1. Main Center Soundbar Bar (Racetrack Aerofoil Curved Unibody)
      const mainBarShape = createRoundedRectShape(1.64, 0.20, 0.07);
      const mainBarGeo = new THREE.ExtrudeGeometry(mainBarShape, {
        depth: 0.26,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });
      const mainBar = new THREE.Mesh(mainBarGeo, meshMat);
      mainBar.position.set(0, -0.25, -0.13);
      mainBar.castShadow = true;
      root.add(mainBar);

      // Smoked Glass Pill Front LED Readout Display
      const displayShape = createRoundedRectShape(0.68, 0.12, 0.04);
      const displayGeo = new THREE.ExtrudeGeometry(displayShape, {
        depth: 0.008,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.004,
        bevelThickness: 0.004,
      });
      const displayPlane = new THREE.Mesh(displayGeo, displayMat);
      displayPlane.position.set(0, 0, 0.264);
      mainBar.add(displayPlane);

      // Top Control Strip on Main Bar (Embossed tactile buttons)
      const topStrip = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.006, 0.08), new THREE.MeshStandardMaterial({ color: 0x181a20, roughness: 0.8 }));
      topStrip.position.set(0, 0.104, 0.13);
      mainBar.add(topStrip);

      // Tactile Buttons: Power, Vol-, Vol+, Source
      [-0.12, -0.04, 0.04, 0.12].forEach((bx) => {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 16), new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.3 }));
        btn.position.set(bx, 0.108, 0.13);
        mainBar.add(btn);
      });

      // Dual Top Dolby Atmos Up-Firing Height Speaker Driver Grilles
      [-0.52, 0.52].forEach((hx) => {
        const heightGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.006, 24), darkMat);
        heightGrille.position.set(hx, 0.104, 0.13);
        mainBar.add(heightGrille);
      });

      // 2. Left Detachable Surround Pod
      const surroundShape = createRoundedRectShape(0.32, 0.20, 0.07);
      const surroundGeo = new THREE.ExtrudeGeometry(surroundShape, {
        depth: 0.26,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      });

      const leftPod = new THREE.Mesh(surroundGeo, meshMat);
      leftPod.position.set(-1.00, -0.25, -0.13);
      leftPod.castShadow = true;
      root.add(leftPod);

      // Left Pod Up-firing Driver Grille
      const leftUpGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.006, 24), darkMat);
      leftUpGrille.position.set(0, 0.104, 0.13);
      leftPod.add(leftUpGrille);

      // Left Pod Mating Face Gold Pogo Pin Contacts (4 pins)
      [0.04, -0.04].forEach((py) => {
        [0.08, 0.18].forEach((pz) => {
          const pogo = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 16), goldPogoMat);
          pogo.rotation.z = Math.PI / 2;
          pogo.position.set(0.165, py, pz);
          leftPod.add(pogo);
        });
      });

      // 3. Right Detachable Surround Pod
      const rightPod = new THREE.Mesh(surroundGeo, meshMat);
      rightPod.position.set(1.00, -0.25, -0.13);
      rightPod.castShadow = true;
      root.add(rightPod);

      // Right Pod Up-firing Driver Grille
      const rightUpGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.006, 24), darkMat);
      rightUpGrille.position.set(0, 0.104, 0.13);
      rightPod.add(rightUpGrille);

      // Right Pod Mating Face Gold Pogo Pin Contacts (4 pins)
      [0.04, -0.04].forEach((py) => {
        [0.08, 0.18].forEach((pz) => {
          const pogo = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 16), goldPogoMat);
          pogo.rotation.z = Math.PI / 2;
          pogo.position.set(-0.165, py, pz);
          rightPod.add(pogo);
        });
      });

      // 4. 10-Inch Wireless Subwoofer Cube with Contoured Edges
      const subShape = createRoundedRectShape(0.72, 0.72, 0.06);
      const subExtrudeGeo = new THREE.ExtrudeGeometry(subShape, {
        depth: 0.78,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      });
      const sub = new THREE.Mesh(subExtrudeGeo, subMat);
      sub.rotation.x = Math.PI / 2;
      sub.position.set(1.48, 0.50, -0.62);
      sub.castShadow = true;
      root.add(sub);

      // 5. Authentic 10-Inch Down-Firing Subwoofer Driver Cone Assembly
      // Recessed Driver Well
      const driverWellGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.04, 32);
      const driverWell = new THREE.Mesh(driverWellGeo, darkMat);
      driverWell.position.set(0, 0, 0.782);
      sub.add(driverWell);

      // High-Roll Rubber Surround Ring
      const surroundRollGeo = new THREE.TorusGeometry(0.22, 0.024, 16, 32);
      const surroundRollMat = new THREE.MeshStandardMaterial({ color: 0x1e2228, roughness: 0.85 });
      const surroundRoll = new THREE.Mesh(surroundRollGeo, surroundRollMat);
      surroundRoll.position.set(0, 0, 0.80);
      sub.add(surroundRoll);

      // Pressed Cellulose Concave Woofer Cone
      const coneGeo = new THREE.ConeGeometry(0.20, 0.06, 32, 1, true);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0x181c22, roughness: 0.7, metalness: 0.1 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI;
      cone.position.set(0, 0, 0.78);
      sub.add(cone);

      // Center Inverted Dust Cap
      const dustCapGeo = new THREE.SphereGeometry(0.07, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const dustCapMat = new THREE.MeshPhysicalMaterial({ color: 0x111317, roughness: 0.4, clearcoat: 0.3 });
      const dustCap = new THREE.Mesh(dustCapGeo, dustCapMat);
      dustCap.rotation.x = -Math.PI / 2;
      dustCap.position.set(0, 0, 0.76);
      sub.add(dustCap);

      // 6. Rear Flared Aerodynamic Bass Reflex Port
      const reflexPort = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.14, 24), darkMat);
      reflexPort.rotation.x = Math.PI / 2;
      reflexPort.position.set(0, -0.365, 0.40);
      sub.add(reflexPort);

      // 7. Subwoofer Elevated High-Vibration Decoupling Feet (4 corner columns)
      [-0.28, 0.28].forEach((x) => {
        [-0.28, 0.28].forEach((y) => {
          const footCol = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.09, 20), new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.6 }));
          footCol.rotation.x = Math.PI / 2;
          footCol.position.set(x, y, 0.825);
          sub.add(footCol);

          // Non-slip rubber isolation base pad
          const rubberPad = new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.040, 0.012, 20), darkMat);
          rubberPad.rotation.x = Math.PI / 2;
          rubberPad.position.set(x, y, 0.875);
          sub.add(rubberPad);
        });
      });

      // 8. Rear Amplifier Backplate with IEC AC power socket & Sync Button
      const ampPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.42), new THREE.MeshStandardMaterial({ color: 0x1f242c, metalness: 0.7, roughness: 0.4 }));
      ampPlate.rotation.x = -Math.PI / 2;
      ampPlate.position.set(0, -0.365, 0.40);
      sub.add(ampPlate);

      // Status LED
      const subLed = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.006, 12), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.8 }));
      subLed.rotation.x = Math.PI / 2;
      subLed.position.set(0.10, -0.368, 0.52);
      sub.add(subLed);

      // Controller: Detachable Surrounds
      controllers.setSurroundsDocked = (docked: boolean) => {
        if (docked) {
          leftPod.position.set(-1.00, -0.25, -0.13);
          rightPod.position.set(1.00, -0.25, -0.13);
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
      // Silver Anodized CNC Aerospace Aluminum
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0xd8dde4,
        metalness: 0.94,
        roughness: 0.15,
        clearcoat: 0.35,
        clearcoatRoughness: 0.12,
      });

      // Forged Cantilever Aluminum Stand
      const standMat = new THREE.MeshPhysicalMaterial({
        color: 0xcfd5dc,
        metalness: 0.95,
        roughness: 0.14,
        clearcoat: 0.25,
      });

      // Dark Interior / Cavity Material
      const darkInteriorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0c10,
        roughness: 0.9,
      });

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

      // 1. 11.5mm Razor-Thin Screen Chassis with Diamond-Cut Chamfers
      const screenShape = createRoundedRectShape(2.24, 1.44, 0.06);
      const screenGeo = new THREE.ExtrudeGeometry(screenShape, {
        depth: 0.024,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.008,
        bevelThickness: 0.008,
      });
      const screen = new THREE.Mesh(screenGeo, chassisMat);
      screen.position.set(0, 0.25, -0.012);
      screen.castShadow = true;
      root.add(screen);

      // 2. Front 4.5K Retina Display Glass with Iconic White Border Bezel
      const displayPlaneGeo = new THREE.PlaneGeometry(2.14, 1.18);
      const displayPlane = new THREE.Mesh(displayPlaneGeo, screenMat);
      displayPlane.position.set(0, 0.09, 0.021);
      screen.add(displayPlane);

      // 3. Front Color-Matched Satin Aluminum Chin
      const chinShape = createRoundedRectShape(2.14, 0.21, 0.02);
      const chinGeo = new THREE.ExtrudeGeometry(chinShape, {
        depth: 0.005,
        bevelEnabled: false,
      });
      const chin = new THREE.Mesh(chinGeo, chassisMat);
      chin.position.set(0, -0.58, 0.019);
      screen.add(chin);

      // 4. Front 12MP Center Stage Camera with Anti-Reflective Sapphire Element
      const camHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.006, 20), darkInteriorMat);
      camHousing.rotation.x = Math.PI / 2;
      camHousing.position.set(0, 0.695, 0.021);
      screen.add(camHousing);

      const camSapphire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.007, 20),
        new THREE.MeshPhysicalMaterial({
          color: 0x0a1020,
          metalness: 0.95,
          roughness: 0.02,
          clearcoat: 1.0,
        })
      );
      camSapphire.rotation.x = Math.PI / 2;
      camSapphire.position.set(0, 0.695, 0.0215);
      screen.add(camSapphire);

      // Dual Ambient Light Sensor Pinhole Openings
      [-0.045, 0.045].forEach((ax) => {
        const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.006, 12), darkInteriorMat);
        sensor.rotation.x = Math.PI / 2;
        sensor.position.set(ax, 0.695, 0.021);
        screen.add(sensor);
      });

      // Top Edge Studio 3-Mic Beamforming Slits
      [-0.18, 0, 0.18].forEach((mx) => {
        const topMic = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.004, 0.008), darkInteriorMat);
        topMic.position.set(mx, 0.722, 0.012);
        screen.add(topMic);
      });

      // Bottom Dual Stereo Speaker Acoustic Grilles (Force-cancelling woofers)
      [-0.55, 0.55].forEach((sx) => {
        const spkGrille = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.004, 0.014), darkInteriorMat);
        spkGrille.position.set(sx, -0.722, 0.012);
        screen.add(spkGrille);
      });

      // 5. Mirror High-Gloss Apple Logo on Rear of iMac
      const appleLogoTex = createAppleLogoTexture();
      const appleLogoMat = new THREE.MeshPhysicalMaterial({
        map: appleLogoTex,
        transparent: true,
        metalness: 0.98,
        roughness: 0.04,
        clearcoat: 1.0,
      });
      const appleLogoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), appleLogoMat);
      appleLogoMesh.position.set(0, 0.14, -0.013);
      appleLogoMesh.rotation.y = Math.PI;
      screen.add(appleLogoMesh);

      // 6. Cylindrical Precision Friction Stand Hinge
      const hingeCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.22, 24), standMat);
      hingeCylinder.rotation.z = Math.PI / 2;
      hingeCylinder.position.set(0, -0.22, -0.026);
      screen.add(hingeCylinder);

      // 7. Cantilevered Forged Aluminum L-Stand with Cable Pass-Through Hole
      const standPoleGeo = new THREE.BoxGeometry(0.40, 0.76, 0.038);
      const standPole = new THREE.Mesh(standPoleGeo, standMat);
      standPole.position.set(0, -0.72, -0.16);
      standPole.rotation.x = 0.22;
      screen.add(standPole);

      // Circular Cable Hole with Soft Silicone Interior Lining
      const holeLining = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.042, 32), new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }));
      holeLining.rotation.x = Math.PI / 2;
      holeLining.position.set(0, 0.02, 0);
      standPole.add(holeLining);

      const holeCavity = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.046, 32), darkInteriorMat);
      holeCavity.rotation.x = Math.PI / 2;
      holeCavity.position.set(0, 0.02, 0);
      standPole.add(holeCavity);

      // Stand Base Foot with Silicone Isolation Runners
      const standBaseShape = createRoundedRectShape(0.74, 0.64, 0.03);
      const standBaseGeo = new THREE.ExtrudeGeometry(standBaseShape, {
        depth: 0.024,
        bevelEnabled: true,
        bevelSegments: 4,
        bevelSize: 0.005,
        bevelThickness: 0.005,
      });
      const standBase = new THREE.Mesh(standBaseGeo, standMat);
      standBase.rotation.x = Math.PI / 2;
      standBase.position.set(0, -1.05, 0.32);
      screen.add(standBase);

      // 8. Rear I/O: 4x Thunderbolt 4 / USB-C Ports + Magnetic Power Socket
      // 4 USB-C Ports
      [-0.14, -0.05, 0.05, 0.14].forEach((px) => {
        const portWell = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.055, 0.012), darkInteriorMat);
        portWell.position.set(0.68 + px, -0.38, -0.012);
        screen.add(portWell);

        const pinTongue = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.032, 0.008), chassisMat);
        pinTongue.position.set(0.68 + px, -0.38, -0.012);
        screen.add(pinTongue);
      });

      // Magnetic Circular Woven Power Port (Color-matched MagSafe)
      const pwrRing = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.01, 24), standMat);
      pwrRing.rotation.x = Math.PI / 2;
      pwrRing.position.set(0, -0.22, -0.014);
      screen.add(pwrRing);

      const pwrCavity = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.012, 24), darkInteriorMat);
      pwrCavity.rotation.x = Math.PI / 2;
      pwrCavity.position.set(0, -0.22, -0.0145);
      screen.add(pwrCavity);

      // Recessed Power Button on Lower Left Rear
      const pwrBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 20), standMat);
      pwrBtn.rotation.x = Math.PI / 2;
      pwrBtn.position.set(-0.88, -0.52, -0.013);
      screen.add(pwrBtn);

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

      // Dark Matte Rear Housing Polymer
      const rearBoxMat = new THREE.MeshStandardMaterial({
        color: 0x101318,
        roughness: 0.65,
        metalness: 0.2,
      });

      // Dark Cavity / Port Material
      const darkCavityMat = new THREE.MeshStandardMaterial({
        color: 0x06070a,
        roughness: 0.95,
      });

      // 1. Cinema Screen 3-Sided Bezel-Less Frame with Razor Border
      const tvScreenGeo = new THREE.BoxGeometry(2.62, 1.50, 0.028);
      const tv = new THREE.Mesh(tvScreenGeo, tvFrameMat);
      tv.castShadow = true;
      root.add(tv);

      // 2. Glowing Quantum Dot 4K QNED Screen Face
      const tvTex = createLGTVDisplayTexture();
      const screenFaceGeo = new THREE.PlaneGeometry(2.58, 1.46);
      const screenFace = new THREE.Mesh(
        screenFaceGeo,
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
      screenFace.position.z = 0.015;
      tv.add(screenFace);

      // 3. Lower Center LG Brand Island & Standby Micro-LED
      const lgChinShape = createRoundedRectShape(0.18, 0.042, 0.012);
      const lgChinGeo = new THREE.ExtrudeGeometry(lgChinShape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.005,
        bevelThickness: 0.005,
      });
      const lgChin = new THREE.Mesh(lgChinGeo, tvFrameMat);
      lgChin.position.set(0, -0.758, 0.008);
      tv.add(lgChin);

      // Standby Micro-LED (Pure White glow)
      const led = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.006, 16),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xffffff,
          emissiveIntensity: 1.8,
        })
      );
      led.rotation.x = Math.PI / 2;
      led.position.set(0, -0.014, 0.026);
      lgChin.add(led);

      // Ambient Light Sensor / IR Receiver Window
      const irWin = new THREE.Mesh(
        new THREE.PlaneGeometry(0.04, 0.012),
        new THREE.MeshBasicMaterial({ color: 0x05070a })
      );
      irWin.position.set(0, 0.006, 0.026);
      lgChin.add(irWin);

      // Multi-Directional Jog Controller on Underside of Chin
      const jogKey = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 16), new THREE.MeshStandardMaterial({ color: 0x334155 }));
      jogKey.position.set(0, -0.024, 0.01);
      lgChin.add(jogKey);

      // 4. Dual Cast-Metal Boomerang Tabletop Stand Feet
      [-0.94, 0.94].forEach((x) => {
        // Angled Boomerang Arm
        const footGeo = new THREE.BoxGeometry(0.038, 0.18, 0.48);
        const foot = new THREE.Mesh(footGeo, tvFrameMat);
        foot.position.set(x, -0.82, 0);
        tv.add(foot);

        // Underside Rubber Pads (Front and Rear)
        [-0.20, 0.20].forEach((fz) => {
          const pad = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.008, 0.06), darkCavityMat);
          pad.position.set(0, -0.094, fz);
          foot.add(pad);
        });
      });

      // 5. Rear Electronics Housing Box with Sculpted Heat Louvers & VESA 400x400
      const rearBoxGeo = new THREE.BoxGeometry(1.72, 0.92, 0.055);
      const rearBox = new THREE.Mesh(rearBoxGeo, rearBoxMat);
      rearBox.position.set(0, -0.08, -0.042);
      tv.add(rearBox);

      // VESA 400x400 M6 Threaded Bolt Inserts (4 metallic holes)
      const vesaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      [-0.32, 0.32].forEach((vx) => {
        [-0.32, 0.32].forEach((vy) => {
          const boltHole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16), vesaMat);
          boltHole.rotation.x = Math.PI / 2;
          boltHole.position.set(vx, vy, -0.029);
          rearBox.add(boltHole);

          const boltCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.012, 16), darkCavityMat);
          boltCenter.rotation.x = Math.PI / 2;
          boltCenter.position.set(vx, vy, -0.029);
          rearBox.add(boltCenter);
        });
      });

      // Horizontal Thermal Ventilation Louver Slats along Top of Rear Box
      for (let i = 0; i < 6; i++) {
        const louver = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.006, 0.008), darkCavityMat);
        louver.position.set(0, 0.36 - i * 0.022, -0.028);
        rearBox.add(louver);
      }

      // Recessed Side I/O Connection Bay (HDMI 2.1 x 4, USB x 2, LAN, Optical)
      const bayGeo = new THREE.BoxGeometry(0.02, 0.38, 0.16);
      const bay = new THREE.Mesh(bayGeo, darkCavityMat);
      bay.position.set(0.865, -0.10, 0);
      rearBox.add(bay);

      // 4x HDMI Ports in Bay
      for (let h = 0; h < 4; h++) {
        const hdmi = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.045, 0.022), new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.8 }));
        hdmi.position.set(0.006, 0.12 - h * 0.07, 0);
        bay.add(hdmi);
      }

      // 6. Integrated Downward-Firing 20W Stereo Sound Ports
      [-0.65, 0.65].forEach((sx) => {
        const spk = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.008, 0.018), darkCavityMat);
        spk.position.set(sx, -0.748, 0);
        tv.add(spk);
      });

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

      // Dark Discharge Chamber Cavity
      const darkCavityMat = new THREE.MeshStandardMaterial({
        color: 0x12151c,
        roughness: 0.85,
      });

      // Chrome Trim Accent Line
      const chromeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.05,
        clearcoat: 1.0,
      });

      // 1. Aerodynamic Curved Unibody Chassis with Filleted Ends
      const acShape = createRoundedRectShape(2.24, 0.68, 0.12);
      const acGeo = new THREE.ExtrudeGeometry(acShape, {
        depth: 0.38,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.018,
        bevelThickness: 0.018,
      });
      const ac = new THREE.Mesh(acGeo, acChassisMat);
      ac.position.set(0, 0, -0.19);
      ac.castShadow = true;
      root.add(ac);

      // 2. High-Gloss Front Panel Fascia with Digital LED 21°C Readout
      const acTex = createTCLACDisplayTexture();
      const frontPlaneGeo = new THREE.PlaneGeometry(2.20, 0.65);
      const frontPlaneMat = new THREE.MeshPhysicalMaterial({
        map: acTex,
        roughness: 0.06,
        metalness: 0.04,
        clearcoat: 1.0,
        emissiveMap: acTex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.32,
      });
      const frontPlane = new THREE.Mesh(frontPlaneGeo, frontPlaneMat);
      frontPlane.position.set(0, 0, 0.192);
      ac.add(frontPlane);

      // Brushed Chrome Trim Accent Bar along lower fascia
      const chromeStrip = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.008, 0.012), chromeMat);
      chromeStrip.position.set(0, -0.18, 0.193);
      ac.add(chromeStrip);

      // 3. Side Air Induction Intake Vents
      [-1.125, 1.125].forEach((sx) => {
        for (let i = 0; i < 4; i++) {
          const sideVent = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.012, 0.18), darkCavityMat);
          sideVent.position.set(sx, 0.12 - i * 0.045, 0.08);
          ac.add(sideVent);
        }
      });

      // 4. Top Air Intake Grille Louvers with Micro-Ribbed Filter Mesh
      const intakeChamber = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 0.30), darkCavityMat);
      intakeChamber.rotation.x = -Math.PI / 2;
      intakeChamber.position.set(0, 0.342, 0);
      ac.add(intakeChamber);

      // 8 Molded Horizontal Intake Louvers
      for (let i = 0; i < 8; i++) {
        const louverBlade = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.008, 0.024), acChassisMat);
        louverBlade.position.set(0, 0.345, -0.12 + i * 0.038);
        ac.add(louverBlade);
      }

      // 5. Motorized Directional Airflow Discharge Chute
      const ventChuteGeo = new THREE.BoxGeometry(2.14, 0.14, 0.12);
      const ventChute = new THREE.Mesh(ventChuteGeo, darkCavityMat);
      ventChute.position.set(0, -0.25, 0.14);
      ac.add(ventChute);

      // Primary Motorized Airflow Guide Louver Blade (Aerofoil blade angled down 22°)
      const primaryLouverGeo = new THREE.BoxGeometry(2.10, 0.022, 0.10);
      const primaryLouver = new THREE.Mesh(primaryLouverGeo, acChassisMat);
      primaryLouver.position.set(0, 0, 0.04);
      primaryLouver.rotation.x = -0.38; // 22-degree downward cooling sweep
      ventChute.add(primaryLouver);

      // Secondary Internal Vertical Directional Vanes (Array of 12 oscillation fins)
      for (let v = 0; v < 12; v++) {
        const finGeo = new THREE.BoxGeometry(0.008, 0.08, 0.04);
        const fin = new THREE.Mesh(finGeo, new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }));
        fin.position.set(-0.95 + v * 0.17, 0, 0);
        fin.rotation.y = 0.15 * Math.sin(v * 0.8); // Natural oscillation angle distribution
        ventChute.add(fin);
      }

      // 6. Rear Installation Details: Galvanized Wall Bracket & Insulated Copper Piping Stub
      const backplate = new THREE.Mesh(
        new THREE.PlaneGeometry(2.18, 0.64),
        new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.35 })
      );
      backplate.position.set(0, 0, -0.001);
      backplate.rotation.y = Math.PI;
      ac.add(backplate);

      // Insulated Copper Line Pair (Refrigerant tubes with white thermal foam wrap)
      const suctionPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.16, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 })
      );
      suctionPipe.position.set(0.85, -0.28, -0.08);
      suctionPipe.rotation.x = 0.5;
      ac.add(suctionPipe);

      const liquidPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.16, 16),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 })
      );
      liquidPipe.position.set(0.90, -0.28, -0.08);
      liquidPipe.rotation.x = 0.5;
      ac.add(liquidPipe);

      // Corrugated Drain Tube Stub
      const drainPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.014, 0.014, 0.18, 16),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 })
      );
      drainPipe.position.set(0.80, -0.30, -0.08);
      drainPipe.rotation.x = 0.6;
      ac.add(drainPipe);

      break;
    }
  }

  return controllers;
}
