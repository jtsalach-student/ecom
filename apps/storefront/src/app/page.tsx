"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { AiAssistantModal } from "../components/AiAssistantModal";
import { WarrantyLookupModal } from "../components/WarrantyLookupModal";
import { InteractiveRotatingHeroCarousel } from "../components/InteractiveRotatingHeroCarousel";
import { useCart } from "../context/CartContext";
import {
  SEED_PRODUCTS,
  SEED_BRANCHES,
  SEED_TENANT,
} from "@gcp/database";
import { ProductListing } from "@gcp/contracts";
import {
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Wind,
  Wifi,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Truck,
  CheckCircle2,
  RotateCcw,
  MapPin,
  PhoneCall,
  Mail,
  ExternalLink,
  Info,
  Sparkles,
  X,
  Search,
  Share2,
  Copy,
  Check,
  Navigation,
  Car,
  ChevronDown,
} from "lucide-react";

export default function StorefrontHomePage() {
  const { addItem, setIsCartOpen } = useCart();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeModalProduct, setActiveModalProduct] = useState<ProductListing | null>(null);
  const [copiedModalLink, setCopiedModalLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Category navigation definitions
  const categories = [
    { id: "ALL", label: "All Items", icon: Sparkles, count: SEED_PRODUCTS.length },
    {
      id: "SMARTPHONES",
      label: "Smartphones",
      icon: Smartphone,
      count: SEED_PRODUCTS.filter((p) => p.category === "SMARTPHONES" || p.category === "TABLETS" || p.category === "SMARTWATCHES").length,
    },
    {
      id: "LAPTOPS",
      label: "Laptops & PC",
      icon: Laptop,
      count: SEED_PRODUCTS.filter((p) => p.category === "LAPTOPS").length,
    },
    {
      id: "AUDIO_HEADPHONES",
      label: "Audio & Sound",
      icon: Headphones,
      count: SEED_PRODUCTS.filter((p) => p.category === "AUDIO_HEADPHONES").length,
    },
    {
      id: "TELEVISIONS",
      label: "4K Televisions",
      icon: Tv,
      count: SEED_PRODUCTS.filter((p) => p.category === "TELEVISIONS").length,
    },
    {
      id: "HOME_APPLIANCES",
      label: "Cooling & Appliances",
      icon: Wind,
      count: SEED_PRODUCTS.filter((p) => p.category === "HOME_APPLIANCES").length,
    },
    {
      id: "ACCESSORIES",
      label: "Accessories & MiFi",
      icon: Wifi,
      count: SEED_PRODUCTS.filter((p) => p.category === "ACCESSORIES" || p.category === "NETWORKING_SATELLITE").length,
    },
  ];

  // Filter products based on search and selected category
  const filteredProducts = useMemo(() => {
    return SEED_PRODUCTS.filter((product) => {
      // Category match
      let matchesCategory = true;
      if (selectedCategory !== "ALL") {
        if (selectedCategory === "SMARTPHONES") {
          matchesCategory =
            product.category === "SMARTPHONES" ||
            product.category === "TABLETS" ||
            product.category === "SMARTWATCHES";
        } else if (selectedCategory === "ACCESSORIES") {
          matchesCategory =
            product.category === "ACCESSORIES" ||
            product.category === "NETWORKING_SATELLITE";
        } else {
          matchesCategory = product.category === selectedCategory;
        }
      }

      // Search query match
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          (product.tags && product.tags.some((t) => t.toLowerCase().includes(query)));
      }

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const verifiedBranch = SEED_BRANCHES[0]; // Single confirmed East Legon branch

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        onOpenAi={() => setIsAiOpen(true)}
        onOpenWarranty={() => setIsWarrantyOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO CAROUSEL: Intact Rotating Assembled Products                      */}
        {/* ========================================================================= */}
        <InteractiveRotatingHeroCarousel
          products={SEED_PRODUCTS}
          onOpenProductModal={(product) => setActiveModalProduct(product)}
        />

        {/* ========================================================================= */}
        {/* 2. CATEGORY DISCOVERY TILES (Retail Clarity Reference)                     */}
        {/* ========================================================================= */}
        <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-[#FF8A00] tracking-wider uppercase">
                Browse by Department
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Authentic Technology Departments
              </h2>
            </div>
            {selectedCategory !== "ALL" && (
              <button
                onClick={() => setSelectedCategory("ALL")}
                className="text-xs font-bold text-[#FF8A00] hover:underline"
              >
                Clear Filter (View All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-28 sm:h-32 group ${
                    isActive
                      ? "bg-[#FF8A00] text-white border-[#FF8A00] shadow-md scale-102"
                      : "bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-[#FF8A00]/50 dark:hover:border-[#FF8A00]/50 shadow-card hover:shadow-cardHover"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#FFF2DF] dark:bg-slate-800 text-[#FF8A00]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm line-clamp-1">
                      {cat.label}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 font-medium ${
                        isActive ? "text-white/80" : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {cat.count} models
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. RESEARCHED PRODUCT CATALOGUE GRID                                      */}
        {/* ========================================================================= */}
        <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FF8A00] uppercase tracking-wider">
                Shop Our Collection
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
                {selectedCategory === "ALL"
                  ? "Featured Products"
                  : categories.find((c) => c.id === selectedCategory)?.label}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Showing {filteredProducts.length} authentic products available from Gadget Master.
              </p>
            </div>

            {/* In-stock count indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>In Stock at East Legon Showroom</span>
            </div>
          </div>

          {/* Product Cards Grid (Responsive 1/2/3/4 columns) */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const primaryVariant = product.variants[0];
                const hasConfirmedPrice =
                  product.advertisementProvenance?.priceConfirmed ?? (primaryVariant?.retailPrice > 0);
                const isCallForStock =
                  product.advertisementProvenance?.availabilityStatus === "CALL_FOR_STOCK";

                return (
                  <div
                    key={product.id}
                    className="group rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 hover:border-[#FF8A00]/40 dark:hover:border-[#FF8A00]/40 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Image Stage */}
                    <div className="relative p-6 bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-center min-h-[240px] overflow-hidden">
                      <img
                        src={primaryVariant?.imageUrl || product.featuredImage}
                        alt={`${product.name} - Genuine ${product.brand} (${product.modelNumber}) available at The Gadget Master East Legon showroom`}
                        className="max-h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Brand Tag Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900/90 text-white dark:bg-white/90 dark:text-slate-900 backdrop-blur-md">
                          {product.brand}
                        </span>
                      </div>

                      {/* Stock / Provenance Badge */}
                      <div className="absolute top-3.5 right-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCallForStock
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {isCallForStock ? "Call for Stock" : "In Stock"}
                        </span>
                      </div>
                    </div>

                    {/* Card Body Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Model {product.modelNumber}
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5 line-clamp-2 leading-snug">
                          {product.name}
                        </h3>

                        {/* Short Benefit / Spec */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {product.shortDescription || product.description}
                        </p>

                        {/* Specs Bullets */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                          {product.specs?.processor && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {product.specs.processor}
                            </span>
                          )}
                          {product.specs?.ramGb && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {product.specs.ramGb}GB RAM
                            </span>
                          )}
                          {product.specs?.displaySizeInches && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {product.specs.displaySizeInches}&quot; Display
                            </span>
                          )}
                          {Boolean(product.specs?.capacityBtu) && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {product.specs?.capacityBtu}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <div className="text-[10px] font-semibold text-slate-400 uppercase">
                              Price
                            </div>
                            {primaryVariant?.retailPrice ? (
                              <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                                GHS {primaryVariant.retailPrice.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                Contact for Price
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setActiveModalProduct(product)}
                            className="text-xs font-semibold text-[#FF8A00] hover:underline"
                          >
                            Details &rarr;
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          {primaryVariant && (
                            <button
                              onClick={() => {
                                addItem(product, primaryVariant, 1);
                                setIsCartOpen(true);
                              }}
                              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-[#FF8A00] hover:bg-[#EA580C] text-white transition-colors active:scale-95 shadow-sm"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}

                          <a
                            href={`https://wa.me/233200147950?text=${encodeURIComponent(
                              `Hello Gadget Master Ghana, I am inquiring about ${product.name} (Model: ${product.modelNumber}).`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Enquire</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No products found matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching by brand (Apple, Samsung, LG, TCL, JBL, Lenovo) or reset the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-[#FF8A00] text-white text-xs font-bold shadow"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* 4. MAP AND STEP-BY-STEP DIRECTIONS SECTION                                 */}
        {/* ========================================================================= */}
        <section id="map-directions" className="py-12 sm:py-16 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/20 mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>East Legon Flagship Showroom</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Map &amp; Driving Directions to Underbridge Mall
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Experience authentic smartphones, computing, soundbars, and climate control in person. Visit our showroom located on Boundary Road, directly adjacent to the East Legon Underbridge.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Map & Instant Direction Actions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-900">
                  <iframe
                    src="https://maps.google.com/maps?q=Underbridge+Mall+Boundary+Road+East+Legon+Accra+Ghana&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-[320px] sm:h-[400px] border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="The Gadget Master Underbridge Mall East Legon Accra Map"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] font-semibold flex items-center gap-2 shadow">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Underbridge Mall, Boundary Rd, East Legon</span>
                  </div>
                </div>

                {/* Map Quick Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Underbridge+Mall+Boundary+Road+East+Legon+Accra+Ghana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-[#FF8A00] hover:bg-[#EA580C] text-white shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </a>
                  <a
                    href="tel:+233200147950"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4 text-[#FF8A00]" />
                    <span>Call: 020 014 7950</span>
                  </a>
                  <a
                    href="https://wa.me/233200147950?text=Hello%20Gadget%20Master%2C%20I%20am%20driving%20to%20your%20Underbridge%20Mall%20showroom%20and%20need%20assistance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Showroom</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Step-by-Step Driving Routes & Amenities */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#FF8A00]" />
                    <span>Step-by-Step Driving Directions</span>
                  </h3>

                  {/* Route 1: From Shiashie / Tetteh Quarshie */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                      <span>From Shiashie &amp; Tetteh Quarshie</span>
                      <span className="text-[10px] text-emerald-500 font-mono">~3 mins</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Head north on Liberation Road toward Legon. Take the right exit onto the East Legon Underbridge into Boundary Road. Underbridge Mall is situated immediately on your right.
                    </p>
                  </div>

                  {/* Route 2: From A&C Mall / American House */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                      <span>From A&amp;C Mall &amp; American House</span>
                      <span className="text-[10px] text-emerald-500 font-mono">~4 mins</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Head south along Boundary Road past Galaxy International School toward the Underbridge. Drive straight for 1.2km; Underbridge Mall is on your left before reaching the bridge.
                    </p>
                  </div>

                  {/* Route 3: From Tema Motorway / Spintex */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                      <span>From Tema Motorway &amp; Spintex Bypass</span>
                      <span className="text-[10px] text-emerald-500 font-mono">~6 mins</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Exit at the East Legon Underbridge bypass directly into Boundary Road. Direct access to secure customer parking is available on ground and underground levels.
                    </p>
                  </div>
                </div>

                {/* Showroom Amenities & Operating Hours */}
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">🅿️</span>
                      <span className="font-medium">Free Customer Parking</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">⚡</span>
                      <span className="font-medium">Live Device Unboxing</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">🛡️</span>
                      <span className="font-medium">Warranty Registration Desk</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">💳</span>
                      <span className="font-medium">MoMo &amp; Card POS</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Showroom Hours:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Mon – Sat: 8:30 AM – 7:30 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. TRUTHFUL SERVICE STANDARDS                                             */}
        {/* ========================================================================= */}
        <section className="py-10 bg-slate-100/60 dark:bg-slate-900/40 border-t border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Limited Store Warranty
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  12-month standard limited store warranty with device serial tracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Truck className="w-6 h-6 text-[#FF8A00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Accra Courier Delivery
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Standard courier dispatch across Greater Accra &amp; surrounding areas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Verified MoMo &amp; Cards
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Paystack-secured MTN MoMo, Telecel Cash, and Visa/Mastercard payments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <RotateCcw className="w-6 h-6 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Trade-In Appraisal
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Bring pre-owned devices to the showroom for appraisal and upgrade credit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5.5 INTERACTIVE HOMEPAGE FAQ SECTION                                      */}
        {/* ========================================================================= */}
        <section id="faq" className="py-12 sm:py-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
                <Info className="w-3.5 h-3.5" />
                <span>Customer Help &amp; FAQs</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Got questions before purchasing? Here is everything you need to know about our genuine stock and warranty.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "Are all products at The Gadget Master brand new and 100% genuine?",
                  a: "Yes. Every phone, laptop, TV, audio system, and appliance is 100% brand new, sealed in original manufacturer packaging with verifiable serial and IMEI numbers.",
                },
                {
                  q: "How does the 1-Year Official Warranty work?",
                  a: "All brand new purchases include our 1-Year Gadget Master Warranty against factory defects, plus an immediate 7-day hassle-free replacement period if an issue is verified.",
                },
                {
                  q: "What payment options do you support?",
                  a: "We support secure online checkout via Paystack with MTN Mobile Money, Telecel Cash, and Visa/Mastercard. At our Underbridge Mall showroom, we also accept POS card swipe and direct transfer.",
                },
                {
                  q: "Can I place an order online and pick it up at the East Legon showroom?",
                  a: "Absolutely. Select showroom pickup during checkout or reserve via WhatsApp. Your order will be staged at our collection counter for you to unbox, inspect, and test.",
                },
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#FF8A00] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Link to Dedicated FAQ Page */}
            <div className="mt-8 text-center">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
              >
                <span>📚 Browse Full FAQ Knowledgebase &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 6. COMPREHENSIVE FOOTER                                                   */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1321] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 transition-colors duration-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src="/logo-oval.png"
                alt="The Gadget Master"
                className="h-9 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                The Gadget Master
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your Trusted Choice for genuine consumer electronics, computing, home entertainment, and inverter climate control in Accra, Ghana.
            </p>
            <div className="mt-4 text-[11px] text-slate-400">
              Provisional brand demonstration subject to merchant trademark authorization.
            </div>
          </div>

          {/* Departments */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Departments
            </h5>
            <ul className="space-y-2">
              {categories.slice(1).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setSelectedCategory(c.id)}
                    className="hover:text-[#FF8A00] transition-colors"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Customer Services &amp; Help
            </h5>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setIsWarrantyOpen(true)} className="hover:text-[#FF8A00] transition-colors">
                  Warranty Verification
                </button>
              </li>
              <li>
                <button onClick={() => setIsAiOpen(true)} className="hover:text-[#FF8A00] transition-colors">
                  AI Product Advisor
                </button>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#FF8A00] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <a href="#map-directions" className="hover:text-[#FF8A00] transition-colors">
                  Showroom Map &amp; Driving Directions
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FF8A00] transition-colors">
                  Privacy Policy (Act 843)
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/233200147950"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF8A00] transition-colors"
                >
                  Direct WhatsApp Help
                </a>
              </li>
              <li>
                <a href="tel:+233200147950" className="hover:text-[#FF8A00] transition-colors font-mono">
                  Tel: 020 014 7950
                </a>
              </li>
            </ul>
          </div>

          {/* Admin Portals & Crawler Specs */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Operations &amp; Admin
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="/login" className="hover:text-[#FF8A00] transition-colors font-semibold">
                  Storefront Customer Login
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF8A00] transition-colors font-semibold flex items-center gap-1"
                >
                  <span>Retailer Admin &amp; POS (3001)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF8A00] transition-colors font-semibold flex items-center gap-1"
                >
                  <span>Platform Superadmin (3002)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="/robots.txt" className="hover:text-[#FF8A00] transition-colors text-[11px] text-slate-400">
                  Search Crawler (Robots.txt)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} The Gadget Master Ltd. All Rights Reserved. Underbridge Mall, East Legon, Accra.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/faq" className="hover:underline">FAQ</Link>
            <span>&bull;</span>
            <span>Powered by GCP Multi-Tenant SaaS</span>
          </div>
        </div>
      </footer>

      {/* Product Details Modal with Social Sharing */}
      {activeModalProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center">
                <img
                  src={activeModalProduct.variants[0]?.imageUrl || activeModalProduct.featuredImage}
                  alt={`${activeModalProduct.name} - Genuine ${activeModalProduct.brand} (${activeModalProduct.modelNumber}) at The Gadget Master East Legon Showroom`}
                  className="max-h-60 object-contain"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                  {activeModalProduct.brand} &bull; {activeModalProduct.modelNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {activeModalProduct.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {activeModalProduct.description}
                </p>

                {activeModalProduct.variants[0]?.retailPrice && (
                  <div className="mt-4">
                    <span className="text-xs text-slate-400">Showroom Price:</span>
                    <div className="text-2xl font-extrabold text-[#FF8A00] font-mono">
                      GHS {activeModalProduct.variants[0].retailPrice.toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  {activeModalProduct.variants[0] && (
                    <button
                      onClick={() => {
                        addItem(activeModalProduct, activeModalProduct.variants[0], 1);
                        setActiveModalProduct(null);
                        setIsCartOpen(true);
                      }}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#FF8A00] hover:bg-[#EA580C] text-white shadow"
                    >
                      Add to Cart
                    </button>
                  )}
                  <a
                    href={`https://wa.me/233200147950?text=${encodeURIComponent(
                      `Hello Gadget Master Ghana, I am inquiring about ${activeModalProduct.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white border border-slate-700"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Social Sharing Component */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-[#FF8A00]" />
                  <span>Share This Gadget:</span>
                </span>
                {copiedModalLink && (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Link Copied!
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `Check out ${activeModalProduct.name} at The Gadget Master Ghana: https://thegadgetmaster.online/#catalogue`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/20 transition-colors"
                  title="Share on WhatsApp"
                >
                  <span>💬 WhatsApp</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `Check out ${activeModalProduct.name} at The Gadget Master Ghana:`
                  )}&url=${encodeURIComponent('https://thegadgetmaster.online/#catalogue')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-sky-500/20 transition-colors"
                  title="Share on X / Twitter"
                >
                  <span>🐦 X (Twitter)</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://thegadgetmaster.online')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-500/20 transition-colors"
                  title="Share on Facebook"
                >
                  <span>👥 Facebook</span>
                </a>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(`${window.location.origin}/#${activeModalProduct.id}`);
                    }
                    setCopiedModalLink(true);
                    setTimeout(() => setCopiedModalLink(false), 2500);
                  }}
                  className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Copy Product Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>

            {/* Technical Specifications Section */}
            {activeModalProduct.specs && Object.keys(activeModalProduct.specs).length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {Object.entries(activeModalProduct.specs).map(([key, value]) => {
                    if (!value || typeof value === "object") return null;
                    return (
                      <div
                        key={key}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60"
                      >
                        <div className="text-[10px] text-slate-400 uppercase font-semibold capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                          {String(value)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drawers & Modals */}
      <CartDrawer />
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <WarrantyLookupModal isOpen={isWarrantyOpen} onClose={() => setIsWarrantyOpen(false)} />
    </div>
  );
}
