# Gadget Commerce Platform (GCP) - Master Plan

## 1. Project Overview & Architecture
The **Gadget Commerce Platform (GCP)** is a multi-tenant electronics commerce SaaS platform engineered for consumer electronics retailers, with **The Gadget Master** (Ghana) as its first flagship storefront tenant.

### Key Architectural Pillars
1. **Multi-Tenant SaaS Foundation**: Complete isolation across store configurations, product catalogs, inventories, orders, customer data, and payment credentials.
2. **Modular Architecture**: Monorepo using TypeScript, Next.js (App Router), NestJS API, PostgreSQL (via Neon Serverless Postgres), Drizzle ORM, and domain-driven packages.
3. **Unified Retail & POS Engine**: Common inventory ledger, transactional reservations, real-time sync across physical branch POS terminals and digital storefronts.
4. **Cinematic 3D Product Disassembly & Exploration Engine**: WebGL/Three.js-driven scroll-linked disassembly based on verified product hardware specifications.
5. **Robust Payment & Financial Core**: Paystack integration (Mobile Money, Cards, Bank Transfers), HMAC SHA-512 webhook verification, idempotent reconciliation, and audit ledgers.
6. **Grounded AI Shopping & Analytics**: Catalogue-grounded recommendations, inventory optimization, and sales intelligence.

---

## 2. Monorepo Structure

```text
gadget-commerce-platform/
  apps/
    storefront/          # Next.js 15 App Router Customer Storefront (PWA, SSR/SSG, Cinematic 3D)
    retail-admin/        # Next.js 15 Retailer Dashboard (Products, Inventory, Orders, POS, Settings)
    platform-admin/      # Next.js 15 Platform Superadmin Dashboard (Tenants, Subscriptions, Audits)
    api/                 # NestJS REST API with OpenAPI/Swagger (Core Modular Backend)
    worker/              # Asynchronous job processor (Outbox, Notifications, Webhooks, Reconciliation)
  packages/
    ui/                  # Shared accessible UI component system (Tailwind, Radix/Headless)
    database/            # Neon PostgreSQL client, Drizzle ORM schemas, migrations, seeders
    auth/                # Multi-tenant auth, RBAC, JWT validation, Neon Auth adapter
    config/              # Shared TypeScript configurations, ESLint, Prettier
    contracts/           # Shared DTOs, API contracts, Zod schemas, event payloads
    domain/              # Domain models, state machines, business entities
    commerce/            # Pricing, promotions, tax, cart, order workflows
    payments/            # Paystack payment provider adapter, webhooks, refund logic
    inventory/           # Multi-branch inventory ledger, concurrency control, reservations
    analytics/           # Metrics calculation, reporting pipelines, data aggregations
    animation-engine/    # Three.js / WebGL / GSAP 3D explosion and inspection engine
    notifications/       # Multi-channel notification engine (Email, SMS, Push, In-App)
    testing/             # Shared test fixtures, mock servers, end-to-end helpers
  infrastructure/
    neon/                # Neon CLI configs, branch management, neon.ts
    deployment/          # Dockerfiles, CI/CD GitHub Actions workflows
    monitoring/          # OpenTelemetry configs, health probes, structured logging
  docs/                  # Traceability, architecture, operations, runbooks
```

---

## 3. Execution Roadmap & Phases

- [x] **Phase 0 — Repository and Discovery**: Monorepo layout, toolchains, base configurations, documentation suite.
- [ ] **Phase 1 — Neon and Infrastructure**: Neon CLI setup, `neon.ts`, service definitions, DB connection, Drizzle schema.
- [ ] **Phase 2 — Identity and Multi-Tenancy**: Tenant management, RBAC, session/JWT handling, tenant scoping guards.
- [ ] **Phase 3 — Catalogue and Product Management**: Global catalog, tenant listings, variants, specs, compatibility engine.
- [ ] **Phase 4 — Inventory and Procurement**: Multi-branch stock ledger, atomic reservations, supplier POs, serial tracking.
- [ ] **Phase 5 — Storefront and Branding**: Responsive customer-facing e-commerce store, PWA, SEO, theme engine.
- [ ] **Phase 6 — 3D Animation Engine**: Three.js/R3F/GSAP scroll disassembly engine, asset package specification, fallbacks.
- [ ] **Phase 7 — Checkout and Paystack**: Cart pricing, reservation locks, Paystack checkout, webhook HMAC, refunds.
- [ ] **Phase 8 — POS and Fulfilment**: Integrated retail POS interface, cashier shifts, barcode search, delivery workflows.
- [ ] **Phase 9 — After-Sales Management**: Warranties, RMA/returns, technician repair job cards, trade-in valuations.
- [ ] **Phase 10 — Analytics and AI**: Executive dashboards, inventory intelligence, grounded AI shopping assistant.
- [ ] **Phase 11 — SaaS Commercialization**: Tenant subscriptions, white-labeling, billing cycles, data export.
- [ ] **Phase 12 — Production Hardening**: Full automated test verification, security scans, performance benchmarks, deployment runbooks.
