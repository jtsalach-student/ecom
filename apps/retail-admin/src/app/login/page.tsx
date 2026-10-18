"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginAnimatedCharacter } from "@gcp/animation-engine";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import { UniversalThemeSelector } from "@gcp/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "the-gadget-master-gh";

export default function RetailAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | "other" | null>(null);
  const [authStatus, setAuthStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setAuthStatus("submitting");

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
        throw new Error(data.error || "Authentication failed. Please verify staff credentials.");
      }

      setAuthStatus("success");

      // Store authenticated credentials
      if (typeof window !== "undefined") {
        localStorage.setItem("gcp_staff_token", data.accessToken);
        localStorage.setItem("gcp_staff_user", JSON.stringify(data.user));
      }

      setTimeout(() => {
        router.push("/");
      }, 700);
    } catch (err: any) {
      setAuthStatus("error");
      setErrorMessage(err.message || "Unable to sign in. Please verify credentials.");
    }
  };

  const handlePresetSelect = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("GadgetMaster2026!");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Header Bar & Theme Selector */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-oval.png" alt="The Gadget Master" className="h-7 w-auto object-contain" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Retail Operations Portal
          </span>
        </div>
        <UniversalThemeSelector />
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Interactive 3D Staff Character */}
        <div className="lg:col-span-7 order-2 lg:order-1 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <LoginAnimatedCharacter
            variant="staff"
            focusedField={focusedField}
            isPasswordRevealed={showPassword}
            authStatus={authStatus}
            tenantName="The Gadget Master"
            tenantColor="#FF8A00"
            className="h-[480px] lg:h-[620px]"
          />
        </div>

        {/* Right Side: Secure Staff Login Form */}
        <div className="lg:col-span-5 order-1 lg:order-2 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-3">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              The Gadget Master Retail ERP
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Staff Portal Login
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Enter authorized branch staff credentials to access retail inventory, POS register, and workshop tickets.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-200 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Error</p>
                <p className="text-xs text-red-600 dark:text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="staff-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Staff Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="staff-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="staff@thegadgetmaster.gh"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="staff-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <span className="text-xs text-slate-400">Authorized Access</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authStatus === "submitting"}
              className="w-full mt-2 py-3.5 px-4 bg-[#FF8A00] hover:bg-[#EA580C] active:bg-[#C2410C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {authStatus === "submitting" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Staff Role Switcher for Development / Test Auditing */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Local Development Sandbox Credentials
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect("owner@thegadgetmaster.gh")}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors text-center"
                >
                  Tenant Owner
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("manager.accra@thegadgetmaster.gh")}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors text-center"
                >
                  Store Manager
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("cashier.eastlegon@thegadgetmaster.gh")}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/60 transition-colors text-center"
                >
                  East Legon Cashier
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
