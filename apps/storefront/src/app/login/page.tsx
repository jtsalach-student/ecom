"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginRotatingProductVisual } from "@gcp/animation-engine";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, ShoppingBag, Sparkles } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "the-gadget-master-gh";

export default function StorefrontLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("customer@example.gh");
  const [password, setPassword] = useState("GadgetMaster2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": DEFAULT_TENANT_ID,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          tenantId: DEFAULT_TENANT_ID,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your email and password.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("gcp_customer_token", data.accessToken);
        localStorage.setItem("gcp_customer_user", JSON.stringify(data.user));
      }

      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Return to Storefront Header Link */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#FF8A00] dark:text-slate-400 dark:hover:text-[#FF8A00] transition-colors"
        >
          &larr; Return to Storefront
        </Link>
        <span className="text-xs font-mono text-slate-400">East Legon Customer Portal</span>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Intact 3D Rotating Product Visual (NO Dissection) */}
        <div className="lg:col-span-7 order-2 lg:order-1 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-cardDark overflow-hidden">
          <LoginRotatingProductVisual
            modelName="iPhone 16 Pro Max • Titanium Showcase"
            className="h-[420px] sm:h-[480px] lg:h-[560px]"
            accentColor="#FF8A00"
          />
        </div>

        {/* Right Side: Customer Sign-In Form */}
        <div className="lg:col-span-5 order-1 lg:order-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card dark:shadow-cardDark">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFF2DF] dark:bg-[#2B1D0E] text-[#A34F00] dark:text-[#FFA336] border border-[#FF8A00]/30 mb-3">
              <ShoppingBag className="w-3.5 h-3.5 text-[#FF8A00]" />
              The Gadget Master Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Customer Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Access verified order history, live delivery status, and warranty claims.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs sm:text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Sign-In Failed</p>
                <p className="text-xs text-red-600 dark:text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="customer-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="customer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.gh"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="customer-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Bcrypt Protected</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="customer-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#FF8A00] hover:bg-[#EA580C] text-white shadow-md hover:shadow-orangeGlow transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Demo Customer Account:</span>
            <div className="mt-1 font-mono text-slate-600 dark:text-slate-400">
              customer@example.gh / GadgetMaster2026!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
