"use client";

import React, { useState } from "react";
import { SEED_TENANT } from "@gcp/database";
import {
  Globe,
  Shield,
  CreditCard,
  Layers,
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Users,
  Search,
} from "lucide-react";

export default function PlatformAdminPage() {
  const [tenants, setTenants] = useState([
    SEED_TENANT,
    {
      id: "ten-accra-elec",
      name: "Accra Electronics Ltd",
      slug: "accra-electronics",
      primaryDomain: "accraelectronics.com.gh",
      additionalDomains: [],
      currency: "GHS",
      locale: "en-GH",
      timezone: "Africa/Accra",
      taxRatePercent: 0,
      subscriptionPlan: "growth" as const,
      subscriptionStatus: "active" as const,
      branding: {
        primaryColor: "#0F172A",
        accentColor: "#F59E0B",
        secondaryColor: "#10B981",
        fontFamily: "Inter, sans-serif",
        heroTitle: "Premium Audio & Gaming",
        heroSubtitle: "Accra's premier audio store.",
        supportEmail: "info@accraelec.com",
        supportPhone: "+233 20 123 4567",
        socialLinks: {},
      },
      createdAt: new Date("2026-02-01"),
      updatedAt: new Date("2026-02-01"),
    },
  ]);

  const [auditLogs] = useState([
    {
      id: "aud-01",
      action: "TENANT_DOMAIN_VERIFIED",
      actor: "platform_superadmin@gcp.io",
      target: "thegadgetmaster.gh",
      time: "2026-10-18 10:14:22",
    },
    {
      id: "aud-02",
      action: "3D_PACKAGE_PUBLISHED",
      actor: "reviewer.tech@gcp.io",
      target: "Apple iPhone 16 Pro Max (A3296)",
      time: "2026-10-18 11:30:05",
    },
    {
      id: "aud-03",
      action: "SUBSCRIPTION_RENEWED",
      actor: "billing_worker",
      target: "The Gadget Master (Enterprise Plan)",
      time: "2026-10-18 12:00:00",
    },
  ]);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newPlan, setNewPlan] = useState<"starter" | "growth" | "enterprise">("growth");

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newDomain) return;

    const newT = {
      id: `ten-${Date.now()}`,
      name: newTenantName,
      slug: newTenantName.toLowerCase().replace(/\s+/g, "-"),
      primaryDomain: newDomain,
      additionalDomains: [],
      currency: "GHS",
      locale: "en-GH",
      timezone: "Africa/Accra",
      taxRatePercent: 0,
      subscriptionPlan: newPlan,
      subscriptionStatus: "active" as const,
      branding: {
        primaryColor: "#090D16",
        accentColor: "#3B82F6",
        secondaryColor: "#10B981",
        fontFamily: "Outfit, sans-serif",
        heroTitle: `${newTenantName} Storefront`,
        heroSubtitle: "Quality electronics & accessories.",
        supportEmail: `support@${newDomain}`,
        supportPhone: "+233 24 000 0000",
        socialLinks: {},
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTenants((prev) => [...prev, newT]);
    setIsOnboardingOpen(false);
    setNewTenantName("");
    setNewDomain("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            GCP
          </div>
          <div>
            <span className="font-bold text-sm text-white">Platform Superadmin</span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
              Multi-Tenant SaaS Operations
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono">
            Platform Cluster: US-EAST (Neon Serverless)
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Services Operational</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Active Tenants</span>
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-2">
              {tenants.length}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">100% Isolated Schemas</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>SaaS Subscriptions</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-2">
              $1,980<span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <span className="text-[10px] text-slate-400">MRR (Platform Revenue)</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Verified 3D Packages</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-2">
              1
            </div>
            <span className="text-[10px] text-blue-400">iPhone 16 Pro Max (A3296)</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Security Baseline</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono mt-2">
              ASVS 5.0
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Zero Cross-Tenant Leaks</span>
          </div>
        </div>

        {/* Tenant Management Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Registered Retail Tenants</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Independent electronics retailers powered by the multi-tenant SaaS architecture.
              </p>
            </div>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Onboard New Tenant
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3.5 px-4">Tenant Name</th>
                  <th className="py-3.5 px-4">Primary Domain</th>
                  <th className="py-3.5 px-4">SaaS Plan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Currency</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {t.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-blue-400">
                      {t.primaryDomain}
                    </td>
                    <td className="py-3.5 px-4 capitalize font-medium text-slate-300">
                      {t.subscriptionPlan}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {t.subscriptionStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {t.currency}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert(`Scoped tenant audit details for ${t.name}`)}
                        className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
                      >
                        Audit Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Audit Trail */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-base text-white">Platform Security & Audit Trail</h3>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold text-[10px]">
                    {log.action}
                  </span>
                  <span className="text-slate-300 font-sans">{log.target}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span>{log.actor}</span>
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Onboarding Modal */}
      {isOnboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setIsOnboardingOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
            <h3 className="font-bold text-base">Onboard New Electronics Retailer</h3>
            <p className="text-xs text-slate-400 mt-1">
              Create an isolated tenant workspace, assign subscription plan, and configure primary domain.
            </p>

            <form onSubmit={handleCreateTenant} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechWorld Kumasi"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Storefront Domain</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. techworld.com.gh"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">SaaS Subscription Plan</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="starter">Starter Plan ($99/mo)</option>
                  <option value="growth">Growth Plan ($249/mo)</option>
                  <option value="enterprise">Enterprise Plan ($699/mo)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Confirm & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
