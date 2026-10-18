"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginRotatingProductVisual } from "@gcp/animation-engine";
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, AlertCircle, KeyRound } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function PlatformAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@gadgetcommerce.io");
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
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Invalid platform credentials.");
      }

      // Verify that the user has PLATFORM_SUPER_ADMIN role
      if (data.user?.role !== "PLATFORM_SUPER_ADMIN") {
        throw new Error("Access Denied: Account lacks PLATFORM_SUPER_ADMIN authorization.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("gcp_superadmin_token", data.accessToken);
        localStorage.setItem("gcp_superadmin_user", JSON.stringify(data.user));
      }

      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to authenticate with platform control plane.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: 3D Intact Assembled Hardware Visual */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <LoginRotatingProductVisual
            modelName="Enterprise Infrastructure Hardware • Assembled Node"
            className="h-[480px] lg:h-[620px]"
          />
        </div>

        {/* Right Side: Platform Superadmin Form */}
        <div className="lg:col-span-5 order-1 lg:order-2 bg-slate-900/90 border border-indigo-900/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              GCP Platform Operations Control Plane
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              Platform Superadmin
            </h1>
            <p className="text-sm text-slate-400 mt-1.5">
              Multi-tenant infrastructure provisioning, global quotas, audit provenance, and billing administration.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Security Access Warning</p>
                <p className="text-xs text-red-300/90 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
              >
                Superadmin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@gadgetcommerce.io"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                >
                  Master Passkey
                </label>
                <span className="text-xs text-indigo-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> FIDO2 / Bcrypt
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verifying Cryptographic Tokens...
                </>
              ) : (
                <>
                  Authenticate Platform Session
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Privileged Session Timeout: 24h</span>
            <span className="text-emerald-400 font-mono">Neon Auth Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
