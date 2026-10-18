import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GCP Platform Superadmin | Multi-Tenant SaaS Operations",
  description: "Global Tenant Onboarding, SaaS Subscriptions, Feature Entitlements, and Audit Logs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
