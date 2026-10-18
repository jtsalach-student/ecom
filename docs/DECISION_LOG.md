# GCP Architecture Decision Log (ADR)

## ADR-001: Monorepo Architecture with pnpm Workspaces & Turborepo
- **Date**: 2026-10-18
- **Status**: Approved
- **Context**: Need strict domain boundaries, code reuse across frontend (Storefront, Retail Admin, Platform Admin) and backend (NestJS API, Worker), shared packages (domain, contracts, database, payments, inventory, 3d engine).
- **Decision**: Adopt pnpm workspaces with Turborepo for fast caching, deterministic dependency resolution, and strict workspace boundary enforcement.
- **Consequences**: Fast parallel builds, shared typed contracts via TypeScript project references, zero-drift DTOs between API and apps.

## ADR-002: Modular Monolith with NestJS & Clean Architecture
- **Date**: 2026-10-18
- **Status**: Approved
- **Context**: E-commerce with POS and inventory requires transactional integrity and high cohesion without the operational tax of distributed microservices.
- **Decision**: Build a modular monolith in NestJS where domains (Catalog, Orders, Inventory, Payments, Auth, Tenants) communicate via internal domain events and strict service contracts.
- **Consequences**: Atomic transactions across order creation and stock reservations, simplified deployment, clean future path to extract microservices if scaling demands.

## ADR-003: Neon Serverless PostgreSQL with Drizzle ORM
- **Date**: 2026-10-18
- **Status**: Approved
- **Context**: High-performance multi-tenant PostgreSQL with serverless branching, connection pooling, and strict schema migrations.
- **Decision**: Use Drizzle ORM with Neon serverless driver (`@neondatabase/serverless`). Direct connection for migrations, pooled connection for API transactions.
- **Consequences**: Type-safe queries, zero runtime overhead, instant schema verification on preview branches.

## ADR-004: Paystack Provider Abstraction & Idempotent Webhook Processing
- **Date**: 2026-10-18
- **Status**: Approved
- **Context**: Paystack is primary for Ghana (Mobile Money: MTN, Telecel, AT; Cards, Bank Transfer) but multi-tenant architecture must allow multi-provider abstraction.
- **Decision**: Implement a decoupled `PaymentProvider` interface with a concrete `PaystackProvider`. All webhooks verify HMAC SHA-512 signatures and record raw payloads in an immutable `payment_events` table before idempotent processing.
- **Consequences**: Zero risk of double crediting, audit-proof financial records, safe Mobile Money asynchronous callback handling.

## ADR-005: Exact-Model 3D Cinematic Disassembly Engine
- **Date**: 2026-10-18
- **Status**: Approved
- **Context**: Visual presentation must show verified hardware internals matching the exact device model, never generic recolors.
- **Decision**: Implement WebGL/Three.js with React Three Fiber, GSAP ScrollTrigger, and strict asset package metadata validation (glTF/GLB with component hierarchy, hotspot annotations, and hardware revision verification). Standard high-res media fallback for models without verified 3D packages.
- **Consequences**: Signature brand differentiator while maintaining 60 FPS performance, mobile degradation, and accessibility fallbacks.
