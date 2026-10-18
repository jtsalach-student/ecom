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
  const imacProduct = products.find((p) => p.id === "prod-apple-imac-24-m4") || products[0];
  const surfaceProduct = products.find((p) => p.id === "prod-surface-laptop-15-snapdragon");
  const jblBarProduct = products.find((p) => p.id === "prod-jbl-bar-800-mk2");
  const iphoneProduct = products.find((p) => p.id === "prod-iphone-16-pro-max");
  const tvProduct = products.find((p) => p.id === "prod-lg-qned70-75");
  const acProduct = products.find((p) => p.id === "prod-tcl-ac-12csd");

  const slides: CarouselSlide[] = [
    {
      id: "slide-imac",
      badge: "Apple M4 Silicon",
      title: "Apple iMac 24-inch M4",
      subtitle: "All-in-One Power with 4.5K Retina Brilliance",
      benefit: "The ultimate desktop centerpiece. 16GB unified memory, 12MP Center Stage camera with Desk View, and Studio-quality acoustics.",
      category: "Desktop Computing",
      priceGhs: 24500,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
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
      title: "Surface Laptop 7th Edition 15\"",
      subtitle: "Snapdragon X Elite 12-Core Ultrabook",
      benefit: "Ultra-fast on-device AI acceleration, 120Hz PixelSense Flow Touchscreen, 1TB Gen 4 SSD, and unprecedented 22-hour battery life.",
      category: "Pro Laptops",
      priceGhs: 22000,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80",
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
      title: "JBL Bar 800 MK2 Surround",
      subtitle: "720W 5.1.2-Channel Cinema System",
      benefit: "Pure cinema immersion with detachable wireless battery-powered rear surround speakers and massive 10-inch down-firing wireless subwoofer.",
      category: "Home Theatre & Audio",
      priceGhs: 12500,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80",
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
      title: "Apple iPhone 16 Pro Max",
      subtitle: "A18 Pro 3nm Silicon & 5x Optical Periscope",
      benefit: "Lightweight titanium construction, 6.9\" Super Retina XDR ProMotion, Camera Control sensor button, and 48MP Fusion imaging.",
      category: "Flagship Smartphones",
      priceGhs: 14800,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80",
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
      title: "LG 75\" QNED70 4K Smart TV",
      subtitle: "α5 Gen6 AI Processor & webOS 23",
      benefit: "Expansive 75-inch living room theatre with richer, deeper colors, Game Optimizer, Active HDR10 Pro, and Magic Remote voice control.",
      category: "4K Televisions",
      priceGhs: 16800,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
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
      title: "TCL 1.5HP Smart Inverter AC",
      subtitle: "Fast 30-Second Cooling & TitanGold Protection",
      benefit: "12,000 BTU cooling efficiency with AI inverter energy savings up to 60%, TitanGold anti-corrosion condenser fins, and quiet operation.",
      category: "Climate & Appliances",
      priceGhs: 4200,
      isConfirmedPrice: true,
      status: "IN_STOCK",
      imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
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
              {/* Product 3D Interactive Canvas */}
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] flex items-center justify-center">
                <RotatingProduct3DStage
                  key={activeSlide.id}
                  deviceType={activeSlide.deviceType}
                  imageUrl={activeSlide.imageUrl}
                  title={activeSlide.title}
                  accentColor={activeSlide.accentColor}
                  onInteractionChange={setIsInteracting}
                />
              </div>

              {/* Interactive Hint Indicator */}
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 pointer-events-none">
                <RotateCw className="w-3 h-3 text-[#FF8A00] animate-spin-slow" />
                <span>Hover or drag product to rotate in 3D</span>
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
// ROTATING PRODUCT 3D STAGE (Three.js WebGL with photographic fallback)
// Products remain assembled! Interactive smooth rotation on pointer hover.
// =============================================================================
interface RotatingProduct3DStageProps {
  deviceType: "imac" | "laptop" | "soundbar" | "phone" | "tv" | "ac";
  imageUrl: string;
  title: string;
  accentColor: string;
  onInteractionChange?: (active: boolean) => void;
}

function RotatingProduct3DStage({
  deviceType,
  imageUrl,
  title,
  accentColor,
  onInteractionChange,
}: RotatingProduct3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);
  const [fallbackRotation, setFallbackRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
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

      // Studio Lighting for Intact Electronics
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
      keyLight.position.set(2, 3, 3);
      keyLight.castShadow = true;
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(new THREE.Color(accentColor), 1.5);
      rimLight.position.set(-3, -2, -2);
      scene.add(rimLight);

      // Floor Shadow Plane
      const shadowPlaneGeo = new THREE.PlaneGeometry(4, 4);
      const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -1.1;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);

      // Build Intact Device Geometry
      productGroup = new THREE.Group();
      buildIntactDeviceModel(productGroup, deviceType, accentColor);
      scene.add(productGroup);

      // Pointer tracking state
      let targetRotY = 0;
      let targetRotX = 0;
      let isHovering = false;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width;
        const normY = (e.clientY - rect.top) / rect.height;

        // Bounded rotation range: ±35° yaw, ±15° pitch
        targetRotY = (normX - 0.5) * 1.2;
        targetRotX = (normY - 0.5) * 0.5;
      };

      const handlePointerEnter = () => {
        isHovering = true;
        onInteractionChange?.(true);
      };

      const handlePointerLeave = () => {
        isHovering = false;
        targetRotY = 0;
        targetRotX = 0;
        onInteractionChange?.(false);
      };

      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerenter", handlePointerEnter);
      container.addEventListener("pointerleave", handlePointerLeave);

      // Rendering Loop with Damped Interpolation (lerp)
      const render = () => {
        animationFrameId = requestAnimationFrame(render);

        if (productGroup) {
          // Smooth damped rotation interpolation
          productGroup.rotation.y += (targetRotY - productGroup.rotation.y) * 0.08;
          productGroup.rotation.x += (targetRotX - productGroup.rotation.x) * 0.08;

          // Subtle idle floating breathing animation when not actively moving pointer
          if (!isHovering) {
            productGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.03;
          }
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      render();

      // Resize observer
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
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerenter", handlePointerEnter);
        container.removeEventListener("pointerleave", handlePointerLeave);
        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch {
      setWebGlFailed(true);
    }
  }, [deviceType, accentColor, onInteractionChange]);

  // Fallback photographic rendering with subtle 3D CSS tilt
  const handleFallbackMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setFallbackRotation({ x: -y * 20, y: x * 25 });
  };

  const handleFallbackLeave = () => {
    setFallbackRotation({ x: 0, y: 0 });
  };

  if (webGlFailed) {
    return (
      <div
        className="w-full h-full flex items-center justify-center p-4 cursor-grab"
        onPointerMove={handleFallbackMove}
        onPointerLeave={handleFallbackLeave}
      >
        <div
          className="relative max-w-sm sm:max-w-md transition-transform duration-200 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${fallbackRotation.x}deg) rotateY(${fallbackRotation.y}deg)`,
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full max-h-[360px] object-contain drop-shadow-2xl rounded-2xl"
          />
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
}

// Helper: Build Procedural 3D Intact Electronics Geometries for Hero Showcase
function buildIntactDeviceModel(
  group: THREE.Group,
  deviceType: "imac" | "laptop" | "soundbar" | "phone" | "tv" | "ac",
  accentHex: string
) {
  const aluminumMat = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.85,
    roughness: 0.25,
  });

  const screenGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c10,
    metalness: 0.9,
    roughness: 0.1,
  });

  const darkPolymerMat = new THREE.MeshStandardMaterial({
    color: 0x181818,
    metalness: 0.3,
    roughness: 0.5,
  });

  switch (deviceType) {
    case "imac": {
      // Screen & Frame
      const screenGeo = new THREE.BoxGeometry(2.2, 1.4, 0.05);
      const screen = new THREE.Mesh(screenGeo, aluminumMat);
      screen.castShadow = true;

      // Screen Glass Panel
      const glassGeo = new THREE.PlaneGeometry(2.1, 1.25);
      const glass = new THREE.Mesh(glassGeo, screenGlassMat);
      glass.position.z = 0.026;
      screen.add(glass);

      // Chin with Apple metallic tint
      const chinGeo = new THREE.BoxGeometry(2.1, 0.25, 0.052);
      const chin = new THREE.Mesh(chinGeo, aluminumMat);
      chin.position.y = -0.55;
      screen.add(chin);

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
      // Laptop Base
      const baseGeo = new THREE.BoxGeometry(2.0, 0.04, 1.4);
      const base = new THREE.Mesh(baseGeo, aluminumMat);
      base.position.set(0, -0.4, 0);
      base.castShadow = true;

      // Trackpad
      const trackpadGeo = new THREE.PlaneGeometry(0.65, 0.45);
      const trackpad = new THREE.Mesh(trackpadGeo, darkPolymerMat);
      trackpad.rotation.x = -Math.PI / 2;
      trackpad.position.set(0, 0.021, 0.35);
      base.add(trackpad);

      // Keyboard Area
      const keyboardGeo = new THREE.PlaneGeometry(1.7, 0.65);
      const keyboard = new THREE.Mesh(keyboardGeo, darkPolymerMat);
      keyboard.rotation.x = -Math.PI / 2;
      keyboard.position.set(0, 0.021, -0.25);
      base.add(keyboard);

      // Laptop Lid (Angled back 110 degrees)
      const lidGeo = new THREE.BoxGeometry(2.0, 1.35, 0.03);
      const lid = new THREE.Mesh(lidGeo, aluminumMat);
      lid.position.set(0, 0.25, -0.65);
      lid.rotation.x = -0.35;
      lid.castShadow = true;

      // Lid Screen Glass
      const lidScreenGeo = new THREE.PlaneGeometry(1.9, 1.25);
      const lidScreen = new THREE.Mesh(lidScreenGeo, screenGlassMat);
      lidScreen.position.z = 0.016;
      lid.add(lidScreen);

      group.add(base);
      group.add(lid);
      break;
    }

    case "soundbar": {
      // Soundbar Main Unit
      const barGeo = new THREE.BoxGeometry(2.4, 0.2, 0.3);
      const bar = new THREE.Mesh(barGeo, darkPolymerMat);
      bar.castShadow = true;

      // Speaker Grill Mesh
      const grillGeo = new THREE.BoxGeometry(2.35, 0.18, 0.02);
      const grillMat = new THREE.MeshStandardMaterial({
        color: 0x242424,
        roughness: 0.8,
        metalness: 0.1,
      });
      const grill = new THREE.Mesh(grillGeo, grillMat);
      grill.position.z = 0.15;
      bar.add(grill);

      // Wireless Subwoofer Beside It
      const subGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
      const sub = new THREE.Mesh(subGeo, darkPolymerMat);
      sub.position.set(1.4, 0.3, -0.2);
      sub.castShadow = true;

      group.add(bar);
      group.add(sub);
      break;
    }

    case "phone": {
      // Smartphone Body (iPhone 16 Pro Max Form)
      const bodyGeo = new THREE.BoxGeometry(1.0, 1.95, 0.08);
      const body = new THREE.Mesh(bodyGeo, aluminumMat);
      body.castShadow = true;

      // Front OLED Glass
      const frontGlassGeo = new THREE.PlaneGeometry(0.94, 1.88);
      const frontGlass = new THREE.Mesh(frontGlassGeo, screenGlassMat);
      frontGlass.position.z = 0.041;
      body.add(frontGlass);

      // Triple Camera Bump
      const bumpGeo = new THREE.BoxGeometry(0.42, 0.45, 0.04);
      const bump = new THREE.Mesh(bumpGeo, aluminumMat);
      bump.position.set(-0.25, 0.65, -0.05);
      body.add(bump);

      group.add(body);
      break;
    }

    case "tv": {
      // Television Display Panel
      const tvGeo = new THREE.BoxGeometry(2.6, 1.5, 0.04);
      const tv = new THREE.Mesh(tvGeo, darkPolymerMat);
      tv.castShadow = true;

      const tvScreenGeo = new THREE.PlaneGeometry(2.54, 1.44);
      const tvScreen = new THREE.Mesh(tvScreenGeo, screenGlassMat);
      tvScreen.position.z = 0.021;
      tv.add(tvScreen);

      // TV Stand Feet
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
      // Split Air Conditioner Indoor Unit
      const acGeo = new THREE.BoxGeometry(2.2, 0.6, 0.4);
      const acMat = new THREE.MeshStandardMaterial({
        color: 0xfafafa,
        metalness: 0.1,
        roughness: 0.3,
      });
      const ac = new THREE.Mesh(acGeo, acMat);
      ac.castShadow = true;

      // Bottom Air Outlet Vent Flap
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
