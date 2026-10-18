"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import {
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Search,
  PhoneCall,
  Sun,
  Moon,
  Laptop,
  Menu,
  X,
  User,
  MapPin,
} from "lucide-react";

export interface NavbarProps {
  onOpenAi: () => void;
  onOpenWarranty: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function Navbar({
  onOpenAi,
  onOpenWarranty,
  searchQuery = "",
  onSearchChange,
  activeCategory = "ALL",
  onSelectCategory,
}: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navCategories = [
    { id: "ALL", label: "All Products" },
    { id: "SMARTPHONES", label: "Smartphones" },
    { id: "LAPTOPS", label: "Laptops & PC" },
    { id: "AUDIO_HEADPHONES", label: "Audio & Sound" },
    { id: "TELEVISIONS", label: "4K Televisions" },
    { id: "HOME_APPLIANCES", label: "Appliances & AC" },
    { id: "ACCESSORIES", label: "Accessories" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-[#151515] text-white py-1.5 px-4 text-xs font-medium border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
            <span className="text-slate-200">
              East Legon Showroom Open (Underbridge Mall, Accra)
            </span>
            <span className="hidden md:inline text-neutral-600">•</span>
            <span className="hidden md:inline text-slate-400">
              Mon - Sat: 8:30 AM - 7:30 PM
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href="tel:+233200147950"
              className="inline-flex items-center gap-1.5 hover:text-[#FF8A00] transition-colors font-mono"
            >
              <PhoneCall className="w-3 h-3 text-[#FF8A00]" />
              <span>020 014 7950</span>
            </a>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <a
              href="mailto:support@thegadgetmaster.online"
              className="hidden sm:inline hover:text-[#FF8A00] transition-colors"
            >
              support@thegadgetmaster.online
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="/" className="flex items-center gap-3 group">
            {!logoError ? (
              <img
                src="/logo-oval.png"
                alt="The Gadget Master - Your Trusted Choice"
                className="h-12 w-auto max-w-[140px] sm:max-w-[160px] object-contain group-hover:scale-105 transition-transform"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="px-3.5 py-2 rounded-2xl bg-[#151515] text-white border border-[#FF8A00]/40 flex flex-col items-center justify-center shadow-md">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
                  GADGET<span className="text-[#FF8A00]">MASTER</span>
                </span>
                <span className="text-[9px] text-slate-300 font-medium tracking-widest uppercase">
                  Your Trusted Choice
                </span>
              </div>
            )}
          </a>
        </div>

        {/* Live Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search genuine gadgets, TVs, ACs, laptops..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#FF8A00] dark:focus:border-[#FF8A00] transition-colors"
              aria-label="Search Catalog"
            />
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ask AI Assistant */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FFF2DF] dark:bg-[#2B1D0E] text-[#A34F00] dark:text-[#FFA336] border border-[#FF8A00]/30 hover:bg-[#FFE8CC] dark:hover:bg-[#3D2914] transition-all hover:scale-105"
            title="Ask AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* Warranty Checker */}
          <button
            onClick={onOpenWarranty}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Verify Warranty Coverage"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden lg:inline">Warranty</span>
          </button>

          {/* Theme Selector Toggle (Light / Dark / System) */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "light"
                  ? "bg-white text-[#FF8A00] shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Light Mode"
              aria-label="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-slate-900 text-[#FF8A00] shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="Dark Mode"
              aria-label="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-1.5 rounded-lg transition-colors ${
                theme === "system"
                  ? "bg-white dark:bg-slate-900 text-[#FF8A00] shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
              title="System Preference"
              aria-label="System Preference"
            >
              <Laptop className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Account Login */}
          <a
            href="/login"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#FF8A00] dark:hover:text-[#FF8A00] transition-colors"
            title="Customer & Staff Login"
            aria-label="Login"
          >
            <User className="w-4 h-4" />
          </a>

          {/* Shopping Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-[#FF8A00] hover:bg-[#EA580C] text-white shadow-sm transition-all active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#151515] text-[#FF8A00] border-2 border-white dark:border-[#111827] text-xs font-bold flex items-center justify-center shadow">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <div className="hidden md:block bg-slate-50 dark:bg-[#0D1321] border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory?.(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#FF8A00] text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search gadgets, TVs, ACs..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Mobile Category Links */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory?.(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  activeCategory === cat.id
                    ? "bg-[#FF8A00] text-white font-bold"
                    : "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                onOpenWarranty();
                setMobileMenuOpen(false);
              }}
              className="text-emerald-600 dark:text-emerald-400 font-semibold"
            >
              Verify Warranty
            </button>
            <a href="/login" className="text-[#FF8A00] font-semibold">
              Sign In &rarr;
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
