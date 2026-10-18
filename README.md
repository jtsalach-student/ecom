# Gadget Commerce Platform (GCP)
## Enterprise Multi-Tenant Electronics Commerce & Retail SaaS

[![Architecture: Modular Monolith](https://img.shields.io/badge/Architecture-Modular%20Monolith-blue.svg)](#)
[![TypeScript: Strict Mode](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue.svg)](#)
[![Database: Neon Serverless Postgres](https://img.shields.io/badge/Database-Neon%20Postgres-00E599.svg)](#)
[![Payments: Paystack](https://img.shields.io/badge/Payments-Paystack%20Ghana-00C3F7.svg)](#)
[![Tests: Vitest](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen.svg)](#)

---

## 1. Overview & System Mission
The **Gadget Commerce Platform (GCP)** is an enterprise-grade multi-tenant software-as-a-service (SaaS) platform engineered specifically for consumer electronics and gadget retailers. Its initial flagship brand is **The Gadget Master**, Ghana's premier retailer in Accra and Kumasi.

The platform provides complete tenant independence, high-fidelity WebGL 3D component disassembly presentation, an omnichannel Point-of-Sale (POS) terminal, multi-branch inventory tracking, Paystack Mobile Money & card reconciliation, and grounded AI shopping assistance.

---

## 2. Monorepo Architecture

```text
gadget-commerce-platform/
  apps/
    storefront/          # Next.js 15 App Router Customer Storefront (PWA, SSR/SSG, Cinematic 3D)
    retail-admin/        # Next.js 15 Retailer Dashboard (Products, Inventory, Orders, POS, Settings)
    platform-admin/      # Next.js 15 Platform Superadmin Dashboard (Tenants, Subscriptions, Audits)
    api/                 # NestJS / Express REST API with OpenAPI/Swagger (Core Modular Backend)
  packages/
    ui/                  # Shared accessible UI component system (Tailwind, Radix/Headless)
    database/            # Neon PostgreSQL client, Drizzle ORM schemas, migrations, seeders
    auth/                # Multi-tenant auth, RBAC, JWT validation, Neon Auth adapter
    contracts/           # Shared DTOs, API contracts, Zod schemas, event payloads
    domain/              # Domain models, state machines, business entities
    commerce/            # Pricing, promotions, tax, cart, order workflows
    payments/            # Paystack payment provider adapter, webhooks, refund logic
    inventory/           # Multi-branch inventory ledger, concurrency control, reservations
    analytics/           # Metrics calculation, reporting pipelines, data aggregations
    animation-engine/    # Three.js / WebGL / GSAP 3D explosion and inspection engine
    testing/             # Shared test fixtures, mock servers, end-to-end helpers
  docs/                  # Complete traceability, architecture, and runbook suite
```

---

## 3. Technology Stack
- **Framework**: Next.js 15 (App Router, Server Components)
- **Backend API**: TypeScript Node.js REST API with modular controllers
- **System of Record**: Neon Serverless PostgreSQL with Drizzle ORM
- **Payments**: Paystack (MTN Mobile Money, Telecel Cash, Visa/Mastercard, Bank Transfer) with HMAC SHA-512 verification
- **3D Graphics**: Three.js, React Three Fiber, GSAP ScrollTrigger
- **Monorepo Tooling**: pnpm workspaces, Turborepo
- **Testing**: Vitest automated testing suite

---

## 4. Quickstart Guide

### Prerequisites
- Node.js v24+ LTS
- pnpm v12+ (`npm i -g pnpm@latest`)

### Setup & Installation
```bash
# Clone and enter directory
cd c:\ecom

# Install all workspace dependencies
pnpm install

# Run automated test suite
pnpm test

# Build all applications and packages
pnpm build
```

### Running Locally
```bash
# Start backend API (Port 4000)
pnpm --filter @gcp/api dev

# Start Customer Storefront (Port 3000)
pnpm --filter @gcp/storefront dev

# Start Retailer Admin & POS (Port 3001)
pnpm --filter @gcp/retail-admin dev

# Start Platform Superadmin (Port 3002)
pnpm --filter @gcp/platform-admin dev
```

---

## 5. Port Allocations & Services

| Service | Port | Description |
|---|---|---|
| **API** | `4000` | REST API, Auth, Catalog, Orders, Paystack Webhooks, Grounded AI |
| **Storefront** | `3000` | Flagship Storefront with 3D Disassembly Engine, Cart & Checkout |
| **Retail Admin** | `3001` | Walk-in POS Terminal, Shift Balancing, Inventory, Warranties |
| **Platform Admin** | `3002` | Global Tenant Provisioning, SaaS Subscriptions & Audits |

---

## 6. Neon Infrastructure Integration
- **Neon Organization ID**: `org-dark-union-91210516`
- **Neon Project ID**: `weathered-frost-63147361`
- **Target Branch**: `production`
- **Infrastructure Policy**: Managed via `neon.ts` declaring eligible services (`auth`, `aiGateway`, `functions`, `buckets`).
