"use client";

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";
import { AiAssistantModal } from "../components/AiAssistantModal";
import { WarrantyLookupModal } from "../components/WarrantyLookupModal";
import { useCart } from "../context/CartContext";
import { DisassemblyViewer } from "@gcp/animation-engine";
import {
  SEED_PRODUCTS,
  SEED_ANIMATION_PACKAGE_IPHONE16,
  SEED_COMPATIBILITIES,
  SEED_BRANCHES,
} from "@gcp/database";
import { findCompatibleAccessories } from "@gcp/domain";
import {
  Sparkles,
  ShoppingBag,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Battery,
  MapPin,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function StorefrontHomePage() {
  const { addItem, setIsCartOpen } = useCart();
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [heroMode, setHeroMode] = useState<"EXPLORE_3D" | "SHOP">("EXPLORE_3D");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeCompatibilityModalProduct, setActiveCompatibilityModalProduct] = useState<any | null>(null);

  const flagshipProduct = SEED_PRODUCTS[0]; // iPhone 16 Pro Max
  const [selectedVariant, setSelectedVariant] = useState(flagshipProduct.variants[0]);

  const filteredProducts = SEED_PRODUCTS.filter((p) => {
    if (selectedCategory === "ALL") return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation */}
      <Navbar
        onOpenAi={() => setIsAiOpen(true)}
        onOpenWarranty={() => setIsWarrantyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* ========================================================================= */}
        {/* HERO SECTION: Flagship 3D Disassembly & Shop Mode                         */}
        {/* ========================================================================= */}
        <section id="flagship-teardown" className="relative pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header & Mode Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Flagship Device Showcase
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {flagshipProduct.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
                Experience precision internal engineering before you buy. Grade 5 Titanium, A18 Pro 3nm SoC, and tetraprism telephoto optics.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
              <button
                onClick={() => setHeroMode("EXPLORE_3D")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  heroMode === "EXPLORE_3D"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Explore Mode (3D Teardown)
              </button>
              <button
                onClick={() => setHeroMode("SHOP")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  heroMode === "SHOP"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shop Mode
              </button>
            </div>
          </div>

          {/* Hero Experience Container */}
          {heroMode === "EXPLORE_3D" ? (
            <div className="relative">
              <DisassemblyViewer
                packageData={SEED_ANIMATION_PACKAGE_IPHONE16}
                onExploreCtaClick={() => setHeroMode("SHOP")}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              {/* Product Gallery */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 border border-slate-800">
                <img
                  src={selectedVariant.imageUrl || flagshipProduct.featuredImage}
                  alt={selectedVariant.name}
                  className="max-h-96 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Shop Configuration */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock at Accra Flagship Store (15 Units Available)</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {flagshipProduct.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {flagshipProduct.shortDescription}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-white">
                      GHS {selectedVariant.retailPrice.toLocaleString()}
                    </span>
                    {selectedVariant.compareAtPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        GHS {selectedVariant.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                      Save GHS {(selectedVariant.compareAtPrice! - selectedVariant.retailPrice).toLocaleString()}
                    </span>
                  </div>

                  {/* Variant Selection */}
                  <div className="mt-6 space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Storage & Finish Options
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {flagshipProduct.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedVariant.id === v.id
                              ? "border-blue-500 bg-blue-500/10 text-white"
                              : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{v.color}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {v.storage} • GHS {v.retailPrice.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Key Verified Specs Callouts */}
                  <div className="mt-6 grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <Cpu className="w-4 h-4 text-blue-400 mb-1" />
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Chip</div>
                      <div className="text-xs font-semibold text-white">A18 Pro (3nm)</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <Layers className="w-4 h-4 text-blue-400 mb-1" />
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Display</div>
                      <div className="text-xs font-semibold text-white">6.9&quot; OLED 120Hz</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <Battery className="w-4 h-4 text-blue-400 mb-1" />
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Battery</div>
                      <div className="text-xs font-semibold text-white">4685 mAh</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => {
                      addItem(flagshipProduct, selectedVariant, 1);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart • GHS {selectedVariant.retailPrice.toLocaleString()}
                  </button>
                  <button
                    onClick={() => setHeroMode("EXPLORE_3D")}
                    className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Layers className="w-4 h-4" />
                    Inspect Internal 3D
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* PRODUCT CATALOGUE SECTION                                                  */}
        {/* ========================================================================= */}
        <section id="smartphones" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Authenticated Inventory
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Direct authorized retail stock with Ghana manufacturer warranties.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {[
                { id: "ALL", label: "All Products" },
                { id: "SMARTPHONES", label: "Smartphones" },
                { id: "LAPTOPS", label: "Laptops & MacBooks" },
                { id: "TABLETS", label: "iPads & Tablets" },
                { id: "GAMING", label: "Gaming Consoles (PS5)" },
                { id: "NETWORKING", label: "Starlink Satellite" },
                { id: "WEARABLES", label: "Apple Watches" },
                { id: "AUDIO", label: "AirPods & Audio" },
                { id: "ACCESSORIES", label: "Chargers & Power" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const defaultVar = prod.variants[0];
              const compatCount = findCompatibleAccessories(prod, SEED_COMPATIBILITIES, SEED_PRODUCTS).length;

              return (
                <div
                  key={prod.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all duration-200 group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative w-full h-52 rounded-xl bg-slate-950 p-4 mb-4 flex items-center justify-center overflow-hidden border border-slate-800">
                      <img
                        src={prod.featuredImage}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wide">
                        {prod.brand}
                      </span>
                      {prod.warrantyMonths > 0 && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {prod.warrantyMonths}M Warranty
                        </span>
                      )}
                    </div>

                    {/* Title & Specs */}
                    <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {prod.shortDescription || prod.description}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {prod.specs.processor && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {prod.specs.processor}
                        </span>
                      )}
                      {prod.specs.displaySizeInches && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {prod.specs.displaySizeInches}&quot; Display
                        </span>
                      )}
                      {prod.specs.chargingWattage && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {prod.specs.chargingWattage}W Fast Charge
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Cart Actions */}
                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xs text-slate-500">Retail Price</span>
                        <div className="text-lg font-extrabold text-white">
                          GHS {defaultVar?.retailPrice.toLocaleString()}
                        </div>
                      </div>
                      {compatCount > 0 && (
                        <button
                          onClick={() => setActiveCompatibilityModalProduct(prod)}
                          className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                        >
                          {compatCount} Compatible Accessories &rarr;
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => defaultVar && addItem(prod, defaultVar, 1)}
                        className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                      {prod.animationPackageId && (
                        <button
                          onClick={() => {
                            setHeroMode("EXPLORE_3D");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="View 3D Teardown"
                        >
                          <Layers className="w-4 h-4 text-blue-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* COMPATIBLE ACCESSORIES POPUP MODAL                                        */}
        {/* ========================================================================= */}
        {activeCompatibilityModalProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setActiveCompatibilityModalProduct(null)}
            />
            <div className="relative z-10 w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-bold text-base">
                  Verified Compatible with {activeCompatibilityModalProduct.name}
                </h4>
                <button
                  onClick={() => setActiveCompatibilityModalProduct(null)}
                  className="text-slate-400 hover:text-white"
                >
                  &times;
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                {findCompatibleAccessories(
                  activeCompatibilityModalProduct,
                  SEED_COMPATIBILITIES,
                  SEED_PRODUCTS
                ).map(({ compatibility, accessory }) => (
                  <div
                    key={accessory.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={accessory.featuredImage}
                        alt={accessory.name}
                        className="w-12 h-12 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">{accessory.name}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          {compatibility.relationshipType} • GHS {accessory.variants[0]?.retailPrice.toLocaleString()}
                        </div>
                        {compatibility.notes && (
                          <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            {compatibility.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    {accessory.variants[0] && (
                      <button
                        onClick={() => {
                          addItem(accessory, accessory.variants[0], 1);
                          setActiveCompatibilityModalProduct(null);
                        }}
                        className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PHYSICAL RETAIL BRANCHES SECTION                                          */}
        {/* ========================================================================= */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Omnichannel Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Visit Our Flagship Stores & Hubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Buy online and collect in 15 minutes, or experience hands-on demonstrations with our certified gadget technicians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEED_BRANCHES.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-base text-white">{b.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{b.address}</p>
                  <p className="text-xs text-slate-400">{b.city}, {b.region}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{b.phone}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Open Mon - Sat
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TRUST & SERVICE GUARANTEES                                                */}
        {/* ========================================================================= */}
        <section className="py-12 bg-slate-900/40 border-t border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-white">Genuine Warranties</h4>
                <p className="text-xs text-slate-400 mt-1">
                  12 to 24 months official warranty recorded on device serial.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <Truck className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-white">Same-Day Express</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Prompt courier delivery across Greater Accra & Tema.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-white">Paystack Protection</h4>
                <p className="text-xs text-slate-400 mt-1">
                  MTN MoMo, Telecel Cash, and Cards with instant verified receipts.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <RotateCcw className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-sm text-white">Trade-In & Upgrades</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Appraise pre-owned devices in-store for immediate store credit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER                                                                    */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              GM
            </div>
            <span className="font-bold text-slate-300">The Gadget Master</span>
            <span>&copy; 2026. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#flagship-teardown" className="hover:text-slate-300">
              3D Teardowns
            </a>
            <button onClick={() => setIsWarrantyOpen(true)} className="hover:text-slate-300">
              Check Warranty
            </button>
            <button onClick={() => setIsAiOpen(true)} className="hover:text-slate-300">
              AI Shopping Assistant
            </button>
            <a href="http://localhost:3001" className="hover:text-blue-400 font-semibold">
              Retailer Admin POS &rarr;
            </a>
          </div>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <CartDrawer />
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <WarrantyLookupModal isOpen={isWarrantyOpen} onClose={() => setIsWarrantyOpen(false)} />
    </div>
  );
}
