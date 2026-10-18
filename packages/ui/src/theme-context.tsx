"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

export interface TenantBrandingConfig {
  tenantId: string;
  name: string;
  logoUrl: string;
  accentColor: string;
  primaryDark: string;
  domain: string;
  isCustomTenant?: boolean;
}

export const KNOWN_TENANTS: Record<string, TenantBrandingConfig> = {
  "the-gadget-master-gh": {
    tenantId: "the-gadget-master-gh",
    name: "The Gadget Master",
    logoUrl: "/logo-oval.png",
    accentColor: "#FF8A00",
    primaryDark: "#151515",
    domain: "thegadgetmaster.online",
  },
  "techworld-kumasi": {
    tenantId: "techworld-kumasi",
    name: "TechWorld Kumasi",
    logoUrl: "/logo-oval.png",
    accentColor: "#3B82F6",
    primaryDark: "#0B1120",
    domain: "techworld.gh",
    isCustomTenant: true,
  },
};

export const PLATFORM_BRANDING: TenantBrandingConfig = {
  tenantId: "platform-global",
  name: "Gadget Commerce Platform",
  logoUrl: "/logo-oval.png",
  accentColor: "#6366F1",
  primaryDark: "#090D16",
  domain: "gadgetcommerce.io",
};

export function getTenantBranding(tenantSlugOrId: string | null | undefined): TenantBrandingConfig {
  if (!tenantSlugOrId) return PLATFORM_BRANDING;
  if (KNOWN_TENANTS[tenantSlugOrId]) return KNOWN_TENANTS[tenantSlugOrId];
  if (
    tenantSlugOrId === "gadget-master" ||
    tenantSlugOrId === "the-gadget-master" ||
    tenantSlugOrId === "thegadgetmaster"
  ) {
    return KNOWN_TENANTS["the-gadget-master-gh"];
  }
  return PLATFORM_BRANDING;
}

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeMode) => void;
  tenant: TenantBrandingConfig;
  setTenantId: (tenantId: string) => void;
  isManagingTenant: boolean;
  managingTenant: TenantBrandingConfig | null;
  setManagingTenantId: (tenantId: string | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTenantId?: string;
  isPlatformAdmin?: boolean;
}

export function ThemeProvider({
  children,
  defaultTenantId = "the-gadget-master-gh",
  isPlatformAdmin = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [tenantId, setTenantIdState] = useState<string>(defaultTenantId);
  const [managingTenantId, setManagingTenantIdState] = useState<string | null>(null);

  // Initialize from URL parameters, localStorage, and system preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);

    // 1. Cross-app theme parameter synchronization
    const urlTheme = urlParams.get("theme") as ThemeMode | null;
    const storedTheme = (localStorage.getItem("gcp_theme_preference") as ThemeMode) || "system";
    const initialTheme = urlTheme && ["light", "dark", "system"].includes(urlTheme)
      ? urlTheme
      : storedTheme;

    setThemeState(initialTheme);
    localStorage.setItem("gcp_theme_preference", initialTheme);

    // 2. Cross-app tenant parameter synchronization (validated server-safe whitelist)
    const urlTenant = urlParams.get("tenant");
    const storedTenant = localStorage.getItem("gcp_tenant_context");
    const targetTenant = (urlTenant && KNOWN_TENANTS[urlTenant])
      ? urlTenant
      : (storedTenant && KNOWN_TENANTS[storedTenant])
      ? storedTenant
      : defaultTenantId;

    setTenantIdState(targetTenant);
    localStorage.setItem("gcp_tenant_context", targetTenant);

    // 3. Platform Admin "Managing Tenant" context
    const urlManagingTenant = urlParams.get("managingTenant");
    if (urlManagingTenant && KNOWN_TENANTS[urlManagingTenant]) {
      setManagingTenantIdState(urlManagingTenant);
    }
  }, [defaultTenantId]);

  // Apply .dark class to document root
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      let isDark = false;
      if (theme === "system") {
        isDark = mediaQuery.matches;
      } else {
        isDark = theme === "dark";
      }

      setResolvedTheme(isDark ? "dark" : "light");

      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("gcp_theme_preference", newTheme);
    }
  };

  const setTenantId = (newTenantId: string) => {
    if (KNOWN_TENANTS[newTenantId]) {
      setTenantIdState(newTenantId);
      if (typeof window !== "undefined") {
        localStorage.setItem("gcp_tenant_context", newTenantId);
      }
    }
  };

  const setManagingTenantId = (id: string | null) => {
    setManagingTenantIdState(id && KNOWN_TENANTS[id] ? id : null);
  };

  const currentTenant = useMemo(() => {
    if (isPlatformAdmin && !managingTenantId) {
      return PLATFORM_BRANDING;
    }
    return KNOWN_TENANTS[tenantId] || KNOWN_TENANTS["the-gadget-master-gh"];
  }, [isPlatformAdmin, managingTenantId, tenantId]);

  const managingTenant = useMemo(() => {
    if (!managingTenantId) return null;
    return KNOWN_TENANTS[managingTenantId] || null;
  }, [managingTenantId]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        tenant: currentTenant,
        setTenantId,
        isManagingTenant: Boolean(managingTenantId),
        managingTenant,
        setManagingTenantId,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Universal 3-way Accessible Theme Switcher Control (Light / Dark / System)
 */
export function UniversalThemeSelector({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs shadow-sm ${className}`}
      role="group"
      aria-label="Theme mode switcher"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
          theme === "light"
            ? "bg-white text-slate-900 shadow-sm font-semibold"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
        title="Switch to Light Theme"
        aria-pressed={theme === "light"}
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
          theme === "dark"
            ? "bg-slate-900 text-white shadow-sm font-semibold"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
        title="Switch to Night Theme"
        aria-pressed={theme === "dark"}
      >
        <Moon className="w-3.5 h-3.5 text-blue-400" />
        <span className="hidden sm:inline">Night</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
          theme === "system"
            ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-semibold"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
        title="Match Operating System Preference"
        aria-pressed={theme === "system"}
      >
        <Laptop className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        <span className="hidden sm:inline">Auto</span>
      </button>
    </div>
  );
}
