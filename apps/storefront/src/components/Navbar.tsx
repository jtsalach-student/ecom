"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  MapPin,
  Search,
  PhoneCall,
  Menu,
} from "lucide-react";

export interface NavbarProps {
  onOpenAi: () => void;
  onOpenWarranty: () => void;
}

export function Navbar({ onOpenAi, onOpenWarranty }: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-blue-900/40 border-b border-slate-800/50 py-1.5 px-4 text-center">
        <p className="text-xs text-slate-300 font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Accra Flagship & Kumasi Stores Open</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline">Same-Day Express Delivery across Greater Accra</span>
          <span className="hidden md:inline text-slate-500">•</span>
          <a
            href="tel:+233244567890"
            className="hidden md:inline-flex items-center gap-1 text-blue-400 hover:underline font-mono"
          >
            <PhoneCall className="w-3 h-3" /> +233 24 456 7890
          </a>
        </p>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-base tracking-tighter">GM</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1">
                The Gadget Master
              </span>
              <span className="block text-[10px] text-blue-400 font-medium tracking-wider uppercase -mt-1">
                Ghana • Verified Tech
              </span>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#flagship-teardown" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            3D Teardown
          </a>
          <a href="#smartphones" className="hover:text-blue-400 transition-colors">
            Smartphones
          </a>
          <a href="#laptops" className="hover:text-blue-400 transition-colors">
            Laptops
          </a>
          <a href="#accessories" className="hover:text-blue-400 transition-colors">
            Fast Chargers & Audio
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Shopping Assistant Button */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 transition-all hover:scale-105"
            title="Ask AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Warranty Checker Button */}
          <button
            onClick={onOpenWarranty}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Verify Warranty Coverage"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Check Warranty</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
